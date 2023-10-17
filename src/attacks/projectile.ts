import SpriteEffect from "../effects/spriteEffect";
import Enemy from "../entities/enemy.entity";

class Projectile extends Phaser.Physics.Arcade.Sprite {
  speed: number;
  traveledDistance: number;
  maxDistance: number;
  cooldown: number;
  damage: number;
  constructor(scene: Phaser.Scene, x: number, y: number, key: string) {
    super(scene, x, y, key);
    scene.add.existing(this);
    scene.physics.add.existing(this);
    this.damage = 10;
    this.speed = 300;
    this.maxDistance = 300;
    this.traveledDistance = 0;
    this.cooldown = 1000;
  }
  fire(x: number, y: number) {
    this.activateProjectile(true);
    this.body.reset(x, y);
    this.setVelocityX(this.speed);
  }
  isOutOfRange() {
    return this.traveledDistance && this.traveledDistance >= this.maxDistance;
  }
  protected preUpdate(time: number, delta: number): void {
    super.preUpdate(time, delta);
    this.traveledDistance += this.body.deltaAbsX();
    if (this.isOutOfRange()) {
      this.activateProjectile(false);
      this.body.reset(0, 0);
      this.traveledDistance = 0;
    }
  }
  deliversHit(target: Enemy) {
    this.activateProjectile(false);
    this.traveledDistance = 0;
    new SpriteEffect(this.scene, 0, 0, "hit-effect").playOn(target);
    this.body.reset(0, 0);
  }
  activateProjectile(status: boolean) {
    this.setActive(status);
    this.setVisible(status);
  }
}

export default Projectile;
