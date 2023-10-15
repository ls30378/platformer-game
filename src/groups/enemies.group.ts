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
}

export default Enemies;
