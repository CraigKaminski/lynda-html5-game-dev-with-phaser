export class Preloader extends Phaser.State {
  private preloadBar: Phaser.Sprite;
  private titleText: Phaser.Image;
  private ready: boolean = false;

  public preload() {
    this.preloadBar = this.add.sprite(this.world.centerX, this.world.centerY, 'preloadBar');
    this.preloadBar.anchor.setTo(0.5, 0.5);
    this.load.setPreloadSprite(this.preloadBar);
    this.titleText = this.add.image(this.world.centerX, this.world.centerY - 220, 'titleImage');
    this.titleText.anchor.setTo(0.5, 0.5);
    this.load.image('titleScreen', 'images/TitleBG.png');
    this.load.bitmapFont('eightbitwonder', 'fonts/eightbitwonder.png', 'fonts/eightbitwonder.fnt');
  }

  public create() {
    // this.preloadBar.cropEnabled = false;
  }

  public update() {
    this.ready = true;
    this.state.start('StartMenu');
  }
}
