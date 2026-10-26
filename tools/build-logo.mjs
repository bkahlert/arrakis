import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const backgroundPath = path.join(root, 'packages/arrakis-orbit-1984/svg/arrakis-orbit-1984-still.svg');
const outputPath = path.join(root, 'docs/logo.svg');
const background = await readFile(backgroundPath, 'utf8');

async function embeddedLayer(id, size) {
  const match = background.match(new RegExp(`<image id="${id}"[^>]+href="data:image/png;base64,([^"]+)"`));
  if (!match) throw new Error(`Missing rendered sphere layer: ${id}`);
  const png = await sharp(Buffer.from(match[1], 'base64'))
    .resize(size, size)
    .png({ compressionLevel: 9 })
    .toBuffer();
  return `data:image/png;base64,${png.toString('base64')}`;
}

const [arrakis, largeMoon, smallMoon] = await Promise.all([
  embeddedLayer('arrakis', 768),
  embeddedLayer('moon-large', 256),
  embeddedLayer('moon-small', 192),
]);

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512" role="img" aria-labelledby="title desc">
<title id="title">Arrakis Orbit</title>
<desc id="desc">Textured Arrakis rises at lower left beneath two cyan moons.</desc>
<metadata>Sphere textures are downsampled exports from this project's WebGL renderer. Texture attribution is in packages/arrakis-orbit-1984/CREDITS.txt.</metadata>
<defs>
  <linearGradient id="sky" x2="1" y2="1"><stop stop-color="#29101f"/><stop offset=".52" stop-color="#100914"/><stop offset="1" stop-color="#03050a"/></linearGradient>
  <radialGradient id="glow"><stop stop-color="#a82943" stop-opacity=".38"/><stop offset="1" stop-color="#721d33" stop-opacity="0"/></radialGradient>
  <clipPath id="round"><rect width="512" height="512" rx="108"/></clipPath>
</defs>
<g clip-path="url(#round)">
  <rect width="512" height="512" fill="url(#sky)"/>
  <ellipse cx="194" cy="177" rx="248" ry="194" fill="url(#glow)"/>
  <g fill="#c6c3d4" opacity=".76"><circle cx="291" cy="76" r="1.4"/><circle cx="461" cy="212" r="1.2"/><circle cx="267" cy="221" r="1"/><circle cx="226" cy="145" r=".8"/></g>
  <image href="${arrakis}" x="-245" y="128" width="646" height="646"/>
  <image href="${largeMoon}" x="291.5" y="90.5" width="117" height="117"/>
  <image href="${smallMoon}" x="391" y="61" width="60" height="60"/>
</g>
</svg>`;

await writeFile(outputPath, svg);
