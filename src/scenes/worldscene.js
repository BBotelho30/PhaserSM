export class WorldScene extends Phaser.Scene {

    constructor() {
        super('WorldScene');
    }

    preload() {

        this.load.image('imagemFundo', 'assets/fundoInicio.png');
        this.load.image('botaoJogar', 'assets/jogar.png');    
        this.load.image('botaoRegras', 'assets/regras.png');
        this.load.image('thor', 'assets/thor.png');

        this.load.audio('somBotao', 'assets/audio/botao.wav')
        

    }

    create() {

        let somBotao = this.sound.add('somBotao');

       // Obter dimensões do canvas (320x480)
        const larguraDoJogo = this.sys.game.config.width;
        const alturaDoJogo  = this.sys.game.config.height; 

        // Adicionar a imagem no centro do ecrã (160, 240)
        this.fundo = this.add.image(larguraDoJogo / 2, alturaDoJogo / 2, 'imagemFundo');

        // Centralizar imagem no canvas.
        this.fundo.displayWidth = larguraDoJogo;
        this.fundo.displayHeight = alturaDoJogo;

        const yBotao = alturaDoJogo * 0.85; 
        
        const escalaBotao = 0.30;

        const espacobotao = 75;

        const escalaBotaoRato = 0.35;


        // Botão JOGAR 
        this.botaoJogar = this.add.image(
            (larguraDoJogo / 2) - espacobotao, 
            yBotao, 
            'botaoJogar'
        )
        .setInteractive() 
        .setScale(escalaBotao); 

        this.botaoJogar.on('pointerdown', () => {
            somBotao.play();
            this.scene.start('GameScene'); 
        });

        this.botaoJogar.on('pointerover', () => {
            this.botaoJogar.setScale(escalaBotaoRato); // Aumenta a escala
        });

        // Quando o ponteiro sai da área do botão
        this.botaoJogar.on('pointerout', () => {
            this.botaoJogar.setScale(escalaBotao); // Volta à escala original
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
            somBotao.play();
            this.scene.start('Rules'); 
        });

        this.botaoRegras.on('pointerover', () => {
            this.botaoRegras.setScale(escalaBotaoRato); // Aumenta a escala
        });

        // Quando o ponteiro sai da área do botão
        this.botaoRegras.on('pointerout', () => {
            this.botaoRegras.setScale(escalaBotao); // Volta à escala original
        });
    }

    update() {
        
    }
}