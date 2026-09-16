/* Opening sequence and bounded image preloading; works without a server too. */
((game) => {
  "use strict";
  game.showBoot = async () => {
    const screen = document.getElementById('boot-screen');
    const root = document.getElementById('game');
    root.inert = true;
    game.bootLoading = true;
    const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches || game.state.settings.motion === false;
    let skip;
    const skipped = new Promise(resolve => { skip = resolve; });
    const button = document.getElementById('boot-skip');
    button.onclick = () => { skip(); button.hidden = true; };
    const wait = ms => Promise.race([new Promise(resolve => setTimeout(resolve, ms)), skipped]);
    const urls = new Set(['assets/Logo Tim.png', 'assets/ui/logo_for_mother.png', 'assets/background/hutan/background-hutan.png']);
    const collect = value => {
      // Clean dust layers are optional, generated/handled by the cleaning system.
      if (typeof value === 'string' && /\.(png|jpe?g|webp)$/i.test(value) && !/dust_(shelf|table|window)_clean\.png$/i.test(value)) urls.add(value);
      else if (value && typeof value === 'object') Object.values(value).forEach(collect);
    };
    collect(game.ASSETS);
    let loaded = 0, failed = 0;
    const preload = Promise.all([...urls].map(src => new Promise(resolve => {
      const img = new Image();
      let settled = false;
      const done = success => {
        if (settled) return;
        settled = true; clearTimeout(timeout);
        if (!success) failed++;
        const percent = Math.round(++loaded / urls.size * 100);
        screen.style.setProperty('--load', percent + '%');
        screen.querySelector('.boot-track').setAttribute('aria-valuenow', percent);
        document.getElementById('boot-percent').textContent = percent + '%';
        resolve();
      };
      const timeout = setTimeout(() => done(false), 12000);
      img.onload = () => done(true); img.onerror = () => done(false); img.src = src;
    })));
    await wait(reduced ? 150 : 1900);
    screen.dataset.phase = 'title';
    await wait(reduced ? 150 : 2100);
    screen.dataset.phase = 'loading';
    button.hidden = true;
    await Promise.all([preload, wait(reduced ? 100 : 1400)]);
    document.getElementById('boot-status').textContent = failed ? 'Siap. Beberapa aset akan dicoba kembali saat bermain.' : 'Perjalanan siap dimulai';
    await wait(reduced ? 100 : 500);
    screen.classList.add('boot-exit');
    await new Promise(resolve => setTimeout(resolve, reduced ? 0 : 650));
    screen.remove(); root.inert = false; game.bootLoading = false; game.keys.clear();
  };
})(window.ForMotherRuntime);
