# Arrakis [![License: MIT + CC BY 4.0](https://img.shields.io/badge/license-MIT%20%2B%20CC%20BY--4.0-29ABE2)](#license) [![Buy Me A Coffee](https://img.shields.io/static/v1?label=&message=%E2%98%95%20Buy%20Me%20A%20Coffee&color=FFDD00)](https://www.buymeacoffee.com/bkahlert)

Animated backgrounds inspired by Dune's deserts and planetary orbits. Each background ships as a WebGL runtime, a native web component, an animated SVG, and a still SVG.

## Backgrounds

| Background | npm package | Preview | Package guide | Comparison page |
| --- | --- | --- | --- | --- |
| Arrakis Desert | `@bkahlert/arrakis-desert` | [![Arrakis Desert](packages/arrakis-desert/svg/arrakis-desert.svg)](packages/arrakis-desert/svg/arrakis-desert.svg) | [README](packages/arrakis-desert/README.md) | [Compare formats](packages/arrakis-desert/index.html) |
| Arrakis Desert (1984) | `@bkahlert/arrakis-desert-1984` | [![Arrakis Desert (1984)](packages/arrakis-desert-1984/svg/arrakis-desert-1984.svg)](packages/arrakis-desert-1984/svg/arrakis-desert-1984.svg) | [README](packages/arrakis-desert-1984/README.md) | [Compare formats](packages/arrakis-desert-1984/index.html) |
| Arrakis Orbit | `@bkahlert/arrakis-orbit` | [![Arrakis Orbit](packages/arrakis-orbit/svg/arrakis-orbit.svg)](packages/arrakis-orbit/svg/arrakis-orbit.svg) | [README](packages/arrakis-orbit/README.md) | [Compare formats](packages/arrakis-orbit/index.html) |
| Arrakis Orbit (1984) | `@bkahlert/arrakis-orbit-1984` | [![Arrakis Orbit (1984)](packages/arrakis-orbit-1984/svg/arrakis-orbit-1984.svg)](packages/arrakis-orbit-1984/svg/arrakis-orbit-1984.svg) | [README](packages/arrakis-orbit-1984/README.md) | [Compare formats](packages/arrakis-orbit-1984/index.html) |

The comparison pages show the live WebGL, component, and SVG variants. The package guides explain integration, motion controls, fallbacks, and each background's rendering details.

## Development

Node.js 22 or newer is required. Build a background from the repository root:

```shell
npm install
npm run build --workspace=packages/arrakis-desert
```

Run `npm run build --workspaces --if-present` to build every background.

## Credits and licenses

Original software is licensed under MIT. Texture assets and finished visual outputs that incorporate them are licensed under CC BY 4.0. Each package includes its license terms and credits, with the source, license link, and modification details for its textures.
