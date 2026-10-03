import * as ex from "excalibur";
import { WORLDS, targetFor } from "./data.js";
import {
  floorGraphic,
  entityGraphic,
  playerGraphic,
  loadWorldArt,
  citizenGraphic,
  weatherGraphic,
} from "./art.js";
import { chipStats } from "./progression.js";
import { trackedTarget } from "./contracts.js";
import { walkable, routeTo } from "./levels.js";

export class Explorer extends ex.Actor {
  constructor(pos, controller, planet) {
    super({
      pos: ex.vec(...pos),
      width: 18,
      height: 16,
      collisionType: ex.CollisionType.Passive,
    });
    this.controller = controller;
    this.planet = planet;
    this.facing = "down";
    this.destination = null;
    this.path = [];
    this.dashUntil = 0;
    this.dashReady = 0;
    this.graphics.use(playerGraphic(this));
    this.graphics.anchor = ex.vec(0.5, 0.8);
  }
  go(pos) {
    this.path = routeTo(this.planet, this.pos, pos).map((p) =>
      ex.vec(p.x, p.y),
    );
    this.destination = this.path.shift() || null;
  }
  onPreUpdate(engine, delta) {
    if (this.controller.paused) {
      this.vel = ex.Vector.Zero;
      return;
    }
    const k = engine.input.keyboard;
    let x =
      (k.isHeld(ex.Keys.D) || k.isHeld(ex.Keys.Right) ? 1 : 0) -
      (k.isHeld(ex.Keys.A) || k.isHeld(ex.Keys.Left) ? 1 : 0);
    let y =
      (k.isHeld(ex.Keys.S) || k.isHeld(ex.Keys.Down) ? 1 : 0) -
      (k.isHeld(ex.Keys.W) || k.isHeld(ex.Keys.Up) ? 1 : 0);
    if (x || y) {
      this.destination = null;
      this.path = [];
    }
    if (!x && !y && this.destination) {
      const diff = this.destination.sub(this.pos);
      if (diff.magnitude < 7) this.destination = this.path.shift() || null;
      else {
        x = diff.x;
        y = diff.y;
      }
    }
    const now = performance.now(),
      hardware = Math.min(2, this.controller.state.flags.hardwareUpgrade || 0);
    if (k.wasPressed(ex.Keys.Space) && now > this.dashReady && (x || y)) {
      this.dashUntil = now + 160;
      this.dashReady = now + 950 - hardware * 100;
    }
    const speed =
      now < this.dashUntil
        ? 560
        : 225 + hardware * 15 + chipStats(this.controller.state).speed;
    let v = x || y ? ex.vec(x, y).normalize().scale(speed) : ex.Vector.Zero;
    if (this.destination) {
      const remaining = this.destination.sub(this.pos).magnitude;
      v = v.scale(
        Math.min(1, remaining / Math.max(0.001, (v.magnitude * delta) / 1000)),
      );
    }
    // Check the whole travelled segment, including long frames and dashes.
    const dt = delta / 1000;
    const clear = (dx, dy) => {
      const steps = Math.max(1, Math.ceil(Math.hypot(dx, dy) / 6));
      for (let i = 1; i <= steps; i++)
        if (
          !walkable(
            this.planet,
            this.pos.x + (dx * i) / steps,
            this.pos.y + (dy * i) / steps,
            9,
          )
        )
          return false;
      return true;
    };
    if (!clear(v.x * dt, 0)) v.x = 0;
    if (!clear(v.x * dt, v.y * dt)) v.y = 0;
    this.vel = v;
    if (Math.abs(y) > Math.abs(x)) this.facing = y < 0 ? "up" : "down";
    else if (x) this.facing = x < 0 ? "left" : "right";
  }
}
class Resident extends ex.Actor {
  constructor(obj, scene) {
    super({
      pos: ex.vec(obj.x, obj.y),
      width: 20,
      height: 16,
      collisionType: ex.CollisionType.Passive,
    });
    this.data = { obj };
    this.sceneRef = scene;
    this.facing = "down";
    this.next = 0;
    this.waitUntil = 0;
    this.walkPhase = 0;
    this.bubbleUntil = 0;
    this.routePath = [];
    this.graphics.use(
      citizenGraphic(
        this,
        obj,
        scene.planet,
        () => scene.nearest?.id === obj.id,
      ),
    );
    this.graphics.anchor = ex.vec(0.5, 0.74);
  }
  onPreUpdate(_engine, delta) {
    const s = this.sceneRef,
      o = this.data.obj,
      now = performance.now();
    if (
      s.controller.paused ||
      s.player.pos.distance(this.pos) < 98 ||
      !o.route ||
      now < this.waitUntil
    ) {
      this.vel = ex.Vector.Zero;
      return;
    }
    if (o.wandering && !this.routePath.length)
      this.routePath = routeTo(s.planet, this.pos, {
        x: o.route[this.next][0],
        y: o.route[this.next][1],
      }).map((p) => ex.vec(p.x, p.y));
    const target = o.wandering
        ? this.routePath[0] || ex.vec(...o.route[this.next])
        : ex.vec(...o.route[this.next]),
      diff = target.sub(this.pos);
    if (o.wandering && diff.magnitude < 7 && this.routePath.length > 1) {
      this.routePath.shift();
      return;
    }
    if (diff.magnitude < 7) {
      this.routePath = [];
      this.next = (this.next + 1) % o.route.length;
      this.waitUntil = now + 1200 + (this.next % 3) * 800;
      this.bubbleUntil = now + 2000;
      this.vel = ex.Vector.Zero;
      return;
    }
    let v = diff
      .normalize()
      .scale(o.wandering ? 65 : o.style === "robot" ? 49 : 37);
    if (
      !walkable(
        s.planet,
        this.pos.x + (v.x * delta) / 1000,
        this.pos.y + (v.y * delta) / 1000,
        5,
      )
    ) {
      this.next = (this.next + 1) % o.route.length;
      v = ex.Vector.Zero;
    }
    this.vel = v;
    if (v.magnitude > 0) this.walkPhase += delta / 120;
    this.facing =
      Math.abs(v.x) > Math.abs(v.y)
        ? v.x < 0
          ? "left"
          : "right"
        : v.y < 0
          ? "up"
          : "down";
  }
}
export class PlanetScene extends ex.Scene {
  constructor(id, controller) {
    super();
    this.id = id;
    this.planet = WORLDS[id];
    this.controller = controller;
    this.worldActors = new Map();
    this.nearest = null;
  }
  onInitialize() {
    const floor = new ex.Actor({
      pos: ex.vec(0, 0),
      anchor: ex.vec(0, 0),
      z: -100,
    });
    floor.graphics.use(floorGraphic(this.planet));
    floor.graphics.anchor = ex.vec(0, 0);
    this.add(floor);
    this.player = new Explorer(this.planet.spawn, this.controller, this.planet);
    this.add(this.player);
    for (const obj of this.planet.objects) {
      let a;
      if (obj.type === "npc") a = new Resident(obj, this);
      else {
        a = new ex.Actor({ pos: ex.vec(obj.x, obj.y), width: 32, height: 32 });
        a.data = { obj };
        a.graphics.use(
          entityGraphic(obj, this.planet, () => this.nearest?.id === obj.id),
        );
        a.graphics.anchor = ex.vec(0.5, 0.59);
        if (obj.type === "ship") a.graphics.current.scale = ex.vec(2, 2);
        if (obj.type === "boss") a.graphics.current.scale = ex.vec(1.45, 1.45);
      }
      this.add(a);
      this.worldActors.set(obj.id, a);
    }
    this.camera.strategy.lockToActor(this.player);
    this.camera.strategy.limitCameraBounds(
      new ex.BoundingBox({
        left: 0,
        top: 0,
        right: this.planet.width,
        bottom: this.planet.height,
      }),
    );
    const weather = new ex.ScreenElement({ pos: ex.vec(0, 0), z: 1000 });
    weather.graphics.use(weatherGraphic(this.planet, this.controller));
    weather.graphics.anchor = ex.vec(0, 0);
    this.add(weather);
    this.refresh();
  }
  onActivate() {
    if (this.player) {
      this.player.destination = null;
      this.player.path = [];
      this.player.vel = ex.Vector.Zero;
    }
    this.refresh();
  }
  refresh() {
    for (const [id, a] of this.worldActors) {
      a.graphics.visible =
        !this.controller.state.collected.includes(id) &&
        !this.controller.state.defeated.includes(id);
    }
  }
  onPostUpdate(engine) {
    if (!this.player) return;
    this.player.z = Math.floor(this.player.pos.y / 10);
    for (const a of this.worldActors.values()) a.z = Math.floor(a.pos.y / 10);
    if (this.controller.paused) {
      this.controller.setPrompt(null);
      return;
    }
    let nearest = null,
      dist = 95;
    for (const [id, a] of this.worldActors) {
      const obj = a.data.obj;
      if (!a.graphics.visible) continue;
      const d = this.player.pos.distance(a.pos);
      if (
        obj.type === "enemy" &&
        d < 34 &&
        this.player.vel.magnitude > 5 &&
        performance.now() > (this.controller.encounterUntil || 0)
      ) {
        this.controller.interact(obj);
        return;
      }
      if (obj.type === "loot" && d < 35) {
        this.controller.interact(obj);
        continue;
      }
      if (d < dist && obj.type !== "loot") {
        nearest = obj;
        dist = d;
      }
    }
    this.nearest = nearest;
    this.controller.setPrompt(nearest);
    if (engine.input.keyboard.wasPressed(ex.Keys.E) && nearest)
      this.controller.interact(nearest);
    const a =
      this.worldActors.get(trackedTarget(this.controller.state)) ||
      this.worldActors.get(targetFor(this.controller.state, this.id));
    this.controller.updateRadar(
      this.player.pos,
      a ? { x: a.pos.x, y: a.pos.y } : null,
    );
  }
  pointer(pos) {
    if (this.controller.paused) return;
    const a = [...this.worldActors.values()].find(
      (a) => a.graphics.visible && a.pos.distance(pos) < 45,
    );
    if (a && this.player.pos.distance(a.pos) < 115)
      this.controller.interact(a.data.obj);
    else this.player.go(pos);
  }
}
export async function createEngine(controller) {
  await loadWorldArt();
  const game = new ex.Engine({
    canvasElementId: "world-canvas",
    width: 960,
    height: 600,
    displayMode: ex.DisplayMode.FitContainerAndFill,
    backgroundColor: ex.Color.fromHex("#0a131b"),
    antialiasing: false,
    suppressPlayButton: true,
    suppressConsoleBootMessage: true,
    pointerScope: ex.PointerScope.Canvas,
    maxFps: 60,
  });
  controller.engine = game;
  for (const id of Object.keys(WORLDS))
    game.add(id, new PlanetScene(id, controller));
  game.input.pointers.primary.on("down", (evt) =>
    game.currentScene.pointer?.(evt.worldPos),
  );
  await game.start();
  await game.goToScene(
    controller.state.world in WORLDS ? controller.state.world : "neon",
  );
  return game;
}
