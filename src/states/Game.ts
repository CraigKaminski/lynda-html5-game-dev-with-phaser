export class Game extends Phaser.State {
  private totalBunnies = 20;
  private bunnyGroup: Phaser.Group;

  public create() {
    this.buildWorld();
  }

  public update() {

  }

  private assignBunnyMovement(b: Phaser.Sprite) {
    const bPosition = Math.floor(this.rnd.realInRange(50, this.world.width - 50));
    const bDelay = this.rnd.integerInRange(2000, 6000);
    if (bPosition < b.x) {
      b.scale.x = 1;
    } else {
      b.scale.x = -1;
    }
    const t = this.add.tween(b).to({x: bPosition}, 3500, Phaser.Easing.Quadratic.InOut, true, bDelay);
    t.onStart.add(this.startBunny, this);
    t.onComplete.add(this.stopBunny, this);
  }

  private buildBunnies() {
    this.bunnyGroup = this.add.group();
    this.bunnyGroup.enableBody = true;
    for (let i = 0; i < this.totalBunnies; i++) {
      const randomX = this.rnd.integerInRange(50, this.world.width - 50);
      const randomY = this.rnd.integerInRange(this.world.height - 100, this.world.height - 60);
      const b: Phaser.Sprite = this.bunnyGroup.create(randomX, randomY, 'bunny', 'Bunny0000');
      b.anchor.setTo(0.5, 0.5);
      b.body.moves = false;
      b.animations.add('Rest', Phaser.ArrayUtils.numberArray(1, 58));
      b.animations.add('Walk', Phaser.ArrayUtils.numberArray(68, 107));
      b.animations.play('Rest', 24, true);
      this.assignBunnyMovement(b);
    }
  }

  private buildWorld() {
    this.add.image(0, 0, 'sky');
    this.add.image(0, 800, 'hill');
    this.buildBunnies();
  }

  private startBunny(b: Phaser.Sprite) {
    b.animations.stop('Rest');
    b.animations.play('Walk', 24, true);
  }

  private stopBunny(b: Phaser.Sprite) {
    b.animations.stop('Walk');
    b.animations.play('Rest', 24, true);
    this.assignBunnyMovement(b);
  }
}
