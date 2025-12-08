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

        this.load.image('raio', 'assets/raio.png');
        this.load.image('raio2', 'assets/raio2.png');

        this.load.audio('disparoSom', 'assets/audio/laser1.wav');
        
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
        this.anims.create({ 
            key: 'up', 
            frames: this.anims.generateFrameNumbers('alien', { frames: [0, 1, 2] }), 
            frameRate: 10, 
            repeat: -1 
        });
        
        this.anims.create({ 
            key: 'right', 
            frames: this.anims.generateFrameNumbers('alien', { frames: [3, 4, 5] }), 
            frameRate: 10, 
            repeat: -1 
        });


        this.anims.create({ 
            key: 'down', 
            frames: this.anims.generateFrameNumbers('alien', { frames: [6, 7, 8] }), 
            frameRate: 10, 
            repeat: -1 
        });

        this.anims.create({ 
            key: 'left', 
            frames: this.anims.generateFrameNumbers('alien', { frames: [9, 10, 11] }), 
            frameRate: 10, 
            repeat: -1 
        });
        
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

        this.maxInimigos = 50;

        this.tempoSpawn = 3500; // Tempo inicial de spawn em milissegundos
        
        //Raios do alien contra inimigos
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

        //Colisão entre alien e inimigos (Tocar no Inimigo)
        this.physics.add.collider(
            this.alien, 
            this.inimigos, 
            this.acertouAlien,
            null, 
            this
        );



        //FAZER UM NIVEL 
        this.nivel = 1;
        this.pontosProximoNivel = 70;
        this.temposSpawn = 2000;

        this.timerSpawn = this.time.addEvent({
            delay: this.temposSpawn,
            callback: this.spawnInimigo,
            callbackScope: this,
            loop: true
        });

        //Carregar o som do disparo
        this.somDisparo = this.sound.add('disparoSom');

        //Raio do inimigo
        this.raiosInimigos = this.physics.add.group({ 
            classType: Phaser.Physics.Arcade.Image,
            runChildUpdate: true,
            allowGravity: false,
        });


        //Colisão entre alien e inimigos (Ser atingido)
        this.physics.add.collider(
            this.alien, 
            this.raiosInimigos, 
            this.acertouAlien,
            null, 
            this);

        this.velocidadeRaioInimigo = 400;

    }

    shutdown() {
        if (this.timerSpawn) { this.timerSpawn.destroy(); }
        if (this.raios) this.raios.destroy(true);
        if (this.raiosInimigos) this.raiosInimigos.destroy(true);
        if (this.inimigos) this.inimigos.destroy(true);
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

        if (this.pontuacao >= this.pontosProximoNivel && this.pontosProximoNivel !== Infinity) {
            this.passarNivel();
        }
    
    }

    dispararRaio() {
    let raio = this.raios.create(this.alien.x + 15, this.alien.y - 5, 'raio');

    raio.setScale(0.5);
    raio.body.velocity.x = this.velocidadeRaio;

    // Quando sair da tela, destruir
    this.time.delayedCall(2000, () => {
        if (raio && raio.active) raio.destroy();
    });

    this.somDisparo.play();
}



    dispararRaioInimigo(inimigo) {
        let raio = this.raiosInimigos.create(inimigo.x - 20, inimigo.y, 'raio2');

        raio.setScale(0.5);
        raio.body.velocity.x = -this.velocidadeRaioInimigo;

         // destruir depois de 2 segundos
        this.time.delayedCall(2000, () => {
            if (raio && raio.active) raio.destroy();
        });
    }



    spawnInimigo() {

    if (this.inimigos.countActive(true) >= this.maxInimigos) return;

    const largura = this.sys.game.config.width;
    const altura = this.sys.game.config.height;

    const arrayInimigos = ['god1', 'god2', 'god3', 'god4'];
    const chave = Phaser.Math.RND.pick(arrayInimigos);

    let inimigo = this.inimigos.create(
        largura + 15,
        Phaser.Math.Between(50, altura - 50),
        chave
    );

    inimigo.setScale(0.4);
    inimigo.body.setVelocityX(-this.velocidadeInimigo);

    // Nivel 3 = inimigo dispara
    if (this.nivel === 3) {
        inimigo.timerDisparo = this.time.addEvent({
            delay: 700,
            callback: () => this.dispararRaioInimigo(inimigo),
            loop: true
        });
    }
}


    acertouInimigo(raio, inimigo) {

        if(inimigo.timerDisparo) {
            inimigo.timerDisparo.destroy();
        }

        inimigo.disableBody(true, true); 
        raio.disableBody(true, true);    

        this.pontuacao += 5; // Incrementa a pontuação em 10 pontos
        this.textoPontuacao.setText('Pontuação: ' + this.pontuacao); // Atualiza o texto da pontuação
    }

    acertouAlien(alien, objeto) {
        // O objeto que atingiu o alien (inimigo ou raio) é destruído
        objeto.destroy(true);      

        this.vidas -= 1; // O alien perde 1 vida
        this.textoVidas.setText('Vidas: ' + this.vidas);
        if (this.vidas <= 0) {
            this.scene.start('GameLose'); 
        }
    }


    passarNivel() {
    const larguraDoJogo = this.sys.game.config.width;
    const alturaDoJogo = this.sys.game.config.height;

    let textoMensagem = '';
    let novoTempoSpawn = this.tempoSpawn;
    let novaVelocidade = this.velocidadeInimigo;

    if (this.nivel === 1) {
        // TRANSITION PARA O NÍVEL 2 (70 pontos)
        this.nivel = 2; 
        this.pontosProximoNivel = 170; // Objetivo do Nível 2
        novaVelocidade = 220; 
        novoTempoSpawn = 1200; // Spawn mais rápido
        textoMensagem = 'NÍVEL 2!';
        
    } else if (this.nivel === 2) {
        // TRANSITION PARA O NÍVEL 3 (170 pontos)
        this.nivel = 3; 
        this.pontosProximoNivel = 270; // Objetivo do Nível 3
        novaVelocidade = 250; 
        novoTempoSpawn = 1000; // Spawn mais rápido
        textoMensagem = 'NÍVEL 3!';
        
    } else if (this.nivel === 3) {
        // Atingiu os pontos para ganhar
        this.scene.start('GameWin'); 
        return;
    }

    // Atualiza velocidade dos inimigos
    this.velocidadeInimigo = novaVelocidade;

    // Atualiza o timer de spawn se o tempo mudou
    if (novoTempoSpawn !== this.tempoSpawn) {
        this.tempoSpawn = novoTempoSpawn;
        if (this.timerSpawn) this.timerSpawn.destroy();
        this.timerSpawn = this.time.addEvent({
            delay: this.tempoSpawn, 
            callback: this.spawnInimigo, 
            callbackScope: this, 
            loop: true 
        });
    }

    // Mostra a mensagem de transição de nível
    if (textoMensagem) {
        const mensagemNivel = this.add.text(
            larguraDoJogo / 2, 
            alturaDoJogo / 2, 
            textoMensagem, 
            { fontSize: '35px', fill: '#1eff00ff' }
        )
        .setOrigin(0.5)
        .setDepth(100);

        // Remove a mensagem após 5 segundos
        this.time.delayedCall(5000, () => {
            mensagemNivel.destroy();
        }, [], this);
    }
}

}