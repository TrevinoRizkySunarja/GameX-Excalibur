# Original prototype assets

## Generated artwork

| File                        | Use                                        | Design direction                                                                                                                                                                                                                                         |
| --------------------------- | ------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `public/art/key-art.webp`   | Title, prologue and README                 | Original pixel-art sci-fi illustration: a teenage traveler in a teal jacket and orange scarf, a handheld cyan Omni-Tool, a cargo explorer ship, NEON on the left, KAGE on the right, and the distant red pirate Citadel. No text or borrowed game logos. |
| `public/art/portraits.webp` | NPC dialogue, player status and final boss | An original 3×2 portrait atlas: protagonist, Ilo, Meester Ren, pirate uncle, Kaito, and ARI. Square cells have a consistent pixel-art portrait style.                                                                                                    |

The raster images were generated for this project, then encoded as WebP for smaller downloads. Their underlying source compositions were not changed during that format conversion.

## Runtime artwork

- `src/art.js`: terrain tiles, buildings, temple gates, vegetation, player walking animation, drones, mechs, terminals, caches, Stars pickups and the Wayfarer sprite, drawn with Canvas.
- `src/ui.js`: small interface icons, a stylized mech, and portrait atlas positioning.
- `src/style.css`: original ship silhouette, planets, orbital station, hacking visualizations, and the epilogue beach composition.
- `public/icon.svg`: original Project X favicon.
- `src/audio.js`: synthesized feedback sounds; no external recordings.

## Fonts

Barlow Condensed and DM Sans are self-hosted through the Fontsource npm packages. The game does not need Google Fonts or an external font request at runtime. Font license texts are available in the installed Fontsource package folders. Excalibur and all other package dependencies retain their own licenses.
