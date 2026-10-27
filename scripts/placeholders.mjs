// Writes tinted placeholder photos into assets-src/raw for any slot that has no real photo yet.
// Drop the real files in with the same names (any of .jpg/.png/.webp) and run `npm run images`.
import fs from 'node:fs';
import sharp from 'sharp';

const slots = [
  ['portrait', 1200, 1500, '#2f6bff', '#07090f', 'Portrait'],
  ['diwan', 1400, 1000, '#1aa3ff', '#0a1a3d', 'Diwan FM'],
  ['hiwar', 1400, 1000, '#ff5a1f', '#1b0b07', 'El Hiwar Ettounsi'],
  ['verites', 1400, 1000, '#efebe3', '#20232b', 'Les 4 Vérités'],
  ['mou7a9e9', 1400, 1000, '#b8ff3c', '#0d140a', 'Al Mou7a9e9'],
  ['studio-1', 1100, 1400, '#1aa3ff', '#0a1a3d', 'Préparer'],
  ['studio-2', 1100, 1400, '#7f6bff', '#121033', 'Interroger'],
  ['studio-3', 1100, 1400, '#2f6bff', '#0b0d12', 'En direct'],
  ['studio-4', 1100, 1400, '#3d9bff', '#0d1426', 'Produire'],
];

const has = (name) => fs.readdirSync('assets-src/raw').some((f) => f.replace(/\.\w+$/, '') === name);

for (const [name, w, h, a, b, label] of slots) {
  if (has(name)) continue;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}">
    <defs>
      <radialGradient id="g" cx="35%" cy="30%" r="90%"><stop offset="0" stop-color="${a}"/><stop offset="1" stop-color="${b}"/></radialGradient>
      <filter id="n"><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" stitchTiles="stitch"/><feColorMatrix values="0 0 0 0 0.5 0 0 0 0 0.5 0 0 0 0 0.5 0 0 0 0.22 0"/></filter>
    </defs>
    <rect width="100%" height="100%" fill="url(#g)"/>
    <ellipse cx="${w * 0.52}" cy="${h * 0.42}" rx="${w * 0.17}" ry="${h * 0.2}" fill="${b}" opacity="0.35"/>
    <path d="M${w * 0.18} ${h} C ${w * 0.25} ${h * 0.62}, ${w * 0.79} ${h * 0.62}, ${w * 0.86} ${h} Z" fill="${b}" opacity="0.35"/>
    <rect width="100%" height="100%" filter="url(#n)"/>
    <text x="${w * 0.06}" y="${h * 0.93}" font-family="Georgia, serif" font-style="italic" font-size="${w * 0.07}" fill="#fff" opacity="0.85">${label}</text>
  </svg>`;
  await sharp(Buffer.from(svg)).jpeg({ quality: 88 }).toFile(`assets-src/raw/${name}.jpg`);
}
console.log('placeholders done');
