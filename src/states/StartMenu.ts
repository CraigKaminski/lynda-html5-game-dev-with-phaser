export class StartMenu extends Phaser.State {
  private startBG: Phaser.Image;
  private startPrompt: Phaser.BitmapText;

  public create() {
    this.startBG = this.add.image(0, 0, 'titleScreen');
    this.startBG.inputEnabled = true;
    this.startBG.events.onInputDown.addOnce(this.startGame, this);

    this.startPrompt = this.add.bitmapText(this.world.centerX - 155,
      this.world.centerY + 180, 'eightbitwonder', 'Touch to Start!', 24);
  }

  public startGame(pointer: Phaser.Pointer) {
    this.state.start('Game');
  }
}
