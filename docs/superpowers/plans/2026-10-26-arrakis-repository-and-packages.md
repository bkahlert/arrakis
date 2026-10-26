# Arrakis Repository and npm Packages Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use
> `superpowers:subagent-driven-development` or
> `superpowers:executing-plans` to implement this plan task-by-task. Steps use
> checkbox (`- [ ]`) syntax for tracking.

**Goal:** Extract the four Arrakis backgrounds into `github.com/bkahlert/arrakis`, share their repeated build tooling, and publish one npm package per background.

**Architecture:** Use one npm-workspaces repository with four package workspaces under `packages/`. Keep shared build helpers at the repository root and each background's renderer and SVG exporter in its workspace. Publish all four derived forms from each background package, with MIT software and CC BY 4.0 visual outputs and texture assets.

**Tech Stack:** Node.js 22 or newer, npm workspaces, esbuild, Playwright, sharp, pngjs, WebGL, and the existing Node test runner.

**Spec:** `docs/superpowers/specs/2026-10-26-arrakis-backgrounds-design.md`

## Global Constraints

- The local checkout is `/Users/bkahlert/Development/com.bkahlert/arrakis`, beside the `bkahlert` checkout.
- The public GitHub repository is `github.com/bkahlert/arrakis`.
- There are four semantic backgrounds and four distributable forms per background: WebGL, native web component, animated SVG, and still SVG.
- Publish four independently versioned npm packages, one per background.
- Share root-level build orchestration, copying, bundling, and artifact tracking; retain background-specific SVG generation.
- Publish manually, one workspace at a time, after reviewing package contents.
- License original software under MIT; license finished visual outputs that incorporate CC BY 4.0 textures under CC BY 4.0.
- Preserve CC BY attribution, license links, and modification notices in all distributed copies and adaptations.
- Preserve artwork, runtime behavior, package documentation, existing tests, and asset credits.
- Match the user's existing repository conventions for README, description, badges, and supporting metadata.
- Do not add or enable a workflow that runs tests.
- Do not commit directly on `main`; use topic branches with the `codex/` prefix.
- Move existing test sources and scripts unchanged; this plan adds no tests and does not run tests.

## Review Focus

- A workspace build must write only that background's outputs; verify its changed-file list stays inside that workspace.
- Every npm archive must include all four forms, license terms, and credits; inspect each `npm pack --dry-run` file list.
- Runtime asset and fallback URLs must remain relative to the web component's package location; inspect the built component and its packaged asset paths.
- Every generated SVG that embeds CC BY material must retain the source, license URL, and modification notice; inspect SVG metadata and the package credits.
- Package metadata must describe the MIT/CC BY split without claiming third-party assets are MIT; inspect each workspace's `package.json` and `LICENSE` together.

---

### Task 1: Bootstrap the public repository

**Files:**
- Create: `/Users/bkahlert/Development/com.bkahlert/arrakis/README.md`
- Create: `/Users/bkahlert/Development/com.bkahlert/arrakis/.gitignore`
- Create: `docs/superpowers/specs/2026-10-26-arrakis-backgrounds-design.md`
- Create: repository description, README badges, and non-test supporting metadata

**Interfaces:**
- Consumes: the approved design at `docs/superpowers/specs/2026-10-26-arrakis-backgrounds-design.md`.
- Produces: a public GitHub repository with local remote `origin` pointing to `github.com/bkahlert/arrakis`.

- [ ] Inspect neighboring repositories to learn the user's README, description,
  badge, and supporting-file conventions. Choose the matching repository
  metadata and presentation for `arrakis`.
- [ ] Create the public repository `bkahlert/arrakis` and its local checkout at
  the required sibling path. Set its repository description using the
  conventions found in the prior step.
- [ ] Create topic branch `codex/arrakis-extraction` before committing files.
- [ ] Add the project README, metadata, design spec, and baseline repository
  configuration. The README introduces the four backgrounds and links to each
  package's README and comparison page. Match non-test supporting files from
  the user's other repos; do not add a workflow that executes tests.
- [ ] Check the checkout and remote.

Run:

```shell
git remote get-url origin
git status --short --branch
```

Expected: `origin` points to `https://github.com/bkahlert/arrakis.git`; the
active branch is `codex/arrakis-extraction`.

- [ ] Commit the repository bootstrap on `codex/arrakis-extraction`.

```shell
git add README.md .gitignore docs/superpowers
git commit -m "chore: bootstrap arrakis repository"
```

### Task 2: Convert the four projects into npm workspaces

**Files:**
- Create: root `package.json` and `package-lock.json`
- Move: `arrakis-desert/` to `packages/arrakis-desert/`
- Move: `arrakis-desert-1984/` to `packages/arrakis-desert-1984/`
- Move: `arrakis-orbit/` to `packages/arrakis-orbit/`
- Move: `arrakis-orbit-1984/` to `packages/arrakis-orbit-1984/`
- Modify: each workspace `package.json` and README

**Interfaces:**
- Consumes: repository root from Task 1.
- Produces: four named npm workspaces, each with its original source, assets,
  generated outputs, README, build scripts, and existing test scripts.

- [ ] Verify the npm scope and candidate package names are available. Use
  `@bkahlert/arrakis-desert`, `@bkahlert/arrakis-desert-1984`,
  `@bkahlert/arrakis-orbit`, and `@bkahlert/arrakis-orbit-1984` if the account
  owns that scope and each name is available; otherwise choose an available
  scope controlled by the user's npm account and names that follow the same
  background suffixes.
- [ ] Move each project under `packages/`, preserving its source, assets,
  comparison pages, generated files, documentation, and existing test suite.
- [ ] Configure the root package as private with workspaces `packages/*`,
  Node.js `>=22`, and shared pinned development dependencies. Consolidate the
  four lockfiles into the root lockfile.
- [ ] Add a root `build` script that runs each workspace's build script with
  `npm run build --workspaces --if-present`.
- [ ] Update each workspace manifest with its public package name, independent
  version, repository URL and workspace directory, engine requirement, and
  scripts. Remove `private: true` from publishable workspaces.
- [ ] Keep each package's README usable from its new workspace path. Keep
  `build`, `serve`, `test`, and generated-artifact commands available per
  workspace.
- [ ] Install the workspace dependencies and build one selected workspace.

Run:

```shell
npm install
npm run build --workspace=packages/arrakis-desert
```

Expected: npm creates one root lockfile, recognizes all four workspaces, and
the selected background generates its outputs inside its own workspace.

- [ ] Commit the workspace migration on `codex/arrakis-extraction`.

```shell
git add package.json package-lock.json packages
git commit -m "chore: move backgrounds into npm workspaces"
```

### Task 3: Extract shared build helpers

**Files:**
- Create: `tools/background-build.mjs`
- Modify: `packages/*/scripts/build.mjs`
- Modify: `packages/*/build-manifest.json` generation

**Interfaces:**
- Consumes: root workspace dependencies and the four background workspaces.
- Produces: `buildBundles(options)`,
  `copyRuntimeAssets(rootDir, assetFiles, destinations)`, and
  `writeBuildManifest(rootDir, files, { envelope })` exports.
  `buildBundles` accepts an array of esbuild `BuildOptions` and awaits them in
  order.
  `copyRuntimeAssets` copies the listed root-relative source files into each
  destination directory. `writeBuildManifest` hashes listed root-relative
  files and writes a flat path-to-digest map, or wraps it under `sha256` when
  `envelope: "sha256"` is supplied.

- [ ] Implement `copyRuntimeAssets` in `tools/background-build.mjs`. It creates
  destination directories and copies each declared asset by basename.
- [ ] Implement `buildBundles(options)` in `tools/background-build.mjs` as a
  sequential wrapper around esbuild. Keep each background's entry points,
  output paths, formats, and loaders explicit in its workspace script.
- [ ] Implement `writeBuildManifest` in the same module using SHA-256. Preserve
  the existing flat manifest shape for the orbit packages and nested `sha256`
  shape for the desert packages through an explicit `envelope` option.
- [ ] Update the four workspace build scripts to call these helpers for
  repeated asset-copy and manifest work. Keep per-background esbuild entry
  points and output options explicit in their own `build.mjs`.
- [ ] Update each manifest input list to hash the shared `../../package-lock.json`
  instead of a removed workspace lockfile. Keep the current flat/nested
  manifest shape so the existing freshness scripts remain compatible.
- [ ] Keep each background's SVG generator and its rendering algorithm inside
  that background workspace.
- [ ] Build all four workspaces and inspect generated file changes.

Run:

```shell
npm run build --workspaces --if-present
git status --short
```

Expected: all four builds complete; generated changes are limited to the four
workspaces and all manifests use the shared hashing helper.

- [ ] Commit shared build tooling and updated build scripts.

```shell
git add tools packages
git commit -m "refactor: share background build tooling"
```

### Task 4: Record package licensing and distribution contents

**Files:**
- Create: `packages/*/LICENSE`
- Create: `packages/*/CREDITS.txt`
- Modify: `packages/*/package.json`
- Modify: `packages/*/src/assets/CREDITS.txt`
- Modify: `packages/*/webgl/assets/CREDITS.txt`
- Modify: `packages/*/webcomponent/assets/CREDITS.txt`
- Modify: `packages/*/svg/*.svg` only if needed to retain attribution metadata
- Modify: `packages/*/README.md`

**Interfaces:**
- Consumes: the four workspace build outputs from Task 3.
- Produces: four installable packages whose license file distinguishes MIT
  software from CC BY 4.0 visual material and whose npm archive contains only
  runtime distributions, documentation, license terms, and credits.

- [ ] Add a top-level `LICENSE` to each package. Include the MIT grant for
  original software, then state that third-party textures and finished visual
  outputs incorporating them are CC BY 4.0. Keep attribution and texture
  modification details in a top-level `CREDITS.txt` copied from source.
- [ ] Ensure every animated and still SVG that embeds a texture includes the
  source, CC BY 4.0 link, and modification notice in its metadata or
  description.
- [ ] Set each workspace's `license` field to `SEE LICENSE IN LICENSE`.
- [ ] Set each workspace's `files` allowlist to include the WebGL,
  web-component, animated SVG, still SVG, package README, license, and credits.
  Exclude source-generation dependencies, tests, and shared repository tools.
  Replace README links to excluded source files with links to their GitHub
  paths, preserving the end-user embedding instructions.
- [ ] Run `npm pack --dry-run` for each workspace and inspect all four file
  lists against the allowlist and license/credit requirements.

Run `npm pack --dry-run --workspace=packages/<background>` once for each of
`arrakis-desert`, `arrakis-desert-1984`, `arrakis-orbit`, and
`arrakis-orbit-1984`.

Expected: each package archive contains its four runtime forms, its README,
LICENSE, and credits; no development-only directories appear.

- [ ] Commit package licensing and distribution metadata.

```shell
git add packages
git commit -m "chore: prepare background packages for npm"
```

- [ ] Push `codex/arrakis-extraction` and open a pull request against `main`.
  Leave it ready for the user's review before publishing packages.

### Task 5: Remove the duplicated projects from `bkahlert`

**Files:**
- Delete: `arrakis-desert/`
- Delete: `arrakis-desert-1984/`
- Delete: `arrakis-orbit/`
- Delete: `arrakis-orbit-1984/`
- Modify: `README.md`
- Modify: `header.svg`
- Modify: `header-mobile.svg`

**Interfaces:**
- Consumes: the complete new repository and its public GitHub URL from Task 1.
- Produces: the portfolio repository points to the Arrakis repository without
  carrying a second copy of its source and generated assets.

- [ ] Use an isolated worktree for the `bkahlert` cleanup and create the
  `codex/arrakis-repo-link` topic branch there.
- [ ] Remove the four migrated project directories from `bkahlert`.
- [ ] Replace the local header thumbnails and README references with one link
  to `https://github.com/bkahlert/arrakis`.
- [ ] Search the portfolio repository for stale local Arrakis paths.

Run:

```shell
rg -n "arrakis-(desert|orbit)" README.md header.svg header-mobile.svg
git status --short
```

Expected: no old local directory links remain; the only Arrakis reference is
the new project link.

- [ ] Commit the portfolio cleanup on `codex/arrakis-repo-link`.

```shell
git add -A
git commit -m "chore: link to standalone arrakis project"
```

- [ ] Push `codex/arrakis-repo-link` and open a pull request in `bkahlert`.

### Task 6: Publish the four packages manually

**Files:**
- Modify: `packages/*/package.json` version fields as each package releases
- Modify: `README.md` if npm badges need the published package names

**Interfaces:**
- Consumes: reviewed npm package archives from Task 4 and the public GitHub
  repository.
- Produces: four public npm packages that can be installed independently by
  background name.

- [ ] Confirm npm login, package scope ownership, package names, license
  metadata, and each final archive's contents.
- [ ] Present the four final package archives and license/credit summaries for
  user review before publishing.
- [ ] Publish only after the new repository's pull request is merged and the
  user has reviewed the archive contents.
- [ ] Publish each package manually with
  `npm publish --workspace=packages/<background> --access public`, one
  background at a time. Commit each selected workspace's version bump before
  publishing it.
- [ ] Confirm each npm package page shows the intended README, public
  visibility, correct repository URL, and independently versioned release.

## Execution choice

Use the native execution approach: one implementer should carry the migration
across the new repository and the portfolio cleanup, then a fresh reviewer
should inspect the completed changes. The tasks share package paths, workspace
interfaces, and generated-file conventions, so keeping one implementation
thread reduces coordination risk.
