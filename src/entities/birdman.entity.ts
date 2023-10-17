import Phaser from "phaser";
import Enemy from "./enemy.entity";
import initAnims from "./anims/birdAnims";
import Projectile from "../attacks/projectile";

class Birdman extends Enemy {
  gravity: number;
  speed: number;
  addCollider: (otherGameObject: any, callback?: Function) => void;
  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, "birdman");
    initAnims(this.scene.anims);
  }
  update(time: number, delta: number) {
    super.update(time, delta);
    if (!this.active) return;
    if (this.isPlayingAnims("birdman-hurt")) return;
    this.play("birdman-idle", true);
  }
  takesHit(source: Projectile) {
    super.takesHit(source);
    this.play("birdman-hurt", true);
  }
}
export default Birdman;
