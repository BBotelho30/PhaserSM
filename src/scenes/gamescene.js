export class GameScene extends Phaser.Scene {

    constructor() {
        super('GameScene');
    }

    preload() {
        this.load.image('Fundo', 'assets/fundo.png');
        
        // Alteração 1: Carregar como Spritesheet com os valores 32x48
        this.load.spritesheet('alien', 'assets/alien.png', { 
            frameWidth: 32, 
            frameHeight: 48 
        });
        this.load.image('raio', 'assets/raio.png');
    }

    create() {
        //(320x480)
        const larguraDoJogo = this.sys.game.config.width; 
        const alturaDoJogo  = this.sys.game.config.height; 

        // tileSprite faz com que o fundo seja repetido e movido.
        this.fundo = this.add.tileSprite(0, 0, larguraDoJogo, alturaDoJogo, 'Fundo');

        //Define a origem do TileSprite para o canto superior esquerdo (0,0)
        this.fundo.setOrigin(0, 0);

        this.alien = this.physics.add.sprite(
            50, // Inicia no centro horizontal
            alturaDoJogo / 2,  // Inicia perto do fundo (90% da altura)
            'alien'
        );

        this.alien.setCollideWorldBounds(true); // Impede que o alien saia do ecrã
        
        this.alien.setScale(1.5); // Escala para o alienígena ser visível
        
        this.teclas = this.input.keyboard.createCursorKeys(); //saber que as teclas foram pressionadas

        this.velocidadeAlien = 220; //velocidade em pixels por segundo

        //Criação das Animações (Frames 0-11)
        this.anims.create({ key: 'up', frames: this.anims.generateFrameNumbers('alien', { frames: [0, 1, 2] }), frameRate: 10, repeat: -1 });
        this.anims.create({ key: 'right', frames: this.anims.generateFrameNumbers('alien', { frames: [3, 4, 5] }), frameRate: 10, repeat: -1 });
        this.anims.create({ key: 'down', frames: this.anims.generateFrameNumbers('alien', { frames: [6, 7, 8] }), frameRate: 10, repeat: -1 });
        this.anims.create({ key: 'left', frames: this.anims.generateFrameNumbers('alien', { frames: [9, 10, 11] }), frameRate: 10, repeat: -1 });
        
        // Frame inicial (Frame 7)
        this.alien.setFrame(7); 

        
        this.raios = this.physics.add.group({
            // Garante que os raios se movem e não são afetados pela gravidade
            runChildUpdate: true,
            allowGravity: false,
        });

        this.teclaEspaco = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE); // Tecla Espaço

        this.velocidadeRaio = 400;

        this.ultimaChaveRaio = 0;

        

    }

    update(){

        this.fundo.tilePositionX += 3; // Velocidade do movimento do fundo


        this.alien.body.setVelocity(0); // Parar o movimento do alien a cada frame

        let animacao = null; // Variável para controlar a animação
      
        if (this.teclas.left.isDown) {
            // Mover para a esquerda
            this.alien.body.setVelocityX(-this.velocidadeAlien);
            animacao = 'left';
        } else if (this.teclas.right.isDown) {
            // Mover para a direita
            this.alien.body.setVelocityX(this.velocidadeAlien);
            animacao = 'right';
        }

        if (this.teclas.up.isDown) {
            // Mover para cima
            this.alien.body.setVelocityY(-this.velocidadeAlien);
            animacao = 'up';
        } else if (this.teclas.down.isDown) {
            // Mover para baixo
            this.alien.body.setVelocityY(this.velocidadeAlien);
            animacao = 'down';
        }
        
        // Alteração 5: Lógica de Animação
        if (animacao) {
            if (this.alien.anims.currentAnim?.key !== animacao) {
                this.alien.anims.play(animacao);
            }
        } else {
            // Estado Parado: Parar a animação e voltar ao Frame 7
            this.alien.anims.stop(); 
            this.alien.setFrame(7); 
        }

        if (this.teclaEspaco.isDown && this.time.now > this.ultimaChaveRaio) {
            this.dispararRaio();
            
            // Define o tempo do próximo disparo para 200 milissegundos no futuro (Fire Rate)
            this.ultimaChaveRaio = this.time.now + 200; 
        }
    
    }

    dispararRaio() {
        // Pega no primeiro raio que está 'inativo' ou cria um novo se não houver
        let raio = this.raios.get(this.alien.x + 15, this.alien.y - 5, 'raio');

        if (raio) {
            raio.setActive(true);  // Torna o raio visível e ativo
            raio.setVisible(true); // Torna o raio visível
            
            // Define a escala (ajuste se a imagem for muito grande)
            raio.setScale(0.5); 

            raio.body.velocity.y = 0;
            
            // Aplica a velocidade vertical para o raio se mover para cima
            raio.body.velocity.x = this.velocidadeRaio; 
            
            // Faz com que o raio seja destruído quando sair do ecrã, para não acumular
            raio.checkWorldBounds = true;
            raio.outOfBoundsKill = true;
        }
    }
    
}