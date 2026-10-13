import { battleSound, reducedEffects } from "./audio.js";
const images = new Map();
export const ENEMY_ART = ["chorus", "matriarch", "warden", "bellkeeper", "moth", "fox"];
const alias = (form) => form === "hydra" ? "chorus" : form;
export function enemyForm(obj, theme) {
  return alias(obj.form || (obj.id === "kage-boss" ? "bellkeeper" : obj.id === "citadel-boss" ? "warden" : obj.id === "neon-boss" ? "sentinel" : theme === "kage" ? "oni" : theme === "citadel" ? "wraith" : "sentinel"));
}
export async function loadEnemyArt() {
  await Promise.all(ENEMY_ART.map(name => new Promise(resolve => {
    const im = new Image();
    im.onload = () => { images.set(name, im); resolve(); };
    im.onerror = () => resolve();
    im.src = `${import.meta.env.BASE_URL}art/enemies/${name}.webp`;
  })));
}
export function enemyMarkup(form, phase = false) {
  form = alias(form);
  const graphic = ENEMY_ART.includes(form)
    ? `<img src="${import.meta.env.BASE_URL}art/enemies/${form}.webp" alt="${{chorus:"Chromehydra",matriarch:"Prismamoeder",warden:"Stormwachter",bellkeeper:"Klokkenwachter",moth:"Keramische maanmot",fox:"Negenstaartige machine"}[form]}"/>`
    : `<svg viewBox="0 0 240 240" aria-label="${form === "oni" ? "Oni-pantser" : form === "wraith" ? "Prismaschaduw" : "Prismawachter"}" role="img"><defs><linearGradient id="enemy-metal" x2="0" y2="1"><stop stop-color="#7b96a2"/><stop offset="1" stop-color="#263542"/></linearGradient></defs>${form === "wraith"
      ? '<path d="M120 30 173 80 160 148 186 212 128 180 91 210 82 160 54 117 76 73Z" fill="#52536c" stroke="#baa4d5" stroke-width="3"/><path d="M71 82 42 33 93 54M164 85 200 26 146 60" fill="#a3a1c1"/><path d="M83 149 64 216M161 158 203 216" stroke="#cfa6da" stroke-width="3"/><path d="m120 68 28 42-28 42-28-42Z" fill="#ee9dde"/>'
      : form === "oni"
      ? '<path d="M73 80 48 66 39 141 61 159 75 130M166 80 194 66 206 141 181 160 168 128" fill="#6b3940" stroke="#e3ae83" stroke-width="3"/><path d="M78 61 55 20 98 50M162 61 186 20 144 50" fill="#d6c7a9"/><path d="M72 71 88 43 151 43 173 71 160 129 78 129Z" fill="#d0c8ae" stroke="#492d39" stroke-width="4"/><path d="M82 73 109 85M132 85 158 73" stroke="#db555e" stroke-width="8"/><path d="M81 130 72 181 95 215 108 154 132 154 146 215 170 181 159 130Z" fill="#76474a" stroke="#c79570" stroke-width="3"/><path d="m120 101 17 17-17 17-17-17Z" fill="#f8d296"/>'
      : '<path d="M62 90 24 69 17 145 64 128M177 90 217 68 226 143 179 129" fill="#526a77" stroke="#91b7c0" stroke-width="3"/><path d="M76 44 166 44 181 121 159 171 80 171 60 122Z" fill="url(#enemy-metal)" stroke="#b9cad1" stroke-width="3"/><path d="M88 171 68 218 102 218 117 185M135 171 159 218 190 218 157 173" fill="#667d86"/><path d="M79 68h82v16H79z" fill="#061a25"/><path d="M94 76h53" stroke="#5ef1e9" stroke-width="6"/><circle cx="120" cy="122" r="22" fill="#24323e" stroke="#e0b081" stroke-width="4"/><circle cx="120" cy="122" r="11" fill="#62eae1"/>'}</svg>`;
  return `<div class="enemy-illustration ${phase ? "phase-active" : ""}" data-form="${form}"><div class="enemy-halo"></div><div class="enemy-orbit"></div>${graphic}<span class="enemy-dust"></span></div>`;
}
export function drawEnemy(c, x, y, form, size = 75, accent = "#f3918d") {
  form = alias(form);
  const im = images.get(form);
  const hover = reducedEffects() ? 0 : Math.sin(performance.now() / 500) * 3;
  if (im) {
    c.drawImage(im, x-size/2, y-size+12+hover, size, size);
    return;
  }
  c.save(); c.translate(x, y-35+hover);
  c.strokeStyle = accent; c.lineWidth = 2;
  if (form === "wraith") {
    c.fillStyle="#66617e"; c.beginPath();c.moveTo(0,-30);c.lineTo(25,-3);c.lineTo(17,36);c.lineTo(0,22);c.lineTo(-21,36);c.lineTo(-24,-3);c.closePath();c.fill();c.stroke();
    c.fillStyle=accent;c.fillRect(-6,-12,12,18);
  } else if(form === "oni") {
    c.fillStyle="#9a5556";c.fillRect(-25,-6,50,35);c.fillStyle="#cebea4";c.beginPath();c.moveTo(-18,-10);c.lineTo(-25,-32);c.lineTo(-8,-19);c.lineTo(9,-19);c.lineTo(25,-32);c.lineTo(18,-10);c.closePath();c.fill();
    c.fillStyle=accent;c.fillRect(-13,-6,8,3);c.fillRect(6,-6,8,3);
  } else {
    c.fillStyle="#6c828e";c.beginPath();c.roundRect(-20,-25,40,50,5);c.fill();c.stroke();c.fillStyle="#1b2c3b";c.fillRect(-15,-18,30,9);c.fillStyle=accent;c.fillRect(-10,-16,20,4);c.beginPath();c.arc(0,8,8,0,7);c.fill();
    for (const dx of [-30,23]) {c.fillStyle="#55747c";c.fillRect(dx,-13,8,29);}
  }
  c.restore();
}
export function showBattleEffect(result, battle, theme) {
  const panel=document.querySelector("#overlay .panel");
  if (!panel) return;
  const effect=document.createElement("div");
  const powerful = result.phaseChanged || result.defeated;
  effect.className=`battle-impact ${result.ok ? "impact-success" : "impact-failure"} ${theme} ${reducedEffects() ? "calm" : ""}`;
  effect.setAttribute("aria-hidden", "true");
  effect.innerHTML=`<div class="impact-ring"></div><div class="impact-slash"></div><div class="impact-slash secondary"></div><strong class="impact-number">${result.ok ? "−" : ""}${result.damage}<small>${result.ok ? result.defeated ? "KERN GEBROKEN" : "OVERRIDE" : "TEGENAANVAL"}</small></strong>${Array.from({length:12},(_,i)=>`<i class="impact-shard" style="--angle:${i*30}deg;--delay:${i%3*25}ms"></i>`).join("")}`;
  panel.append(effect);
  panel.classList.toggle("battle-shock", !reducedEffects());
  battleSound(result.ok, powerful);
  const caption=document.querySelector(".battle-caption");
  if(caption)caption.textContent=result.ok?`${result.name}: −${result.damage} HP${result.phaseChanged ? " · tweede fase ontwaakt" : result.defeated ? " · signaal uitgeschakeld" : ""}`:`${result.name} countert: −${result.damage} HP`;
}
