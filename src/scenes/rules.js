export class Rules extends Phaser.Scene {

    constructor() {
        super('Rules');
    }

    preload() {
        this.load.image('RegrasImagem', 'assets/regras2.png');
        this.load.image('botaoVoltar', 'assets/voltar.png')
    }

    create() {
        // Obter dimensões do canvas (320x480)
        const larguraDoJogo = this.sys.game.config.width; 
        const alturaDoJogo  = this.sys.game.config.height; 

        // Adicionar a imagem no centro do ecrã (160, 240)
        this.fundo = this.add.image(larguraDoJogo / 2, alturaDoJogo / 2, 'RegrasImagem');

        // Centralizar imagem no canvas.
        this.fundo.displayWidth = larguraDoJogo;
        this.fundo.displayHeight = alturaDoJogo;

        //tamanho
        const escalaBotaoVoltar = 0.25;
        //tamanho ao passar o mouse
        const escalaBotaoVoltarHover = 0.30;

        this.botaoVoltar = this.add.image(
            larguraDoJogo * 0.15, 
            alturaDoJogo * 0.14,  
            'botaoVoltar'
        )
        .setInteractive() // Torna o botão clicável
        .setScale(escalaBotaoVoltar); // Aplica a escala definida
        
        this.botaoVoltar.on('pointerover', () => {
            this.botaoVoltar.setScale(escalaBotaoVoltarHover); // Aumenta a escala
        });

        // Quando o ponteiro sai da área do botão
        this.botaoVoltar.on('pointerout', () => {
            this.botaoVoltar.setScale(escalaBotaoVoltar); // Volta à escala original
        });

        // volta para o menu principal
        this.botaoVoltar.on('pointerdown', () => {
            this.scene.start('WorldScene'); 
        });
        
    }
    
}