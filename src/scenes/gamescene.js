export class GameScene extends Phaser.Scene {

    constructor() {
        super('GameScene');
    }

    preload() {
        this.load.image('Fundo', 'assets/fundo.png');
        this.load.image('alien', 'assets/alien.png');
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
            larguraDoJogo / 2, // Inicia no centro horizontal
            alturaDoJogo * 0.9,  // Inicia perto do fundo (90% da altura)
            'alien'
        );

        this.alien.setCollideWorldBounds(true); // Impede que o alien saia do ecrã
        
        this.alien.setScale(0.2); 
        
        this.teclas = this.input.keyboard.createCursorKeys(); //saber que as teclas foram pressionadas

        this.velocidadeAlien = 220; //velocidade em pixels por segundo

        
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

        this.fundo.tilePositionY += 3; // Velocidade do movimento do fundo


        this.alien.body.setVelocity(0); // Parar o movimento do alien a cada frame

      
        if (this.teclas.left.isDown) {
            // Mover para a esquerda
            this.alien.body.setVelocityX(-this.velocidadeAlien);
        } else if (this.teclas.right.isDown) {
            // Mover para a direita
            this.alien.body.setVelocityX(this.velocidadeAlien);
        }

        if (this.teclas.up.isDown) {
            // Mover para cima
            this.alien.body.setVelocityY(-this.velocidadeAlien);
        } else if (this.teclas.down.isDown) {
            // Mover para baixo
            this.alien.body.setVelocityY(this.velocidadeAlien);
        }

        if (this.teclaEspaco.isDown && this.time.now > this.ultimaChaveRaio) {
            this.dispararRaio();
            
            // Define o tempo do próximo disparo para 200 milissegundos no futuro (Fire Rate)
            this.ultimaChaveRaio = this.time.now + 200; 
        }
    
    }

    dispararRaio() {
        // Pega no primeiro raio que está 'inativo' ou cria um novo se não houver
        let raio = this.raios.get(this.alien.x, this.alien.y - 20, 'raio'); 

        if (raio) {
            raio.setActive(true);  // Torna o raio visível e ativo
            raio.setVisible(true); // Torna o raio visível
            
            // Define a escala (ajuste se a imagem for muito grande)
            raio.setScale(0.1); 
            
            // Aplica a velocidade vertical para o raio se mover para cima
            raio.body.velocity.y = -this.velocidadeRaio; 
            
            // Faz com que o raio seja destruído quando sair do ecrã, para não acumular
            raio.checkWorldBounds = true;
            raio.outOfBoundsKill = true;
        }
    }
    
}