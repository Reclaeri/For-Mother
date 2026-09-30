/* Run with node tools/qa_lumi_flip.cjs. Uses an isolated headless Chrome profile.
   Test hooks are injected by this localhost server, never into the shipped game. */
const fs = require("node:fs");
const path = require("node:path");
const http = require("node:http");
const os = require("node:os");
const { spawn } = require("node:child_process");
const assert = require("node:assert/strict");
const root = path.resolve(__dirname, "..");
const chromePath =
  process.env.CHROME_PATH ||
  "C:/Program Files/Google/Chrome/Application/chrome.exe";
const profile = fs.mkdtempSync(path.join(os.tmpdir(), "for-mother-qa-"));
const output = path.join(root, "tools", "qa-output");
fs.mkdirSync(output, { recursive: true });
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
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
  const name = decodeURIComponent(
    new URL(req.url, "http://localhost").pathname,
  );
  const file = path.resolve(root, "." + (name === "/" ? "/index.html" : name));
  if (!file.startsWith(root + path.sep)) {
    res.writeHead(403);
    res.end();
    return;
  }
  try {
    let content = fs.readFileSync(file);
    if (file === path.join(root, "script.js"))
      content = Buffer.from(
        content.toString().replace("window.ForMotherQA = {", hooks),
      );
    const mime = {
      ".html": "text/html",
      ".js": "text/javascript",
      ".css": "text/css",
      ".png": "image/png",
      ".mp3": "audio/mpeg",
      ".wav": "audio/wav",
      ".mp4": "video/mp4",
    };
    res.writeHead(200, {
      "Content-Type": mime[path.extname(file)] || "application/octet-stream",
    });
    res.end(content);
  } catch {
    res.writeHead(404);
    res.end();
  }
});
let chrome, socket;
async function main() {
  console.log("Starting isolated Chrome gameplay checks...");
  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
  chrome = spawn(
    chromePath,
    [
      "--headless=new",
      "--disable-gpu",
      "--no-first-run",
      "--no-default-browser-check",
      "--remote-debugging-port=0",
      `--user-data-dir=${profile}`,
      "--window-size=1440,900",
      "about:blank",
    ],
    { windowsHide: true, stdio: "ignore" },
  );
  chrome.on("error", (error) => {
    console.error(error.message);
  });
  const portFile = path.join(profile, "DevToolsActivePort");
  for (let i = 0; i < 100 && !fs.existsSync(portFile); i++) await delay(100);
  if (!fs.existsSync(portFile))
    throw Error("Chrome did not start. Set CHROME_PATH to a Chromium browser.");
  const port = fs.readFileSync(portFile, "utf8").split("\n")[0];
  const targets = await (await fetch(`http://127.0.0.1:${port}/json`)).json();
  socket = new WebSocket(
    targets.find((t) => t.type === "page").webSocketDebuggerUrl,
  );
  await new Promise((resolve, reject) => {
    const timeout = setTimeout(
      () => reject(Error("Chrome websocket timed out")),
      10000,
    );
    socket.addEventListener(
      "open",
      () => {
        clearTimeout(timeout);
        resolve();
      },
      { once: true },
    );
    socket.addEventListener(
      "error",
      () => {
        clearTimeout(timeout);
        reject(Error("Chrome websocket failed"));
      },
      { once: true },
    );
  });
  let seq = 0;
  const pending = new Map(),
    exceptions = [],
    missing = [];
  socket.addEventListener("message", (event) => {
    const msg = JSON.parse(event.data);
    if (msg.id) {
      const p = pending.get(msg.id);
      pending.delete(msg.id);
      msg.error ? p.reject(Error(msg.error.message)) : p.resolve(msg.result);
    }
    if (msg.method === "Runtime.exceptionThrown")
      exceptions.push(
        msg.params.exceptionDetails.text +
          ": " +
          msg.params.exceptionDetails.exception?.description,
      );
    if (
      msg.method === "Network.responseReceived" &&
      msg.params.response.status >= 400 &&
      !msg.params.response.url.endsWith("favicon.ico")
    )
      missing.push(msg.params.response.url);
  });
  const send = (method, params = {}) =>
    new Promise((resolve, reject) => {
      const id = ++seq;
      const timeout = setTimeout(() => {
        pending.delete(id);
        reject(Error(method + " timed out"));
      }, 15000);
      pending.set(id, {
        resolve: (result) => {
          clearTimeout(timeout);
          resolve(result);
        },
        reject: (error) => {
          clearTimeout(timeout);
          reject(error);
        },
      });
      socket.send(JSON.stringify({ id, method, params }));
    });
  const evaluate = async (expression) => {
    const result = await send("Runtime.evaluate", {
      expression,
      awaitPromise: true,
      returnByValue: true,
    });
    if (result.exceptionDetails)
      throw Error(
        result.exceptionDetails.exception?.description ||
          result.exceptionDetails.text,
      );
    return result.result.value;
  };
  const check = async (expression, message) => {
    assert(await evaluate(expression), message);
    console.log("PASS: " + message);
  };
  await send("Runtime.enable");
  await send("Network.enable");
  await send("Page.enable");
  await send("Page.navigate", {
    url: `http://127.0.0.1:${server.address().port}/`,
  });
  for (
    let i = 0;
    i < 200 &&
    !(await evaluate(
      '!!window.ForMotherQA && !document.getElementById("boot-screen")',
    ));
    i++
  )
    await delay(100);
  const shot = async (name) =>
    fs.writeFileSync(
      path.join(output, name + ".png"),
      Buffer.from((await send("Page.captureScreenshot")).data, "base64"),
    );
  await evaluate(
    'ForMotherQA.mutableState().knowledge.fill(true); document.getElementById("lumiBook").click(); document.querySelectorAll("[data-book-page]")[0].click()',
  );
  await delay(1250);
  await shot("lumi-flip-open");
  await evaluate('document.getElementById("nextLumiPage").click()');
  await check(
    '!!document.querySelector(".book-turning-leaf") && document.querySelector(".book-leaf-front").textContent.includes("Kebiasaan")',
    "Printed page turns with its content",
  );
  await evaluate(
    'document.querySelector(".book-turning-leaf").getAnimations({subtree:true}).forEach(a=>{a.pause();a.currentTime=380})',
  );
  await shot("lumi-flip-middle");
  await evaluate(
    'document.querySelector(".book-turning-leaf").getAnimations({subtree:true}).forEach(a=>a.finish())',
  );
  await delay(60);
  await check(
    '!document.querySelector(".book-turning-leaf") && document.querySelector(".book-page-number").textContent.includes("2 dari")',
    "Turn completes and cleans up",
  );
  await evaluate('document.getElementById("previousLumiPage").click()');
  await delay(1250);
  await check(
    'document.getElementById("previousLumiPage").disabled',
    "Backward turn reaches first page",
  );
  const bounds = await evaluate(
    '(()=>{const r=document.querySelector(".lumi-book-spread").getBoundingClientRect();return {x:r.x,y:r.y,w:r.width,h:r.height}})()',
  );
  const drag = async (distance) => {
    const x = bounds.x + bounds.w * 0.8,
      y = bounds.y + 100;
    await send("Input.dispatchMouseEvent", {
      type: "mousePressed",
      x,
      y,
      button: "left",
      clickCount: 1,
    });
    await send("Input.dispatchMouseEvent", {
      type: "mouseMoved",
      x: x - distance,
      y,
      button: "left",
      buttons: 1,
    });
    await send("Input.dispatchMouseEvent", {
      type: "mouseReleased",
      x: x - distance,
      y,
      button: "left",
      clickCount: 1,
    });
    await delay(1250);
  };
  await drag(25);
  await check(
    'document.getElementById("previousLumiPage").disabled',
    "Short drag returns the leaf",
  );
  await drag(bounds.w * 0.35);
  await check(
    'document.querySelector(".book-page-number").textContent.includes("2 dari")',
    "Mouse drag turns page",
  );
  await evaluate(
    'document.querySelector(".lumi-book-spread").dispatchEvent(new KeyboardEvent("keydown",{key:"ArrowLeft",bubbles:true}))',
  );
  await delay(1250);
  await check(
    'document.getElementById("previousLumiPage").disabled',
    "Keyboard turns backward",
  );
  await evaluate(
    'document.querySelectorAll("[data-book-page]")[5].click(); document.querySelectorAll("[data-book-page]")[0].click()',
  );
  await delay(1250);
  await check(
    'document.getElementById("previousLumiPage").disabled && document.querySelectorAll(".book-turning-leaf").length===0',
    "Rapid tab navigation settles cleanly",
  );
  await evaluate(
    'ForMotherQA.mutableState().settings.motion=false; document.getElementById("nextLumiPage").click()',
  );
  await check(
    '!document.querySelector(".book-turning-leaf") && document.querySelector(".book-page-number").textContent.includes("2 dari")',
    "Animation preference respected",
  );
  await evaluate("ForMotherQA.mutableState().settings.motion=true");
  await send("Emulation.setDeviceMetricsOverride", {
    width: 390,
    height: 844,
    deviceScaleFactor: 1,
    mobile: false,
  });
  await evaluate('document.getElementById("nextLumiPage").click()');
  await delay(1250);
  await check(
    'document.querySelector(".lumi-book").scrollWidth <= document.querySelector(".lumi-book").clientWidth+1',
    "Book fits narrow display",
  );
  await shot("lumi-flip-mobile");
  await evaluate(
    'document.getElementById("closeLumiBook").click(); ForMotherQA.mutableState().knowledge.fill(false); document.getElementById("lumiBook").click()',
  );
  await check(
    'document.querySelectorAll(".book-locked").length===2',
    "Locked lessons remain protected",
  );
  assert.deepEqual(exceptions, [], "No browser exceptions");
  assert.deepEqual(missing, [], "No missing assets");
  await send("Browser.close");
}
main()
  .catch((error) => {
    console.error(error.stack);
    process.exitCode = 1;
  })
  .finally(async () => {
    socket?.close();
    chrome?.kill();
    server.closeAllConnections();
    server.close();
    // Chrome may still be releasing its isolated temporary profile on Windows.
    await delay(300);
    const resolvedProfile = path.resolve(profile);
    if (
      path.dirname(resolvedProfile) === path.resolve(os.tmpdir()) &&
      path.basename(resolvedProfile).startsWith("for-mother-qa-")
    ) {
      try {
        fs.rmSync(resolvedProfile, {
          recursive: true,
          force: true,
          maxRetries: 2,
        });
      } catch {}
    }
  });
