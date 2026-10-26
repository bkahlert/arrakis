# Arrakis CI, Pages, and Branch Protection Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use `superpowers:executing-plans` to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Run every package's checks and tests in parallel on GitHub Actions, expose `npm test` at the repository root, protect the default branch with a required CI check, and serve the comparison pages from GitHub Pages.

**Architecture:** The root npm script dispatches tests to all four existing workspaces. A GitHub Actions matrix runs freshness, build, and test commands concurrently per package, then publishes one stable aggregate check. After successful CI on `codex/arrakis-extraction` or the default branch, the same workflow deploys a minimal static site containing the four comparison pages and their runtime directories. The single Pages URL will serve the topic branch until main replaces it after merge.

**Tech Stack:** Node.js 22, npm workspaces, Playwright, GitHub Actions, GitHub Pages, GitHub repository rulesets.

**Spec:** `docs/superpowers/specs/2026-10-26-arrakis-ci-and-main-protection-design.md`

## Global Constraints

- Preserve the four existing workspace test suites and package-level scripts.
- Root `npm test` must invoke each workspace's existing `test` script.
- Run workspace CI jobs concurrently and set `fail-fast: false` so one package failure does not cancel others.
- Use Node.js 22 and the root `package-lock.json` for CI setup and caching.
- Install Playwright Chromium and WebKit with system dependencies before browser tests.
- Run workflows on pushes and pull requests without path filters, so required status checks cannot be skipped.
- Deploy Pages after CI passes from `codex/arrakis-extraction` for this PR, then from the default branch after merge.
- Publish only the Pages landing page and the four comparison pages plus each package's `webgl`, `webcomponent`, and `svg` runtime directories.
- Require the stable aggregate CI check in a default-branch ruleset matching the existing `bkahlert` repository protection pattern.
- Do not publish npm packages or merge the existing Arrakis PR as part of this work.

## Review Focus

- Root `npm test` must not skip any workspace; verify all four package scripts appear and pass.
- CI must run all four workspaces concurrently while preserving each existing test script's internal serial execution.
- The aggregate status must fail when any matrix job fails and keep a stable required-check name.
- Pages output must preserve `packages/<workspace>/` and all relative iframe, JavaScript, SVG, and asset paths.
- README comparison URLs must point to the corresponding deployed Pages directory; the Actions badge must use the actual workflow filename.

---

### Task 1: Expose workspace tests at the repository root

**Files:**
- Modify: `package.json`
- Modify: `README.md`

**Interfaces:**
- Consumes: the four existing workspace `test` scripts.
- Produces: root command `npm test`, which invokes `npm run test --workspaces` and fails if a workspace test script is missing or fails.

- [x] Add the root `test` script using `npm run test --workspaces` without `--if-present`, so a workspace cannot silently disappear from the test run.
- [x] Add `npm test` to the root README's development commands.
- [x] Run `npm run build --workspaces --if-present` to refresh manifests after the earlier package metadata changes; confirm only the four `build-manifest.json` files change.
- [x] Run `npm test` from the repository root and confirm all four workspace scripts run and pass.
- [x] Confirm the existing `package.json` files and test source files remain unchanged.
- [x] Commit as `test: add root workspace test command`.

### Task 2: Add parallel CI and Pages deployment

**Files:**
- Create: `.github/workflows/ci.yml`
- Create: `site/index.html`

**Interfaces:**
- Consumes: root workspace install, package build scripts, package freshness checks, and package test scripts.
- Produces: matrix job `package-tests` with one entry per workspace; stable aggregate job `ci`; and a Pages deployment job for pushes to `main` or `codex/arrakis-extraction` that depends on successful package tests and aggregate CI.

- [x] Configure `push` on branches, `pull_request`, and `workflow_dispatch`; do not add path filters.
- [x] Pin GitHub Actions to immutable commit SHAs, following existing repository workflow conventions.
- [x] Set Node.js 22 and npm cache input `package-lock.json`; run `npm ci` from the repository root.
- [x] Define a four-workspace matrix with `fail-fast: false`. In each job install Chromium and WebKit with system dependencies, run `check:generated`, `build`, and `test` for that workspace in that order, and upload that package's `test-results` and `playwright-report` on failure.
- [x] Add aggregate job `ci` with `if: always()` and `needs: package-tests`; fail it unless the matrix result is `success`.
- [x] Add `site/index.html` with links to all four comparison pages using paths under `/arrakis/packages/<workspace>/`.
- [x] Add a Pages deployment job that runs only for pushes to `main` or `codex/arrakis-extraction` after `package-tests` and `ci` succeed; do not deploy on `pull_request` events. Give only this job `pages: write` and `id-token: write` permissions.
- [x] Assemble `_site` with `site/index.html`, each `packages/<workspace>/index.html`, and that package's `webgl`, `webcomponent`, and `svg` directories. Preserve the full relative directory structure and add `.nojekyll`.
- [x] Configure Pages with `actions/configure-pages`, upload `_site` with `actions/upload-pages-artifact`, and deploy with `actions/deploy-pages` in the `github-pages` environment.
- [x] Run `actionlint .github/workflows/ci.yml` and inspect generated `_site` paths with `find _site -type f` before pushing.
- [x] Commit as `ci: add parallel workspace checks and Pages deployment`.

### Task 3: Link live comparisons and add the workflow badge

**Files:**
- Modify: `README.md`
- Modify: `packages/arrakis-desert/README.md`
- Modify: `packages/arrakis-desert-1984/README.md`
- Modify: `packages/arrakis-orbit/README.md`
- Modify: `packages/arrakis-orbit-1984/README.md`

**Interfaces:**
- Consumes: the Pages URL `https://bkahlert.github.io/arrakis/packages/<workspace>/` for each workspace and the `.github/workflows/ci.yml` workflow.
- Produces: comparison links that open on the Pages site after a successful topic-branch deployment, and an Actions status badge at the top of the root README.

- [x] Add a `[![CI](.../actions/workflows/ci.yml/badge.svg)](...)` badge beside the root README title, matching the style in `pihero`.
- [x] Replace root README `Compare formats` targets with their corresponding Pages URLs.
- [x] Replace each package README's GitHub `blob/main/.../index.html` comparison target with the same workspace's Pages URL.
- [x] Note in the PR description that GitHub Pages has one shared URL: the current topic branch will be live until the main deployment replaces it after merge.
- [x] Keep package-local links to the WebGL, component, and SVG example pages unchanged.
- [x] Search all five READMEs for GitHub blob links to comparison `index.html` files and confirm none remain.
- [x] Commit as `docs: link live comparison pages and add CI badge`.

### Task 4: Enable Pages and protect the default branch

**Files:**
- GitHub repository settings: `bkahlert/arrakis` Pages and rulesets.

**Interfaces:**
- Consumes: successful CI check context from the current pull request.
- Produces: Pages configured for workflow publishing and an active `Protect default branch` ruleset requiring CI.

- [x] Enable GitHub Pages with workflow-based publishing.
- [x] Push the workflow and README changes to `codex/arrakis-extraction`.
- [x] Confirm all four matrix jobs and the aggregate status pass on the open PR.
- [x] Inspect the Actions runs and confirm the aggregate check context is `ci` from GitHub Actions (`integration_id: 15368`).
- [x] Create an active ruleset matching `~DEFAULT_BRANCH` with deletion and non-fast-forward updates disallowed, pull requests required, zero required approvals, resolved review threads required, linear history required, squash as the only merge method, and the aggregate CI check required.
- [x] Verify the ruleset JSON targets the default branch and requires the exact status check.

### Task 5: Verify the deployed comparison pages

**Files:**
- GitHub Pages deployment output.

**Interfaces:**
- Consumes: the merged default-branch commit and a successful Pages deployment.
- Produces: live comparison pages for all four backgrounds.

- [x] After the topic-branch CI passes, confirm the Pages deployment succeeds and the comparison links in the PR resolve.
- [ ] After the user merges the Arrakis PR, confirm the main deployment replaces the topic-branch content.
- [x] Open all four Pages URLs and confirm each comparison page and its runtime variants and referenced assets return HTTP 200.
- [x] Confirm the root README CI badge reports `passing`.

## Execution Choice

Use the already-selected native execution approach. The repo changes are a small workflow and documentation change, while the ruleset and Pages configuration are repository settings; keeping one implementation context avoids handoff across those dependent settings.
