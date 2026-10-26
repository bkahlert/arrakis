# Arrakis CI and default-branch protection design

## Intent

Run the four existing background packages' freshness checks, builds, and test suites on GitHub Actions, and protect Arrakis's default branch using the same repository ruleset pattern used in the user's other repositories. The package test files and npm scripts already exist; the missing piece is automated execution and merge protection. Make the test command available at the workspace root and run package jobs concurrently in CI.

Publish the four HTML comparison pages through GitHub Pages so their README links open live pages instead of GitHub's source viewer.

## Goals

- Run each workspace's `check:generated`, `build`, and `test` scripts on pull requests and branch pushes.
- Add a root `npm test` command that runs all four existing workspace test scripts.
- Run each package's CI job concurrently in GitHub Actions, with failures isolated so one package does not cancel the others.
- Install the project's pinned Node dependencies and Chromium/WebKit needed by the existing Playwright suites.
- Add a CI workflow badge at the top of the root README.
- Deploy the comparison pages to GitHub Pages while preserving `packages/<workspace>/` paths and local runtime assets.
- Link comparison references in the root and package READMEs to the live Pages URLs.
- Provide a small Pages landing page linking to the four comparisons.
- Require a successful aggregate CI status on the default branch's pull requests.
- Deploy Pages after CI succeeds from `codex/arrakis-extraction` for the current PR and from the default branch after merge.
- Match the existing `Protect default branch` rules: disallow deletion and non-fast-forward updates, require pull requests, require resolved review threads, preserve linear history, and allow squash merges only.

## Non-goals

- Add or rewrite test cases unless CI exposes a concrete defect in the migrated suites.
- Publish npm packages or change their versions.
- Publish any additional site content beyond the four package comparison pages and their runtime assets.
- Require human approvals; the existing `bkahlert` ruleset uses zero required approvals.

## Approaches

1. Copy the `bkahlert` ruleset exactly and add CI that reports results without blocking merges. This preserves its current PR-only protection, but a failing test run would not stop a merge.
2. Adapt the existing backgrounds workflow to npm workspaces and add a stable aggregate CI check to the `bkahlert` ruleset. This follows the stricter status-check pattern in `pihero` and ensures all four workspaces pass before merge. **Proposed default:** use this approach because the request adds CI and tests specifically to protect `main`.

## Comparison-link options

1. Remove comparison links from GitHub READMEs. This avoids GitHub's source viewer, but drops direct access to the live demos.
2. Use a third-party raw-HTML preview service. This adds an external runtime dependency and may not preserve all relative runtime assets.
3. Serve the comparison pages through GitHub Pages, preserving the package paths and runtime directories. **Chosen:** use GitHub Pages because it is GitHub-native and serves the existing static pages with their relative assets. GitHub Pages has one shared site URL rather than an isolated PR preview. After CI passes, deploy the current topic branch so the links work in this PR; the default-branch deployment replaces it after merge. The topic branch will therefore be the public Pages content until main deploys.

GitHub Pages custom workflows support uploading and deploying static files. Keep the package directory structure in the Pages artifact so each comparison page and its relative runtime links resolve: [custom Pages workflows](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages), [project site URLs](https://docs.github.com/en/pages/getting-started-with-github-pages/creating-a-github-pages-site).

## Proposed implementation

- Add a root `test` script that dispatches to each workspace's existing test script.
- Keep the root npm command simple and serial; use the GitHub Actions matrix for parallel package execution.
- Add a GitHub Actions workflow using Node 22, root `npm ci`, and Playwright Chromium/WebKit installation.
- Run freshness check, build, and test for each of the four workspaces in a parallel matrix; upload test diagnostics when a workspace fails.
- Run on pushes and pull requests without path filters so required checks cannot be skipped by a path mismatch.
- Add an aggregate status check with a stable name and make it required in an active ruleset targeting `~DEFAULT_BRANCH`.
- Configure that ruleset to match the existing `bkahlert` repository defaults, plus the required CI check.
- On pushes to `codex/arrakis-extraction` or `main` after CI succeeds, deploy a Pages artifact containing each package's comparison page and required runtime directories. Do not deploy from `pull_request` events.
- Include the Pages landing page at the site root.
- Enable GitHub Pages with workflow-based publishing and update comparison links to `https://bkahlert.github.io/arrakis/packages/<workspace>/`.
- Add a GitHub Actions CI badge to the root README heading.

## Verification

The root `npm test` command must run all four workspace test scripts. The workflow must pass for all four workspaces concurrently. Inspect the actual GitHub check-run name before adding it as a required ruleset context. Confirm the ruleset applies to the current default branch and the PR can merge only after its required check succeeds. Confirm a successful topic-branch push publishes the comparison links in the PR, then after merge confirm the main deployment replaces it.
