// Original procedural soundtrack and effects. Browser audio is armed by a
// gesture; all nodes share separate music / effects buses and a master mute.
const KEY = "project-x-audio-v2";
let settings = { enabled: true, music: 0.35, effects: 0.7, subtitles: "normal", largeText: false, reducedEffects: false };
try { settings = { ...settings, ...JSON.parse(localStorage.getItem(KEY) || "{}") }; } catch {}
for (const key of ["music", "effects"]) settings[key] = Math.max(0, Math.min(1, Number(settings[key]) || 0));
if (!["normal", "fast", "instant"].includes(settings.subtitles)) settings.subtitles = "normal";
let ctx, master, musicBus, effectsBus, loop, world = "neon", mode = "explore", beat = 0;
let notesPlayed = 0, effectsPlayed = 0;
export const audioSettings = () => ({ ...settings });
export const audioStatus = () => ({ context: ctx?.state || "locked", world, mode, notesPlayed, effectsPlayed, ...settings });
function buses() {
  if (!ctx) {
    ctx = new (window.AudioContext || window.webkitAudioContext)();
    master = ctx.createGain(); musicBus = ctx.createGain(); effectsBus = ctx.createGain();
    master.connect(ctx.destination); musicBus.connect(master); effectsBus.connect(master);
  }
  master.gain.value = settings.enabled ? 1 : 0;
  musicBus.gain.value = settings.music;
  effectsBus.gain.value = settings.effects;
}
export function unlockAudio() {
  try { buses(); if (ctx.state === "suspended") ctx.resume().catch(() => {}); startLoop(); } catch {}
}
export function updateAudioSettings(patch) {
  settings = { ...settings, ...patch };
  for (const key of ["music", "effects"]) settings[key] = Math.max(0, Math.min(1, Number(settings[key]) || 0));
  try { localStorage.setItem(KEY, JSON.stringify(settings)); if (ctx) buses(); } catch {}
  document.documentElement.dataset.effects = settings.reducedEffects ? "reduced" : "full";
  document.documentElement.style.setProperty("--subtitle-size", settings.largeText ? "19px" : "16px");
  document.querySelector("#nav-sound")?.setAttribute("aria-pressed", String(settings.enabled));
  return audioSettings();
}
export function setAudio(enabled) { updateAudioSettings({ enabled }); return settings.enabled; }
export function reducedEffects() {
  return settings.reducedEffects || matchMedia("(prefers-reduced-motion: reduce)").matches;
}
function oscillator(freq, duration, type, volume, bus, delay = 0, endFrequency) {
  if (!ctx || !settings.enabled || ctx.state !== "running") return;
  const o = ctx.createOscillator(), gain = ctx.createGain(), now = ctx.currentTime + delay;
  o.type = type; o.frequency.setValueAtTime(freq, now);
  if (endFrequency) o.frequency.exponentialRampToValueAtTime(endFrequency, now + duration);
  gain.gain.setValueAtTime(0.0001, now);
  gain.gain.exponentialRampToValueAtTime(Math.max(0.0002, volume), now + Math.min(.015, duration / 3));
  gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);
  o.connect(gain); gain.connect(bus); o.start(now); o.stop(now + duration + .02);
  o.onended = () => { o.disconnect(); gain.disconnect(); };
}
export function tone(freq = 400, duration = .1, type = "sine", volume = .05) {
  if (!settings.enabled) return;
  unlockAudio(); effectsPlayed++; oscillator(freq, duration, type, volume, effectsBus);
}
function noise(duration = .2, volume = .035) {
  if (!ctx || !settings.enabled || ctx.state !== "running") return;
  const buffer = ctx.createBuffer(1, Math.ceil(ctx.sampleRate * duration), ctx.sampleRate), data = buffer.getChannelData(0);
  for (let i = 0; i < data.length; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / data.length);
  const source = ctx.createBufferSource(), g = ctx.createGain(), filter = ctx.createBiquadFilter();
  source.buffer = buffer; filter.type = "lowpass"; filter.frequency.value = 1400;
  g.gain.value = volume; source.connect(filter); filter.connect(g); g.connect(effectsBus); source.start();
  source.onended = () => { source.disconnect(); filter.disconnect(); g.disconnect(); };
}
function startLoop() {
  if (loop || !ctx) return;
  loop = setInterval(() => {
    if (document.hidden || !settings.enabled || !settings.music || ctx.state !== "running") return;
    const battle = mode === "battle", kage = world === "kage";
    const scale = kage ? [220, 261.63, 293.66, 329.63, 392, 440, 392, 293.66] : world === "citadel" ? [146.83, 174.61, 220, 233.08, 293.66, 220, 174.61, 164.81] : [164.81, 246.94, 329.63, 392, 293.66, 246.94, 220, 329.63];
    const n = scale[beat % scale.length];
    oscillator(n * (battle ? 1 : .5), kage ? .75 : .5, kage ? "sine" : "triangle", battle ? .065 : .03, musicBus);
    if (beat % 4 === 0) oscillator(scale[0] / 2, 1.4, "sine", .04, musicBus);
    if (battle) {
      oscillator(beat % 2 ? 110 : 70, .15, "triangle", .065, musicBus, .23, 36);
      if (beat % 2 === 0) oscillator(n * 2, .13, "sine", .018, musicBus, .25);
    }
    notesPlayed++; beat++;
  }, 520);
}
export function setSoundscape(planet, sceneMode = "explore") { world = planet; mode = sceneMode; }
export function success() {
  tone(523, .13, "triangle", .04);
  if (ctx) { oscillator(659, .18, "triangle", .04, effectsBus, .08); oscillator(784, .3, "sine", .04, effectsBus, .17); }
}
export function fail() { tone(130, .3, "sawtooth", .018); noise(.2, .025); }
export function click() { tone(world === "kage" ? 660 : 880, .045, "sine", .022); }
export function speech(character = "ari") {
  if (!ctx || ctx.state !== "running") return;
  oscillator(280 + character.charCodeAt(0) % 7 * 35, .026, "triangle", .008, effectsBus);
}
export function encounterSound() {
  tone(world === "kage" ? 196 : 110, .65, "triangle", .045);
  noise(.4, .045);
  if (ctx) for (let i=0; i<5; i++) oscillator(220 * 2 ** (i / 3), .12, "sawtooth", .011, effectsBus, i * .055);
}
export function battleSound(ok, powerful = false) {
  if (ok) { tone(world === "kage" ? 740 : 980, .22, "triangle", .04); noise(.18, .04); }
  else { fail(); tone(65, .38, "triangle", .06); }
  if (powerful && ctx) oscillator(98, .7, "sine", .07, effectsBus, .1, 30);
}
export function lootSound(rarity) {
  tone(523, .25, "sine", .05);
  if (ctx) for (const [i,n] of [659,784,1047,1319].entries()) oscillator(n, .55, "sine", .025, effectsBus, i * .12);
}
if (typeof document !== "undefined") document.addEventListener("visibilitychange", () => {
  if (!ctx) return;
  if (document.hidden) ctx.suspend().catch(() => {});
  else ctx.resume().catch(() => {});
});
