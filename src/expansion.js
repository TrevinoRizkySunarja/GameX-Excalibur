// New districts extend the existing geometry. Old object IDs and coordinates
// stay valid, so a saved campaign can continue into the expansion.
const obj = (id, type, x, y, name, extra = {}) => ({
  id, type, x: x * 2, y: y * 2, name,
  hint: `${type === "npc" ? "Spreek" : type === "dungeon" ? "Betreed" : type === "boss" ? "Confronteer" : type === "relic" ? "Onderzoek" : "Hack"} ${name}`,
  ...extra,
});
const gang = (id, x, y, name, form, hp = 60) => obj(id, "enemy", x, y, name, {
  gangName: name, form, hp, damage: 14,
  members: [
    { name: `${name} · kern`, role: "KERNDRAGER", hp, damage: 14, form },
    { name: "Prismaschild", role: "WACHTER", hp: 35, damage: 11, form: "sentinel" },
    { name: "Echojager", role: "VERKENNER", hp: 30, damage: 10, form: "wraith" },
  ],
});
const citizen = (world, id, x, y, name, style, line) => obj(`${world}-${id}`, "npc", x, y, name, {
  character: id, style, line,
  route: [[x, y], [x + 40, y], [x + 40, y + 22], [x, y + 22]].map(p => p.map(n => n * 2)),
  quest: `${world}-${id}-1`, portrait: world === "kage" ? 2 : 1,
});

export const EXPANSION_CAST = {
  nyx: { name: "Nyx", skin: "#986b58", hair: "#327ec9", coat: "#273544", accent: "#66efef", kind: "short" },
  cass: { name: "Cass", skin: "#c38e6a", hair: "#929c94", coat: "#c2c1ac", accent: "#69ddd2", kind: "short" },
  flux: { name: "Flux", skin: "#b88464", hair: "#d8d5c6", coat: "#384364", accent: "#e9b164", kind: "ponytail" },
  akari: { name: "Akari", skin: "#c49273", hair: "#864834", coat: "#8e4547", accent: "#edc685", kind: "ponytail" },
  sumi: { name: "Sumi", skin: "#d0b89c", hair: "#d8dce1", coat: "#303f5b", accent: "#a9c2a7", kind: "ponytail" },
  kaede: { name: "Kaede", skin: "#ba9878", hair: "#283037", coat: "#365c4e", accent: "#cc6965", kind: "ponytail" },
};

export function expandDistricts(worlds) {
  for (const id of ["neon", "kage"]) {
    const w = worlds[id];
    w.width = 6144; w.height = 4096; w.theme = id;
    w.walkAreas.push(...[
      [1420, id === "neon" ? 473 : 401, 1480, 90],
      [1580, 110, 110, 1820], [2140, 110, 100, 1820], [2790, 110, 110, 1820],
      [1600, 150, 1250, 100], [1600, 950, 1250, 100],
      [1600, 1440, 1250, 110], [1600, 1830, 1250, 110],
      [480, id === "neon" ? 900 : 950, 140, 980], [185, 1140, 1450, 100],
      [185, 1150, 110, 790], [200, 1450, 1420, 100], [200, 1840, 1420, 100],
      [940, 955, 110, 925], [1300, id === "neon" ? 900 : 850, 110, 1080],
    ].map(r => r.map(n => n * 2)));
    const names = id === "neon"
      ? ["Chromemarkt", "Nulkliniek", "Blackline Kathedraal", "Spiegelhaven", "Schrootbaai", "Onderstroom", "Prismakade", "De Laatste Frequentie"]
      : ["De Smidse", "Inktvallei", "Verdronken Klok", "Maanoven", "Roninvallei", "Kitsunepad", "Jadeterras", "Duizend Lantaarns"];
    [[1625, 200], [2180, 500], [2830, 200], [2825, 990], [250, 1180], [1000, 1480], [2200, 1500], [2800, 1865]]
      .forEach(([x, y], i) => w.districts.push({ x: x * 2, y: y * 2, name: names[i], expanded: true }));
    w.objects.push(obj(`${id}-beacon-dock`, "beacon", 390, 845, "Landingsbaken", { hint:"Activeer lokaal reisbaken" }));
    for(const [i,d] of w.districts.filter(d=>d.expanded).entries()) {
      w.objects.push(obj(`${id}-beacon-${i}`, "beacon", d.x/2+5,d.y/2+30, d.name+" · reisbaken", {hint:"Activeer lokaal reisbaken"}));
    }
    const crowds = id === "neon" ? [
      [1650,230,"Lio · ramenkok","Mijn klanten komen voor soep en blijven voor het nieuws."],
      [2180,810,"Maks · kabeltrekker","Cass krijgt vandaag stroom. Daar zorg ik voor."],
      [2500,995,"Eris · discjockey","Na het koor wil ik weer een stem horen die zelf mag kiezen."],
      [990,1200,"Lumen · lichtkunstenaar","Dat schip op de muur? De Wayfarer. Iemand schilderde het hier jaren geleden."],
      [1620,1510,"Rox · taxipiloot","Ontdek eerst een reisbaken. Daarna kun je tussen de bakens springen."],
      [2180,1880,"Bex · signaaljager","De laatste frequentie zwijgt. Zelfs stilte heeft hier een eigenaar."],
      [250,1500,"Opal · monteur","Flux praat alsof niets hem raakt. Kijk naar wat hij repareert."],
      [1330,1640,"Kip · nachtwachter","Twee zenders horen elkaar niet meer. Er ligt iets tussen hun signalen."],
    ] : [
      [1650,230,"Chiyo · wapensmid","Akari werkt met sterrenstaal. Haar mooiste werk heeft geen kling."],
      [2180,810,"Goro · theemeester","Iedere pelgrim krijgt een kom. Ook de pelgrim die niet terug durft."],
      [2500,995,"Hoshi · maanwachter","De Maanoven gloeit. Haar vleugels zijn van porselein, haar hart niet."],
      [990,1200,"Nao · kalligraaf","Inkt verdwijnt. Een naam blijft als iemand hem zegt."],
      [1620,1510,"Riku · lantaarnmaker","De reisbakens volgen de paden. Alleen de eerste reis vraagt om je voeten."],
      [2180,1880,"Emi · klokluisteraar","De bel bij het Kitsunepad hoort die bij de Duizend Lantaarns."],
      [250,1500,"Jun · medicijnzoeker","Taro is teruggekeerd. Hij had genoeg Stars om nooit meer terug te hoeven."],
      [1330,1640,"Rei · voormalige wachter","Kaede noemt iedere naam. Veel mensen met een vaandel deden minder."],
    ];
    crowds.forEach(([x,y,name,line],i)=>w.objects.push(obj(`${id}-crowd-${i}`,"npc",x,y,name,{ambient:true,line,style:["amber","violet","green","blue","red"][i%5],skin:["#96694f","#bc8a65","#dcb999"][i%3],hair:["#292c38","#614334","#c2c5b8"][i%3],route:[[x,y],[x+25,y],[x+25,y+10],[x,y+10]].map(p=>p.map(n=>n*2))})));
    w.expansionBuildings = [
      [1730, 290, 310, 150], [2280, 290, 390, 150], [1750, 650, 310, 215],
      [2320, 640, 335, 240], [1740, 1110, 320, 225], [2300, 1110, 365, 230],
      [330, 1280, 490, 110], [1100, 1290, 120, 110], [370, 1630, 450, 135],
      [1110, 1630, 140, 140], [1750, 1620, 290, 135], [2360, 1630, 320, 130],
      [1720, 60, 300, 60], [2310, 55, 320, 65], [3030, 110, 25, 1700],
    ];
    // Exploration caches and signposted clues belong to the new streets.
    for (let i = 0; i < 8; i++) {
      const d = w.districts[6 + i];
      w.objects.push(obj(`${id}-district-cache-${i}`, "chest", d.x / 2 + 18, d.y / 2 + 10, id === "kage" ? "Pelgrimsvoorraad" : "Versleutelde buurtvoorraad"));
    }
  }
  worlds.neon.objects.push(
    citizen("neon", "nyx", 1622, 185, "Nyx · netwerkduiker", "blue", "Ik hoor de stad zelfs als haar speakers zwijgen. Iemand gebruikt onze stemmen als encryptiesleutel."),
    citizen("neon", "cass", 2180, 500, "Cass · straatarts", "green", "Ik tel geen credits. Ik tel mensen die morgen weer zelfstandig kunnen ademen."),
    citizen("neon", "flux", 230, 1175, "Flux · schrootpiloot", "amber", "Je ouders hebben me ooit uit een wrak gehaald. Mijn schuld betaal ik niet met geld."),
    obj("neon-nyx-relay", "sidehack", 2180, 200, "Gestolen stemmenrelais"),
    obj("neon-cass-filter", "sidehack", 1625, 990, "Kliniek-luchtfilter"),
    obj("neon-flux-drive", "sidehack", 540, 1175, "Wayfarer-reservedrive"),
    gang("neon-choir-gang", 2620, 520, "Koor van Chroom", "hydra", 65),
    gang("neon-rift-gang", 2180, 1270, "Prismabreuk", "wraith", 70),
    obj("neon-blackline-entry", "dungeon", 2828, 185, "Blackline Kathedraal", { dungeon: "blackline" }),
    obj("neon-prism-entry", "dungeon", 2825, 980, "Prismakluis", { dungeon: "prism" }),
    obj("neon-arcwarden", "boss", 2190, 1500, "ARC-WARDEN · Stormhart", { form: "warden", hp: 160, damage: 17, phase: "Stormoverbelasting", dropChip: "stormheart" }),
    obj("neon-secret-switch-a", "sidehack", 1350, 1470, "Onzichtbare dragerfrequentie", { hidden: true }),
    obj("neon-secret-switch-b", "sidehack", 2800, 1870, "Laatste dragerfrequentie", { hidden: true }),
    obj("neon-secret-relic", "relic", 985, 1868, "De Ster tussen de Ruis", { hidden: true, chip: "ghostlight", requiresSolved: ["neon-secret-switch-a", "neon-secret-switch-b"], clue: "Nyx: twee stille zenders. Eén aan de Onderstroom, één op de Laatste Frequentie." }),
  );
  worlds.kage.objects.push(
    citizen("kage", "akari", 1622, 185, "Akari · sterrenstaalsmid", "red", "Een zwaard onthoudt iedere hand. Een Omni-Tool zou dat ook moeten doen."),
    citizen("kage", "sumi", 2180, 500, "Sumi · blinde archivaris", "blue", "Vane heeft de letters niet gewist. Hij heeft de mensen geleerd hun eigen geschiedenis te wantrouwen."),
    citizen("kage", "kaede", 230, 1175, "Kaede · ronin zonder vaandel", "green", "Dat masker is niet mijn gezicht. Het is wat ik achterliet toen ik voor de piraten vocht."),
    obj("kage-akari-forge", "sidehack", 2180, 200, "Gesloten sterrenstaaloven"),
    obj("kage-sumi-script", "sidehack", 1625, 990, "Gevangen herinneringsrol"),
    obj("kage-kaede-oath", "sidehack", 540, 1175, "Gebroken eedsteen"),
    gang("kage-oni-gang", 2620, 440, "De IJzeren Oni", "oni", 75),
    gang("kage-ghost-gang", 2180, 1270, "De Maskerlozen", "wraith", 65),
    obj("kage-bell-entry", "dungeon", 2828, 185, "Verdronken Klok", { dungeon: "bell" }),
    obj("kage-moon-entry", "dungeon", 2825, 980, "Maanoven", { dungeon: "moon" }),
    obj("kage-nine-tail", "boss", 2190, 1500, "KUZUNOHA · Negenstaartige machine", { form: "fox", hp: 170, damage: 18, phase: "Negen rode manen", dropChip: "kitsune" }),
    obj("kage-secret-switch-a", "sidehack", 1350, 1470, "Zwijgende windbel", { hidden: true }),
    obj("kage-secret-switch-b", "sidehack", 2800, 1870, "Vergeten windbel", { hidden: true }),
    obj("kage-secret-relic", "relic", 985, 1868, "Wat de Maan Bewaart", { hidden: true, chip: "moonwake", requiresSolved: ["kage-secret-switch-a", "kage-secret-switch-b"], clue: "Sumi: de ene bel hoort de Kitsune, de andere waakt over Duizend Lantaarns." }),
  );
}

const definitions = [
  ["blackline", "neon", "Blackline Kathedraal", "Koor van gestolen stemmen", "nyx", "chorus", "CHORUS-9 · Het duizendstemmige hart", 180, "Voltpsalm", "voltpsalm"],
  ["prism", "neon", "Prismakluis", "De prijs van een perfecte herinnering", "cass", "matriarch", "PRISMA · De Spiegelmoeder", 210, "Prisma-ontwaking", "prismheart"],
  ["bell", "kage", "Verdronken Klok", "Een eed onder het water", "sumi", "bellkeeper", "HYAKU · De Duizendklokkenwachter", 190, "De honderdste slag", "bellguard"],
  ["moon", "kage", "Maanoven", "Smeed iets dat je niet kan bezitten", "akari", "moth", "TSUKI · De keramische maanmot", 220, "Eclips van sterrenstaal", "eclipse"],
];
export const DUNGEONS = Object.fromEntries(definitions.map(([id, theme, name, subtitle, character, form, bossName, hp, phase, chip]) => {
  const routeGang = gang(`${id}-guard`, 365, 710, theme === "kage" ? "Verzonken eedwachters" : "Gefragmenteerde beveiliging", theme === "kage" ? "oni" : "sentinel", 60);
  const gate = [`${id}-seal-a`, `${id}-seal-b`];
  return [id, {
    id, theme, dungeon: true, name, subtitle, chapter: theme === "neon" ? "01" : "02",
    width: 2560, height: 1792, accent: theme === "neon" ? "#70f2ed" : "#eac697",
    color: theme === "neon" ? "#192d42" : "#3b393c", spawn: [220, 1500],
    character, chip, boss: `${id}-boss`, gates: gate, guard: routeGang.id,
    districts: [[120, 735, "Drempel"], [365, 670, "Wachterszaal"], [860, 435, "Twee zegels"], [1070, 165, "Kernkamer"]].map(([x, y, name]) => ({x: x * 2, y: y * 2, name})),
    walkAreas: [[55, 655, 520, 160], [295, 535, 155, 135], [320, 425, 870, 130], [780, 200, 150, 300], [755, 75, 455, 160]].map(r => r.map(n => n * 2)),
    objects: [
      obj(`${id}-exit`, "exit", 110, 740, "Terug naar de planeet", {hint: "Verlaat de dungeon"}),
      routeGang,
      obj(gate[0], "sidehack", 580, 478, theme === "kage" ? "Zegel van de wind" : "Stemsleutel Alpha"),
      obj(gate[1], "sidehack", 1020, 478, theme === "kage" ? "Zegel van de maan" : "Stemsleutel Omega"),
      obj(`${id}-boss`, "boss", 1060, 162, bossName, { form, hp, damage: 18, phase, phaseRule: id === "prism" ? "regen" : id === "bell" ? "armour" : "counter", requiresSolved: gate, requiresDefeated: [routeGang.id] }),
      obj(`${id}-vault`, "relic", 1160, 120, "Verzegelde kernschat", {chip, requiresDefeated: [`${id}-boss`]}),
      obj(`${id}-supply`, "supply", 250, 710, "Noodvoorraad", {hint: "Gebruik noodvoorraad · één keer per dungeon"}),
    ],
  }];
}));
export function requirementsMet(state, obj) {
  return (obj.requiresSolved || []).every(id => state.flags[`solved_${id}`]) &&
    (obj.requiresDefeated || []).every(id => state.defeated.includes(id));
}
export function dungeonGoals(state, d) {
  return [
    {label: "Versla de wachters", done: state.defeated.includes(d.guard), target: d.guard},
    ...d.gates.map((id, i) => ({label: `Herschrijf zegel ${i + 1}`, done: !!state.flags[`solved_${id}`], target: id})),
    {label: "Breek de bosskern", done: state.defeated.includes(d.boss), target: d.boss},
    {label: "Claim de kernschat", done: state.collected.includes(`${d.id}-vault`), target: `${d.id}-vault`},
  ];
}

const hack = (target, label) => ({kind: "hack", target, label});
const defeat = (target, label) => ({kind: "defeat", target, label});
const collect = (target, label) => ({kind: "collect", target, label});
const quest = (world, who, stage, name, story, ending, chip, goals) => ({
  id: `${world}-${who}-${stage}`, world, giver: `${world}-${who}`, npc: EXPANSION_CAST[who].name,
  name, story, ending, chip, reward: stage === 1 ? 70 : 120, goals,
  ...(stage === 2 ? {requires: `${world}-${who}-1`} : {}),
});
export const EXPANSION_QUESTS = Object.fromEntries([
  quest("neon", "nyx", 1, "Wie spreekt er in de ruis?", "Nyx herkent haar verdwenen zus in een vijandelijk radiosignaal. Ze wil de stemmen bevrijden, niet wissen.", "In de ruis zegt een vrouw: ‘De gevangenen leven.’ Nyx geeft je haar Null Thread-software. Een stilte kan ook bescherming zijn.", "nullthread", [hack("neon-nyx-relay", "Bevrijd het stemmenrelais"), defeat("neon-choir-gang", "Versla het Koor van Chroom")]),
  quest("neon", "nyx", 2, "De stem achter de deur", "Onder Blackline bouwden je ouders een noodkanaal. Als het koor blijft zingen, vindt de kapitein ieder gezin dat via dat kanaal vlucht.", "De stemmen keren terug naar hun eigenaars. Nyx krijgt een laatste bericht van haar zus: ik wacht op je. Het kanaal blijft bestaan, zonder de piraten.", "ghostlight", [collect("blackline-vault", "Bevrijd de kern van Blackline")]),
  quest("neon", "cass", 1, "Adem voor de benedenstad", "Cass kan zijn kliniek niet verlaten. De filterbesturing sluit patiënten buiten omdat ze geen piraten-ID hebben.", "Het filter accepteert mensen zonder ID. Cass vertelt dat je moeder hetzelfde deed voor vluchtelingen. Hij bouwt een veldreparatiechip voor je.", "fieldheart", [hack("neon-cass-filter", "Herstel de lucht voor de kliniek")]),
  quest("neon", "cass", 2, "Een herinnering is geen medicijn", "PRISMA verkoopt perfecte kopieën van verloren mensen. Cass wil het origineel van zijn dochter terugvinden, ook al is het pijnlijk.", "Cass bewaart haar onvolmaakte stemopname. ‘Ze lacht op het verkeerde moment. Dat deed ze altijd.’ De Omni-Tool krijgt ruimte voor foutjes.", "nullthread", [collect("prism-vault", "Doorbreek PRISMA’s herinneringskluis")]),
  quest("neon", "flux", 1, "Een motor die terugkomt", "Flux sleept de oude reservedrive van de Wayfarer door de Onderstroom. Die drive bevat de eerste gereedschapsinstellingen van je vader.", "De motor start. Op het display staat zijn notitie: ‘Voor als ons kind verder moet dan wij.’ Flux monteert een snellere bewegingschip.", "afterburn", [hack("neon-flux-drive", "Herstel de Wayfarer-reservedrive")]),
  quest("neon", "flux", 2, "Vlieg tegen de storm in", "De Arc-Warden voedt de piratenbakens met iedere vlucht die hij neerhaalt. Flux weigert nog een vluchteling achter te laten.", "De storm verdwijnt van de scanner. Flux vliegt met de eerste evacuatievlucht mee. Sommige schulden betaal je door iemand anders te redden.", "fieldheart", [defeat("neon-arcwarden", "Versla de Arc-Warden")]),
  quest("kage", "akari", 1, "Het staal onthoudt", "Akari’s smidse leverde onbewust wapens aan Vane. Ze wil de oven herstellen om prothesen te smeden in plaats van meer zwaarden.", "Het eerste nieuwe werkstuk is een hand voor een tuinier. Akari versterkt je tool met sterrenstaal dat beschermt voordat het snijdt.", "starsteel", [hack("kage-akari-forge", "Herstel de sterrenstaaloven"), defeat("kage-oni-gang", "Breek de IJzeren Oni")]),
  quest("kage", "akari", 2, "Onder dezelfde maan", "In de Maanoven ligt een prototype van je vader. Akari wil weten waarom hij het nooit als wapen afmaakte.", "In de kern staat: ‘Een kracht die alles kan maken, moet ook kunnen stoppen.’ Akari herstelt zijn ontwerp en geeft het aan jou door.", "moonwake", [collect("moon-vault", "Open de schat van de Maanoven")]),
  quest("kage", "sumi", 1, "De letters die overleven", "Sumi kent iedere naam in het archief uit haar hoofd. Vane heeft een geheugenrol opgesloten waarin de ouders van je thuiswereld genoemd worden.", "De namen zijn er nog. Sumi leest die van jouw ouders zonder te aarzelen. Ze laat je de tool op rustige ademhalingen afstemmen.", "inkmemory", [hack("kage-sumi-script", "Bevrijd de herinneringsrol")]),
  quest("kage", "sumi", 2, "De klok onder het water", "De verzonken klok droeg ooit noodsignalen tussen de planeten. Hyaku vervormt die signalen tot bevelen. Sumi wil de klok terughoren.", "De klok luidt met de stemmen van de eilanden. Sumi herkent je moeders naam in het oude signaal. Je bent niet de eerste die tegen deze piraten bleef hopen.", "starsteel", [collect("bell-vault", "Herstel de kern van de Verdronken Klok")]),
  quest("kage", "kaede", 1, "Een masker zonder meester", "Kaede sloot ooit de vluchtwegen voor Vane af. Hij biedt geen excuus, maar de locatie van iedere overgebleven eedsteen.", "De steen noemt de mensen die hij liet wachten. Kaede spreekt hun namen uit. Je hoeft hem niet te vergeven om zijn hulp te gebruiken.", "ronin", [hack("kage-kaede-oath", "Ontgrendel de eedsteen"), defeat("kage-ghost-gang", "Versla de Maskerlozen")]),
  quest("kage", "kaede", 2, "Negen staarten, één keuze", "Kuzunoha kopieert iedere eed die aan de piraten is gezworen. Kaede wil die van hem breken, zonder de herinnering te wissen.", "De negen maskers breken. Kaede houdt het zijne. Het blijft een herinnering, geen meester. Hij besluit in KAGE te blijven en de routes te bewaken.", "inkmemory", [defeat("kage-nine-tail", "Versla Kuzunoha")]),
].map(q => [q.id, q]));
