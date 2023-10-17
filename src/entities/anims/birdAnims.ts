export default (anims: Phaser.Animations.AnimationManager) => {
  anims.create({
    key: "birdman-idle",
    frames: anims.generateFrameNumbers("birdman", {
      start: 0,
      end: 8,
    }),
    frameRate: 12,
    repeat: -1,
  });
  anims.create({
    key: "birdman-hurt",
    frames: anims.generateFrameNumbers("birdman", {
      start: 25,
      end: 26,
    }),
    frameRate: 10,
    repeat: 0,
  });
};
