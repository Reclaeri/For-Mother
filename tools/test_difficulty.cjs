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
  spawnValid: game.spawnPositionValid, config:game.DIFFICULTIES, safeLoad:game.safeLoad,
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
  for (const mode of ['EASY','MEDIUM','HARD']) {
    await evaluate(`q.mutableState().difficulty='${mode}';q.mutableState().chapterProgress={};q.mutableState().resume=null;`);
    for(let chapter=1;chapter<=5;chapter++) {
      await load('Chapter'+chapter);
      await reachable();
      await check(`q.runtime().chapterTimer.limit === q.config['${mode}'].timers[${chapter-1}]`, `${mode} Chapter ${chapter} timer`);
      if(chapter===1) await check('q.runtime().total === q.config[q.mutableState().difficulty].trash', 'Trash count');
      if(chapter===2) await check("q.repairDefinition('pipe').spots.length===q.config[q.mutableState().difficulty].pipe && q.repairDefinition('window').spots.length===q.config[q.mutableState().difficulty].window", 'Fixed source defect counts');
      if(chapter===3) await check('q.runtime().stains.length===q.config[q.mutableState().difficulty].stains','Stain count');
      if(chapter===4) await check('q.runtime().interactables.filter(i=>i.repair).length===q.config[q.mutableState().difficulty].repairs','Furniture repair count');
      if(chapter===5) await check('Object.keys(q.runtime().flags).length===q.config[q.mutableState().difficulty].final','Final objective count');
      for(let attempt=0;attempt<4;attempt++) {
        const prior = await evaluate(`JSON.stringify(q.mutableState().chapterProgress.chapter${chapter}.layouts)`);
        await evaluate(`q.save('Chapter${chapter}')`);
        await check(`q.safeLoad().difficulty==='${mode}'`, 'Saved difficulty');
        await load('Chapter'+chapter);
        await check(`JSON.stringify(q.mutableState().chapterProgress.chapter${chapter}.layouts)===${JSON.stringify(prior)}`, 'Continue retains layout');
        await evaluate('q.restartChapter();q.ready();');
        await check(`JSON.stringify(q.mutableState().chapterProgress.chapter${chapter}.layouts)!==${JSON.stringify(prior)}`, 'Restart changes layout');
        await check(`Object.entries(q.mutableState().chapterProgress.chapter${chapter}.layouts).every(([key,points])=>points.every((p,i)=>!q.runtime().obstacles.some(r=>p[0]+40>r.x && p[0]-40<r.x+r.w && p[1]+20>r.y && p[1]-60<r.y+r.h) && points.every((b,j)=>i===j || Math.hypot(p[0]-b[0],p[1]-b[1]) >= (key==='trash'?80:key==='furniture'?120:100))))`, 'Spawn clearance and spacing');
      }
    }
  }
  await evaluate('q.loadScene("MainMenu");document.getElementById("new").click();');
  await check('document.querySelectorAll("[data-difficulty]").length===3','Menu offers three difficulty options');
  fs.writeFileSync(path.join(output,'difficulty-menu.png'),Buffer.from((await send('Page.captureScreenshot',{format:'png'})).data,'base64'));
  await evaluate(`document.querySelector('[data-difficulty="EASY"]').click();document.getElementById('startDifficulty').click();`);
  await delay(1500);
  await check("q.mutableState().difficulty==='EASY' && q.safeLoad().difficulty==='EASY'", 'Selected mode is saved when starting');
  await evaluate(`localStorage.setItem('forMother.save.v2',JSON.stringify({scene:'WitchHouse',currentChapter:3,chapters:[true,true],medicines:[true,true]}));`);
  await check("q.safeLoad().difficulty==='MEDIUM' && q.safeLoad().medicines[1] && q.safeLoad().chapters[1]", 'Legacy saves retain chapter and medicine progress with MEDIUM fallback');

  assert.deepEqual(exceptions,[]);assert.deepEqual(missing,[]);
  console.log('PASS: all difficulty, repeated spawn, save and menu checks');
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
