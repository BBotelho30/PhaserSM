export class WorldScene extends Phaser.Scene {

    constructor() {
        super('WorldScene');
    }

    preload() {

        //imagem fundo
        this.load.image('imagemFundo', 'assets/fundoInicio.png');

        //imagem botões
        this.load.image('botaoJogar', 'assets/jogar.png');    
        this.load.image('botaoRegras', 'assets/regras.png');
    }

    create() {
       // Obter dimensões do canvas (320x480)
        const larguraDoJogo = this.sys.game.config.width; 
        const alturaDoJogo  = this.sys.game.config.height; 

        // Adicionar a imagem no centro do ecrã (160, 240)
        this.fundo = this.add.image(larguraDoJogo / 2, alturaDoJogo / 2, 'imagemFundo');

        // Centralizar imagem no canvas.
        this.fundo.displayWidth = larguraDoJogo;
        this.fundo.displayHeight = alturaDoJogo;

        const yBotao = alturaDoJogo * 0.8; 
        
        const escalaBotao = 0.33;

        const espacobotao = 75;

        // Botão JOGAR 
        this.botaoJogar = this.add.image(
            (larguraDoJogo / 2) - espacobotao, 
            yBotao, 
            'botaoJogar'
        )
        .setInteractive() 
        .setScale(escalaBotao); 

        this.botaoJogar.on('pointerdown', () => {
            this.scene.start('GameScene'); 
        });

        // Botão REGRAS 
        this.botaoRegras = this.add.image(
            (larguraDoJogo / 2) + espacobotao, 
            yBotao, 
            'botaoRegras'
        )
        .setInteractive() 
        .setScale(escalaBotao); 

        this.botaoRegras.on('pointerdown', () => {
            this.scene.start('Rules'); 
        });
    }

    update() {
        
    }
}