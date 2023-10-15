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
};
