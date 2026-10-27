import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';

gsap.registerPlugin(ScrollTrigger, SplitText);

const themes: Record<string, { bg: string; fg: string; muted: string }> = {
  ink: { bg: '#07090f', fg: '#efebe3', muted: 'rgba(239, 235, 227, 0.5)' },
  paper: { bg: '#efebe3', fg: '#0b0d12', muted: 'rgba(11, 13, 18, 0.5)' },
  blue: { bg: '#2f5fff', fg: '#f4f1ea', muted: 'rgba(244, 241, 234, 0.62)' },
};

/** The page colour shifts as each [data-theme] section crosses the middle of the viewport. */
export function initThemes() {
  const root = document.documentElement;
  const apply = (name: string, duration = 0.9) => {
    const t = themes[name];
    gsap.to(root, { '--bg': t.bg, '--fg': t.fg, '--muted': t.muted, duration, ease: 'power2.out', overwrite: 'auto' });
  };
  document.querySelectorAll<HTMLElement>('[data-theme]').forEach((el) => {
    ScrollTrigger.create({
      trigger: el,
      start: 'top 50%',
      end: 'bottom 50%',
      onToggle: (self) => self.isActive && apply(el.dataset.theme!),
    });
  });
}

/** Headings rise line by line from a mask the first time they enter. */
export function initTextReveals() {
  document.querySelectorAll<HTMLElement>('[data-split]').forEach((el) => {
    SplitText.create(el, {
      type: 'lines',
      mask: 'lines',
      linesClass: 'line',
      autoSplit: true,
      onSplit: (self) =>
        gsap.from(self.lines, {
          yPercent: 110,
          rotate: 3,
          duration: 1.3,
          stagger: 0.1,
          ease: 'expo.out',
          scrollTrigger: { trigger: el, start: 'top 82%', once: true },
        }),
    });
  });
}

/** Manifesto words light up as the paragraph is scrolled through. */
export function initScrub() {
  document.querySelectorAll<HTMLElement>('[data-scrub]').forEach((el) => {
    SplitText.create(el, {
      type: 'words',
      wordsClass: 'word',
      autoSplit: true,
      onSplit: (self) =>
        gsap.fromTo(
          self.words,
          { opacity: 0.12, filter: 'blur(6px)' },
          {
            opacity: 1,
            filter: 'blur(0px)',
            stagger: 0.05,
            ease: 'none',
            scrollTrigger: { trigger: el, start: 'top 78%', end: 'bottom 45%', scrub: true },
          },
        ),
    });
  });
}
