# Arrakis Backgrounds Repository and Packages

**Status:** Draft for approval  
**Date:** 2026-10-26

## Intent

Move the four Dune-inspired backgrounds out of the `bkahlert` portfolio
repository into the public repository `github.com/bkahlert/arrakis`. Give the
new repository the description, badges, README, and usual project details found
in the user's other repositories; the execution agent can infer those details.
Keep its local checkout at
`/Users/bkahlert/Development/com.bkahlert/arrakis`, next to the `bkahlert`
checkout.
Publish one npm package per background. Share repeated build and derivation
tooling while keeping each background independently maintained and released.

The four backgrounds are the semantic products. Each produces four
distributable forms: a WebGL page/runtime, a native web component, an animated
SVG, and a still SVG.

## Goals

- Keep the four backgrounds together in one new repository and separate from
  the portfolio code.
- Keep the local `arrakis` checkout beside the local `bkahlert` checkout.
- Set up `github.com/bkahlert/arrakis` with a polished project README,
  repository description, badges, and the usual supporting project metadata.
- Publish four independently versioned npm packages, one per background.
- Keep each package usable on its own and include all four generated forms.
- Start with manual, per-workspace npm publishing after reviewing package
  contents.
- License original software code under MIT and visual outputs that incorporate
  the third-party textures under CC BY 4.0, with the license scopes stated
  clearly in each package.
- Share repeated build orchestration, asset copying, bundling, and generated
  artifact tracking.
- Preserve artwork, runtime behavior, package-level documentation, tests, and
  asset credits during the move.
- Keep the existing portfolio connected with a small link to the new project.

## Non-goals and anti-goals

- Create a package for every generated file or format.
- Combine the four scenes into one runtime renderer or force their SVG
  generators into one algorithm.
- Redesign the artwork or change its runtime behavior as part of extraction.
- Publish build tools as a public runtime dependency.

## Constraints and current state

The four projects currently have separate source, build scripts, generated
outputs, tests, and private npm manifests. They are independently copyable.
The desert backgrounds export SVG artwork through their WebGL renderer. The
orbit backgrounds use different SVG export paths. Their component wrappers
and build scripts also differ in details.

All four asset credit files identify Solar System Scope / INOVE textures as
CC BY 4.0 and describe adaptations. Original code has no package-wide license
file today. The user chose MIT for original software and CC BY 4.0 for the
finished visual outputs that incorporate those textures. The package-level
license file must make those scopes explicit; CC BY credit and modification
notices stay with every distributed copy or adaptation.

Build steps repeat across projects: copying assets, bundling outputs, and
recording source/output hashes. The four package directories include
development dependencies and generated runtime files. Public package contents
must include the runtime files and credits while excluding development-only
files.

## Approaches

1. **Four npm workspaces with shared repository tooling — selected.** Each
   background remains a separately publishable workspace. Common build helpers
   live in an unpublished root-level tooling area. Scene-specific source and
   SVG generation stay with each background. This preserves the consumer
   boundary and avoids a second package boundary for private build code.
2. **Four workspaces plus a private tooling workspace.** This makes the shared
   tool interface explicit and can help if other repositories later consume
   it. It adds workspace dependency and release-like coordination for tools
   used only inside this repository.
3. **Keep four separate repositories and duplicate tooling.** This preserves
   the strongest isolation, but conflicts with the goal of removing duplicated
   derivation tooling and coordinating shared changes.

The user selected four background packages and agreed with root-level shared
tooling. The working recommendation is four npm workspaces in one separate
repository, each package publishing its own four runtime forms. Consumers
choose the form they use from that background package.

The builder check identified release automation as the one material open
question. The user chose manual publishing for the initial workflow. Repository
metadata and README details are delegated to the execution agent, which should
inspect the user's other repositories for their conventions.

## Design

The new repository has a root workspace configuration and shared development
tooling. Each background workspace owns its canonical scene source, assets,
art-specific SVG generator, tests, package metadata, and README. Shared build
helpers handle only common operations such as bundling, copying outputs,
recording artifact hashes, and freshness checks. A background-specific build
adapter connects those helpers to its own renderer and export process.

Each public package allowlists its runtime distribution files, README, and
license/credit notices in npm's package contents. It excludes browser tests,
source-generation dependencies, and repository-level tooling unless a runtime
needs them. Each package license file distinguishes MIT-covered software from
CC BY 4.0-covered texture assets and visual outputs. Credits retain source,
license link, and modification details wherever those outputs are distributed.
Package metadata points to the file-specific terms using npm's
`SEE LICENSE IN LICENSE` form.
Versions can advance independently by background. The root repository can
build and check all workspaces together, while each workspace remains
individually buildable and publishable.

The first release workflow is manual. The maintainer reviews package contents,
updates the selected workspace version, and publishes that workspace. CI-based
versioning and publishing are outside the initial scope.

Proposed portfolio update: remove the four copied project directories and
replace their local references with one link to the new repository. The new
repository retains the side-by-side previews and background-specific pages.

## Left to the builder

- Check availability and choose scoped npm names for the four packages. The
  repository slug is fixed as `arrakis`.
- Inspect the user's other repositories and match their conventions for the
  description, README structure, badges, and supporting metadata.
- Decide the exact root-level tooling module boundaries from the repeated
  implementation, without unifying scene-specific SVG algorithms.
- Preserve existing independent build and test entry points where practical.
- Prepare package tarballs for review before the first public npm release.
