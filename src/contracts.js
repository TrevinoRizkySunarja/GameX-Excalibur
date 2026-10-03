import { SIDE_QUESTS } from "./levels.js";
const repair = (target, label) => ({ kind: "hack", target, label });
const defeat = (target, label) => ({ kind: "defeat", target, label });
const found = (target, label) => ({ kind: "collect", target, label });
export const QUESTS = {
  ...Object.fromEntries(
    Object.entries(SIDE_QUESTS).map(([id, q]) => [
      id,
      {
        ...q,
        id,
        world: id.split("-")[0],
        giver: {
          "neon-repair": "neon-mira",
          "neon-garden": "neon-aya",
          "kage-water": "kage-hana",
          "citadel-cells": "citadel-dr-vale",
        }[id],
        goals: [repair(id, q.description.split(" en ")[0])],
        story: {
          "neon-repair":
            "De piraten hebben Mira’s scheepsonderdelen in beslag genomen. Ze houdt de buurt draaiende met tweedehands zekeringen.",
          "neon-garden":
            "Aya kweekt de planten die vervuild kanaalwater zuiveren. De bezetters noemen haar tuin verspilde ruimte.",
          "kage-water":
            "Hana bewaart de laatste zaden van haar familie. Zonder water gaat er meer verloren dan een tuin.",
          "citadel-cells":
            "Vale werkte ooit aan de gevangenenmonitoren. Nu riskeert hij zijn leven om dezelfde mensen te bevrijden.",
        }[id],
        ending: {
          "neon-repair":
            "Mira zet de brug weer op volle kracht. Voor het eerst vandaag vertrekt een burgerscheepje.",
          "neon-garden":
            "De irrigatie ontwaakt. Aya geeft de jonge planten namen van verdwenen bewoners.",
          "kage-water":
            "Het water keert terug. Hana hangt een lantaarn op voor de reizigers die niet thuiskwamen.",
          "citadel-cells":
            "De medische deur is open. Vale vindt genoeg voorraden om de eerste gewonden te helpen.",
        }[id],
      },
    ]),
  ),
  "neon-blackout": {
    id: "neon-blackout",
    world: "neon",
    giver: "neon-mira",
    npc: "Mira",
    name: "De nacht blijft van ons",
    requires: "neon-repair",
    reward: 65,
    chip: "overclock",
    story:
      "De brug werkt, maar de kapitein heeft een tweede stroomslot geplaatst. Mira kan de hele wijk weer aanzetten als jij twee verdeelpunten bevrijdt.",
    ending:
      "De lampen blijven branden. Mira herkent in jouw tool de handtekening van je ouders: techniek die mensen helpt.",
    goals: [
      repair("neon-grid-north", "Herstel de noordelijke stroomverdeler"),
      repair("neon-grid-south", "Herstel de tuinverdeler"),
    ],
  },
  "neon-letter": {
    id: "neon-letter",
    world: "neon",
    giver: "neon-nori",
    npc: "Nori",
    name: "Een brief zonder ontvanger",
    reward: 50,
    chip: "flow",
    story:
      "Nori bezorgt al weken een verzegeld bericht. De ontvanger staat op een gevangenenlijst. Het pakket is door een piratenscanner opgesloten.",
    ending:
      "In de brief staat: “Als de Wayfarer terugkomt, vertel ons kind dat we bleven hopen.” Nori legt haar hand op je schouder. Je bent het spoor niet kwijt.",
    goals: [repair("neon-postbox", "Bevrijd het onderschepte postpakket")],
  },
  "neon-memory": {
    id: "neon-memory",
    world: "neon",
    giver: "neon-juno",
    npc: "Juno",
    name: "Wat de stad onthoudt",
    reward: 55,
    chip: "buffer",
    story:
      "Juno verzamelt wat de bezetters wissen. Het vergeten archief in de bloesemwijk bevat de eerste transportorders van je thuisplaneet.",
    ending:
      "De orders dragen de naam van je oom. Dit was geen losse piratenaanval; je familie was het doelwit.",
    goals: [found("neon-secret", "Open het verborgen stadsarchief")],
  },
  "kage-bells": {
    id: "kage-bells",
    world: "kage",
    giver: "kage-hana",
    npc: "Hana",
    name: "Twee klokken voor morgen",
    requires: "kage-water",
    reward: 70,
    chip: "harmony",
    story:
      "De tempelklokken houden de losse rotseilanden in hetzelfde ritme. Vane heeft hun signalen vervalst. Hana wil dat je beide klokken herstemt.",
    ending:
      "De klokken vinden elkaar terug. Hana vraagt je de kracht van de Omni-Tool te gebruiken om iets achter te laten dat blijft.",
    goals: [
      repair("kage-bell-west", "Herstel de westelijke resonantieklok"),
      repair("kage-bell-east", "Herstel de oostelijke resonantieklok"),
    ],
  },
  "kage-caravan": {
    id: "kage-caravan",
    world: "kage",
    giver: "kage-taro",
    npc: "Taro",
    name: "De laatste lantaarnkaravaan",
    reward: 60,
    chip: "scavenger",
    story:
      "Taro’s medicijnen bereiken het dorp niet. Een Ronin-drone bewaakt de tempelroute; een verloren voorraadkist ligt bij het bamboepad.",
    ending:
      "De route is weer veilig. Taro besluit terug te keren met medicijnen in plaats van weg te vliegen met zijn winst.",
    goals: [
      defeat("kage-drone-2", "Versla de Ronin-drone"),
      found("kage-cache-2", "Haal de verloren reizigerskist op"),
    ],
  },
  "kage-oath": {
    id: "kage-oath",
    world: "kage",
    giver: "kage-zen",
    npc: "Zen",
    name: "Een eed zonder meester",
    reward: 80,
    chip: "aegis",
    story:
      "Zen hield ooit Vane’s toegangspoort dicht. Hij wil zijn eed nu aan de bewoners teruggeven. Versla Vane, maar vergeet niet voor wie je vecht.",
    ending:
      "Zen legt zijn pirateninsigne neer. “Een wereld heeft beschermers nodig. Geen nieuwe kapitein.”",
    goals: [defeat("kage-boss", "Bevrijd Kage van Vane")],
  },
  "citadel-beacon": {
    id: "citadel-beacon",
    world: "citadel",
    giver: "citadel-sera",
    npc: "Sera",
    name: "Een stem buiten de muren",
    reward: 75,
    chip: "lifeline",
    story:
      "Sera zat naast je ouders opgesloten. De evacuatiefrequentie is het enige signaal dat nog door de blokkade kan. Herstel haar twee noodbakens.",
    ending:
      "Een zwak antwoord komt door: burgerpiloten zijn onderweg. Sera zegt dat je ouders nooit over wraak spraken. Alleen over jouw terugkeer.",
    goals: [
      repair("citadel-beacon-west", "Activeer het baken bij de cellen"),
      repair("citadel-beacon-east", "Activeer het baken bij het archief"),
    ],
  },
  "citadel-voice": {
    id: "citadel-voice",
    world: "citadel",
    giver: "citadel-echo",
    npc: "ECHO",
    name: "Een robot kiest zelf",
    reward: 85,
    chip: "paradox",
    story:
      "ECHO bewaart twee verboden geheugenkernen. Samen bewijzen ze dat zijn bevelen om burgers op te sluiten veranderd kunnen worden. Hij durft ze zelf niet te openen.",
    ending:
      "ECHO vervangt “gehoorzaam” door “bescherm”. Zijn eerste eigen besluit is om de route voor de vluchtelingen te bewaken.",
    goals: [
      repair("citadel-memory-a", "Ontsleutel de eerste geheugenkern"),
      repair("citadel-memory-b", "Ontsleutel de tweede geheugenkern"),
    ],
  },
  "citadel-relief": {
    id: "citadel-relief",
    world: "citadel",
    giver: "citadel-dr-vale",
    npc: "Dr. Vale",
    name: "De rekening van het imperium",
    requires: "citadel-cells",
    reward: 90,
    chip: "aegis",
    story:
      "De medische deur staat open, maar twee scan-units blijven nieuwe patiënten onderscheppen. Vale vraagt je de aanvoerroute vrij te maken.",
    ending:
      "De eerste gewonden bereiken de noodpost. Vale blijft. Iemand moet herstellen wat dit imperium heeft achtergelaten.",
    goals: [
      defeat("citadel-drone-2", "Versla de magazijnwacht"),
      defeat("citadel-drone-3", "Versla de keizerlijke scan-unit"),
    ],
  },
};
export function goalDone(state, g) {
  return g.kind === "hack"
    ? !!state.flags["solved_" + g.target]
    : g.kind === "defeat"
      ? state.defeated.includes(g.target)
      : state.collected.includes(g.target);
}
export function questReady(state, q) {
  return q.goals.every((g) => goalDone(state, g));
}
export function questsFor(state, npc) {
  return Object.values(QUESTS).filter(
    (q) =>
      q.giver === npc && (!q.requires || state.flags["claimed_" + q.requires]),
  );
}
export function trackedTarget(state) {
  const q = QUESTS[state.flags.trackedQuest];
  if (!q || state.flags["claimed_" + q.id]) return null;
  return questReady(state, q)
    ? q.giver
    : q.goals.find((g) => !goalDone(state, g))?.target;
}
