const { it } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs/promises');
const path = require('node:path');
const os = require('node:os');
const { spawnSync } = require('node:child_process');
const process = require('node:process');

it('rejects changed sources and missing outputs without rebuilding', async () => {
  const directory = await fs.mkdtemp(path.join(os.tmpdir(), 'orbit1984-freshness-'));
  try {
    const root = path.join(__dirname, '..');
    const workspace = path.join(directory, 'packages', 'arrakis-orbit-1984');
    await fs.cp(root, workspace, { recursive: true, filter: filename => !['node_modules', 'test-results'].includes(path.basename(filename)) });
    const manifest = JSON.parse(await fs.readFile(path.join(root, 'build-manifest.json'), 'utf8'));
    for (const file of Object.keys(manifest).filter(file => file.startsWith('../../'))) {
      const destination = path.resolve(workspace, file);
      await fs.mkdir(path.dirname(destination), { recursive: true });
      await fs.copyFile(path.resolve(root, file), destination);
    }
    const environment = { ...process.env };
    delete environment.NODE_TEST_CONTEXT;
    const renderer = path.join(workspace, 'src/renderer.js');
    const original = await fs.readFile(renderer);
    await fs.appendFile(renderer, '\n');
    const stale = spawnSync(process.execPath, ['--test', 'tests/build.test.cjs'], { cwd: workspace, encoding: 'utf8', env: environment });
    assert.notEqual(stale.status, 0, stale.stdout + stale.stderr);
    assert.match(stale.stdout, /src\/renderer.js is stale/);
    await fs.writeFile(renderer, original);
    await fs.unlink(path.join(workspace, 'svg/arrakis-orbit-1984.svg'));
    const missing = spawnSync(process.execPath, ['--test', 'tests/build.test.cjs'], { cwd: workspace, encoding: 'utf8', env: environment });
    assert.notEqual(missing.status, 0);
    const restored = await fs.access(path.join(workspace, 'svg/arrakis-orbit-1984.svg')).then(() => true, () => false);
    assert.equal(restored, false);
  } finally { await fs.rm(directory, { recursive: true, force: true }); }
});
