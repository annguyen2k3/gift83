import { initScreen1 } from './screens/screen1.js';
import { initScreen2 } from './screens/screen2.js';
import { initScreen3 } from './screens/screen3.js';

const overlay    = document.getElementById('transition-overlay');
const destroyers = {};

// ─── Screen manager ───
function goToScreen(num) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  const target = document.getElementById(`screen-${num}`);
  if (target) target.classList.add('active');
}

function transitionTo(from, to, initFn) {
  overlay.classList.add('visible');

  setTimeout(() => {
    if (destroyers[from]) { destroyers[from](); delete destroyers[from]; }

    goToScreen(to);

    if (initFn) {
      const destroy = initFn();
      if (destroy) destroyers[to] = destroy;
    }

    requestAnimationFrame(() => requestAnimationFrame(() => {
      overlay.classList.remove('visible');
    }));
  }, 680);
}

// ─── Màn 1 → Màn 2 ───
destroyers[1] = initScreen1(document.getElementById('screen-1'), () => {
  transitionTo(1, 2, () =>
    initScreen2(document.getElementById('screen-2'), () => {
      transitionTo(2, 3, () =>
        initScreen3(
          document.getElementById('screen-3'),
          () => transitionTo(3, 4),
          () => transitionTo(3, 5),
        )
      );
    })
  );
});
