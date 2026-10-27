import { gsap } from 'gsap';
import { lockScroll, scrollTo } from '../scroll';
import { pointer } from '../pointer';

export function initClock() {
  const clocks = document.querySelectorAll('.nav__clock');
  const fmt = new Intl.DateTimeFormat('fr-FR', { timeZone: 'Africa/Tunis', hour: '2-digit', minute: '2-digit' });
  const tick = () => clocks.forEach((c) => (c.textContent = fmt.format(new Date())));
  tick();
  setInterval(tick, 15000);
}

/** Dot + lagging ring; the ring grows and shows a label over [data-cursor] targets. */
export function initCursor() {
  if (matchMedia('(pointer: coarse)').matches) return;
  const cursor = document.querySelector<HTMLElement>('.cursor')!;
  const ring = cursor.querySelector<HTMLElement>('.cursor__ring')!;
  const dot = cursor.querySelector<HTMLElement>('.cursor__dot')!;
  const label = cursor.querySelector<HTMLElement>('.cursor__label')!;
  const ringX = gsap.quickTo(ring, 'x', { duration: 0.55, ease: 'power3.out' });
  const ringY = gsap.quickTo(ring, 'y', { duration: 0.55, ease: 'power3.out' });
  const dotX = gsap.quickTo(dot, 'x', { duration: 0.12, ease: 'power3.out' });
  const dotY = gsap.quickTo(dot, 'y', { duration: 0.12, ease: 'power3.out' });

  addEventListener('pointermove', () => {
    cursor.classList.add('is-on');
    ringX(pointer.x);
    ringY(pointer.y);
    dotX(pointer.x);
    dotY(pointer.y);
  });
  document.documentElement.addEventListener('pointerleave', () => cursor.classList.remove('is-on'));

  const sync = (el: Element | null) => {
    const target = el?.closest<HTMLElement>('[data-cursor], a, button');
    cursor.classList.toggle('is-link', !!target && !target.dataset.cursor);
    cursor.classList.toggle('is-label', !!target?.dataset.cursor);
    if (target?.dataset.cursor) label.textContent = target.dataset.cursor;
  };
  document.addEventListener('pointerover', (e) => sync(e.target as Element));
  // Content moves under a still pointer while scrolling, which fires no pointerover.
  addEventListener('scroll', () => pointer.active && sync(document.elementFromPoint(pointer.x, pointer.y)), { passive: true });
}

/** Elements drift toward the pointer, and their inner text drifts a little further. */
export function initMagnetic() {
  if (matchMedia('(pointer: coarse)').matches) return;
  document.querySelectorAll<HTMLElement>('[data-magnetic]').forEach((el) => {
    const x = gsap.quickTo(el, 'x', { duration: 0.8, ease: 'elastic.out(1, 0.4)' });
    const y = gsap.quickTo(el, 'y', { duration: 0.8, ease: 'elastic.out(1, 0.4)' });
    const inner = el.firstElementChild as HTMLElement | null;
    el.addEventListener('pointermove', (e) => {
      const r = el.getBoundingClientRect();
      const dx = e.clientX - r.left - r.width / 2;
      const dy = e.clientY - r.top - r.height / 2;
      x(dx * 0.35);
      y(dy * 0.35);
      if (inner) gsap.to(inner, { x: dx * 0.18, y: dy * 0.18, duration: 0.6, ease: 'power3.out' });
    });
    el.addEventListener('pointerleave', () => {
      x(0);
      y(0);
      if (inner) gsap.to(inner, { x: 0, y: 0, duration: 0.9, ease: 'elastic.out(1, 0.4)' });
    });
  });
}

export function initMenu(motion: boolean) {
  const btn = document.querySelector<HTMLButtonElement>('.nav__menu')!;
  const menu = document.querySelector<HTMLElement>('.menu')!;
  const links = menu.querySelectorAll('.menu__label');
  let open = false;

  const tl = gsap
    .timeline({ paused: true, defaults: { ease: 'expo.inOut' } })
    .set(menu, { visibility: 'visible' })
    .fromTo(menu, { clipPath: 'inset(0 0 100% 0)' }, { clipPath: 'inset(0 0 0% 0)', duration: motion ? 1.1 : 0.01 })
    .from(links, { yPercent: 110, duration: motion ? 1 : 0.01, stagger: 0.06, ease: 'expo.out' }, '-=0.5')
    .from('.menu__foot', { autoAlpha: 0, duration: 0.6 }, '-=0.6');

  const toggle = (state = !open) => {
    open = state;
    btn.setAttribute('aria-expanded', String(open));
    document.body.classList.toggle('menu-open', open);
    lockScroll(open);
    if (open) tl.timeScale(1).play();
    else tl.timeScale(1.6).reverse();
  };
  btn.addEventListener('click', () => toggle());
  addEventListener('keydown', (e) => e.key === 'Escape' && open && toggle(false));

  document.querySelectorAll<HTMLAnchorElement>('[data-scroll-to]').forEach((a) =>
    a.addEventListener('click', (e) => {
      e.preventDefault();
      const target = a.getAttribute('href')!;
      if (open) {
        toggle(false);
        gsap.delayedCall(0.5, () => scrollTo(target));
      } else scrollTo(target);
    }),
  );
}
