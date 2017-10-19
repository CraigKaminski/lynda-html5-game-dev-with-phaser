// tslint:disable:ordered-imports
import 'p2';
import 'pixi';
import 'phaser';
// tslint:enable:ordered-imports

import { Boot } from './states/Boot';
import { Game } from './states/Game';
import { Preloader } from './states/Preloader';
import { StartMenu } from './states/StartMenu';

const game = new Phaser.Game(540, 960, Phaser.AUTO, '', null);
game.state.add('Boot', Boot);
game.state.add('Preloader', Preloader);
game.state.add('StartMenu', StartMenu);
game.state.add('Game', Game);
game.state.start('Boot');
