import { contact, menu, shows, studio } from './content';

const pad = (n: number) => String(n).padStart(2, '0');

/** Builds the repeated markup (antennas, studio steps, marquee, menu, dials) from content.ts. */
export function render() {
  document.querySelector('.shows__track')!.insertAdjacentHTML('beforeend', shows
    .map(
      (s, i) => `
      <article class="show">
        <a class="show__media" data-gl href="${s.handle}" target="_blank" rel="noopener" data-cursor="Suivre" aria-label="${s.name} sur Instagram">
          <img src="${s.image}" alt="${s.name}" loading="eager" decoding="async" />
        </a>
        <div class="show__body">
          <p class="show__n mono">${pad(i + 1)} / ${pad(shows.length)} — ${s.medium}</p>
          <h3 class="show__name">${s.name}</h3>
          <p class="show__role">${s.role}</p>
          <p class="show__text">${s.text}</p>
        </div>
      </article>`,
    )
    .join(''));

  document.querySelector('.studio__steps')!.innerHTML = studio
    .map(
      (s, i) => `
      <article class="step">
        <figure class="step__figure">
          <div class="step__media" data-gl><img src="${s.image}" alt="Nawrez Mechraoui — ${s.caption}" loading="eager" decoding="async" /></div>
          <figcaption class="mono"><span class="dot"></span>${s.caption}</figcaption>
        </figure>
        <div class="step__body">
          <p class="step__n mono">${pad(i + 1)} / ${pad(studio.length)}</p>
          <h3 class="step__title">${s.title}</h3>
          <p class="step__text">${s.text}</p>
        </div>
      </article>`,
    )
    .join('');

  const phrase = '<span>On air</span><i>✦</i><span class="ar" lang="ar">على الهواء</span><i>✦</i><em>En direct</em><i>✦</i>';
  document.querySelectorAll('.onair__inner').forEach((el) => (el.innerHTML = `<div>${phrase.repeat(3)}</div>`.repeat(2)));

  document.querySelector('.menu__list')!.innerHTML = menu
    .map((m, i) => `<li><a class="menu__link" href="${m.href}" data-scroll-to><span class="menu__n mono">${pad(i + 1)}</span><span class="menu__label">${m.label}</span></a></li>`)
    .join('');

  // FM band ticks, 87.5–108 MHz, for the preloader tuner.
  const ticks: string[] = [];
  for (let f = 875; f <= 1080; f += 5) {
    const major = f % 25 === 0;
    ticks.push(`<i class="${major ? 'is-major' : ''}">${major ? `<b>${(f / 10).toFixed(f % 10 ? 1 : 0)}</b>` : ''}</i>`);
  }
  document.querySelector('.tuner__scale')!.innerHTML = ticks.join('');
  document.querySelector('.dial__scale')!.innerHTML = Array.from({ length: 61 }, (_, i) => `<i class="${i % 15 === 0 ? 'is-major' : ''}"></i>`).join('');

  const mailto = `mailto:${contact.email}`;
  document.querySelector<HTMLAnchorElement>('.contact__cta')!.href = mailto;
  const mail = document.querySelector<HTMLAnchorElement>('.contact__mail')!;
  mail.href = mailto;
  mail.textContent = contact.email;
  document.querySelector<HTMLAnchorElement>('.contact__ig')!.href = contact.instagram;
  document.querySelector<HTMLAnchorElement>('.contact__threads')!.href = contact.threads;
  document.querySelector('.footer__year')!.textContent = String(new Date().getFullYear());
}
