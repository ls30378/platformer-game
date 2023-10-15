import Phaser from "phaser";
import collidable from "../mixins/collidable";

class Enemy extends Phaser.Physics.Arcade.Sprite {
  gravity: number;
  speed: number;
  addCollider: (otherGameObject: any, callback?: Function) => void;
  constructor(scene: Phaser.Scene, x: number, y: number, key: string) {
    super(scene, x, y, key);
    scene.physics.add.existing(this);
    scene.add.existing(this);
    this.init();
    this.initEvents();
    Object.assign(this, collidable);
  }
  init() {
    this.gravity = 500;
    this.speed = 200;
    this.setGravityY(500);
    this.setSize(20, 45);
    this.setOffset(10, 20);
    this.setImmovable();
    this.setCollideWorldBounds(true);
  }
  initEvents() {
    this.scene.events.on(Phaser.Scenes.Events.UPDATE, this.update, this);
  }
  update(time: number, delta: number) {}
}
export default Enemy;
