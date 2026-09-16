/* Run with node tools/test_gameplay.cjs. Uses an isolated headless Chrome profile.
   Test hooks are injected by this localhost server, never into the shipped game. */
const fs = require('node:fs');
const path = require('node:path');
const http = require('node:http');
const os = require('node:os');
const { spawn } = require('node:child_process');
const assert = require('node:assert/strict');
const root = path.resolve(__dirname, '..');
const chromePath = process.env.CHROME_PATH || 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const profile = fs.mkdtempSync(path.join(os.tmpdir(), 'for-mother-qa-'));
const output = path.join(root, 'tools', 'qa-output');
fs.mkdirSync(output, { recursive: true });
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
const hooks = `window.ForMotherQA = {
  runtime: () => game.runtime, mutableState: () => game.state, player: () => game.player,
  save: game.save, restartChapter: game.restartChapter, repairDefinition: game.repairDefinition,
  startRepairSession: game.startRepairSession, advanceDialog: game.advanceDialog, updateChapterClock: game.updateChapterClock,
  audio: game.AudioManager, move: game.move, collisionBox: game.collisionBox, keys: game.keys,
  environment: game.syncEnvironmentAudio, showPrompt: game.showPrompt, pause: game.pause,
  startDialog: game.startDialog, finalRestoration: game.startFinalRestoration,
  ready: () => {
    const {runtime, els} = game;
    clearTimeout(runtime.timers['chapter-intro']); delete runtime.timers['chapter-intro'];
    runtime.chapterIntroActive = false; game.cutsceneActive = game.dialogActive = game.miniGameActive = false;
    runtime.queuedDialog = null; runtime.lumiEducation = null;
    els.modal.replaceChildren(); els.dialog.replaceChildren();
    runtime.chapterTimer.started = true;
  },
  tick: dt => { game.runtime.updaters.forEach(fn => fn(dt)); game.updateChapterClock(dt); },
`;
const server = http.createServer((req, res) => {
  const name = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
  const file = path.resolve(root, '.' + (name === '/' ? '/index.html' : name));
  if (!file.startsWith(root + path.sep)) { res.writeHead(403); res.end(); return; }
  try {
    let content = fs.readFileSync(file);
    if (file === path.join(root, 'script.js')) content = Buffer.from(content.toString().replace('window.ForMotherQA = {', hooks));
    const mime = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.png': 'image/png', '.mp3': 'audio/mpeg', '.wav': 'audio/wav', '.mp4': 'video/mp4' };
    res.writeHead(200, { 'Content-Type': mime[path.extname(file)] || 'application/octet-stream' });
    res.end(content);
  } catch { res.writeHead(404); res.end(); }
});
let chrome, socket;
async function main() {
  console.log('Starting isolated Chrome gameplay checks...');
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  chrome = spawn(chromePath, ['--headless=new', '--disable-gpu', '--no-first-run', '--no-default-browser-check', '--remote-debugging-port=0', `--user-data-dir=${profile}`, '--window-size=1440,900', 'about:blank'], { windowsHide: true, stdio: 'ignore' });
  chrome.on('error', error => { console.error(error.message); });
  const portFile = path.join(profile, 'DevToolsActivePort');
  for (let i = 0; i < 100 && !fs.existsSync(portFile); i++) await delay(100);
  if (!fs.existsSync(portFile)) throw Error('Chrome did not start. Set CHROME_PATH to a Chromium browser.');
  const port = fs.readFileSync(portFile, 'utf8').split('\n')[0];
  const targets = await (await fetch(`http://127.0.0.1:${port}/json`)).json();
  socket = new WebSocket(targets.find(t => t.type === 'page').webSocketDebuggerUrl);
  await new Promise((resolve, reject) => {
    const timeout = setTimeout(() => reject(Error('Chrome websocket timed out')), 10000);
    socket.addEventListener('open', () => { clearTimeout(timeout); resolve(); }, { once: true });
    socket.addEventListener('error', () => { clearTimeout(timeout); reject(Error('Chrome websocket failed')); }, { once: true });
  });
  let seq = 0;
  const pending = new Map(), exceptions = [], missing = [];
  socket.addEventListener('message', event => {
    const msg = JSON.parse(event.data);
    if (msg.id) { const p = pending.get(msg.id); pending.delete(msg.id); msg.error ? p.reject(Error(msg.error.message)) : p.resolve(msg.result); }
    if (msg.method === 'Runtime.exceptionThrown') exceptions.push(msg.params.exceptionDetails.text + ': ' + msg.params.exceptionDetails.exception?.description);
    if (msg.method === 'Network.responseReceived' && msg.params.response.status >= 400 && !msg.params.response.url.endsWith('favicon.ico')) missing.push(msg.params.response.url);
  });
  const send = (method, params = {}) => new Promise((resolve, reject) => {
    const id = ++seq;
    const timeout = setTimeout(() => { pending.delete(id); reject(Error(method + ' timed out')); }, 15000);
    pending.set(id, { resolve: result => { clearTimeout(timeout); resolve(result); }, reject: error => { clearTimeout(timeout); reject(error); } });
    socket.send(JSON.stringify({ id, method, params }));
  });
  const evaluate = async expression => {
    const result = await send('Runtime.evaluate', { expression, awaitPromise: true, returnByValue: true });
    if (result.exceptionDetails) throw Error(result.exceptionDetails.exception?.description || result.exceptionDetails.text);
    return result.result.value;
  };
  const check = async (expression, message) => { assert(await evaluate(expression), message); console.log('PASS: ' + message); };
  await send('Runtime.enable'); await send('Network.enable'); await send('Page.enable');
  await send('Page.navigate', { url: `http://127.0.0.1:${server.address().port}/` });
  for (let i = 0; i < 200 && !await evaluate('!!window.ForMotherQA && !document.getElementById("boot-screen")'); i++) await delay(100);
  await evaluate(`window.q = ForMotherQA; q.mutableState().settings.motion = false;`);
  const load = async name => { await evaluate(`q.loadScene('${name}'); q.ready();`); };
  const reachable = async () => check(`(() => {
    const seen = new Set(), points = [], queue = [[q.player().x,q.player().y]];
    for(let index=0; index<queue.length; index++) {
      const [x,y]=queue[index], key=x+','+y;
      if(seen.has(key) || !q.valid(x,y)) continue;
      seen.add(key); const foot=q.collisionBox(q.player(),x,y); points.push([foot.x,foot.y]);
      for(const [dx,dy] of [[20,0],[-20,0],[0,20],[0,-20]]) queue.push([x+dx,y+dy]);
    }
    return q.runtime().interactables.filter(i=>i.enabled).every(i=>points.some(([x,y])=>Math.hypot(i.x-x,i.y-y)<=80));
  })()`, 'Every active objective is reachable using existing collisions');
  const act = async id => {
    await evaluate(`q.runtime().interactables.find(i => i.id === '${id}').action()`);
    if (id === 'pipe') {
      for (let i=0; i<4 && await evaluate('!!document.getElementById("dialog").children.length'); i++) {
        await delay(150); await evaluate('q.advanceDialog();');
      }
    }
  };
  const screenshot = async name => {
    await delay(150);
    const result = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(path.join(output, name + '.png'), Buffer.from(result.data, 'base64'));
  };
  const inspect = async id => {
    await evaluate(`q.repairDefinition('${id}').spots.forEach((s,i) => { if(s[3]) document.querySelector('[data-spot="'+i+'"]').click(); });`);
  };
  const repair = async (id, storageId=id) => {
    await inspect(id);
    const steps = await evaluate(`q.repairDefinition('${id}').steps`);
    const chapter = await evaluate('"chapter" + q.runtime().chapterTimer.chapter');
    const from = await evaluate(`q.mutableState().chapterProgress.${chapter}.repairs[${JSON.stringify(storageId)}].step`);
    for (let i = from; i < steps.length; i++) {
      const [tool, , target] = steps[i];
      await evaluate(`document.querySelector('[data-tool="${tool}"]').click();`);
      if (id === 'bin' && tool === 'collect') {
        await screenshot('chapter2-drag-trash');
        const timer = await evaluate('q.runtime().chapterTimer.remaining');
        const drag = async (miss=false) => {
          const points = await evaluate(`(() => {const a=document.querySelector('[data-rubbish]:not([hidden])').getBoundingClientRect(); const b=document.querySelector('.repair-drop-bin').getBoundingClientRect();return {a:{x:a.x+a.width/2,y:a.y+a.height/2},b:{x:b.x+b.width/2,y:b.y+b.height/2}};})()`);
          await send('Input.dispatchMouseEvent',{type:'mousePressed',button:'left',buttons:1,clickCount:1,...points.a});
          await send('Input.dispatchMouseEvent',{type:'mouseMoved',button:'left',buttons:1,...(miss?points.a:points.b)});
          await send('Input.dispatchMouseEvent',{type:'mouseReleased',button:'left',buttons:0,clickCount:1,...(miss?points.a:points.b)});
        };
        await drag(true);
        await check('q.mutableState().chapterProgress.chapter2.repairs.bin.collected.length === 0', 'Dropping outside bin returns rubbish without completing it');
        await drag();
        await check('q.mutableState().chapterProgress.chapter2.repairs.bin.collected.length === 1', 'Dragging rubbish into bin records one item');
        await evaluate('q.runtime().repair.cancel()');
        await act('bin'); await inspect('bin');
        await evaluate(`document.querySelector('[data-tool="collect"]').click()`);
        await check('document.querySelectorAll("[data-rubbish]:not([hidden])").length === 4', 'Reopening collection preserves deposited rubbish');
        for(let n=0;n<4;n++) await drag();
        await check('q.mutableState().chapterProgress.chapter2.repairs.bin.collected.length === 5', 'All five rubbish items are collected individually');
        await check(`q.runtime().chapterTimer.remaining >= ${timer} - 1`, 'Collection keeps repair timer paused');
        continue;
      }
      if (tool === 'windowKit' || tool === 'kit' && i === 0) await check("!!document.querySelector('.repair-driver') && !!document.querySelector('.repair-bolt-head')", 'Bolt step displays rotating screwdriver and screw');
      const amount = await evaluate(`q.mutableState().chapterProgress.${chapter}.repairs[${JSON.stringify(storageId)}].amount`);
      await evaluate('q.tick(2)');
      await check(`q.mutableState().chapterProgress.${chapter}.repairs[${JSON.stringify(storageId)}].amount === ${amount}`, 'Waiting does not perform repair');
      if (id === 'pipe' && i === from) await screenshot('repair-gesture');
      let lastPoint;
      for (let n=0;n<6;n++) {
        if (await evaluate(`q.mutableState().chapterProgress.${chapter}.repairs[${JSON.stringify(storageId)}].step !== ${i}`)) break;
        const point = await evaluate(`(() => {const r=document.querySelector('.repair-node.next').getBoundingClientRect();return {x:r.x+r.width/2,y:r.y+r.height/2};})()`);
        await send('Input.dispatchMouseEvent', {type:n === 0 ? 'mousePressed' : 'mouseMoved',button:'left',buttons:1,clickCount:1,...point});
        if (n === 1 && (tool === 'windowKit' || tool === 'kit' && i === 0)) {
          await check("Math.abs(parseFloat(document.querySelector('.repair-action').style.getPropertyValue('--bolt-angle'))) > 20", 'Tool angle follows pointer around screw');
          if (id === 'window') await screenshot('repair-rotating-bolt');
        }
        lastPoint = point;
      }
      if (lastPoint) await send('Input.dispatchMouseEvent', {type:'mouseReleased',button:'left',buttons:0,clickCount:1,...lastPoint});
      await check(`q.mutableState().chapterProgress.${chapter}.repairs[${JSON.stringify(storageId)}].step === ${i+1}`, 'Gesture completes only the current repair step');
    }
    await delay(400);
  };
  const clean = async id => {
    await act(id);
    await evaluate('new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)))');
    const point = await evaluate(`(() => { const r=document.querySelector('.cleaning-zone').getBoundingClientRect(); return {x:r.x+r.width*.25,y:r.y+r.height/2}; })()`);
    await send('Input.dispatchMouseEvent', { type:'mousePressed', button:'left', buttons:1, clickCount:1, ...point });
    await evaluate(`(() => {
      const zone = document.querySelector('.cleaning-zone').getBoundingClientRect();
      const y = zone.y + zone.height / 2;
      for(let i=0;i<1000 && q.runtime().cleaning;i++) document.dispatchEvent(new PointerEvent('pointermove',{clientX:zone.x+zone.width*(i%2?.25:.75),clientY:y,bubbles:true}));
    })()`);
    await send('Input.dispatchMouseEvent', { type:'mouseReleased', button:'left', buttons:0, clickCount:1, ...point });
    assert(await evaluate(`q.runtime().cleanables?.find(i=>i.id==='${id}')?.done || q.runtime().stains?.find(i=>'clean-'+i.id==='${id}')?.cleaned`), 'Pointer scrubbing completes ' + id);
  };
  await load('Chapter2');
  await reachable();
  await act(await evaluate('q.runtime().dirt.find(d=>d.type==="dust").id'));
  await check('!q.runtime().cleaning', 'Chapter 2 blocks cleaning before all repairs');
  await act('pipe');
  await check('!!q.runtime().repair && document.querySelectorAll(".repair-session").length === 1', 'Pipe opens one inspection session');
  await inspect('pipe');
  const penaltyBefore = await evaluate('q.runtime().chapterTimer.remaining');
  await evaluate(`document.querySelector('[data-tool="patch"]').click()`);
  await check(`q.runtime().chapterTimer.remaining === ${penaltyBefore} - 5 && !!document.querySelector('.repair-penalty')`, 'Wrong tool deducts exactly five seconds and displays repair popup');
  await check('q.mutableState().chapterProgress.chapter2.repairs.pipe.step === 0', 'Wrong tool cannot advance pipe repair');
  const before = await evaluate('q.runtime().chapterTimer.remaining');
  await evaluate(`document.querySelector('[data-tool="glue"]').click(); document.querySelector('[data-spot="0"]').dispatchEvent(new KeyboardEvent('keydown', {key:'Enter'})); q.tick(.4); q.runtime().repair.cancel();`);
  await check(`q.runtime().chapterTimer.remaining === ${before}`, 'Timer pauses during repair while repair progress advances');
  await check('q.mutableState().chapterProgress.chapter2.repairs.pipe.amount > 0', 'Partial repair saved on cancel');
  await load('Chapter2');
  await act('pipe');
  await check('q.mutableState().chapterProgress.chapter2.repairs.pipe.amount > 0', 'Partial repair survives scene reload');
  await screenshot('chapter2-inspection');
  await repair('pipe');
  await check('q.runtime().sources.pipe && !document.querySelector(".source-emission.pipe")', 'Pipe fixed and leak effect removed');
  await evaluate('q.mutableState().chapterProgress.chapter2.repairs.window = {introduced:true}');
  await act('window'); await repair('window');
  await act('bin'); await repair('bin');
  await check('Object.values(q.runtime().sources).every(Boolean) && q.runtime().dirt.filter(d=>d.type==="trash").every(d=>d.done)', 'Three repairs complete; bin repair clears surrounding rubbish without sorting');
  await evaluate('q.ready();');
  const count = await evaluate('q.runtime().dirt.length');
  await evaluate('q.tick(8);');
  await check(`q.runtime().dirt.length === ${count}`, 'Repaired sources never spawn new dirt');
  await act(await evaluate('q.runtime().dirt.find(d=>d.type==="dust").id'));
  await check('!!q.runtime().cleaning', 'Cleaning unlocked after all repairs');
  await evaluate('q.runtime().cleaning.cancel(true); q.save("Chapter2");');
  await load('Chapter2');
  await check('Object.values(q.runtime().sources).every(Boolean)', 'Completed repairs survive reload');
  await evaluate('q.save("Chapter2"); window.ForMotherQA = undefined; window.q = undefined;');
  await send('Page.reload');
  for (let i = 0; i < 200 && !await evaluate('!!window.ForMotherQA && !document.getElementById("boot-screen")'); i++) await delay(100);
  await evaluate('window.q = ForMotherQA; q.mutableState().settings.motion = false;');
  await evaluate('document.getElementById("cont").click();');
  for (let i = 0; i < 100 && !await evaluate('q.runtime().chapterTimer?.chapter === 2'); i++) await delay(100);
  await delay(450);
  await evaluate('q.ready();');
  await check('Object.values(q.getState().chapterProgress.chapter2.sources).every(Boolean)', 'Repair save survives an actual browser reload');
  await load('Chapter2');
  const dirtIDs = await evaluate('q.runtime().dirt.filter(d=>!d.done).map(d=>d.id)');
  for (const id of dirtIDs) await clean(id);
  await evaluate('q.tick(1.1)');
  await check('q.getState().chapters[1] && !!document.querySelector(".result-card")', 'Chapter 2 reaches its existing result and reward flow');
  await load('Chapter2');
  await evaluate('q.restartChapter(); q.ready();');
  await check('!Object.values(q.runtime().sources).some(Boolean) && Object.keys(q.mutableState().chapterProgress.chapter2.repairs).length === 0', 'Chapter 2 restart clears repairs and resets clock');
  await act('pipe'); await inspect('pipe');
  await evaluate('q.runtime().chapterTimer.remaining = .01; q.tick(.1);');
  await check('!q.runtime().chapterTimer.expired && !!q.runtime().repair', 'Repair does not consume the last fraction of chapter time');
  await evaluate('q.runtime().repair.cancel(); q.tick(.1);');
  await check('q.runtime().chapterTimer.expired && !q.runtime().repair && !document.querySelector(".repair-session")', 'Timeout cancels active repair');

  await load('Chapter4');
  await reachable();
  await act('repair-chair');
  await check('!q.runtime().repair', 'Chapter 4 repair waits for tidying');
  await act('pick-books'); await act('place-toys');
  await check('q.runtime().held.id === "books" && !q.mutableState().chapterProgress.chapter4.placed.toys', 'Wrong destination keeps the carried item');
  await load('Chapter4');
  await check('q.runtime().held.id === "books"', 'Carried item survives reload');
  await act('place-books');
  for (const id of ['box', 'toys', 'pillow']) { await act('pick-' + id); await act('place-' + id); }
  await check('Object.values(q.mutableState().chapterProgress.chapter4.placed).filter(Boolean).length === 4 && !q.runtime().held', 'Four items placed at their own destinations');
  await act('repair-chair'); await screenshot('chapter4-chair'); await repair('chair');
  await act('repair-shelf'); await repair('shelf');
  for(const id of await evaluate('q.runtime().interactables.filter(i=>i.repair && i.enabled).map(i=>i.id)')) {await act(id);const key=id.replace('repair-','');await repair(Number(key.split('-')[1])%2===0?'chair':'shelf',key);}
  await check('q.mutableState().chapterProgress.chapter4.fixed.chair && q.mutableState().chapterProgress.chapter4.fixed.shelf', 'Chair and shelf repairs complete');
  await act('ch4-trash');
  await evaluate(`document.querySelectorAll('.trash-sort-item').forEach(el=>{ el.click(); document.querySelector('.trash-sort-bin[data-type="'+el.dataset.type+'"]').click(); });`);
  await delay(450);
  await check('!!q.mutableState().chapterProgress.chapter4.cleaned.trash', 'Existing Chapter 4 rubbish sorting remains functional');
  await act('ch4-floor');
  await check('!q.runtime().cleaning && document.getElementById("dialog").textContent.length > 0', 'Lumi blocks mopping before dust');
  await evaluate('q.ready();');
  await screenshot('chapter4-room');
  // Complete cleaning through the existing pointer scrub handlers below.
  await clean('ch4-dustShelf'); await clean('ch4-dustTable');
  await check('q.mutableState().chapterProgress.chapter4.cleaned.dustShelf && q.mutableState().chapterProgress.chapter4.cleaned.dustTable && q.runtime().chapterTimer.bonus === 3', 'Dust cleaned by scrubbing; order awards one time bonus');
  await load('Chapter4');
  await check('q.runtime().chapterTimer.bonus === 3 && q.mutableState().chapterProgress.chapter4.bonuses.dust', 'Time bonus persists without duplication');
  await clean('ch4-stain'); await clean('ch4-floor');
  for(const id of await evaluate("q.runtime().cleanables.filter(i=>i.id.startsWith('ch4-extra-')).map(i=>i.id)")) await clean(id);
  await check('q.mutableState().chapterProgress.chapter4.cleaned.floor', 'Floor can be scrubbed after dust');
  await evaluate('q.tick(.1);');
  await check('q.runtime().chapter4Closing', 'Finishing all tasks opens closing dialogue');
  for (let i=0; i<10 && await evaluate('!!document.getElementById("dialog").children.length'); i++) {
    await delay(150);
    await evaluate('q.advanceDialog();');
  }
  for (let i=0; i<10 && !await evaluate('!!document.querySelector(".result-card")'); i++) {
    await evaluate('document.querySelector(".lumi-next")?.click();');
    await delay(200);
  }
  await check('q.getState().chapters[3] && !!document.querySelector(".result-card")', 'Chapter 4 closing dialogue continues to its existing result and reward flow');
  await load('Chapter4');
  await evaluate('q.restartChapter(); q.ready();');
  await check('Object.keys(q.mutableState().chapterProgress.chapter4.placed).length === 0 && !q.runtime().held && q.runtime().chapterTimer.bonus === 0', 'Chapter 4 restart clears placements, carried item, and bonuses');
  for (const chapter of ['Chapter1','Chapter3','Chapter5']) { await load(chapter); await check('q.runtime().interactables.length > 0', chapter + ' still initializes'); }
  const finishDialogue = async () => {
    for(let i=0;i<20 && await evaluate('!!document.getElementById("dialog").children.length');i++){
      await delay(150); await evaluate('q.advanceDialog();');
    }
  };
  const finishGuide = async () => {
    for(let i=0;i<12 && await evaluate('!!q.runtime().lumiEducation');i++){
      await evaluate('document.querySelector(".lumi-next")?.click();'); await delay(150);
    }
  };
  await load('Chapter1');
  await evaluate('q.mutableState().settings.motion=false;');
  for(const [id,bin] of await evaluate("q.runtime().interactables.filter(i=>/^(banana|food|paper|can|bag|bottle)-/.test(i.id)).map(i=>[i.id,/^(banana|food)-/.test(i.id)?'organic':'nonorganic'])")){
    await act(id);
    if(id.endsWith('-0')) {await evaluate("q.save('Chapter1')");await load('Chapter1');await check("!!q.runtime().held",'Chapter 1 carried rubbish survives continue');}
    await act('bin_'+bin);
  }
  await finishGuide();
  await check('q.getState().chapters[0] && !!document.querySelector(".result-card")', 'Original Chapter 1 sorting still reaches its result');
  await evaluate('q.mutableState().settings.motion=false; q.loadScene("Chapter3");');
  await delay(750); await finishDialogue();
  await check('q.runtime().phase === "INVESTIGATION"', 'Original Chapter 3 intro enters investigation');
  await evaluate('q.runtime().onQ();');
  const hiddenIDs = await evaluate('q.runtime().stains.map(s=>s.id)');
  for(const id of hiddenIDs){
    await evaluate(`(()=>{const s=q.runtime().stains.find(s=>s.id==='${id}');q.runtime().lumi.x=s.x;q.runtime().lumi.y=s.y;q.tick(.01);s.inspect.action();})()`);
  }
  await check('q.runtime().marked === q.runtime().stains.length', 'Lumi Vision still detects and marks all Chapter 3 stains');
  await finishGuide(); await delay(1100); await finishDialogue();
  await check('q.runtime().phase === "CLEANING"', 'Original reveal sequence still unlocks cleaning');
  for(const id of hiddenIDs){
    if(id==='hidden-trash'){
      await act('clean-'+id);
      await evaluate(`document.querySelectorAll('.trash-sort-item').forEach(el=>{el.click();document.querySelector('.trash-sort-bin[data-type="'+el.dataset.type+'"]').click();});`);
      await delay(450);
    }else await clean('clean-'+id);
    if(id===hiddenIDs[0]) {
      await evaluate("q.save('Chapter3');q.loadScene('Chapter3');");
      await delay(750);await finishDialogue();
      await check("q.runtime().phase==='CLEANING' && q.runtime().cleaned===1",'Chapter 3 continues cleaning with completed stains preserved');
    }
  }
  await finishDialogue();
  await check('q.getState().chapters[2] && !!document.querySelector(".result-card")', 'Original Chapter 3 cleaning and dialogue still reach the result');
  await load('Chapter5'); await reachable();
  await act('source'); await repair('window');
  await check('q.runtime().flags.source && !q.runtime().repair', 'Chapter 5 uses the shared repair puzzle');
  await act('trash');
  await evaluate(`document.querySelectorAll('.trash-sort-item').forEach(el=>{ el.click(); document.querySelector('.trash-sort-bin[data-type="'+el.dataset.type+'"]').click(); });`);
  await delay(450);
  await act('organize'); await act('place-final-toys');
  await check('q.runtime().flags.organize && !q.runtime().held', 'Chapter 5 requires pickup and delivery');
  await clean('dust'); await clean('stain'); await clean('puddle');
  for(const id of await evaluate("Object.keys(q.runtime().flags).filter(id=>id.startsWith('extra-'))")) await clean(id);
  await evaluate('q.runtime().onQ();');
  await act('hidden');
  await check('!!q.runtime().investigating && !q.runtime().cleaning', 'Hidden dirt must be inspected after Lumi Vision');
  await evaluate('new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)))');
  const spot = await evaluate(`(()=>{const r=document.querySelector('.investigation-zone').getBoundingClientRect();return {x:r.x+r.width/2,y:r.y+r.height/2};})()`);
  await send('Input.dispatchMouseEvent',{type:'mousePressed',button:'left',buttons:1,clickCount:1,...spot});
  await evaluate(`(()=>{ const el=document.querySelector('.investigation-session');for(let i=0;i<200&&q.runtime().investigating;i++)el.dispatchEvent(new PointerEvent('pointermove',{clientX:${spot.x}+(i%2?10:-10),clientY:${spot.y},bubbles:true})); })()`);
  await send('Input.dispatchMouseEvent',{type:'mouseReleased',button:'left',buttons:0,clickCount:1,...spot});
  await check('q.getState().chapterProgress.chapter5.hiddenMarked && !!q.runtime().cleaning', 'Inspection unlocks cleaning for final hidden dirt');
  await clean('hidden'); await clean('last'); await evaluate('q.tick(.1)');
  await check('q.runtime().restoration && !!document.querySelector(".final-restoration img")', 'Final restoration uses supplied glow artwork');
  await delay(1300); await screenshot('chapter5-restoration');
  const restorationTime = await evaluate('q.runtime().chapterTimer.remaining');
  await evaluate('q.updateChapterClock(1)');
  await check(`q.runtime().chapterTimer.remaining === ${restorationTime}`, 'Final restoration pauses the clock');
  await delay(3500);
  for(let i=0;i<10&&!await evaluate('!!document.querySelector(".result-card")');i++){
    await evaluate('document.querySelector(".lumi-next")?.click()'); await delay(200);
  }
  await check('q.getState().chapters[4] && !!document.querySelector(".result-card")', 'Chapter 5 keeps its existing result and medicine reward path');
  await load('Chapter5'); await evaluate('q.restartChapter(); q.ready();');
  await check('!Object.values(q.runtime().flags).some(Boolean) && !q.getState().chapterProgress.chapter5.restored && !q.runtime().held', 'Chapter 5 restart clears repair, restoration, and carried state');

  // Audio lifecycle and directional foot collision checks.
  await load('Chapter2'); await evaluate('q.audio.unlock(); q.environment();');
  await check('q.audio.snapshot().loops.includes("water_leak") && q.audio.snapshot().loops.includes("wind")', 'Chapter 2 starts separate quiet source ambience');
  const loopStarts = await evaluate('q.audio.snapshot().counts["water_leak:loop"]');
  await evaluate('for(let i=0;i<60;i++) q.environment()');
  await check(`q.audio.snapshot().counts["water_leak:loop"] === ${loopStarts}`, 'Environment loops do not restart each frame');
  await evaluate('q.runtime().chapterTimer.remaining=14; q.updateChapterClock(0);');
  const warningStarts = await evaluate('q.audio.snapshot().counts["timer_warning:loop"]');
  await evaluate('for(let i=0;i<60;i++) q.updateChapterClock(0);');
  await check(`q.audio.snapshot().counts["timer_warning:loop"] === ${warningStarts}`, 'Timer warning starts once per active warning interval');
  await evaluate('q.startDialog([{name:"Lumi",who:"lumi",text:"Uji prioritas audio."}]); q.environment();');
  await check('q.audio.snapshot().priorityFactor === .35 && q.audio.snapshot().environmentFactor === .18', 'Dialogue takes priority over ambience and music');
  await evaluate('q.ready(); q.pause();');
  await check('q.audio.snapshot().loops.length === 0', 'Pause stops environment loops');
  await evaluate('document.getElementById("resume").click(); q.runtime().chapterTimer.remaining=100;');
  await load('Chapter4');
  await evaluate('q.player().x=800;q.player().y=620;q.keys.add("d");q.move(.4);q.keys.clear();');
  await check('(q.audio.snapshot().counts.footstep || 0) > 0', 'Actual movement produces quiet footsteps');
  await evaluate('q.move(.1);');
  await check('!q.player().moving', 'Idle movement stops stepping');
  await check(`(()=>{const p=q.player();p.dir='left';const l=q.collisionBox(p);p.dir='right';const r=q.collisionBox(p);return l.w===22&&l.h===12&&r.x>l.x&&r.y===l.y;})()`, 'Foot collider is small, directional, and independent of sprite dimensions');
  await evaluate('q.loadScene("MainMenu");');
  await check('q.audio.snapshot().loops.length === 0', 'Returning to menu clears chapter loops');
  await delay(100);
  const clicks = await evaluate('q.audio.snapshot().counts.ui_click || 0');
  await evaluate('document.getElementById("credits").click();');
  await check(`q.audio.snapshot().counts.ui_click === ${clicks + 1}`, 'One button click produces one menu click sound after many restarts');
  await check('window.ForMotherRuntime === undefined', 'Shared runtime stays private after module bootstrap');

  await evaluate('q.loadScene("Ending"); document.getElementById("menu").click();');
  await check('!!document.querySelector(".ending-brand-sequence")', 'Existing ending logo sequence still starts');
  await delay(8100);
  await check('q.getState().scene === "MainMenu"', 'Ending logo sequence returns to the menu');
  await evaluate('q.loadScene("Ending"); document.getElementById("replay").click();');
  for (let attempt=0;attempt<60 && await evaluate('q.getState().scene !== "Opening1"');attempt++) await delay(200);
  await check('q.getState().scene === "Opening1" && !q.getState().chapters.some(Boolean)', 'Ending replay preserves the logo sequence and resets the game');
  await load('Chapter2'); await act('pipe');
  for (const [width,height] of [[1366,768],[844,390],[390,844]]) {
    await send('Emulation.setDeviceMetricsOverride', {width,height,deviceScaleFactor:1,mobile:false});
    await screenshot(`repair-${width}x${height}`);
    await check('document.querySelector(".repair-panel").scrollWidth <= document.querySelector(".repair-panel").clientWidth + 1', 'Repair has no horizontal overflow at ' + width);
  }
  assert.deepEqual(exceptions, [], 'No browser exceptions');
  assert.deepEqual(missing, [], 'No missing local assets');
  console.log('PASS: no browser exceptions or missing local assets. Screenshots: tools/qa-output');
  await send('Browser.close');
}
main().catch(error => { console.error(error.stack); process.exitCode = 1; }).finally(async () => {
  socket?.close(); chrome?.kill(); server.closeAllConnections(); server.close();
  // Chrome may still be releasing its isolated temporary profile on Windows.
  await delay(300);
  const resolvedProfile = path.resolve(profile);
  if (path.dirname(resolvedProfile) === path.resolve(os.tmpdir()) && path.basename(resolvedProfile).startsWith('for-mother-qa-')) {
    try { fs.rmSync(resolvedProfile, { recursive:true, force:true, maxRetries:2 }); } catch {}
  }
});
