export class BootScene extends Phaser.Scene {

    constructor() {
        super('BootScene');
    }

    preload() {

        this.load.image('fundo', 'assets/fundoInicio.png');
    }

    create() {
        // -- Iniciar uma nova Scene
        this.scene.start('WorldScene');
        
    }
    
}
