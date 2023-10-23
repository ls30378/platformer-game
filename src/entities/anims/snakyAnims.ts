export default (anims: Phaser.Animations.AnimationManager) => {
  anims.create({
    key: "snaky-walk",
    frames: anims.generateFrameNumbers("snaky", {
      start: 0,
      end: 8,
    }),
    frameRate: 20,
    repeat: -1,
  });
  anims.create({
    key: "snaky-hurt",
    frames: anims.generateFrameNumbers("snaky", {
      start: 21,
      end: 22,
    }),
    frameRate: 10,
    repeat: 0,
  });
};
