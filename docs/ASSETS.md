# Original prototype assets

## Generated artwork

| File                        | Use                                        | Design direction                                                                                                                                                                                                                                         |
| --------------------------- | ------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `public/art/key-art.webp`   | Title, prologue and README                 | Original pixel-art sci-fi illustration: a teenage traveler in a teal jacket and orange scarf, a handheld cyan Omni-Tool, a cargo explorer ship, NEON on the left, KAGE on the right, and the distant red pirate Citadel. No text or borrowed game logos. |
| `public/art/portraits.webp` | NPC dialogue, player status and final boss | An original 3×2 portrait atlas: protagonist, Ilo, Meester Ren, pirate uncle, Kaito, and ARI. Square cells have a consistent pixel-art portrait style.                                                                                                    |

The raster images were generated for this project, then encoded as WebP for smaller downloads. Their underlying source compositions were not changed during that format conversion.

## Archived world paintings

Generated with the built-in image-generation tool for this update. Each original is 1536 × 1024, encoded to WebP at quality 93 and displayed at 2× with nearest-neighbor sampling. No characters or UI are baked into the world paintings. Walkable areas and object positions are separately authored in `src/levels.js`.

| File                             | Direction                                                                                                                                                                                                                                                                   |
| -------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `public/art/worlds/neon.webp`    | Dense cyberpunk pixel-art harbor: wet paving, cyan and magenta shop lighting, upper-left market and workshop, central signal plaza, northeast cargo arena, south canal with bridge and southeast blossom garden. The user-provided NEON concept served as visual reference. |
| `public/art/worlds/kage.webp`    | A samurai and science-fiction district: bamboo, torii gates, warm paper lanterns, gold gravity machinery, temple market, shrine arena, stone bridges and cherry blossoms.                                                                                                   |
| `public/art/worlds/citadel.webp` | Pirate industrial fortress: prison blocks, cables, furnaces, lava channels, red warning lamps, a central control complex and a northeast throne arena.                                                                                                                      |

Shared prompt constraints: original detailed top-down pixel-art game map; legible, connected streets and bridges; bottom-left landing zone; empty walkable lanes; no people, ships, enemies, UI or copied franchise logos. These backgrounds are visual prototypes, not a reusable Godot tile atlas.

## Runtime artwork

- `src/art.js`, `src/world-renderer.js`, `src/entities.js`: authored map illustration, weather, smooth walking residents, player animation, drones, terminals, caches, Stars pickups and the Wayfarer, drawn with Canvas.
- `src/sprites.js`: archived pixel character drawing, retained as reference.
- `src/characters.js`: transparent illustrated portrait frames for human speakers and SVG speech-light layers for robots.
- `src/ui.js`: small interface icons, a stylized mech, and portrait atlas positioning.
- `src/style.css`: original ship silhouette, planets, orbital station, hacking visualizations, and the epilogue beach composition.
- `public/icon.svg`: original Project X favicon.
- `src/audio.js`: synthesized feedback sounds; no external recordings.

## Fonts

Barlow Condensed and DM Sans are self-hosted through the Fontsource npm packages. The game does not need Google Fonts or an external font request at runtime. Font license texts are available in the installed Fontsource package folders. Excalibur and all other package dependencies retain their own licenses.

## Current illustrated maps and manga panels

Current gameplay maps are drawn by `src/world-renderer.js` rather than loaded from the archived paintings. `src/entities.js` draws the smooth world actors. See [ART_DIRECTION.md](ART_DIRECTION.md) for all twelve manga panel paths, exact generation prompts, the original pirate emblem and the animated portrait layers.
