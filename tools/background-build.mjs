import { createHash } from 'node:crypto';
import { copyFile, mkdir, readFile, writeFile } from 'node:fs/promises';
import { basename, resolve } from 'node:path';
import { build } from 'esbuild';

export async function buildBundles(options) {
  for (const option of options) await build(option);
}

export async function copyRuntimeAssets(rootDir, assetFiles, destinations) {
  for (const destination of destinations) {
    const destinationDir = resolve(rootDir, destination);
    await mkdir(destinationDir, { recursive: true });
    for (const file of assetFiles) {
      await copyFile(resolve(rootDir, file), resolve(destinationDir, basename(file)));
    }
  }
}

export async function writeBuildManifest(rootDir, files, { envelope } = {}) {
  const hashes = Object.fromEntries(await Promise.all(files.map(async file => {
    const bytes = await readFile(resolve(rootDir, file));
    return [file, createHash('sha256').update(bytes).digest('hex')];
  })));
  const manifest = envelope === 'sha256' ? { sha256: hashes } : hashes;
  await writeFile(resolve(rootDir, 'build-manifest.json'), JSON.stringify(manifest, null, 2) + '\n');
}
