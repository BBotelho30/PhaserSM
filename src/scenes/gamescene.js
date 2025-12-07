export class GameScene extends Phaser.Scene {

    constructor() {
        super('GameScene');
    }

    preload() {
        this.load.image('Fundo', 'assets/fundo.png');
        
        //spritesheet com os valores 32x48
        this.load.spritesheet('alien', 'assets/alien.png', { 
            frameWidth: 32, 
            frameHeight: 48 
        });

        this.load.image('raio', 'assets/raio.png');
        this.load.image('god1', 'assets/god1.png');
        this.load.image('god2', 'assets/god2.png');
        this.load.image('god3', 'assets/god3.png');
        this.load.image('god4', 'assets/god4.png');
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

        this.ultimoRaio = 0;

        this.inimigos = this.physics.add.group({
            allowGravity: false 
        });


        this.velocidadeInimigo = 150;

        this.maxInimigos = 15;

        //Fazer aparecer inimigos periodicamente
        this.time.addEvent({
            delay: 2500, //2.5seg 
            callback: this.spawnInimigo, 
            callbackScope: this, 
            loop: true 
        });

        //colisão entre raios e inimigos
        this.physics.add.collider(
            this.raios,        
            this.inimigos,     
            this.acertouInimigo, // Função a chamar quando a colisão acontece
            null,              // Função de callback de processamento (deixamos nulo)
            this              // O 'scope' (contexto) da função
        );

        this.pontuacao = 0;
        this.textoPontuacao = this.add.text(10, 10, 'Pontuação: 0', { fontSize: '25px', fill: '#ffffff' });

        this.vidas = 5,
        this.textoVidas = this.add.text(670, 10, 'Vidas: 5', { fontSize: '25px', fill: '#ffffff' });

        //Colisão entre alien e inimigos
        this.physics.add.collider(
            this.alien, 
            this.inimigos, 
            this.perderVida, 
            null, 
            this);

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
        
        // Lógica de Animação
        if (animacao) {
            if (this.alien.anims.currentAnim?.key !== animacao) {
                this.alien.anims.play(animacao);
            }
        } else {
            //Parar a animação e voltar ao Frame 7
            this.alien.anims.stop(); 
            this.alien.setFrame(7); 
        }

        if (this.teclaEspaco.isDown && this.time.now > this.ultimoRaio) {
            this.dispararRaio();
            
            //Tempo do próximo disparo para 200 milissegundos no futuro (Fire Rate)
            this.ultimoRaio = this.time.now + 200; 
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
            
            raio.checkWorldBounds = true;
            raio.outOfBoundsKill = true;
        }
    }

    spawnInimigo() {
    
        // Verifica se o número máximo de inimigos ativos foi atingido
        if (this.inimigos.countActive(true) >= this.maxInimigos) {
            return; 
        }

        const larguraDoJogo = this.sys.game.config.width;
        const alturaDoJogo = this.sys.game.config.height;

        const arrayInimigos = ['god1', 'god2', 'god3', 'god4'];
        const inimigosAleatorio = Phaser.Math.RND.pick(arrayInimigos);

        // Margem fixa de segurança (30) para evitar que os pés sejam cortados
        const margemFixa = 50; 
        
        // Posição X fora do ecrã à direita
        const xPos = larguraDoJogo + 15; 
        
        //Posição aleatória dentro das margens de segurança
        const yPos = Phaser.Math.Between(margemFixa, alturaDoJogo - margemFixa);

        // Cria o inimigo usando a chave aleatória
        let inimigo = this.inimigos.get(xPos, yPos, inimigosAleatorio);
        
        if (!inimigo) return; 

    
        inimigo.setActive(true);
    
        inimigo.setVisible(true);
        
        inimigo.setScale(0.4); 

        // Define a velocidade para mover o inimigo para a esquerda
        inimigo.body.setVelocityX(-this.velocidadeInimigo);
        
        inimigo.checkWorldBounds = true;
        inimigo.outOfBoundsKill = true; 
    }

    acertouInimigo(raio, inimigo) {
        inimigo.destroy(true); 
        raio.destroy(true);    

        this.pontuacao += 5; // Incrementa a pontuação em 10 pontos
        this.textoPontuacao.setText('Pontuação: ' + this.pontuacao); // Atualiza o texto da pontuação
    }

    perderVida(alien, inimigo) {
        inimigo.destroy(true);      

        this.vidas -= 1;
        this.textoVidas.setText('Vidas: ' + this.vidas);
        if (this.vidas <= 0) {
            this.scene.start('GameLose'); 
        }
        }
}