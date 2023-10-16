import Phaser from "phaser";
import collidable from "../mixins/collidable";
import PlayScene from "../scenes/play.scene";

class Enemy extends Phaser.Physics.Arcade.Sprite {
  gravity: number;
  timeFromLastTurn: number;
  rayGraphics: Phaser.GameObjects.Graphics;
  speed: number;
  currentPatrolDistance: number;
  maxPatrolDistance: number;
  config: any;
  raycast: (
    body: Phaser.Physics.Arcade.Body | Phaser.Physics.Arcade.StaticBody,
    layer: Phaser.Tilemaps.DynamicTilemapLayer,
    {
      precision,
      raylength,
      steepnes,
    }: { precision?: number; raylength?: number; steepnes?: number }
  ) => {
    ray: Phaser.Geom.Line;
    hasHit: boolean;
  };
  addCollider: (otherGameObject: any, callback?: Function) => void;
  platformCollidersLayer: Phaser.Tilemaps.DynamicTilemapLayer;
  damage: number;
  constructor(scene: Phaser.Scene, x: number, y: number, key: string) {
    super(scene, x, y, key);
    scene.physics.add.existing(this);
    scene.add.existing(this);
    this.config = (scene as PlayScene).config;
    this.init();
    this.initEvents();
    Object.assign(this, collidable);
  }
  init() {
    this.maxPatrolDistance = 100;
    this.damage = 20;
    this.currentPatrolDistance = 0;
    this.gravity = 500;
    this.timeFromLastTurn = 0;
    this.speed = 75;
    this.rayGraphics = this.scene.add.graphics({
      lineStyle: { width: 2, color: 0xaa00aa },
    });
    this.setGravityY(500);
    this.setSize(20, 45);
    this.setOffset(10, 20);
    this.setImmovable();
    this.setCollideWorldBounds(true);
    this.setVelocityX(this.speed);
    this.platformCollidersLayer = null;
  }
  initEvents() {
    this.scene.events.on(Phaser.Scenes.Events.UPDATE, this.update, this);
  }
  update(time: number, delta: number) {
    this.patrol(time);
  }

  patrol(time: number) {
    if (!this.body || !(this.body as Phaser.Physics.Arcade.Body).onFloor())
      return;
    this.currentPatrolDistance += Math.abs(this.body.deltaX());
    const { ray, hasHit } = this.raycast(
      this.body,
      this.platformCollidersLayer,
      { raylength: 30, precision: 1, steepnes: 0.3 }
    );
    if (this.config.debug && ray) {
      this.rayGraphics.clear();
      this.rayGraphics.strokeLineShape(ray);
    }
    if (
      (!hasHit || this.currentPatrolDistance >= this.maxPatrolDistance) &&
      this.timeFromLastTurn + 200 < time
    ) {
      this.setFlipX(!this.flipX);
      this.setVelocityX((this.speed = -this.speed));
      this.timeFromLastTurn = time;
      this.currentPatrolDistance = 0;
    }
  }
  setPlatformColliders(
    platformCollidersLayer: Phaser.Tilemaps.DynamicTilemapLayer
  ) {
    this.platformCollidersLayer = platformCollidersLayer;
  }
}
export default Enemy;
