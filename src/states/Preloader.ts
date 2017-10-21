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
    this.load.image('hill', 'images/hill.png');
    this.load.image('sky', 'images/sky.png');
    this.load.atlasXML('bunny', 'images/spritesheets/bunny.png', 'images/spritesheets/bunny.xml');
    this.load.atlasXML('spacerock', 'images/spritesheets/SpaceRock.png', 'images/spritesheets/SpaceRock.xml');
    this.load.image('explosion', 'images/explosion.png');
    this.load.image('ghost', 'images/ghost.png');
    this.load.audio('explosion_audio', 'audio/explosion.mp3');
    this.load.audio('hurt_audio', 'audio/hurt.mp3');
    this.load.audio('select_audio', 'audio/select.mp3');
    this.load.audio('game_audio', 'audio/bgm.mp3');
  }

  public create() {
    // this.preloadBar.cropEnabled = false;
  }

  public update() {
    if (this.cache.isSoundDecoded('game_audio') && this.ready === false) {
      this.ready = true;
      this.state.start('StartMenu');
    }
  }
}
