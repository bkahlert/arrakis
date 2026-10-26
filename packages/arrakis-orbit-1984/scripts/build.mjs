import { buildBundles, copyRuntimeAssets, writeBuildManifest } from '../../../tools/background-build.mjs';
import { fileURLToPath } from 'node:url';
import { buildSvg } from './build-svg.mjs';

const root = fileURLToPath(new URL('../', import.meta.url));
const assets = ['arrakis.jpg', 'moon.jpg', 'CREDITS.txt'];
await copyRuntimeAssets(root, assets.map(file => `src/assets/${file}`), [
  'webgl/assets',
  'webcomponent/assets',
]);
await buildBundles([
  {
    absWorkingDir: root,
    entryPoints: ['src/page.js'],
    outfile: 'webgl/scene.js',
    bundle: true,
    format: 'esm',
    loader: { '.css': 'text' },
    logLevel: 'error',
  },
  {
    absWorkingDir: root,
    entryPoints: ['src/component.js'],
    outfile: 'webcomponent/arrakis-orbit-1984.js',
    bundle: true,
    format: 'esm',
    loader: { '.css': 'text' },
    logLevel: 'error',
  },
]);
await buildSvg(root);

const inputsAndOutputs = [
  'package.json', '../../package-lock.json', '../../tools/background-build.mjs',
  'index.html',
  'webgl/index.html', 'webcomponent/index.html', 'svg/index.html',
  'src/page.js', 'src/component.js', 'src/renderer.js', 'src/scene.css',
  'scripts/build.mjs', 'scripts/build-svg.mjs',
  ...assets.map(file => `src/assets/${file}`),
  ...['webgl', 'webcomponent'].flatMap(variant =>
    assets.map(file => `${variant}/assets/${file}`)),
  'webgl/scene.js', 'webcomponent/arrakis-orbit-1984.js',
  'svg/arrakis-orbit-1984.svg', 'svg/arrakis-orbit-1984-still.svg',
];
await writeBuildManifest(root, inputsAndOutputs);
