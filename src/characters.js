import { CHARACTERS } from "./story.js";

// Human portraits have matching closed/open raster frames. Robots use a
// separate speech-light layer. Both follow the subtitle reveal.
export function mangaPortrait(id = "hero") {
  if (!CHARACTERS[id]) id = "hero";
  const p = CHARACTERS[id];
  const ink = "#1c2936";
  if (p.kind !== "robot") {
    const base = import.meta.env.BASE_URL;
    return `<span class="manga-portrait illustrated-portrait" role="img" aria-label="${p.name}"><img class="portrait-frame mouth-closed" src="${base}art/characters/${id}-closed.webp" alt=""/><img class="portrait-frame mouth-open" src="${base}art/characters/${id}-open.webp" alt=""/></span>`;
  }
  return `<svg class="manga-portrait robot-portrait" viewBox="0 0 320 420" role="img" aria-label="${p.name}">
    <path d="M45 420 57 332Q160 286 263 332L280 420" fill="${p.coat}" stroke="${ink}" stroke-width="5"/>
    <path d="M83 170Q160 127 237 170L249 263Q160 306 71 263Z" fill="${p.coat}" stroke="${ink}" stroke-width="6"/>
    <path d="M87 179Q161 154 233 179L235 198Q155 176 85 199Z" fill="#ffffff20"/>
    <circle cx="160" cy="218" r="43" fill="#223448" stroke="#cecbbe" stroke-width="9"/>
    <circle class="robot-eye" cx="160" cy="218" r="23" fill="${p.accent}"/><circle cx="154" cy="212" r="10" fill="#eefcf1"/>
    <path d="M121 155 118 125M205 157 210 125" stroke="${ink}" stroke-width="7"/><circle cx="118" cy="121" r="8" fill="${p.accent}"/>
    <g class="portrait-mouth mouth-open"><path d="M136 282h48" stroke="${p.accent}" stroke-width="7" stroke-dasharray="6 3"/></g>
    <path d="M138 306 116 354 160 376 203 355 181 306" fill="#303747" stroke="${ink}" stroke-width="4"/>
    <path d="M94 375v29m134-29v29" stroke="${p.accent}" stroke-width="6"/>
  </svg>`;
}
