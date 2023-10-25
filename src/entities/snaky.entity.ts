import Phaser from "phaser";
import Enemy from "./enemy.entity";
import initAnims from "./anims/birdAnims";
import Projectile from "../attacks/projectile";
import Projectiles from "../attacks/projectiles";

class Snaky extends Enemy {
  gravity: number;
  speed: number;
  addCollider: (otherGameObject: any, callback?: Function) => void;
  projectiles: Projectiles;
  timeFromLastAttack: number;
  attackDelay: number;
  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, "snaky");
  }

  init() {
    super.init();
    this.speed = 33;

    initAnims(this.scene.anims);
    this.projectiles = new Projectiles(this.scene, "fireball-1");
    this.timeFromLastAttack = 0;
    this.attackDelay = this.getAttackDelay();
    this.setSize(this.width - 20, 45);
    this.setOffset(10, 15);
  }
  update(time: number, delta: number) {
    super.update(time, delta);
    if (this.timeFromLastAttack + this.attackDelay <= time) {
      this.projectiles.fireProjectile(this, "fireball");
    }
    if (!this.active) return;
    if (this.isPlayingAnims("snaky-hurt")) return;
    this.play("snaky-walk", true);
  }
  getAttackDelay() {
    return Phaser.Math.Between(1000, 4000);
  }
  takesHit(source: Projectile) {
    super.takesHit(source);
    this.play("snaky-hurt", true);
  }
}
export default Snaky;
