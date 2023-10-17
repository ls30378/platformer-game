export default {
  isPlayingAnims(animsKey: string) {
    return this.anims.isPlaying && this.anims.getCurrentKey() === animsKey;
  },
};
