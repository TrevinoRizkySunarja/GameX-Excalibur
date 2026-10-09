import { mangaPortrait } from "./characters.js";
import { worldMapURL } from "./world-renderer.js";
import { PIRATE_FACTION } from "./story.js";
import { tone } from "./audio.js";

const escape = (value) =>
  String(value).replace(
    /[&<>"']/g,
    (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        c
      ],
  );
const base = import.meta.env.BASE_URL;
export function cinematicMarkup(frame, world, options = {}) {
  const {
    buttonId = "dialogue-next",
    action = "Verder",
    counter = "",
    skip = false,
  } = options;
  const image = frame.image
    ? `${base}art/story/${frame.image}.webp`
    : worldMapURL(world);
  return `<div class="cinema-heading"><span class="eyebrow">${escape(frame.label || world.name + " / VERHAAL")}</span><span>${escape(counter)}</span>${skip ? '<button id="skip-story" class="cinema-skip">Sla intro over</button>' : ""}</div>
    <div class="cinema-stage ${frame.image ? "" : "map-backdrop"}" data-speaker="${escape(frame.portrait || "ari")}">
      <img class="cinema-image" src="${image}" alt="${escape(frame.title || frame.speaker)}"/>
      <div class="cinema-shade"></div><div class="cinema-screentone"></div>
      <span class="cinema-chapter">${escape(frame.title || world.subtitle)}</span>
      <div class="cinema-actor">${mangaPortrait(frame.portrait)}</div>
      ${frame.portrait === "captain" ? `<div class="cinema-faction"><img src="${base}art/pirate-sigil.svg" alt="Insigne van ${PIRATE_FACTION}"/><span>${PIRATE_FACTION}</span></div>` : ""}
    </div><div class="cinema-caption"><span class="cinema-speaker">${escape(frame.speaker)}</span>
      <button class="cinema-subtitle" id="cinema-subtitle" aria-label="Toon de volledige ondertitel"><span id="subtitle-text"></span></button>
      <span class="sr-only" id="subtitle-accessible">${escape(frame.text)}</span>
      <div class="dialogue-actions"><button id="${buttonId}" class="button accent">${action} <span aria-hidden="true">→</span></button><small>SPATIE / ENTER · VERDER</small></div>
    </div>`;
}
export function mountSubtitle(frame) {
  const root = document.querySelector(".cinema-stage"),
    text = document.querySelector("#subtitle-text");
  if (!root || !text) return () => {};
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const letters = Array.from(frame.text);
  let count = reduced ? letters.length : 0,
    step = 0;
  const reveal = () => {
    count = letters.length;
    text.textContent = frame.text;
    root.classList.remove("speaking");
  };
  text.textContent = letters.slice(0, count).join("");
  const timer = setInterval(() => {
    step++;
    if (count < letters.length) {
      count = Math.min(letters.length, count + 2);
      text.textContent = letters.slice(0, count).join("");
      const speech = /[\p{L}\p{N}]/u.test(letters[count - 1] || "");
      root.classList.toggle("speaking", !reduced && speech && step % 4 !== 0);
    } else root.classList.remove("speaking");
    root.classList.toggle("blinking", !reduced && step % 113 >= 109);
  }, 40);
  const subtitle = document.querySelector("#cinema-subtitle");
  subtitle.onclick = reveal;
  const keyboard = (e) => {
    if (
      e.repeat ||
      !["Space", "Enter"].includes(e.code) ||
      e.target.matches("input,textarea") ||
      (e.target.closest("button") &&
        !e.target.matches(
          "#cinema-subtitle,.dialogue-actions > button:first-child",
        ))
    )
      return;
    e.preventDefault();
    if (count < letters.length) reveal();
    else document.querySelector(".dialogue-actions > button")?.click();
  };
  window.addEventListener("keydown", keyboard);
  return () => {
    clearInterval(timer);
    window.removeEventListener("keydown", keyboard);
    root.classList.remove("speaking", "blinking");
  };
}
export function encounterMarkup(battle, world) {
  return `<div class="encounter-wipe" style="--encounter-color:${world.accent}" aria-live="polite"><div class="encounter-slice top"></div><div class="encounter-slice bottom"></div>
    <div class="encounter-emblem"><img src="${base}art/pirate-sigil.svg" alt="Insigne van ${PIRATE_FACTION}"/></div>
    <div class="encounter-copy"><span class="eyebrow">${battle.members.length > 1 ? "VIJANDELIJKE GROEP" : "VIJANDELIJKE VERBINDING"}</span><h1>${escape(battle.encounterName)}</h1><p>${world.name} · ${battle.members.length} ${battle.members.length === 1 ? "signaal" : "signalen"} · OMNI-LINK ACTIEF</p></div>
    <button id="enter-arena" class="cinema-skip">Door naar hackbattle →</button></div>`;
}
export function mountEncounter(onComplete) {
  let finished = false;
  const duration = matchMedia("(prefers-reduced-motion: reduce)").matches
    ? 120
    : 1000;
  const finish = () => {
    if (finished) return;
    finished = true;
    cleanup();
    onComplete();
  };
  const timer = setTimeout(finish, duration);
  const keyboard = (e) => {
    if (!e.repeat && ["Space", "Enter"].includes(e.code)) {
      e.preventDefault();
      finish();
    }
  };
  function cleanup() {
    clearTimeout(timer);
    window.removeEventListener("keydown", keyboard);
  }
  window.addEventListener("keydown", keyboard);
  document.querySelector("#enter-arena").onclick = finish;
  tone(130, 0.22, "triangle", 0.025);
  return () => {
    finished = true;
    cleanup();
  };
}
