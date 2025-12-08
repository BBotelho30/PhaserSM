export class BootScene extends Phaser.Scene {

    constructor() {
        super('BootScene');
    }

    preload() {

        this.load.image('fundo', 'assets/fundoInicio.png');

        this.load.spritesheet('alien', 'assets/alien.png', { 
            frameWidth: 32,  
            frameHeight: 48 
        });
        
        this.load.image('raio', 'assets/raio.png');
        this.load.image('god1', 'assets/god1.png');
        this.load.image('raio2', 'assets/raio2.png');
        this.load.image('RegrasImagem', 'assets/regras2.png');

        this.load.audio('disparoSom', 'assets/audio/laser1.wav');
        this.load.audio('somPerdeu', 'assets/audio/somPerde.wav');
        this.load.audio('somGanhou', 'assets/audio/somGanha.wav');



    }

    create() {
        // -- Iniciar uma nova Scene
        this.scene.start('WorldScene');
        
    }
    
}
