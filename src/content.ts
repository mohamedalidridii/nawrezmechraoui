// All editable copy lives here. Roles come from Nawrez's public Instagram bio;
// longer descriptions are draft copy to be confirmed with her.

export const contact = {
  email: 'contact@nawrezmechraoui.com', // TODO: replace with her real address
  instagram: 'https://www.instagram.com/nawrez_mechraoui',
  threads: 'https://www.threads.net/@nawrez_mechraoui',
};

export type Show = {
  name: string;
  role: string;
  medium: string;
  image: string;
  handle: string;
  text: string;
};

export const shows: Show[] = [
  {
    name: 'Diwan FM',
    role: 'Chroniqueuse & productrice',
    medium: 'Radio',
    image: '/images/diwan.webp',
    handle: 'https://www.instagram.com/diwanfm',
    text: "Au micro chaque semaine : chroniques, invités et sujets qui font parler la Tunisie, de la préparation à l'antenne.",
  },
  {
    name: 'El Hiwar Ettounsi',
    role: 'Journaliste',
    medium: 'Télévision',
    image: '/images/hiwar.webp',
    handle: 'https://www.instagram.com/elhiwarettounsi.tv',
    text: "Reportages et plateaux pour l'une des chaînes les plus regardées du pays — l'actualité racontée au plus près des gens.",
  },
  {
    name: 'Les 4 Vérités',
    role: 'Journaliste',
    medium: 'Télévision',
    image: '/images/verites.webp',
    handle: 'https://www.instagram.com/les_4_verites',
    text: 'Le débat sans détour : questions franches, faits vérifiés, et la parole donnée à ceux qui ont quelque chose à dire.',
  },
  {
    name: 'Al Mou7a9e9',
    role: 'Productrice',
    medium: 'Investigation',
    image: '/images/mou7a9e9.webp',
    handle: 'https://www.instagram.com/al.mou7a9e9',
    text: "Produire l'enquête : chercher, recouper, attendre la bonne preuve — puis la mettre en images.",
  },
];

export type Step = { title: string; image: string; caption: string; text: string };

// "Derrière le micro": her radio work, step by step. Draft copy to be confirmed with her.
export const studio: Step[] = [
  {
    title: 'Préparer',
    image: '/images/studio-1.webp',
    caption: 'Diwan FM — avant l’antenne',
    text: 'Choisir le sujet, lire, appeler, vérifier. Une bonne émission se gagne avant même d’entrer en studio.',
  },
  {
    title: 'Interroger',
    image: '/images/studio-2.webp',
    caption: 'Micro Diwan FM',
    text: 'Une seule règle face à l’invité : écouter. La meilleure question est souvent la deuxième.',
  },
  {
    title: 'En direct',
    image: '/images/studio-3.webp',
    caption: 'Studio Diwan FM — on air',
    text: 'Le voyant s’allume, le temps se compte en secondes. Tenir le rythme, relancer, garder le fil — sans filet.',
  },
  {
    title: 'Produire',
    image: '/images/studio-4.webp',
    caption: 'Production',
    text: 'Penser l’émission de bout en bout : invités, déroulé, montage, diffusion. De l’idée jusqu’à l’auditeur.',
  },
];

export const menu = [
  { label: 'Manifeste', href: '#manifesto' },
  { label: 'Antennes', href: '#shows' },
  { label: 'En studio', href: '#studio' },
  { label: 'Contact', href: '#contact' },
];
