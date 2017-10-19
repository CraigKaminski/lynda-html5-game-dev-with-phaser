export class Boot extends Phaser.State {
  public preload() {
    this.load.image('preloadBar', 'images/loader_bar.png');
    this.load.image('titleImage', 'images/TitleImage.png');
  }

  public create() {
    this.input.maxPointers = 1;
    this.stage.disableVisibilityChange = false;
    this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    this.scale.minWidth = 270;
    this.scale.minHeight = 480;
    this.scale.pageAlignHorizontally = true;
    this.scale.pageAlignVertically = true;
    // this.scale.forcePortrait = true;

    this.input.addPointer();
    this.stage.backgroundColor = '#171642';

    this.state.start('Preloader');
  }
}
