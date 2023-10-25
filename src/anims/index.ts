export default (anims: Phaser.Animations.AnimationManager) => {
  anims.create({
    key: "hit-effect",
    frames: anims.generateFrameNumbers("hit-sheet", {
      start: 0,
      end: 4,
    }),
    frameRate: 10,
    repeat: 0,
  });
  anims.create({
    key: "sword-default-swing",
    frames: anims.generateFrameNumbers("sword-default", {
      start: 0,
      end: 2,
    }),
    frameRate: 10,
    repeat: 0,
  });
  anims.create({
    key: "fireball",
    frames: [
      {
        frame: "fireball-1",
        key: "fireball-1",
      },
      {
        frame: "fireball-2",
        key: "fireball-2",
      },
      {
        frame: "fireball-3",
        key: "fireball-3",
      },
    ],
    frameRate: 10,
    repeat: -1,
  });
};
