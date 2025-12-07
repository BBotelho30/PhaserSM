// scenes/gameoverscene.js
export class GameOver extends Phaser.Scene {

    constructor() {
        super('GameOver'); // Chave da cena
    }

    create() {
        const larguraDoJogo = this.sys.game.config.width;
        const alturaDoJogo = this.sys.game.config.height;

        // Título "PERDEU"
        this.add.text(
            larguraDoJogo / 2, 
            alturaDoJogo / 2 - 50, 
            'PERDEU', 
            { fontSize: '50px', fill: '#FF0000', fontFamily: 'Arial Black' }
        ).setOrigin(0.5);

        // Botão para voltar ao Menu (Opcional, mas recomendado)
        this.add.text(
            larguraDoJogo / 2, 
            alturaDoJogo / 2 + 50, 
            'Clique para Recomeçar', 
            { fontSize: '20px', fill: '#FFFFFF' }
        ).setOrigin(0.5)
        .setInteractive()
        .on('pointerdown', () => {
            // Reinicia a cena do menu inicial
            this.scene.start('WorldScene'); 
        });
    }
}