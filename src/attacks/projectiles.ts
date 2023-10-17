import Player from "../entities/player.entity";
import { getTimestamp } from "../utils/functions";
import Projectile from "./projectile";

class Projectiles extends Phaser.Physics.Arcade.Group {
  timeFromLastShoot: number;
  constructor(scene: Phaser.Scene) {
    super(scene.physics.world, scene);
    this.createMultiple({
      frameQuantity: 5,
      active: false,
      visible: false,
      key: "iceball",
      classType: Projectile,
    });
    this.timeFromLastShoot = null;
  }
  fireProjectile(initiator: Player) {
    const projectile = this.getFirstDead(false);
    const center = initiator.getCenter();
    let centerX;
    if (!projectile) return;
    if (
      this.timeFromLastShoot &&
      this.timeFromLastShoot + projectile.cooldown > getTimestamp()
    )
      return;
    if (initiator.lastDirection === Phaser.Physics.Arcade.FACING_RIGHT) {
      projectile.speed = Math.abs(projectile.speed);
      projectile.setFlipX(false);
      centerX = center.x + 10;
    } else {
      projectile.speed = -projectile.speed;
      projectile.setFlipX(true);
      centerX = center.x - 10;
    }
    projectile.fire(centerX, center.y);
    this.timeFromLastShoot = getTimestamp();
  }
}

export default Projectiles;
