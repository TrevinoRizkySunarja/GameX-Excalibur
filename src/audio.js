let ctx,
  enabled = true;
export function setAudio(value) {
  enabled = value;
  return enabled;
}
export function tone(freq = 400, duration = 0.1, type = "sine", volume = 0.05) {
  if (!enabled) return;
  try {
    ctx ??= new (window.AudioContext || window.webkitAudioContext)();
    ctx.resume();
    const o = ctx.createOscillator(),
      g = ctx.createGain();
    o.type = type;
    o.frequency.value = freq;
    g.gain.setValueAtTime(volume, ctx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);
    o.connect(g);
    g.connect(ctx.destination);
    o.start();
    o.stop(ctx.currentTime + duration);
  } catch {}
}
export function success() {
  tone(523, 0.12);
  setTimeout(() => tone(784, 0.2), 90);
}
export function fail() {
  tone(130, 0.25, "sawtooth", 0.025);
}
export function click() {
  tone(800, 0.035, "sine", 0.025);
}
