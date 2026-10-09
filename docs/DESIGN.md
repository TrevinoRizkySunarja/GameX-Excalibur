# Prototype design — Project X

## Core loop

**Explore → meet an NPC or discover a target → activate the Omni-Tool → receive a random hack task → complete it → change the world or damage an enemy → collect loot and story information → upgrade and travel.**

This is the personal Excalibur adventure. Its repository and development remain independent of the school project in Godot.

## The narrative

1. **Prologue — before the silence.** A child lives on a peaceful technological world. Their uncle returns with a pirate fleet to steal the family's rare core energy. The parents send the child away on the automatic cargo ship Wayfarer and are captured.
2. **The ship — a forbidden prototype.** Years later, the teenager finds the Omni-Tool while sorting cargo. ARI, the ship's computer, explains that it can rewrite physical laws. The protagonist's inherited energy allows them to survive its normally lethal output. The first random task teaches the hacking interaction.
3. **NEON — the first trail.** Merchant robot Ilo has seen the pirate transports. Helping with the city's relay makes the harbor guardian vulnerable. Its manifest points toward KAGE and confirms that the family was transported alive.
4. **KAGE — the price of balance.** Pirate overseer Vane controls a gravity anchor. Ren wants to preserve the islands by repairing it. Rebel Kaito wants to overload it to break the occupation immediately. The player chooses. Overloading weakens Vane, but damages the landscape; repair preserves it and leaves his armor intact.
5. **CITADEL — blood and code.** Security overrides lead to the uncle's Mech-Tech Armour. The protagonist uses successive random hacking tasks to destroy it. The parents are free, but the years apart and the player's choices have changed the reunion.
6. **Epilogue — bittersweet peace.** The protagonist leaves on the Wayfarer and rests on a tropical planet with a coconut. The ending acknowledges the KAGE decision rather than declaring every player equally ruthless. Afterward, the player can revisit planets and finish the archive quest.

## A universe that can expand

The map intentionally scatters its destinations rather than presenting a straight line. Story progression unlocks coordinates, while visited destinations remain available. Twelve destinations are represented; three have actual playable maps.

| Destination      | Visual theme                                                     | Future mission potential                                           | Status                      |
| ---------------- | ---------------------------------------------------------------- | ------------------------------------------------------------------ | --------------------------- |
| NEON             | Rain-lit cyberpunk harbor, industrial neon and information trade | Restore infrastructure, expose stolen cargo and decode hidden logs | Playable chapter 1          |
| KAGE             | Samurai temples, bamboo and floating stone                       | Resolve an occupation without destroying local balance             | Playable chapter 2          |
| CITADEL          | Pirate fortress, red warning lights and mechanical systems       | Release prisoners and face the stolen family technology            | Playable chapter 3 / finale |
| FORGE            | Medieval foundries fused with orbital machinery                  | Help guilds reclaim a forge supplying the pirate army              | Concept                     |
| VIREL            | Bioluminescent jungle and overgrown alien computers              | Stabilize a living network and discover old survey ships           | Concept                     |
| PELAGOS          | Ocean planet, submerged domes and tidal generators               | Reopen flooded routes and retrieve a stranded crew                 | Concept                     |
| CINDER           | Volcanic mines and high-temperature reactors                     | Cool an unstable reactor before an evacuation fails                | Concept                     |
| MIRAGE           | Desert observatories and shifting signal illusions               | Distinguish real coordinates from forged transmissions             | Concept                     |
| HOLLOW           | Abandoned mining moon and buried ruins                           | Uncover the origin of the family's energy research                 | Concept                     |
| MERIDIAN STATION | A single orbital trade station instead of another planet         | Trade, investigate smuggling and meet competing factions           | Concept                     |
| NOX              | Frozen twilight world and radio telescopes                       | Repair a deep-space array to contact missing survivors             | Concept                     |
| RIFT             | Fractured reality and drifting architectural fragments           | Close dangerous distortions produced by failed Omni experiments    | Concept                     |

These concepts are placeholders for future world building, not extra playable levels or a promise of a complete campaign.

## Hack tasks, results and themes

- **Task:** one of sixteen minigames is randomly chosen. Immediate repeats are avoided when another task exists.
- **Result:** battle success deals upgrade-dependent damage; terminals advance missions; archive success opens secrets.
- **Theme:** NEON uses data-network presentation, KAGE uses an anchor/samurai protocol, CITADEL uses imperial encryption. Rules remain consistent.

In the arena, a failed task or expired timer produces a counterattack. The player can retreat between links. Exploration itself pauses in this separate interface, matching the Pokémon-like encounter request. The prototype does not combine WASD movement and a competing WASD hacking sequence.

## Progression and rewards

- Ground pickups provide a small random number of Stars once.
- Chests provide Stars and bolts once.
- Normal encounters provide Stars and hardware once.
- Bosses provide stronger rewards, a chip if an upgrade slot is available, and guaranteed coordinates or story progress.
- The original base software upgrades increase hack damage from 25 to 40. Eight additional collectible Chips offer distinct passive effects; two can be equipped at once. Damage Chips stack with the base upgrades.
- Bolts fund two movement upgrades: +15 movement speed and a shorter dash cooldown per upgrade.
- Stars buy Chips and recovery; bolts can also be recycled into Stars. Four types of salvage can be sold to traders. Shops show prices and reject duplicate purchases.
- All three archives complete the optional large quest and give bonus Stars and a chip if there is room.

## Scope and next experiments

The expanded build proves the loop with three 3072 × 2048 worlds and sixteen tasks. The other nine destinations remain concepts. It does not implement seamless space flight, multiplayer, large branching cutscenes or a live-service endgame.

Each world uses an authored Canvas illustration driven by the existing navigation rectangles. Foreground residents, ships, enemies and interactions remain live Excalibur actors. The maps do not yet provide destructible buildings, interiors or automatic foreground occlusion. Old generated paintings are retained only as reference.

Eighteen residents follow short routes and stop while the player approaches. Quest givers remember acceptance, repairs and claimed rewards in the existing save. Completed main-story and loot IDs remain compatible with the earlier prototype.

### The first four sidequests

| Quest                | Destination | Giver    | Task                              | Completion reward  |
| -------------------- | ----------- | -------- | --------------------------------- | ------------------ |
| Een stad in beweging | NEON        | Mira     | Restore the bridge fuses          | 45 Stars + 3 bolts |
| Bloei tussen beton   | NEON        | Aya      | Restore the irrigation controller | 40 Stars + 3 bolts |
| Het water herinnert  | KAGE        | Hana     | Restore the temple pump           | 45 Stars + 3 bolts |
| Niemand achterlaten  | CITADEL     | Dr. Vale | Open the medical cell door        | 60 Stars + 3 bolts |

Each repair also gives 12 Stars once. Return to the NPC to claim the quest reward once. Additional chests, patrol encounters, Stars and the original secret archives reward exploration.

### Hack library

| Category       | Tasks                                                            |
| -------------- | ---------------------------------------------------------------- |
| Timing and aim | Timing bar, five rhythm targets, moving hostile targets          |
| Memory         | Symbol sequence, temporary keypad code                           |
| Logic          | Chess mate-in-one, cause-and-effect combinations, rotating pipes |
| Short tasks    | Matching wires, ordered pulses, numbers 1–9, filter cleanup      |
| Control        | Cursor maze, frequency sliders, energy balance, symbol locks     |

All sixteen use the same random selection system in battles and exploration. They do not grant specific effects or belong exclusively to one world. The three planet themes change their presentation. The practice terminal also assigns a random task rather than letting the player choose one.

Useful next playtest questions:

1. Do players understand that task, effect and theme are separate?
2. Is completing multiple tasks per enemy fun, or does it need faster pacing?
3. Which minigame feels most natural with the Omni-Tool?
4. Does the KAGE choice affect how players interpret the ending?
5. Do Stars, bolts and chips have clearly different uses?

## Story and economy expansion

The side stories follow the consequences of the campaign: NEON’s residents keep the city alive, KAGE’s inhabitants preserve their community and the Citadel’s prisoners organize an escape. NPC dialogue acknowledges the completed campaign. These are original characters and stories; the cited inspiration games inform the idea of lively hubs, distinct loot and optional quest chains.

| Sidequest                    | Giver    | Requirement / objectives                             | Special Chip     |
| ---------------------------- | -------- | ---------------------------------------------------- | ---------------- |
| De nacht blijft van ons      | Mira     | Finish bridge repair; restore two power distributors | Overclock        |
| Een brief zonder ontvanger   | Nori     | Recover an intercepted family letter                 | Flow Circuit     |
| Wat de stad onthoudt         | Juno     | Unlock NEON’s hidden archive                         | Tijdsbuffertje   |
| Twee klokken voor morgen     | Hana     | Finish water repair; restore both resonance bells    | Kage Resonance   |
| De laatste lantaarnkaravaan  | Taro     | Defeat the Ronin drone and recover its supply chest  | Sterrenzoeker    |
| Een eed zonder meester       | Zen      | Defeat Vane                                          | Aegis-plaat      |
| Een stem buiten de muren     | Sera     | Restore two evacuation beacons                       | Phoenix Protocol |
| Een robot kiest zelf         | ECHO     | Unlock two forbidden memory cores                    | Paradox Kernel   |
| De rekening van het imperium | Dr. Vale | Open the medical door, then defeat two patrols       | Aegis-plaat      |

Combined with the first four quests this gives thirteen sidequests, in addition to the main campaign and the three-archive post-campaign objective. Each contract awards its listed Stars, three bolts and any promised Chip. Duplicate Chip rewards become thirty Stars. Required objectives have fixed locations and are not gated by random loot.

### Shops and builds

Rhea, Yui and Dr. Vale run local shops. Sol, Taro and ECHO walk longer district routes and stop when approached. All six offer their own Chip selection and sell repairs. They buy valuable cargo, but never consume quest completion data. Inventory is finite per unique Chip rather than a real-time rotating shop schedule.

The equipment screen (I) holds two special Chip slots. It displays the resulting battle damage, bonus hack time and counterattack protection. Equipment, cargo and quest claims persist in browser saves. The random hack selection pool stays unchanged by equipment.

## Cinematic presentation and group encounters

The opening is a six-panel manga sequence: farewell, boarding, goodbye through the window, capture by De Gebroken Zon, escape, then the discovery of the Omni-Tool years later. Important NPC dialogues use illustrated or world-backed stages, original animated mouth/eye layers and Dutch subtitles. Advancement never chooses a KAGE outcome automatically. Opening replay is available on the ship.

Each of NEON, KAGE and CITADEL has a three-member enemy gang. The player can switch targets between hacks. A failed hack takes the selected enemy’s damage plus two for each other living enemy, reduced by equipped protection. Killing a support unit reduces pressure; the encounter completes only after every member is gone. Victory grants the original enemy reward plus eight Stars and one bolt per additional member, and two salvage items. Retreated encounters reset enemy health; player damage remains saved. Existing enemy IDs still represent complete encounters, keeping sidequest and save compatibility.
