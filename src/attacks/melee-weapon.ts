import Player from "../entities/player.entity";

class MeleeWeapon extends Phaser.Physics.Arcade.Sprite {
  damage: number;
  attackSpeed: number;
  weaponName: string;
  wielder?: Player;
  constructor(scene: Phaser.Scene, x: number, y: number, weaponName: string) {
    super(scene, x, y, weaponName);
    scene.add.existing(this);
    scene.physics.add.existing(this);
    this.damage = 15;
    this.attackSpeed = 1000;
    this.weaponName = weaponName;
    this.wielder = null;
    this.activateWeapon(false);
  }
  swing(wielder: Player) {
    this.wielder = wielder;
    this.activateWeapon(true);
    this.body.reset(wielder.x, wielder.y);
  }

  activateWeapon(status: boolean) {
    this.setActive(status);
    this.setVisible(status);
  }
}

export default MeleeWeapon;
