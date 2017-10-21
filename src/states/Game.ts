export class Game extends Phaser.State {
  private totalBunnies = 20;
  private bunnyGroup: Phaser.Group;
  private totalSpacerocks = 13;
  private spacerockGroup: Phaser.Group;
  private burst: Phaser.Particles.Arcade.Emitter;
  private gameover = false;
  private countdown: Phaser.BitmapText;
  private overmessage: Phaser.BitmapText;
  private secondsElapsed = 0;
  private timer: Phaser.Timer;
  private music: Phaser.Sound;
  private ouch: Phaser.Sound;
  private boom: Phaser.Sound;
  private ding: Phaser.Sound;

  public create() {
    this.timer = this.time.create(false);
    this.timer.loop(1000, this.updateSeconds, this);
    this.music = this.add.audio('game_audio');
    this.music.play('', 0, 0.3, true);
    this.ouch = this.add.audio('hurt_audio');
    this.boom = this.add.audio('explosion_audio');
    this.ding = this.add.audio('select_audio');
    this.buildWorld();
  }

  public update() {
    this.physics.arcade.overlap(this.spacerockGroup, this.burst, this.burstCollision, undefined, this);
    this.physics.arcade.overlap(this.spacerockGroup, this.bunnyGroup, this.bunnyCollision, undefined, this);
    this.physics.arcade.overlap(this.bunnyGroup, this.burst, this.friendlyFire, undefined, this);
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

  private bunnyCollision(r: Phaser.Sprite, b: Phaser.Sprite) {
    if (b.exists) {
      this.ouch.play();
      this.resetRock(r);
      this.makeGhost(b);
      b.kill();
      this.totalBunnies--;
      this.checkBunniesLeft();
    }
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

  private buildEmitter() {
    this.burst = this.add.emitter(0, 0, 80);
    this.burst.minParticleScale = 0.3;
    this.burst.maxParticleScale = 1.2;
    this.burst.minParticleSpeed.setTo(-30, 30);
    this.burst.maxParticleSpeed.setTo(30, -30);
    this.burst.makeParticles('explosion', undefined, undefined, true);
    this.input.onDown.add(this.fireBurst, this);
  }

  private buildSpacerocks() {
    this.spacerockGroup = this.add.group();
    for (let i = 0; i < this.totalSpacerocks; i++) {
      const randomX = this.rnd.integerInRange(0, this.world.width);
      const randomY = this.rnd.realInRange(-1500, 0);
      const r = this.spacerockGroup.create(randomX, randomY, 'spacerock', 'SpaceRock0000');
      const scale = this.rnd.realInRange(0.3, 1.0);
      r.scale.x = scale;
      r.scale.y = scale;
      this.physics.enable(r, Phaser.Physics.ARCADE);
      r.enableBody = true;
      r.body.velocity.y = this.rnd.integerInRange(200, 400);
      r.animations.add('Fall');
      r.animations.play('Fall', 24, true);
      r.checkWorldBounds = true;
      r.events.onOutOfBounds.add(this.resetRock, this);
    }
  }

  private buildWorld() {
    this.add.image(0, 0, 'sky');
    this.add.image(0, 800, 'hill');
    this.buildBunnies();
    this.buildSpacerocks();
    this.buildEmitter();
    this.countdown = this.add.bitmapText(10, 10, 'eightbitwonder', 'Bunnies Left ' + this.totalBunnies, 20);
    this.timer.start();
  }

  private burstCollision(r: Phaser.Sprite, b: Phaser.Sprite) {
    this.respawnRock(r);
  }

  private checkBunniesLeft() {
    if (this.totalBunnies <= 0) {
      this.gameover = true;
      this.music.stop();
      this.countdown.setText('Bunnies Left 0');
      this.overmessage = this.add.bitmapText(this.world.centerX - 180, this.world.centerY - 40,
        'eightbitwonder', 'GAME OVER\n\n' + this.secondsElapsed, 42);
      this.overmessage.align = 'center';
      this.overmessage.inputEnabled = true;
      this.overmessage.events.onInputDown.addOnce(this.quitGame, this);
    } else {
      this.countdown.setText('Bunnies Left ' + this.totalBunnies);
    }
  }

  private fireBurst(pointer: Phaser.Input) {
    if (this.gameover === false) {
      this.boom.play();
      this.boom.volume = 0.2;
      this.burst.emitX = pointer.x;
      this.burst.emitY = pointer.y;
      this.burst.start(true, 2000, undefined, 20);
    }
  }

  private friendlyFire(b: Phaser.Sprite, e: Phaser.Sprite) {
    if (b.exists) {
      this.ouch.play();
      this.makeGhost(b);
      b.kill();
      this.totalBunnies--;
      this.checkBunniesLeft();
    }
  }

  private makeGhost(b: Phaser.Sprite) {
    const bunnyghost = this.add.sprite(b.x - 20, b.y - 180, 'ghost');
    bunnyghost.anchor.setTo(0.5, 0.5);
    bunnyghost.scale.x = b.scale.x;
    this.physics.enable(bunnyghost, Phaser.Physics.ARCADE);
    // bunnyghost.enableBody = true;
    bunnyghost.checkWorldBounds = true;
    bunnyghost.body.velocity.y = -800;
  }

  private quitGame(pointer: Phaser.Input) {
    this.ding.play();
    this.state.start('StartMenu');
  }

  private resetRock(r: Phaser.Sprite) {
    if (r.y > this.world.height) {
      this.respawnRock(r);
    }
  }

  private respawnRock(r: Phaser.Sprite) {
    if (this.gameover === false ) {
      r.reset(this.rnd.integerInRange(0, this.world.width), this.rnd.realInRange(-1500, 0));
      r.body.velocity.y = this.rnd.integerInRange(200, 400);
    }
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

  private updateSeconds() {
    this.secondsElapsed++;
  }
}
