import Phaser from "phaser";
import Player from "../entities/player.entity";
import Birdman from "../entities/birdman.entity";
import { getEnemyTypes } from "../types";
import Enemies from "../groups/enemies.group";
import Enemy from "../entities/enemy.entity";
import Projectile from "../attacks/projectile";
import initAnims from "../anims/index";
import Collectable from "../collectables/collectable.entity";
import CollectablesGroup from "../groups/collectables.group";
import Hud from "../hud";

class PlayScene extends Phaser.Scene {
  plotting: Boolean;
  tileHits: Phaser.Tilemaps.Tile[];
  graphics: Phaser.GameObjects.Graphics;
  line: Phaser.Geom.Line;
  playerSpeed: number;
  config: {
    zoomFactor: number;
    mapOffset: number;
    width: number;
    height: number;
    debug: boolean;
    leftTopCorner: {
      y: number;
      x: number;
    };
    rightTopCorner: {
      y: number;
      x: number;
    };
  };
  score: number;
  hud: Hud;

  constructor(config: {
    zoomFactor: number;
    mapOffset: number;
    width: number;
    height: number;
    debug: boolean;
    leftTopCorner: { y: number; x: number };
    rightTopCorner: { y: number; x: number };
  }) {
    super("PlayScene");
    this.config = config;
  }

  update() {
    // if (this.plotting) {
    //   const pointer = this.input.activePointer;
    //   this.line.x2 = pointer.worldX;
    //   this.line.y2 = pointer.worldY;
    //   this.graphics.clear();
    //   this.graphics.strokeLineShape(this.line);
    // }
  }
  preload() {}

  create() {
    initAnims(this.anims);
    this.hud = new Hud(this, 0, 0).setDepth(100);
    this.score = 0;
    const map = this.createMap();
    const layer = this.createLayers(map);
    const playerZones = this.getPlayerZones(layer.playerZones);
    const player = this.createPlayer(playerZones);
    const collectables = this.createCollectables(layer.collectables);
    const enemies = this.createEnemies(
      layer.enemySpawns,
      layer.platformColliders
    );
    this.createPlayerColliders(player, {
      colliders: {
        platformColliders: layer.platformColliders,
        projectiles: enemies.getProjectiles(),
        collectables,
      },
    });
    this.createEnemyColliders(enemies, {
      colliders: {
        platformColliders: layer.platformColliders,
        player,
      },
    });
    this.createEndOfLevel(playerZones.end, player);
    this.setupFollowupCameraOn(player);

    this.plotting = false;
    this.graphics = this.add.graphics();
    this.line = new Phaser.Geom.Line();
    this.graphics.lineStyle(1, 0x00ff00);
    // this.input.on("pointerdown", this.startDrawing, this);
    // this.input.on(
    //   "pointerup",
    //   (pointer: Phaser.Input.Pointer) =>
    //     this.finishDrawing(pointer, layer.platform),
    //   this
    // );
  }
  createCollectables(collectables: Phaser.Tilemaps.ObjectLayer) {
    const collectableLayers = new CollectablesGroup(this).setDepth(-1);
    collectableLayers.addFromLayer(collectables);
    collectableLayers.playAnimation("diamond-shine");
    return collectableLayers;
  }
  drawDebug(layer: Phaser.Tilemaps.DynamicTilemapLayer) {
    const collidingTileColor = new Phaser.Display.Color(243, 134, 48, 100);
    layer.renderDebug(this.graphics, {
      tileColor: null,
      collidingTileColor,
    });
  }
  startDrawing(pointer: Phaser.Input.Pointer) {
    if (this.tileHits?.length) {
      this.tileHits.forEach((tile) => {
        if (tile.index !== -1) {
          tile.setCollision(false);
        }
      });
    }

    this.line.x1 = pointer.worldX;
    this.line.y1 = pointer.worldY;
    this.plotting = true;
  }

  finishDrawing(
    pointer: Phaser.Input.Pointer,
    layer: Phaser.Tilemaps.DynamicTilemapLayer
  ) {
    this.line.x2 = pointer.worldX;
    this.line.y2 = pointer.worldY;
    this.graphics.strokeLineShape(this.line);
    this.tileHits = layer.getTilesWithinShape(this.line);
    if (this.tileHits.length) {
      this.tileHits.forEach((tile) => {
        if (tile.index !== -1) {
          tile.setCollision(true);
        }
      });
    }
    this.drawDebug(layer);
    this.plotting = false;
  }

  createEndOfLevel(end: Phaser.Types.Tilemaps.TiledObject, player: Player) {
    const endZone = this.physics.add
      .sprite(end.x, end.y, "end")
      .setAlpha(0)
      .setSize(5, 200)
      .setOrigin(0, 1);
    const eolOverlap = this.physics.add.overlap(endZone, player, () => {
      eolOverlap.active = false;
    });
  }
  getPlayerZones(playerZones: Phaser.Types.Tilemaps.TiledObject[]) {
    return {
      start: playerZones.filter((z) => z.name === "startZone")[0],
      end: playerZones.filter((z) => z.name === "endZone")[0],
    };
  }
  setupFollowupCameraOn(player: Player) {
    const { height, mapOffset, width, zoomFactor } = this.config;
    this.physics.world.setBounds(0, 0, width + mapOffset, height + 200);
    this.cameras.main
      .setBounds(0, 0, width + mapOffset, height)
      .setZoom(zoomFactor);
    this.cameras.main.startFollow(player);
  }
  onCollect(entity: any, collectable: any) {
    this.score += collectable.score;
    this.hud.updateScoreboard(this.score);
    collectable.disableBody(true, true);
  }
  createPlayerColliders(
    player: Player,
    {
      colliders,
    }: {
      colliders: any;
    }
  ) {
    player.addCollider(colliders.platformColliders);
    player.addOverlap(colliders.collectables, this.onCollect, this);
    // player.addCollider(colliders.projectiles, this.onWeaponHit);
  }
  createMap() {
    const map = this.make.tilemap({
      key: "map",
    });
    map.addTilesetImage("main_lev_build_1", "tiles-1");
    map.addTilesetImage("main_lev_build_2", "tiles-2");
    return map;
  }
  createLayers(map: Phaser.Tilemaps.Tilemap) {
    const tileset1 = map.getTileset("main_lev_build_1");
    const platformColliders = map.createDynamicLayer(
      "platform-colliders",
      tileset1
    );
    const env = map.createStaticLayer("env", tileset1).setDepth(-2);
    const enemySpawns = map.getObjectLayer("enemy_spawns");
    const platform = map.createDynamicLayer("platforms", tileset1);
    const playerZones = map.getObjectLayer("player_zones").objects;
    const collectables = map.getObjectLayer("collectables");
    platformColliders.setCollisionByExclusion([-1], true);
    return {
      env,
      platform,
      platformColliders,
      playerZones,
      enemySpawns,
      collectables,
    };
  }
  createPlayer(playerZones: {
    start: Phaser.Types.Tilemaps.TiledObject;
    end: Phaser.Types.Tilemaps.TiledObject;
  }) {
    const player: Player = new Player(
      this,
      playerZones.start.x,
      playerZones.start.y
    );
    return player;
  }

  createEnemies(
    spawns: Phaser.Tilemaps.ObjectLayer,
    platformColliders: Phaser.Tilemaps.DynamicTilemapLayer
  ) {
    const enemies = new Enemies(this);
    const enemyTypes = enemies.getTypes();
    spawns.objects.forEach((spawnPoint) => {
      const enemy = new enemyTypes[spawnPoint.type](
        this,
        spawnPoint.x,
        spawnPoint.y
      );
      enemy.setPlatformColliders(platformColliders);
      enemies.add(enemy);
    });
    return enemies;
  }

  onWeaponHit(entity: Enemy, source: Projectile) {
    entity.takesHit(source);
  }
  createEnemyColliders(
    enemies: Enemies,
    {
      colliders,
    }: {
      colliders: any;
    }
  ) {
    enemies.addCollider(colliders.platformColliders);
    enemies.addCollider(colliders.player, this.onPlayerCollision);
    enemies.addCollider(colliders.player.projectiles, this.onWeaponHit);
    enemies.addCollider(colliders.player.meleeWeapon, this.onWeaponHit);
  }
  onPlayerCollision(enemy: Enemy, player: Player) {
    player.takesHit(enemy);
  }
}

export default PlayScene;
