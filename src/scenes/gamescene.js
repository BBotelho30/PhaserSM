export class GameScene extends Phaser.Scene {

    constructor() {
        super('GameScene');
    }

    preload() {
        this.load.image('Fundo', 'assets/fundo.png');
    }

    create() {
        // Obter dimensões do canvas (320x480)
        const larguraDoJogo = this.sys.game.config.width; 
        const alturaDoJogo  = this.sys.game.config.height; 

        // O this.add.tileSprite faz com que o fundo seja repetido e movido.
        this.fundo = this.add.tileSprite(0, 0, larguraDoJogo, alturaDoJogo, 'Fundo');

        //Define a origem do TileSprite para o canto superior esquerdo (0,0)
        this.fundo.setOrigin(0, 0);
        
    }

    update(){

        //Incrementa a posição Y da textura do TileSprite em 2 pixels a cada frame.
        //Faz com que a textura da imagem se desloque para baixo
       this.fundo.tilePositionY += 2;
    }
    
}