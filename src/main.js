import { BootScene } from './scenes/bootscene.js';
import { WorldScene } from './scenes/worldscene.js';
import { GameScene } from './scenes/GameScene.js';
import { Rules } from './scenes/rules.js';
import {GameLose} from './scenes/gameLose.js';
import {GameWin} from './scenes/GameWin.js';

const config = {
    type: Phaser.AUTO,
    parent: 'game-container',
    width: 800,
    height: 500,
    backgroundColor: '#000000',
    autoResize: true,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: false
        }
    },

    scene: [
        BootScene,
        WorldScene,
        GameScene,
        Rules,
        GameLose,
        GameWin
    ],

    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
}

new Phaser.Game(config);
            