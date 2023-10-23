import EffectManager from "../effects/effect-manager";
import Enemy from "../entities/enemy.entity";
import Player from "../entities/player.entity";

class MeleeWeapon extends Phaser.Physics.Arcade.Sprite {
  damage: number;
  attackSpeed: number;
  weaponName: string;
  wielder?: Player;
  weaponAnim: string;
  effectManager: EffectManager;
  constructor(scene: Phaser.Scene, x: number, y: number, weaponName: string) {
    super(scene, x, y, weaponName);
    scene.add.existing(this);
    scene.physics.add.existing(this);
    this.damage = 15;
    this.attackSpeed = 1000;
    this.weaponName = weaponName;
    this.weaponAnim = weaponName + "-swing";
    this.effectManager = new EffectManager(this.scene);
    this.wielder = null;
    this.setOrigin(0.5, 0.5);
    this.setDepth(10);
    this.activateWeapon(false);
    this.on("animationcomplete", (animation: Phaser.Animations.Animation) => {
      if (animation.key === this.weaponAnim) {
        this.activateWeapon(false);
        this.body.checkCollision.none = false;
        this.body.reset(0, 0);
      }
    });
  }
  protected preUpdate(time: number, delta: number): void {
    super.preUpdate(time, delta);
    if (!this.active) return;
    this.setFlipX(
      this.wielder.lastDirection === Phaser.Physics.Arcade.FACING_LEFT
    );
    this.body.reset(this.wielder.x, this.wielder.y);
  }
  swing(wielder: Player) {
    this.wielder = wielder;
    this.activateWeapon(true);
    this.body.reset(wielder.x, wielder.y);
    this.anims.play(this.weaponAnim, true);
  }

  activateWeapon(status: boolean) {
    this.setActive(status);
    this.setVisible(status);
  }
  deliversHit(target: Enemy) {
    const impactPosition = { x: this.x, y: this.y };
    this.body.reset(0, 0);
    this.effectManager.playEffectOn("hit-effect", target, impactPosition);
    this.body.checkCollision.none = true;
  }
}

export default MeleeWeapon;
