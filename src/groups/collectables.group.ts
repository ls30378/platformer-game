import Collectable from "../collectables/collectable.entity";

class CollectablesGroup extends Phaser.Physics.Arcade.StaticGroup {
  constructor(scene: Phaser.Scene) {
    super(scene.physics.world, scene);
    this.createFromConfig({
      classType: Collectable,
    });
  }
  addFromLayer(collectables: Phaser.Tilemaps.ObjectLayer) {
    const { score: defaultScore, type } = this.mapProperties(
      collectables.properties
    );
    collectables.objects.forEach((c) => {
      const collectable = this.get(c.x, c.y, "diamond");
      const objProps = c.properties && this.mapProperties(c.properties);
      collectable.score = objProps?.score || defaultScore;
      collectable.setScale(
        collectable.score > 1 ? collectable.score / 50 + 1 : 1
      );
    });
  }
  mapProperties(propertiesList: any) {
    if (!propertiesList || !propertiesList.length) return;
    return propertiesList.reduce((map: any, obj: any) => {
      map[obj.name] = obj.value;
      return map;
    }, {});
  }
}

export default CollectablesGroup;
