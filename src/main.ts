import '@fontsource/instrument-serif/400.css';
import '@fontsource/instrument-serif/400-italic.css';
import '@fontsource-variable/inter-tight';
import '@fontsource/ibm-plex-mono/400.css';
import '@fontsource-variable/noto-kufi-arabic';
import './styles/base.css';
import './styles/sections.css';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { render } from './render';
import { initScroll, startScroll, velocity } from './scroll';
import { GL } from './gl/Canvas';
import { initScrub, initTextReveals, initThemes } from './anim/text';
import { heroIntro, initHeroScroll, initMarquee, initMediaReveals, initNumbers, initStudio, initShows } from './anim/sections';
import { initClock, initCursor, initMagnetic, initMenu } from './anim/ui';

gsap.registerPlugin(ScrollTrigger);

const motion = !matchMedia('(prefers-reduced-motion: reduce)').matches;
const mobile = matchMedia('(max-width: 900px), (pointer: coarse)').matches;

function webglAvailable() {
  try {
    const c = document.createElement('canvas');
    return !!(c.getContext('webgl2') || c.getContext('webgl'));
  } catch {
    return false;
  }
}

// The intro always starts at the top; restoring a mid-page position would also make
// already-passed `once` triggers kill themselves inside ScrollTrigger's first refresh.
history.scrollRestoration = 'manual';
window.scrollTo(0, 0);

render();
initScroll(motion);

const gl = motion && webglAvailable() ? new GL(document.querySelector<HTMLCanvasElement>('.webgl')!, mobile) : null;
if (gl) {
  document.documentElement.classList.add('gl-ready');
  gsap.ticker.add((time) => gl.render(time, velocity()));
} else {
  document.querySelector('.webgl')?.remove();
}

initClock();
initCursor();
initMagnetic();
initMenu(motion);

if (motion) runPreloader();
else finishStatic();

function initScrollScenes() {
  // Pinned scenes first, so every later trigger measures positions with the pin spacing in place.
  initShows();
  initThemes();
  initTextReveals();
  initScrub();
  initHeroScroll(gl);
  initMediaReveals(gl);
  initStudio();
  initNumbers();
  initMarquee(true);
  ScrollTrigger.refresh();
}

function finishStatic() {
  document.documentElement.classList.add('is-static');
  document.querySelector('.preloader')?.remove();
  document.body.classList.remove('is-loading');
  initThemes();
}

async function runPreloader() {
  const pre = document.querySelector<HTMLElement>('.preloader')!;
  const num = pre.querySelector<HTMLElement>('.preloader__num')!;
  const needle = pre.querySelector<HTMLElement>('.tuner__needle')!;

  gsap.from('.tuner__scale i', { scaleY: 0, duration: 1.2, stagger: { each: 0.012, from: 'center' }, ease: 'expo.out' });
  gsap.from('.preloader__label, .preloader__freq, .preloader__sig', { y: 20, autoAlpha: 0, duration: 1.2, stagger: 0.1, ease: 'expo.out' });

  // Progress blends real asset loading with a minimum, so the intro always breathes.
  const progress = { real: 0, shown: 0 };
  const minTime = gsap.to({}, { duration: 2 });
  let parts = 0;
  const assets = Promise.all([
    document.fonts.ready,
    gl
      ? Promise.all([
          gl.signal.load('/images/portrait.webp'),
          gl.media.load((l, t) => (parts = l / t)),
        ])
      : Promise.resolve(),
  ]).then(() => (progress.real = 1));
  const counter = (_: number, delta: number) => {
    const real = Math.max(progress.real, parts * 0.95);
    const target = Math.min(real, minTime.time() / 2) * 100;
    progress.shown += (target - progress.shown) * Math.min(delta / 140, 1);
    num.textContent = String(Math.round(progress.shown)).padStart(2, '0');
    // A little needle wobble, like a hand on the dial.
    const wobble = Math.sin(performance.now() * 0.012) * (1 - progress.shown / 100) * 1.2;
    needle.style.left = `${progress.shown + wobble}%`;
  };
  gsap.ticker.add(counter);
  await assets;
  await new Promise<void>((resolve) => {
    const check = () => (progress.shown > 99.4 ? resolve() : requestAnimationFrame(check));
    check();
  });
  gsap.ticker.remove(counter);
  num.textContent = '100';
  needle.style.left = '100%';

  initScrollScenes();

  const tl = gsap.timeline({
    onComplete: () => {
      pre.remove();
      document.body.classList.remove('is-loading');
      startScroll();
      ScrollTrigger.refresh();
    },
  });
  tl.to('.preloader__inner, .preloader__sig', { yPercent: -40, autoAlpha: 0, duration: 0.8, ease: 'expo.in' })
    .to(pre, { clipPath: 'inset(0 0 100% 0)', duration: 1.3, ease: 'expo.inOut' }, '-=0.15')
    .add(heroIntro(gl), '-=0.9');
}
