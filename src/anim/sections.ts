import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import type { GL } from '../gl/Canvas';
import { velocity } from '../scroll';

gsap.registerPlugin(ScrollTrigger, SplitText);

const desktop = '(min-width: 901px) and (pointer: fine)';

/** Signal tunes in while the name rises letter by letter. */
export function heroIntro(gl: GL | null) {
  const lines = document.querySelectorAll<HTMLElement>('.hero__line');
  const split = SplitText.create(lines, { type: 'chars', mask: 'chars', charsClass: 'char' });
  const tl = gsap.timeline();
  if (gl) tl.to(gl.signal.uniforms.uTune, { value: 1, duration: 3.2, ease: 'power2.inOut' }, 0);
  else tl.from('.hero__fallback', { autoAlpha: 0, scale: 1.08, duration: 2, ease: 'expo.out' }, 0);
  tl.from(split.chars, { yPercent: 115, duration: 1.6, stagger: 0.045, ease: 'expo.out' }, 0.35)
    .from('.hero__kicker span', { yPercent: 100, autoAlpha: 0, duration: 1, stagger: 0.08, ease: 'expo.out' }, 0.9)
    .from('.hero__foot > *, .nav > *', { y: 24, autoAlpha: 0, duration: 1.1, stagger: 0.07, ease: 'expo.out' }, 1.1);
  return tl;
}

/** As the hero leaves, the two name lines slide apart and the signal smears out. */
export function initHeroScroll(gl: GL | null) {
  const tl = gsap.timeline({ scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });
  tl.to('.hero__line:first-child', { xPercent: -14, ease: 'none' }, 0)
    .to('.hero__line--it', { xPercent: 12, ease: 'none' }, 0)
    .to('.hero__foot, .hero__kicker', { y: -80, autoAlpha: 0, ease: 'none' }, 0);
  if (gl) tl.to(gl.signal.uniforms.uOut, { value: 1, ease: 'power1.in' }, 0);
  else tl.to('.hero__fallback', { yPercent: 18, autoAlpha: 0, ease: 'none' }, 0);
}

let track: gsap.core.Tween | null = null;

/** Desktop: the antennas scroll sideways inside a pinned frame, with an FM dial tracking progress. */
export function initShows() {
  const mm = gsap.matchMedia();
  mm.add(desktop, () => {
    const el = document.querySelector<HTMLElement>('.shows__track')!;
    const needle = document.querySelector<HTMLElement>('.dial__needle')!;
    const freq = document.querySelector<HTMLElement>('.dial__freq')!;
    const count = el.querySelectorAll('.show').length;
    track = gsap.to(el, {
      x: () => -(el.scrollWidth - innerWidth),
      ease: 'none',
      scrollTrigger: {
        trigger: '.shows',
        pin: '.shows__pin',
        start: 'top top',
        end: () => `+=${el.scrollWidth - innerWidth}`,
        scrub: 0.8,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          gsap.set(needle, { left: `${self.progress * 100}%` });
          freq.textContent = String(Math.min(count, Math.floor(self.progress * count) + 1)).padStart(2, '0');
        },
      },
    });
    el.querySelectorAll('.show').forEach((show) => {
      gsap.from(show.querySelectorAll('.show__body > *'), {
        y: 40,
        autoAlpha: 0,
        duration: 1.1,
        stagger: 0.08,
        ease: 'expo.out',
        scrollTrigger: { trigger: show, containerAnimation: track!, start: 'left 75%', once: true },
      });
    });
    return () => (track = null);
  });
}

/** Each WebGL plane wipes in, row by row, the first time it comes into view. */
export function initMediaReveals(gl: GL | null) {
  if (!gl) return;
  gl.media.items.forEach(({ el }) => {
    const u = gl.media.uniformsFor(el);
    if (!u) return;
    const inTrack = !!track && !!el.closest('.shows__track');
    ScrollTrigger.create({
      trigger: el,
      start: inTrack ? 'left 90%' : 'top 88%',
      containerAnimation: inTrack ? track! : undefined,
      once: true,
      onEnter: () => gsap.to(u.uReveal, { value: 1, duration: 1.8, ease: 'power2.out' }),
    });
  });
}

/** Two opposing ticker rows; scroll speed pushes them faster and skews the type. */
export function initMarquee(motion: boolean) {
  const rows = [...document.querySelectorAll<HTMLElement>('.onair__inner')];
  if (!motion) return;
  const state = rows.map((_, i) => ({ x: i % 2 ? -50 : 0, dir: i % 2 ? 1 : -1 }));
  let skew = 0;
  gsap.ticker.add((_, delta) => {
    const v = velocity();
    const boost = 1 + Math.min(Math.abs(v) * 0.25, 6);
    skew += (gsap.utils.clamp(-12, 12, -v * 0.6) - skew) * 0.1;
    rows.forEach((row, i) => {
      const s = state[i];
      s.x = gsap.utils.wrap(-50, 0, s.x + s.dir * boost * delta * 0.004);
      row.style.transform = `translate3d(${s.x}%, 0, 0) skewX(${skew}deg)`;
    });
  });
}

/** Each studio step's text rises as it reaches the middle of the screen. */
export function initStudio() {
  document.querySelectorAll<HTMLElement>('.step').forEach((step) => {
    gsap.from(step.querySelectorAll('.step__body > *'), {
      y: 50,
      autoAlpha: 0,
      duration: 1.2,
      stagger: 0.1,
      ease: 'expo.out',
      scrollTrigger: { trigger: step, start: 'top 60%', once: true },
    });
  });
}

export function initNumbers() {
  document.querySelectorAll<HTMLElement>('[data-count]').forEach((el) => {
    const end = Number(el.dataset.count);
    const suffix = el.dataset.suffix ?? '';
    const o = { n: 0 };
    gsap.to(o, {
      n: end,
      duration: 2.2,
      ease: 'expo.out',
      scrollTrigger: { trigger: el, start: 'top 85%', once: true },
      onUpdate: () => (el.textContent = Math.round(o.n) + suffix),
    });
  });
}
