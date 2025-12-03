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

    }

    create() {
        // -- Iniciar uma nova Scene
        this.scene.start('WorldScene');
        
    }
    
}
