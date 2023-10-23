import Phaser from "phaser";
import initAnimations from "./anims/playerAnims";
import collidable from "../mixins/collidable";
import HealthBar from "../hud/healthbar";
import Enemy from "./enemy.entity";
import Projectiles from "../attacks/projectiles";
import animsMixins from "../mixins/animsMixins";
import MeleeWeapon from "../attacks/melee-weapon";

class Player extends Phaser.Physics.Arcade.Sprite {
  cursors: Phaser.Types.Input.Keyboard.CursorKeys;
  gravity: number;
  playerSpeed: number;
  jumpCount: number;
  consecutiveJumps: number;
  addCollider: (otherGameObject: any, callback?: Function) => void;
  hasBeenHit: boolean;
  bounceVelocity: number;
  health: number;
  hp: HealthBar;
  projectiles: Projectiles;
  lastDirection: number;
  isPlayingAnims: (key: string) => boolean;
  meleeWeapon: MeleeWeapon;
  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, "player");
    scene.physics.add.existing(this);
    scene.add.existing(this);
    this.init();
    this.initEvents();
    Object.assign(this, collidable);
    Object.assign(this, animsMixins);
  }
  init() {
    this.projectiles = new Projectiles(this.scene);
    this.health = 100;
    this.hp = new HealthBar(this.scene, 0, 0, 2, this.health);
    this.jumpCount = 0;
    this.hasBeenHit = false;
    this.bounceVelocity = 250;
    this.consecutiveJumps = 1;
    this.gravity = 500;
    this.playerSpeed = 200;
    this.cursors = this.scene.input.keyboard.createCursorKeys();
    this.lastDirection = Phaser.Physics.Arcade.FACING_RIGHT;
    this.meleeWeapon = new MeleeWeapon(this.scene, 0, 0, "sword-attack");
    this.setSize(20, 35);
    this.setGravityY(500);
    this.setCollideWorldBounds(true);
    initAnimations(this.scene.anims);
    this.scene.input.keyboard.on("keydown-Q", () => {
      this.projectiles.fireProjectile(this);
      this.play("throw", true);
    });
    this.scene.input.keyboard.on("keydown-E", () => {
      // this.projectiles.fireProjectile(this);
      this.play("throw", true);
      this.meleeWeapon.swing(this);
    });
  }

  initEvents() {
    this.scene.events.on(Phaser.Scenes.Events.UPDATE, this.update, this);
  }

  update() {
    if (this.hasBeenHit) return;
    const { left, right, space, up } = this.cursors;
    const isSpaceJustDown = Phaser.Input.Keyboard.JustDown(space);
    const isUpJustDown = Phaser.Input.Keyboard.JustDown(up);
    const onFloor = (this.body as Phaser.Physics.Arcade.Body).onFloor();

    if (left.isDown) {
      this.setVelocityX(-this.playerSpeed);
      this.setFlipX(true);
      this.lastDirection = Phaser.Physics.Arcade.FACING_LEFT;
    } else if (right.isDown) {
      this.lastDirection = Phaser.Physics.Arcade.FACING_RIGHT;
      this.setVelocityX(this.playerSpeed);
      this.setFlipX(false);
    } else {
      this.setVelocityX(0);
    }
    if (
      (isSpaceJustDown || isUpJustDown) &&
      (onFloor || this.jumpCount < this.consecutiveJumps)
    ) {
      this.setVelocityY(-this.playerSpeed * 1.5);
      this.jumpCount++;
    }
    if (onFloor) this.jumpCount = 0;
    if (this.isPlayingAnims("throw")) return;
    onFloor
      ? this.body.velocity.x !== 0
        ? this.play("run", true)
        : this.play("idle", true)
      : this.play("jump", true);
  }
  takesHit(initator: Enemy) {
    if (this.hasBeenHit) return;
    this.hasBeenHit = true;
    this.bounceOff();
    const hitAnim = this.playDamageTween();
    this.health -= initator.damage;
    this.hp.decrease(this.health);
    this.scene.time.delayedCall(1000, () => {
      this.hasBeenHit = false;
      hitAnim.stop();
      this.clearTint();
    });
    // this.scene.time.addEvent({
    //   delay: 1000,
    //   callback: () => {
    //     this.hasBeenHit = false;
    //   },
    //   loop: false,
    // });
  }
  playDamageTween() {
    return this.scene.tweens.add({
      targets: this,
      duration: 100,
      repeat: -1,
      tint: 0xffffff,
    });
  }
  bounceOff() {
    this.setVelocity(
      this.body.touching.right ? -this.bounceVelocity : this.bounceVelocity,
      -this.bounceVelocity
    );
  }
}
export default Player;
