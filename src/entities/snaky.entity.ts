import Phaser from "phaser";
import Enemy from "./enemy.entity";
import initAnims from "./anims/birdAnims";
import Projectile from "../attacks/projectile";

class Snaky extends Enemy {
  gravity: number;
  speed: number;
  addCollider: (otherGameObject: any, callback?: Function) => void;
  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, "snaky");
    initAnims(this.scene.anims);
  }

  init() {
    super.init();
    this.speed = 33;
    this.setSize(this.width - 20, 45);
    this.setOffset(10, 15);
  }
  update(time: number, delta: number) {
    super.update(time, delta);
    if (!this.active) return;
    if (this.isPlayingAnims("snaky-hurt")) return;
    this.play("snaky-walk", true);
  }
  takesHit(source: Projectile) {
    super.takesHit(source);
    this.play("snaky-hurt", true);
  }
}
export default Snaky;
