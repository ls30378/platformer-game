import collidable from "../mixins/collidable";
import { getEnemyTypes } from "../types";

class Enemies extends Phaser.GameObjects.Group {
  addCollider: (otherGameObject: any, callback?: Function) => void;
  constructor(scene: Phaser.Scene) {
    super(scene);
    Object.assign(this, collidable);
  }
  getTypes() {
    return getEnemyTypes();
  }
  getProjectiles() {
    // const projectiles = new Phaser.GameObjects.Group(this.scene);
    const projectiles: any = [];
    const children = this.getChildren();
    children.forEach(
      (enemy) =>
        (enemy as any).projectiles &&
        projectiles.push((enemy as any).projectiles.getChildren())
    );
    return projectiles;
  }
}

export default Enemies;
