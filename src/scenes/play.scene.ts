import Phaser from "phaser";
import Player from "../entities/player.entity";
import Birdman from "../entities/birdman.entity";
import { getEnemyTypes } from "../types";
import Enemies from "../groups/enemies.group";

class PlayScene extends Phaser.Scene {
  config;
  playerSpeed: number;
  constructor(config: {
    zoomFactor: number;
    mapOffset: number;
    width: number;
    height: number;
  }) {
    super("PlayScene");
    this.config = config;
  }

  update() {}
  preload() {}

  create() {
    const map = this.createMap();
    const layer = this.createLayers(map);
    const playerZones = this.getPlayerZones(layer.playerZones);
    const player = this.createPlayer(playerZones);
    const enemies = this.createEnemies(layer.enemySpawns);
    this.createPlayerColliders(player, {
      colliders: {
        platformColliders: layer.platformColliders,
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
  }
  createEndOfLevel(end: Phaser.Types.Tilemaps.TiledObject, player: Player) {
    const endZone = this.physics.add
      .sprite(end.x, end.y, "end")
      .setAlpha(0)
      .setSize(5, 200)
      .setOrigin(0, 1);
    const eolOverlap = this.physics.add.overlap(endZone, player, () => {
      eolOverlap.active = false;
      console.log("over");
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
  createPlayerColliders(
    player: Player,
    {
      colliders,
    }: {
      colliders: any;
    }
  ) {
    player.addCollider(colliders.platformColliders);
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
    const env = map.createStaticLayer("env", tileset1);
    const enemySpawns = map.getObjectLayer("enemy_spawns");
    const platform = map.createDynamicLayer("platforms", tileset1);
    const playerZones = map.getObjectLayer("player_zones").objects;
    platformColliders.setCollisionByExclusion([-1], true);
    return { env, platform, platformColliders, playerZones, enemySpawns };
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

  createEnemies(spawns: Phaser.Tilemaps.ObjectLayer) {
    const enemies = new Enemies(this);
    const enemyTypes = enemies.getTypes();
    spawns.objects.forEach((spawnPoint) => {
      const enemy = new enemyTypes[spawnPoint.type](
        this,
        spawnPoint.x,
        spawnPoint.y
      );
      enemies.add(enemy);
    });
    return enemies;
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
    enemies.addCollider(colliders.player);
  }
}

export default PlayScene;
