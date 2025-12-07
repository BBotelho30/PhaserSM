export class GameLose extends Phaser.Scene {

    constructor() {
        super('GameLose'); // Chave da cena
    }

    preload() {
        this.load.image('Fundo', 'assets/fundo.png');
        this.load.image('botaoMenu', 'assets/menu.png');
        this.load.image('botaoJogar', 'assets/jogar.png');

    }

    create() {
        const larguraDoJogo = this.sys.game.config.width;
        const alturaDoJogo = this.sys.game.config.height;

        this.fundo = this.add.image(larguraDoJogo / 2, alturaDoJogo / 2, 'Fundo');

        // Centralizar imagem no canvas.
        this.fundo.displayWidth = larguraDoJogo;
        this.fundo.displayHeight = alturaDoJogo;

        const yBotao = alturaDoJogo * 0.85; 
        
        const escalaBotao = 0.30;

        const espacobotao = 75;

        const escalaBotaoRato = 0.35;


        // Título "PERDEU"
        this.add.text(
            larguraDoJogo / 2, 
            alturaDoJogo / 2 - 50, 
            'PERDEU', 
            { fontSize: '50px', fill: '#FF0000', fontFamily: 'Arial Black' }
        ).setOrigin(0.5);


        // Botão Menu
        this.botaoMenu = this.add.image(
            (larguraDoJogo / 2) + espacobotao, 
            yBotao, 
            'botaoMenu'
        )
        .setInteractive() 
        .setScale(escalaBotao); 

        this.botaoMenu.on('pointerdown', () => {
            this.scene.start('WorldScene'); 
        });

        this.botaoMenu.on('pointerover', () => {
            this.botaoMenu.setScale(escalaBotaoRato); // Aumenta a escala
        });

        // Quando o ponteiro sai da área do botão
        this.botaoMenu.on('pointerout', () => {
            this.botaoMenu.setScale(escalaBotao); // Volta à escala original
        });

        // Botão Voltar a Jogar
        this.botaoVoltarJogar = this.add.image(
            (larguraDoJogo / 2) - espacobotao, 
            yBotao, 
            'botaoJogar'
        )
        .setInteractive() 
        .setScale(escalaBotao);

        this.botaoVoltarJogar.on('pointerdown', () => {
            this.scene.start('GameScene'); 
        });

        this.botaoVoltarJogar.on('pointerover', () => {
            this.botaoVoltarJogar.setScale(escalaBotaoRato); // Aumenta a escala
        });

        // Quando o ponteiro sai da área do botão
        this.botaoVoltarJogar.on('pointerout', () => {
            this.botaoVoltarJogar.setScale(escalaBotao); // Volta à escala original
        });



    }
}