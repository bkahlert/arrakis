import { buildBundles, copyRuntimeAssets } from '../../../tools/background-build.mjs';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));
await copyRuntimeAssets(root, ['src/assets/moon.jpg', 'src/assets/CREDITS.txt'], [
  'webgl/assets',
  'webcomponent/assets',
]);
await copyRuntimeAssets(root, ['src/scene.js', 'src/scene.css'], ['webgl']);
await buildBundles([{
  absWorkingDir: root,
  entryPoints: ['src/component.js'],
  outfile: 'webcomponent/arrakis-desert.js',
  bundle: true,
  format: 'esm',
  loader: { '.css': 'text' },
}]);
