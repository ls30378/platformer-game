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
    key: "iceball",
    frames: [
      {
        frame: "iceball-1",
        key: "iceball-1",
      },
      {
        frame: "iceball-2",
        key: "iceball-2",
      },
    ],
    frameRate: 10,
    repeat: -1,
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
  anims.create({
    key: "diamond-shine",
    frames: [
      {
        frame: "1",
        key: "diamond-1",
      },
      {
        frame: "1",
        key: "diamond-2",
      },
      {
        frame: "1",
        key: "diamond-3",
      },
      {
        frame: "1",
        key: "diamond-4",
      },

      {
        frame: "diamond-5",
        key: "diamond-5",
      },

      {
        frame: "diamond-6",
        key: "diamond-6",
      },
    ],
    frameRate: 10,
    repeat: -1,
  });
};
