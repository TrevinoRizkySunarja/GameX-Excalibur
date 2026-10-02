import "@fontsource/barlow-condensed/latin-500.css";
import "@fontsource/barlow-condensed/latin-600.css";
import "@fontsource/barlow-condensed/latin-700.css";
import "@fontsource/barlow-condensed/latin-800.css";
import "@fontsource/dm-sans/latin-400.css";
import "@fontsource/dm-sans/latin-600.css";
import "@fontsource/dm-sans/latin-700.css";
import "./style.css";
import { createEngine } from "./world.js";
import {
  freshState,
  readSave,
  writeSave,
  grant,
  purchase,
  record,
  pickHack,
  damageFor,
} from "./state.js";
import {
  WORLDS,
  DESTINATIONS,
  MINIGAMES,
  availableDestinations,
  missionFor,
} from "./data.js";
import { mountHack } from "./hacks.js";
import { click, success, setAudio } from "./audio.js";
import { icon, portrait, button, mech } from "./ui.js";

const app = document.querySelector("#app");
app.innerHTML = `<div class="game-shell">
  <nav class="rail" aria-label="Game menu"><a class="brand-mark" href="#" aria-label="Project X">X<span>·</span></a><div class="rail-middle"><button id="nav-map" title="Bestemmingen (M)">${icon("orbit")}</button><button id="nav-journal" title="Logboek (J)">${icon("journal")}</button><button id="nav-ship" title="Schip & upgrades">${icon("ship")}</button></div><button id="nav-sound" title="Geluid aan/uit" aria-pressed="true">${icon("sound")}</button><span class="rail-label">EXCALIBUR / 01</span></nav>
  <div class="main-shell"><header class="topbar"><div class="wordmark">PROJECT <b>X</b><span>QUANTUM SHIFT</span></div><div class="live-label"><i></i> PLAYABLE PROTOTYPE</div><div class="wallet"><span title="Stars">${icon("star")}<b id="stars">0</b></span><span title="Bouten">${icon("bolt")}<b id="bolts">0</b></span><span title="Softwarechips">${icon("tool")}<b id="chips">0</b></span></div></header>
  <main class="play-layout"><section class="viewport" aria-label="Speelwereld"><canvas id="world-canvas" aria-label="Top-down speelwereld"></canvas><div class="world-vignette"></div><div class="world-top"><div class="chapter-tag"><i></i><span id="world-tag">NEON / CHAPTER 01</span></div><span class="coordinate">SECTOR // <span id="coordinates">000 : 000</span></span></div><div id="prompt" class="interact-prompt" hidden><kbd>E</kbd><span></span></div><div class="world-bottom"><div class="health-cluster"><span>VITAAL SIGNAAL <b id="hp-text">100 / 100</b></span><div class="health-meter"><i id="hp-fill"></i></div><div class="controls"><span><kbd>WASD</kbd> bewegen</span><span><kbd>SPATIE</kbd> dash</span><span><kbd>E</kbd> interactie</span></div></div><div class="radar" title="Positie en volgend doel"><div class="radar-grid"></div><i id="radar-player"></i><b id="radar-target"></b><span>SCAN / LIVE</span></div></div><div id="toast" class="toast" role="status"></div><div id="loading" class="loading">Omni-Link synchroniseren…</div></section>
  <aside class="mission-panel"><span class="eyebrow">ACTIEVE BESTEMMING</span><h1 id="world-title">NEON</h1><p id="world-subtitle"></p><div class="chapter-progress"><span class="active"></span><span></span><span></span></div><div class="mission-card"><span class="eyebrow">HOOFDMISSIE</span><h2 id="mission-title">Het eerste spoor</h2><p id="mission-text"></p><button id="mission-journal">Bekijk logboek ${icon("arrow")}</button></div><div class="tool-dossier"><div class="tool-orb">${icon("tool")}</div><div><span class="eyebrow">OMNI-TOOL</span><h3>Herschrijf de realiteit.</h3></div><p>Een willekeurige opdracht.<br>Eén geslaagde hack.<br>Een wereld die reageert.</p><div class="signal-row"><i></i><span id="tool-status">LINK OFFLINE</span></div></div><div class="field-note"><span class="eyebrow">VELDNOTITIE</span><p id="field-note"></p></div><span class="prototype-note">3 speelbare chapters · 12 conceptbestemmingen<br>JavaScript + Excalibur.js</span></aside></main>
  <footer class="statusbar"><span>DE WAYFARER <i>/</i> JOURNEY LOG <b id="hacks-count">0 HACKS</b></span><span id="save-status">LOKALE VOORTGANG</span><button id="help-button">BEDIENING</button></footer></div></div><div id="overlay" class="overlay" hidden></div>`;

export class ProjectX {
  constructor() {
    this.state = readSave();
    this.paused = true;
    this.engine = null;
    this.hackCleanup = null;
    this.battle = null;
    this.modalType = "";
    this.toastTimer = null;
    this.soundOn = true;
  }
  save() {
    const ok = writeSave(this.state);
    document.querySelector("#save-status").textContent = ok
      ? "VOORTGANG OPGESLAGEN OP DIT APPARAAT"
      : "OPSLAAN NIET BESCHIKBAAR";
    this.refresh();
  }
  refresh() {
    const s = this.state,
      w = WORLDS[s.world];
    for (const key of ["stars", "bolts", "chips"])
      document.querySelector(`#${key}`).textContent = s[key];
    document.querySelector("#hp-text").textContent = `${s.hp} / ${s.maxHp}`;
    document.querySelector("#hp-fill").style.width = `${s.hp}%`;
    document.querySelector("#world-tag").textContent =
      `${w.name} / CHAPTER ${w.chapter}`;
    document.querySelector("#world-title").textContent = w.name;
    document.querySelector("#world-subtitle").textContent = w.subtitle;
    document.querySelector("#mission-title").textContent = {
      neon: "Het eerste spoor",
      kage: "De prijs van evenwicht",
      citadel: "Bloed & code",
    }[s.world];
    document.querySelector("#mission-text").textContent = missionFor(
      s,
      s.world,
    );
    document.querySelector("#field-note").textContent = {
      neon: "Ilo weet meer over de piratenroute. Op NEON heeft informatie altijd een prijs.",
      kage: "Ren en Kaito willen hetzelfde: vrijheid. De prijs die ze daarvoor willen betalen verschilt.",
      citadel:
        "Je ouders leven. De Omni-Tool kan elke deur openen. Maar kan hij terugbrengen wie je was?",
    }[s.world];
    document.querySelector("#tool-status").textContent = s.tool
      ? "OMNI-LINK ONLINE"
      : "LINK OFFLINE";
    document.querySelector("#hacks-count").textContent = `${s.hacks} HACKS`;
    document
      .querySelectorAll(".chapter-progress span")
      .forEach((el, i) => el.classList.toggle("active", i < Number(w.chapter)));
    document.documentElement.style.setProperty("--world-accent", w.accent);
    this.engine?.currentScene.refresh?.();
  }
  toast(text) {
    const el = document.querySelector("#toast");
    el.textContent = text;
    el.classList.add("visible");
    clearTimeout(this.toastTimer);
    this.toastTimer = setTimeout(() => el.classList.remove("visible"), 3400);
  }
  setPrompt(obj) {
    const el = document.querySelector("#prompt");
    el.hidden = !obj;
    if (obj) el.querySelector("span").textContent = obj.hint;
  }
  updateRadar(pos, target) {
    document.querySelector("#coordinates").textContent =
      `${Math.round(pos.x)} : ${Math.round(pos.y)}`;
    const dot = document.querySelector("#radar-player");
    dot.style.left = `${(pos.x / 1440) * 100}%`;
    dot.style.top = `${(pos.y / 1040) * 100}%`;
    const goal = document.querySelector("#radar-target");
    goal.hidden = !target;
    if (target) {
      goal.style.left = `${(target.x / 1440) * 100}%`;
      goal.style.top = `${(target.y / 1040) * 100}%`;
    }
  }
  modal(html, type = "dialogue", wide = false) {
    this.hackCleanup?.();
    this.hackCleanup = null;
    this.paused = true;
    this.modalType = type;
    this.setPrompt(null);
    const el = document.querySelector("#overlay");
    el.hidden = false;
    el.className = `overlay ${type === "title" ? "title-overlay" : ""}`;
    el.innerHTML = `<section class="panel ${wide ? "wide" : ""}" style="--accent:${WORLDS[this.state.world].accent}">${html}</section>`;
    requestAnimationFrame(() =>
      el
        .querySelector("button:not([disabled])")
        ?.focus({ preventScroll: true }),
    );
  }
  close() {
    this.hackCleanup?.();
    this.hackCleanup = null;
    document.querySelector("#overlay").hidden = true;
    document.querySelector("#overlay").innerHTML = "";
    this.paused = false;
    this.modalType = "";
    this.battle = null;
    this.encounterUntil = performance.now() + 2000;
    this.refresh();
    document.querySelector("#world-canvas").focus();
  }
  bind(id, fn) {
    const el = document.getElementById(id);
    if (el)
      el.onclick = () => {
        click();
        fn();
      };
  }
  closeButton(action = () => this.close()) {
    this.bind("close-modal", action);
  }
  header(label, title) {
    return `<div class="panel-top"><span class="eyebrow">${label}</span><button id="close-modal" class="icon-button" aria-label="Sluiten">${icon("cross")}</button></div><h1 class="panel-title">${title}</h1>`;
  }
  dialogue(
    person,
    lines,
    actionText = "Verder",
    action = () => this.close(),
    portraitId = 5,
  ) {
    this.modal(
      `<div class="dialogue-layout">${portrait(portraitId)}<div><span class="eyebrow">TRANSMISSIE / ${person}</span><h1>${person}</h1>${lines.map((t) => `<p>${t}</p>`).join("")}<div class="dialogue-actions">${button("dialogue-next", actionText)}<span>OMNI-LINK // SECURE</span></div></div></div>`,
    );
    this.bind("dialogue-next", action);
  }
  title() {
    this.modal(
      `<div class="title-art"></div><div class="title-shade"></div><div class="title-content"><div class="title-kicker"><i></i> PROJECT X / EXCALIBUR PROTOTYPE</div><h1>HACK THE<br><em>IMPOSSIBLE.</em></h1><p>Een verloren familie. Een gestolen universum.<br>Eén tool die de realiteit kan herschrijven.</p><div class="title-buttons">${this.state.started ? button("resume", "Hervat je reis " + icon("arrow")) : button("new-game", "Begin je reis " + icon("arrow"))}${this.state.started ? button("new-game", "Nieuwe reis", "ghost") : ""}</div><div class="title-stats"><span><b>03</b> SPEELBARE CHAPTERS</span><span><b>05</b> RANDOM HACKS</span><span><b>01</b> OMNI-TOOL</span></div><div class="title-footer"><span>TOP-DOWN SCI-FI ADVENTURE</span><span>WASD / MUIS / E</span></div></div><div class="title-art-credit">ORIGINELE CONCEPTART · PROJECT X</div>`,
      "title",
      true,
    );
    this.bind("resume", () => (this.state.tool ? this.close() : this.ship()));
    this.bind("new-game", () => {
      if (this.state.started) {
        this.modal(
          `${this.header("NIEUWE REIS", "Opnieuw beginnen?")}<p>Je opgeslagen voortgang op dit apparaat wordt vervangen.</p><div class="button-row">${button("confirm-reset", "Start een nieuwe reis")}${button("cancel-reset", "Behoud mijn voortgang", "ghost")}</div>`,
          "reset",
        );
        this.closeButton(() => this.title());
        this.bind("cancel-reset", () => this.title());
        this.bind("confirm-reset", () => this.newGame());
      } else this.newGame();
    });
  }
  newGame() {
    this.state = freshState();
    this.state.started = true;
    this.save();
    this.engine?.goToScene("neon");
    this.prologue();
  }
  prologue() {
    const scenes = [
      [
        "VÓÓR DE STILTE",
        "Je thuisplaneet was vredig. Tot je oom terugkeerde met een piratenvloot. Hij wilde de zeldzame kernenergie van je familie — en alles wat ermee gemaakt kon worden.",
        0,
      ],
      [
        "DE WAYFARER",
        "Je ouders stuurden je weg in een automatisch vrachtschip. Zij bleven achter. Jarenlang was de boordcomputer je enige gezelschap. Je groeide op tussen onbekende sterren.",
        5,
      ],
      [
        "EEN VERBODEN PROTOTYPE",
        "Als tiener vind je in het vrachtruim de Omni-Tool. Het apparaat kan natuurwetten herschrijven. Voor anderen is de energiestroom dodelijk. Jouw bloed kan hem geleiden.",
        0,
      ],
    ];
    let index = 0;
    const next = () => {
      const [title, text, p] = scenes[index];
      this.modal(
        `<div class="story-split"><div class="story-image"><img src="${import.meta.env.BASE_URL}art/key-art.webp" alt="Jonge reiziger bij zijn schip tussen sci-fi planeten"/>${portrait(p, "story-portrait")}</div><div class="story-copy"><span class="eyebrow">PROLOOG / ${String(index + 1).padStart(2, "0")}</span><h1>${title}</h1><p>${text}</p>${button("story-next", index === 2 ? "Vind de Omni-Tool" : "Volgende " + icon("arrow"))}</div></div>`,
        "story",
        true,
      );
      this.bind("story-next", () => {
        index++;
        if (index < scenes.length) next();
        else this.ship();
      });
    };
    next();
  }
  ship() {
    this.modal(
      `${this.header("JE SCHIP / VEILIGE HUB", "De Wayfarer")}<div class="ship-layout"><div class="ship-visual"><div class="ship-illustration"><span class="ship-wing left"></span><span class="ship-wing right"></span><span class="ship-hull"></span><span class="ship-glass"></span><span class="ship-engine left"></span><span class="ship-engine right"></span></div><span>WF—07 / CARGO EXPLORER</span><div class="ship-status">${this.state.tool ? "OMNI-TOOL VERBONDEN" : "ONBEKEND PROTOTYPE IN VRACHTRUIM"}</div></div><div class="ship-copy"><span class="eyebrow">BOORDCOMPUTER / ARI</span><h2>${this.state.tool ? "Welkom terug, reiziger." : "Er ligt iets op je te wachten."}</h2><p>${this.state.tool ? "Hier ben je veilig. Herstel je signaal, verbeter je hardware en kies je volgende bestemming." : "De kist van je ouders bevat een Omni-Tool. Maak eerst één oefenverbinding. De opdracht wordt willekeurig gekozen; het doel is de tool activeren."}</p><div class="button-stack">${this.state.tool ? button("ship-destinations", "Open bestemmingen " + icon("orbit")) : button("tool-tutorial", "Activeer de Omni-Tool " + icon("tool"))}${this.state.tool ? button("ship-repair", "Gratis herstellen", "ghost") + button("ship-shop", "Stars uitgeven & upgraden", "ghost") : ""}</div><p class="small-note">Bouten verbeteren hardware. Chips versterken hacks.<br>Stars gebruik je om te handelen.</p></div></div>`,
      "ship",
      true,
    );
    this.closeButton(() => (this.state.tool ? this.close() : this.title()));
    this.bind("tool-tutorial", () =>
      this.hack(
        "tool",
        () => {
          this.state.tool = true;
          grant(this.state, { stars: 40, bolts: 4 });
          record(
            this.state,
            "Omni-Tool gevonden en geactiveerd aan boord van de Wayfarer.",
          );
          this.save();
          this.dialogue(
            "ARI",
            [
              "De link is stabiel. Jouw kernenergie beschermt je.",
              "Begin op NEON. Ilo, een robot op de avondmarkt, kent de transporten van het piratenimperium.",
            ],
            "Land op NEON",
            () => this.travel("neon"),
            5,
          );
        },
        () => this.ship(),
      ),
    );
    this.bind("ship-destinations", () => this.destinations());
    this.bind("ship-shop", () => this.shop());
    this.bind("ship-repair", () => {
      this.state.hp = 100;
      this.save();
      this.toast("Vitaal signaal hersteld.");
      this.ship();
    });
  }
  destinations() {
    if (!this.state.tool) {
      this.ship();
      return;
    }
    const available = availableDestinations(this.state);
    this.modal(
      `${this.header("NAVIGATIE / DE WAYFARER", "Een universum aan mogelijkheden.")}<p class="map-description">Kies een bereikbaar chapter. Nieuwe coördinaten komen van de minibosses. De overige bestemmingen tonen de uitbreidingsrichting.</p><div class="star-map"><div class="star-nebula"></div><svg class="map-routes" viewBox="0 0 100 100" preserveAspectRatio="none"><path d="M23 39 Q35 78 61 68 T80 25"/><circle cx="23" cy="39" r="2"/><circle cx="61" cy="68" r="2"/><circle cx="80" cy="25" r="2"/></svg>${DESTINATIONS.map((d) => `<button class="destination ${d.planned ? "planned" : available.includes(d.id) ? "available" : "locked"} ${d.name.includes("STATION") ? "station" : ""}" data-destination="${d.id || ""}" style="left:${d.x}%;top:${d.y}%;--planet-color:${d.color}" ${!available.includes(d.id) ? "disabled" : ""}><span class="planet-disc"></span><strong>${d.name}</strong><small>${d.planned ? "CONCEPT" : available.includes(d.id) ? d.type : "COÖRDINATEN ONBEKEND"}</small></button>`).join("")}<span class="map-ship-label">${icon("ship")} WAYFARER // ONLINE</span></div><div class="map-legend"><span><i class="available-key"></i> SPEELBAAR</span><span><i></i> NOG VERGRENDELD</span><span>12 BESTEMMINGEN / INCLUSIEF 1 STATION</span></div>`,
      "map",
      true,
    );
    this.closeButton();
    document
      .querySelectorAll("[data-destination]:not([disabled])")
      .forEach((b) => (b.onclick = () => this.travel(b.dataset.destination)));
  }
  async travel(id) {
    if (!availableDestinations(this.state).includes(id)) return;
    this.state.world = id;
    this.state.hp = 100;
    this.save();
    this.modal(
      `<div class="landing-transmission">${icon("ship")}<span class="eyebrow">AUTOPILOT / WF—07</span><h1>Nadering ${WORLDS[id].name}</h1><div class="landing-line"></div><p>Landingsbaken bevestigd. Omni-Link gereed.</p></div>`,
      "travel",
    );
    try {
      await this.engine.goToScene(id);
      const scene = this.engine.currentScene;
      scene.player.pos.x = WORLDS[id].spawn[0];
      scene.player.pos.y = WORLDS[id].spawn[1];
    } catch (e) {
      this.toast("Deze bestemming kon niet worden geladen.");
      console.error(e);
      this.destinations();
      return;
    }
    setTimeout(() => {
      const flag = `visited_${id}`;
      if (!this.state.flags[flag]) {
        this.state.flags[flag] = true;
        this.save();
        this.dialogue(
          WORLDS[id].name,
          [
            WORLDS[id].intro,
            "Loop met WASD of klik op de grond. Druk bij een personage of object op E. Het gele punt op de scanner toont je volgende doel.",
          ],
          "Verken de planeet",
          () => this.close(),
          WORLDS[id].portrait,
        );
      } else this.close();
    }, 650);
  }
  journal() {
    this.modal(
      `${this.header("MISSIES / INVENTARIS", "Reislogboek")}<div class="journal-columns"><div><span class="eyebrow">CAMPAIGN</span>${Object.values(
        WORLDS,
      )
        .map(
          (w) =>
            `<div class="journal-mission ${w.id === this.state.world ? "current" : ""}"><span>${w.chapter}</span><div><h3>${w.name} — ${w.subtitle}</h3><p>${availableDestinations(this.state).includes(w.id) ? missionFor(this.state, w.id) : "Vind de coördinaten in het vorige chapter."}</p></div></div>`,
        )
        .join(
          "",
        )}<div class="journal-mission"><span>+</span><div><h3>Echo's van het verleden</h3><p>Optionele grote quest: ontgrendel de geheime archieven op alle drie de planeten. ${this.state.collected.filter((id) => id.endsWith("-secret")).length} / 3 gevonden.</p></div></div></div><div><span class="eyebrow">RECENTE ONTDEKKINGEN</span><ul class="log-list">${this.state.log.length ? this.state.log.map((l) => `<li>${l}</li>`).join("") : "<li>Je reis begint aan boord van de Wayfarer.</li>"}</ul><div class="inventory-strip"><span><b>${this.state.stars}</b> STARS</span><span><b>${this.state.bolts}</b> BOUTEN</span><span><b>${this.state.chips}</b> CHIPS</span></div></div></div>`,
      "journal",
      true,
    );
    this.closeButton();
  }
  shop() {
    this.modal(
      `${this.header("HANDEL / UPGRADES", "Geef je reis meer mogelijkheden.")}<p>Je hebt <strong>${this.state.stars} Stars</strong> en <strong>${this.state.bolts} bouten</strong>. Elke verbetering blijft behouden na het reizen.</p><div class="shop-grid"><article>${icon("tool")}<h2>Softwarechip</h2><p>+5 schade per geslaagde battle-hack.<br>Maximaal 3 actieve verbeteringen.</p>${button("buy-chip", this.state.chips >= 3 ? "Volledig geüpgraded" : "Koop · 60 Stars")}</article><article>${icon("bolt")}<h2>Hardware recyclen</h2><p>Verkoop 3 bouten als waardevolle vondst. Je ontvangt 20 Stars.</p>${button("sell-bolts", "Verkoop · 3 bouten", "ghost")}</article><article>${icon("bolt")}<h2>Omni-hardware</h2><p>+15 loopsnelheid en snellere dash-reset. Maximaal 2 hardwareverbeteringen.</p>${button("buy-hardware", this.state.flags.hardwareUpgrade >= 2 ? "Hardware compleet" : "Upgrade · 8 bouten", "ghost")}</article><article>${icon("ship")}<h2>Reparatiepakket</h2><p>Herstel je vitaal signaal naar 100. Op je schip kan dit ook gratis.</p>${button("buy-heal", "Herstel · 15 Stars", "ghost")}</article></div>`,
      "shop",
      true,
    );
    this.closeButton();
    this.bind("buy-chip", () => {
      if (this.state.chips >= 3) {
        this.toast("Alle drie software-slots zijn al actief.");
        return;
      }
      if (!purchase(this.state, 60, (s) => s.chips++)) {
        this.toast("Je hebt meer Stars nodig.");
        return;
      }
      this.save();
      this.toast("Chip geïnstalleerd. +5 hackschade.");
      this.shop();
    });
    this.bind("buy-hardware", () => {
      if ((this.state.flags.hardwareUpgrade || 0) >= 2) {
        this.toast("De hardware is volledig geüpgraded.");
        return;
      }
      if (this.state.bolts < 8) {
        this.toast("Je hebt 8 bouten nodig.");
        return;
      }
      this.state.bolts -= 8;
      this.state.flags.hardwareUpgrade =
        (this.state.flags.hardwareUpgrade || 0) + 1;
      this.save();
      this.toast("Hardware verbeterd. Je beweegt sneller.");
      this.shop();
    });
    this.bind("sell-bolts", () => {
      if (this.state.bolts < 3) {
        this.toast("Je hebt minstens 3 bouten nodig.");
        return;
      }
      this.state.bolts -= 3;
      this.state.stars += 20;
      this.save();
      this.toast("3 bouten verkocht voor 20 Stars.");
      this.shop();
    });
    this.bind("buy-heal", () => {
      if (!purchase(this.state, 15, (s) => (s.hp = 100))) {
        this.toast("Je hebt meer Stars nodig.");
        return;
      }
      this.save();
      this.toast("Vitaal signaal hersteld.");
      this.shop();
    });
  }
  interact(obj) {
    if (
      this.paused ||
      this.state.collected.includes(obj.id) ||
      this.state.defeated.includes(obj.id)
    )
      return;
    if (obj.type === "ship") {
      this.ship();
      return;
    }
    if (!this.state.tool) {
      this.ship();
      return;
    }
    if (obj.type === "npc") {
      this.npc(obj);
      return;
    }
    if (obj.type === "loot") {
      this.state.collected.push(obj.id);
      grant(this.state, { stars: 8 + Math.floor(Math.random() * 9) });
      this.save();
      this.toast("Stars gevonden.");
      success();
      return;
    }
    if (obj.type === "chest") {
      this.state.collected.push(obj.id);
      grant(this.state, { stars: 25, bolts: 3 });
      record(
        this.state,
        `${obj.name} ontdekt op ${WORLDS[this.state.world].name}.`,
      );
      this.save();
      this.toast("Vracht gevonden: +25 Stars · +3 bouten.");
      success();
      return;
    }
    if (obj.type === "secret") {
      this.hack("secret", () => {
        this.state.collected.push(obj.id);
        grant(this.state, { stars: 35, bolts: 2 });
        record(
          this.state,
          `Geheim archief op ${WORLDS[this.state.world].name} ontgrendeld.`,
        );
        const total = this.state.collected.filter((x) =>
          x.endsWith("-secret"),
        ).length;
        if (total === 3) {
          grant(this.state, {
            stars: 100,
            chips: this.state.chips < 3 ? 1 : 0,
          });
          record(
            this.state,
            "Grote quest voltooid: Echo’s van het verleden. Je ouders bouwden de Omni-Tool om werelden te helpen.",
          );
        }
        this.save();
        this.dialogue(
          "ARCHIEF",
          [
            {
              neon: "De vracht kwam van je thuisplaneet. Je ouders werden levend naar de Citadel vervoerd.",
              kage: "De Omni-Tool werd ontworpen voor herstel. Het apparaat neemt de intentie van zijn gebruiker over.",
              citadel:
                "De piratenkapitein stal de kernenergie van zijn eigen familie. De laatste log noemt de Wayfarer als reddingsschip.",
            }[this.state.world],
            total === 3
              ? "Alle archieven gevonden. +100 Stars en een chip indien er een slot vrij is."
              : "Je ontvangt 35 Stars en 2 bouten.",
          ],
          "Bewaar de gegevens",
        );
      });
      return;
    }
    if (obj.type === "terminal") {
      this.terminal(obj);
      return;
    }
    if (obj.type === "boss") {
      const f = this.state.flags;
      if (obj.id === "neon-boss" && !f.neonRelay) {
        this.toast("K-9 is afgeschermd. Hack eerst het energierelais.");
        return;
      }
      if (obj.id === "kage-boss" && !f.kageChoice) {
        this.toast("Maak eerst verbinding met het zwaartekrachtanker.");
        return;
      }
      if (obj.id === "citadel-boss" && !f.citadelCore) {
        this.toast("De gevangenisbeveiliging houdt de toegang gesloten.");
        return;
      }
    }
    if (obj.type === "enemy" || obj.type === "boss") this.startBattle(obj);
  }
  npc(obj) {
    if (obj.id === "ilo")
      this.dialogue(
        "Ilo",
        [
          "Een transportmanifest? Natuurlijk heb ik dat gezien. Maar K-9 bewaakt de haven.",
          "Help mij eerst: hack het energierelais in het noordoosten. Dan valt zijn schild uit en kunnen we zien waar de gevangenen heen gingen.",
        ],
        this.state.flags.neonTalk ? "Bekijk de handel" : "Ik help je",
        () => {
          if (!this.state.flags.neonTalk) {
            this.state.flags.neonTalk = true;
            record(this.state, "Ilo vraagt hulp bij het energierelais.");
            this.save();
            this.close();
          } else this.shop();
        },
        1,
      );
    if (obj.id === "ren")
      this.dialogue(
        "Meester Ren",
        [
          "Het anker houdt onze eilanden in evenwicht. Vane gebruikt diezelfde kracht om ons vast te zetten.",
          "Herstel het systeem als je kunt. Een overwinning die ons thuis vernietigt, is geen bevrijding.",
        ],
        "Ik onderzoek het anker",
        () => {
          this.state.flags.kageTalk = true;
          record(
            this.state,
            "Ren vraagt om het zwaartekrachtanker te herstellen.",
          );
          this.save();
          this.close();
        },
        2,
      );
    if (obj.id === "kaito")
      this.dialogue(
        "Kaito",
        [
          "Elke dag dat Vane hier blijft, verliezen we mensen. Overbelast het anker. Schakel hun hele netwerk uit.",
          "Ren beschermt het verleden. Ik wil dat we morgen nog leven. Maar ja… de zweefrotsen kunnen vallen.",
        ],
        "Ik zal mijn keuze maken",
        () => {
          record(this.state, "Kaito stelt voor het anker te overbelasten.");
          this.save();
          this.close();
        },
        4,
      );
  }
  terminal(obj) {
    const key = {
      "neon-relay": "neonRelay",
      "kage-anchor": "kageAnchor",
      "citadel-core": "citadelCore",
    }[obj.id];
    if (obj.id === "neon-relay" && !this.state.flags.neonTalk) {
      this.toast("Vraag Ilo eerst naar de piratenroute.");
      return;
    }
    if (obj.id === "kage-anchor" && !this.state.flags.kageTalk) {
      this.toast("Spreek eerst Meester Ren over het anker.");
      return;
    }
    if (this.state.flags[key]) {
      if (obj.id === "kage-anchor" && !this.state.flags.kageChoice)
        this.anchorChoice();
      else this.toast("Dit systeem is al gehackt.");
      return;
    }
    this.hack("world", () => {
      this.state.flags[key] = true;
      grant(this.state, { stars: 20, bolts: 2 });
      record(this.state, `${obj.name} met de Omni-Tool gehackt.`);
      this.save();
      if (obj.id === "kage-anchor") this.anchorChoice();
      else
        this.dialogue(
          "OMNI-TOOL",
          [
            obj.id === "neon-relay"
              ? "De stroom is omgeleid. K-9 verliest zijn externe schild. De route naar het transportmanifest is open."
              : "De celbeveiliging valt uit. Je ouders zijn dichtbij. De kapitein wacht bij de kern.",
            "+20 Stars · +2 bouten.",
          ],
          "Verbinding sluiten",
        );
    });
  }
  anchorChoice() {
    this.modal(
      `<span class="eyebrow">KAGE / VERHAALKEUZE</span><h1 class="panel-title">Vrijheid heeft een prijs.</h1><p>Het anker is toegankelijk. Jij beslist wat de Omni-Tool ermee doet.</p><div class="choice-grid"><button id="restore-anchor">${portrait(2)}<span><strong>HERSTEL HET ANKER</strong><small>Bewaar het evenwicht. De eilanden blijven veilig, maar Vane behoudt zijn volledige pantser.</small></span></button><button id="overload-anchor">${portrait(4)}<span><strong>OVERBELAST HET ANKER</strong><small>Breek het piratennetwerk. Vane verliest 40 HP, maar een deel van het landschap stort in.</small></span></button></div>`,
      "choice",
      true,
    );
    for (const [id, value] of [
      ["restore-anchor", "restore"],
      ["overload-anchor", "overload"],
    ])
      this.bind(id, () => {
        this.state.flags.kageChoice = value;
        record(
          this.state,
          value === "restore"
            ? "Het anker hersteld. KAGE behoudt zijn evenwicht."
            : "Het anker overbelast. De piraten verzwakken, maar zweefrotsen vallen.",
        );
        this.save();
        this.dialogue(
          value === "restore" ? "Meester Ren" : "Kaito",
          [
            value === "restore"
              ? "Je hebt onze wereld behouden. Laat Vane zien dat zorg ook kracht kan zijn."
              : "Het netwerk is gebroken. Maar kijk naar de horizon… Dit zullen ze zich herinneren.",
          ],
          "Zoek Vane",
          () => this.close(),
          value === "restore" ? 2 : 4,
        );
      });
  }
  hack(context, onSuccess, onBack = () => this.close()) {
    const type = pickHack(this.state, MINIGAMES),
      w = this.state.world;
    this.modal(
      `<div class="panel-top"><span class="eyebrow">OMNI-LINK / ${WORLDS[w].name} / ${context === "tool" ? "OEFENVERBINDING" : context === "secret" ? "ARCHIEF" : "WERELDINTERACTIE"}</span><button id="close-modal" class="icon-button" aria-label="Hack afbreken">${icon("cross")}</button></div><div class="hack-theme-label">${w === "kage" ? "ANKERPROTOCOL / KAGE" : w === "citadel" ? "IMPERIAL ENCRYPTION" : "NEON DATA NETWORK"}</div><div id="hack-body"></div>`,
      "hack",
    );
    this.closeButton(onBack);
    this.hackCleanup = mountHack(type, w, Number(WORLDS[w].chapter), (ok) => {
      this.hackCleanup = null;
      if (ok) {
        this.state.hacks++;
        this.save();
        setTimeout(onSuccess, 400);
      } else
        setTimeout(() => {
          this.modal(
            `<span class="eyebrow">OMNI-LINK / VERBROKEN</span><h1 class="panel-title">Het systeem weigert toegang.</h1><p>Je kunt opnieuw verbinden. De volgende opdracht wordt weer willekeurig gekozen.</p><div class="button-row">${button("retry-hack", "Nieuwe verbinding")}${button("leave-hack", "Terug", "ghost")}</div>`,
            "hack-result",
          );
          this.bind("retry-hack", () => this.hack(context, onSuccess, onBack));
          this.bind("leave-hack", onBack);
        }, 400);
    });
  }
  startBattle(obj) {
    this.battle = {
      ...obj,
      currentHp:
        obj.hp -
        (obj.id === "kage-boss" && this.state.flags.kageChoice === "overload"
          ? 40
          : 0),
      maxHp: obj.hp,
      attempts: 0,
      turn: 1,
    };
    this.battleReady();
  }
  battleMarkup(inner) {
    const b = this.battle,
      w = WORLDS[this.state.world];
    return `<div class="battle-top"><span class="eyebrow">ENCOUNTER / CHAPTER ${w.chapter}</span><span class="battle-round">LINK ${String(b.turn).padStart(2, "0")}</span></div><div class="battle-grid"><aside class="opponent">${b.id === "citadel-boss" ? portrait(3, "boss-portrait") : mech(w.id)}<span class="eyebrow">${b.type === "boss" ? "BOSS SIGNAL" : "VIJANDELIJK SIGNAAL"}</span><h2>${b.name}</h2><div class="enemy-meter"><i style="width:${(b.currentHp / b.maxHp) * 100}%"></i></div><div class="enemy-stats"><span>${Math.max(0, b.currentHp)} / ${b.maxHp} HP</span><span>${w.name}</span></div><div class="battle-self">${portrait(0)}<span>JOUW SIGNAAL<b>${this.state.hp} / 100</b></span></div><p class="small-note">Elke geslaagde hack doet ${damageFor(this.state)} damage. Een mislukte link geeft de vijand een tegenaanval.</p></aside><section class="battle-task">${inner}</section></div>`;
  }
  battleReady(
    message = "De Omni-Tool zoekt een ingang in het vijandelijke systeem.",
  ) {
    const b = this.battle;
    if (!b) return;
    this.modal(
      this.battleMarkup(
        `<div class="battle-ready"><div class="ready-symbol">${icon("tool")}</div><span class="eyebrow">APARTE HACKARENA</span><h1>Herschrijf zijn realiteit.</h1><p>${message}</p><div class="hack-types"><span>TIMING</span><span>GEHEUGEN</span><span>LOGICA</span></div>${button("battle-hack", "Maak een hackverbinding " + icon("arrow"))}${button("battle-flee", "Trek je terug", "ghost")}<p class="small-note">De opdracht is willekeurig. Je kiest de hack niet zelf.</p></div>`,
      ),
      "battle",
      true,
    );
    this.bind("battle-hack", () => this.battleHack());
    this.bind("battle-flee", () => {
      this.close();
      this.toast("Je trekt je terug. Herstel gratis op je schip.");
    });
  }
  battleHack() {
    const type = pickHack(this.state, MINIGAMES),
      b = this.battle;
    if (!b) return;
    b.attempts++;
    this.modal(
      this.battleMarkup(
        `<div class="hack-theme-label">${this.state.world === "kage" ? "ZWAARDPROTOCOL / KAGE" : "OMNI-TOOL / REALITY OVERRIDE"}</div><div id="hack-body"></div>`,
      ),
      "battle-hack",
      true,
    );
    this.hackCleanup = mountHack(
      type,
      this.state.world,
      Number(WORLDS[this.state.world].chapter),
      (ok) => {
        this.hackCleanup = null;
        let message;
        if (ok) {
          const damage = damageFor(this.state);
          b.currentHp -= damage;
          this.state.hacks++;
          message = `Hack geslaagd. ${damage} damage — ${["zijn energiecel raakt overbelast.", "de zwaartekracht slaat door zijn pantser.", "zijn motoren worden tegen hem gekeerd."][Math.floor(Math.random() * 3)]}`;
        } else {
          this.state.hp = Math.max(0, this.state.hp - b.damage);
          message = `Link verbroken. ${b.name.split(" · ")[0]} countert: −${b.damage} vitaal signaal.`;
        }
        b.turn++;
        this.save();
        setTimeout(() => {
          if (b.currentHp <= 0) this.battleWin();
          else if (this.state.hp <= 0) this.battleLost();
          else this.battleReady(message);
        }, 450);
      },
    );
  }
  battleLost() {
    const name = this.battle.name;
    this.modal(
      `<span class="eyebrow">NOODPROTOCOL / ARI</span><h1 class="panel-title">Signaal verloren. Jij leeft.</h1><p>${name} heeft de verbinding gebroken. ARI haalt je terug naar de Wayfarer. Je verzamelde loot en voltooide missies blijven behouden.</p>${button("respawn", "Terug naar je schip")}`,
      "defeat",
    );
    this.bind("respawn", () => {
      this.state.hp = 100;
      this.save();
      this.battle = null;
      this.engine.currentScene.player.pos.x = 270;
      this.engine.currentScene.player.pos.y = 790;
      this.ship();
    });
  }
  battleWin() {
    const b = this.battle;
    if (this.state.defeated.includes(b.id)) {
      this.close();
      return;
    }
    this.state.defeated.push(b.id);
    const boss = b.type === "boss";
    grant(this.state, {
      stars: boss ? 60 : 18,
      bolts: boss ? 5 : 2,
      chips: boss && this.state.chips < 3 ? 1 : 0,
    });
    if (b.id === "neon-boss") {
      this.state.flags.neonBoss = true;
      record(this.state, "K-9 verslagen. Het manifest wijst naar KAGE.");
    }
    if (b.id === "kage-boss") {
      this.state.flags.kageBoss = true;
      record(
        this.state,
        "Vane verslagen. Coördinaten van de Citadel gevonden.",
      );
    }
    if (b.id === "citadel-boss") {
      this.state.flags.finalBoss = true;
      record(this.state, "De piratenkapitein verslagen. Je ouders zijn vrij.");
    }
    this.save();
    success();
    this.modal(
      `<div class="victory"><div class="victory-mark">${icon("check")}</div><span class="eyebrow">VIJANDELIJK SIGNAAL / OFFLINE</span><h1>${boss ? "Systeem overwonnen." : "Link voltooid."}</h1><p>${b.id === "neon-boss" ? "Het transportmanifest bevat coördinaten voor KAGE." : b.id === "kage-boss" ? "Vane’s navigatiekern onthult de Citadel." : b.id === "citadel-boss" ? "Het Mech-Tech Armour valt uiteen. De deur naar je ouders gaat open." : "De drone is uitgeschakeld. Je ontvangt de achtergebleven hardware."}</p><div class="loot-summary"><span>${icon("star")} +${boss ? 60 : 18} STARS</span><span>${icon("bolt")} +${boss ? 5 : 2} BOUTEN</span>${boss ? "<span>SOFTWARE GEÜPDATET</span>" : ""}</div>${button("win-continue", b.id === "citadel-boss" ? "Vind je ouders" : "Ga verder " + icon("arrow"))}</div>`,
      "victory",
    );
    this.bind("win-continue", () =>
      b.id === "citadel-boss" ? this.ending() : this.close(),
    );
  }
  ending() {
    const ruthless = this.state.flags.kageChoice === "overload";
    let i = 0;
    const scenes = [
      [
        "DE DEUR GAAT OPEN",
        ruthless
          ? "Je ouders omhelzen je, maar herkennen de blik in je ogen niet. Op KAGE offerde je een landschap op om sneller bij hen te komen. Je oom is dood. De afstand tussen jullie is gebleven."
          : "Je ouders omhelzen je. Ze horen hoe je KAGE herstelde en mensen hielp. Maar de strijd heeft je veranderd. Ze zijn gered; de jaren die jullie verloren kwamen niet terug.",
      ],
      [
        "EEN NIEUW PAD",
        "Je neemt afscheid en kiest je eigen bestemming. ARI zet koers naar een warme, afgelegen planeet. Je hebt je familie gevonden. Nu moet je jezelf terugvinden.",
      ],
      [
        "BITTERZOETE VREDE",
        "Onder een buitenaardse zon zit je met een kokosnoot op het strand. De Omni-Tool ligt naast je. Voor het eerst hoeft hij niets te veranderen.",
      ],
    ];
    const next = () => {
      const [title, text] = scenes[i];
      this.modal(
        `<div class="ending-card ${i === 2 ? "beach" : ""}"><div class="ending-stars"></div><span class="eyebrow">EPILOOG / ${i + 1} VAN 3</span><h1>${title}</h1><p>${text}</p>${i === 2 ? '<div class="beach-scene"><span class="beach-sun"></span><span class="beach-person"></span><span class="coconut">◒</span></div>' : ""}${button("ending-next", i === 2 ? "Blijf het universum verkennen" : "Verder " + icon("arrow"))}${i === 2 ? '<span class="ending-credit">PROJECT X · TREV, SISSI & TEAM<br>EXCALIBUR PROOF OF CONCEPT</span>' : ""}</div>`,
        "ending",
        true,
      );
      this.bind("ending-next", () => {
        i++;
        if (i < scenes.length) next();
        else {
          this.state.flags.campaignDone = true;
          this.save();
          this.battle = null;
          this.dialogue(
            "ARI",
            [
              "De campaign is voltooid. Je kunt alle drie de planeten opnieuw bezoeken.",
              "Er zijn nog vrachtkisten, vijanden en verborgen archieven. Vind alle drie de archieven voor de grote quest: Echo’s van het verleden.",
            ],
            "Open bestemmingen",
            () => this.destinations(),
            5,
          );
        }
      });
    };
    next();
  }
  help() {
    this.modal(
      `${this.header("BEDIENING", "Maak je eerste Omni-Link.")}<div class="help-grid"><div><kbd>WASD / PIJLEN</kbd><p>Bewegen. Je kunt ook op de grond klikken.</p><kbd>E / KLIK OP OBJECT</kbd><p>Interactie als je dichtbij bent.</p><kbd>SPATIE</kbd><p>Dash tijdens verkenning. Timingactie tijdens een reactiebalk.</p></div><div><kbd>M</kbd><p>Bestemmingen. Nieuwe chapters ontgrendelen via minibosses.</p><kbd>J</kbd><p>Missies, ontdekkingen en inventaris.</p><kbd>ESC</kbd><p>Menu sluiten of de bediening openen.</p></div></div><p class="small-note">5 willekeurige hacks. Elke opdracht kan schade doen of een wereldobject openen. De presentatie volgt het thema van je planeet. Voortgang wordt lokaal in je browser bewaard.</p>`,
      "help",
    );
    this.closeButton();
  }
}

document.body.appendChild(document.querySelector("#toast"));
const project = new ProjectX();
project.refresh();
for (const [id, action] of [
  ["nav-map", "destinations"],
  ["nav-journal", "journal"],
  ["mission-journal", "journal"],
  ["nav-ship", "ship"],
  ["help-button", "help"],
])
  project.bind(id, () => {
    if (!project.paused) project[action]();
  });
project.bind("nav-sound", () => {
  project.soundOn = !project.soundOn;
  setAudio(project.soundOn);
  document
    .querySelector("#nav-sound")
    .setAttribute("aria-pressed", String(project.soundOn));
  project.toast(project.soundOn ? "Geluid aan." : "Geluid uit.");
});
document.querySelector(".brand-mark").onclick = (e) => {
  e.preventDefault();
  if (!project.paused) project.title();
};
window.addEventListener("keydown", (e) => {
  if (e.repeat) return;
  if (e.code === "Space" && e.target.tagName !== "BUTTON") e.preventDefault();
  if (project.paused) {
    if (
      e.code === "Escape" &&
      ["map", "journal", "shop", "help", "ship"].includes(project.modalType) &&
      project.state.tool
    )
      project.close();
    return;
  }
  if (e.code === "KeyM") project.destinations();
  if (e.code === "KeyJ") project.journal();
  if (e.code === "Escape") project.help();
});
try {
  await createEngine(project);
  document.querySelector("#loading").hidden = true;
  project.title();
} catch (error) {
  console.error(error);
  document.querySelector("#loading").innerHTML =
    "<strong>De engine kon niet starten.</strong><br>Ververs de pagina in een browser met WebGL-ondersteuning.";
}
if (new URLSearchParams(location.search).get("debug") === "1")
  window.__PROJECTX__ = project;
