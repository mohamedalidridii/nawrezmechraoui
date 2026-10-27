import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

let lenis: Lenis | null = null;
let nativeLast = 0;
let nativeVelocity = 0;

const easeInOutCubic = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

/**
 * Lenis driven by GSAP's ticker, so smooth scroll, ScrollTrigger and the WebGL loop
 * all advance on the same frame.
 */
export function initScroll(smooth: boolean) {
  gsap.ticker.lagSmoothing(0);
  if (!smooth) {
    gsap.ticker.add(() => {
      nativeVelocity += (scrollY - nativeLast - nativeVelocity) * 0.2;
      nativeLast = scrollY;
    });
    return;
  }
  lenis = new Lenis({ autoRaf: false, lerp: 0.08, wheelMultiplier: 0.9, touchMultiplier: 1.4 });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((time) => lenis!.raf(time * 1000));
  lenis.stop();
}

export function startScroll() {
  lenis?.start();
}

export function lockScroll(locked: boolean) {
  if (locked) lenis?.stop();
  else lenis?.start();
}

export function velocity() {
  return lenis?.velocity ?? nativeVelocity;
}

export function scrollTo(target: string | HTMLElement | number) {
  if (lenis) {
    lenis.scrollTo(target, { duration: 1.8, easing: easeInOutCubic, force: true });
    return;
  }
  const el = typeof target === 'string' ? document.querySelector(target) : target;
  if (typeof el === 'number') window.scrollTo({ top: el });
  else el?.scrollIntoView({ behavior: 'auto' });
}
