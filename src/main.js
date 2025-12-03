import { BootScene } from './scenes/bootscene.js';
import { WorldScene } from './scenes/worldscene.js';
import { GameScene } from './scenes/GameScene.js';
import { Rules } from './scenes/rules.js';

const config = {
    type: Phaser.AUTO,
    parent: 'game-container',
    width: 900,
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
        Rules
    ],

    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
}

new Phaser.Game(config);
            