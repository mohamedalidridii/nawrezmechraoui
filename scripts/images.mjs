// Converts source photos in assets-src/raw into optimised WebP files in public/images.
import fs from 'node:fs';
import sharp from 'sharp';

const src = 'assets-src/raw';
const out = 'public/images';
fs.mkdirSync(out, { recursive: true });

for (const f of fs.readdirSync(src).filter((f) => /\.(jpe?g|png|webp)$/i.test(f))) {
  const name = f.replace(/\.\w+$/, '');
  await sharp(`${src}/${f}`)
    .rotate()
    .resize({ width: 1600, withoutEnlargement: true })
    .webp({ quality: 82 })
    .toFile(`${out}/${name}.webp`);
}
console.log('images done');
