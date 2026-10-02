export const icon = (name) => {
  const paths = {
    orbit:
      '<circle cx="12" cy="12" r="3"/><ellipse cx="12" cy="12" rx="10" ry="5" transform="rotate(-32 12 12)"/>',
    journal: '<path d="M5 3h14v18H5zM8 7h8M8 11h8M8 15h5"/>',
    ship: '<path d="m12 2 5 9 4 3v5l-6-2-3 4-3-4-6 2v-5l4-3zM12 8v6"/>',
    sound:
      '<path d="m4 9 4 0 5-4v14l-5-4H4zM17 8a6 6 0 0 1 0 8M20 5a10 10 0 0 1 0 14"/>',
    bolt: '<path d="m14 2-9 12h7l-2 8 9-12h-7z"/>',
    star: '<path d="m12 2 3 6 7 1-5 5 1 7-6-3-6 3 1-7-5-5 7-1z"/>',
    arrow: '<path d="M5 12h14m-6-6 6 6-6 6"/>',
    cross: '<path d="m6 6 12 12M6 18 18 6"/>',
    tool: '<path d="m7 3 1 5 4 4 4-4 5 1-4 6-4 1-7 6-4-4 7-6-1-4z"/>',
    check: '<path d="m4 12 5 5L20 5"/>',
  };
  return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths[name] || paths.orbit}</svg>`;
};
export function portrait(index = 0, extra = "") {
  return `<div class="portrait ${extra}" style="background-position:${(index % 3) * 50}% ${Math.floor(index / 3) * 100}%" role="img" aria-label="Personageportret"></div>`;
}
export const button = (id, label, kind = "accent") =>
  `<button id="${id}" class="button ${kind}">${label}</button>`;
export function mech(world) {
  return `<div class="mech-art ${world}"><div class="mech-aura"></div><div class="mech-head"><i></i></div><div class="mech-arm left"></div><div class="mech-arm right"></div><div class="mech-body"><div class="mech-core"></div></div><div class="mech-leg left"></div><div class="mech-leg right"></div></div>`;
}
