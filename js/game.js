

var game;
var ballonHorizontalSpeed = 100;
var ballonVerticalSpeed = 15000;
var ballonMoveDelay = 0;
var ballonDistance = 10;
var gameBG; 
var score;
var canvas_height_max = 480;
var canvas_width_max = 320;
var theme;
var coinSound;
var crash;
var firstComet = 0;
var randomValue = 0;
var ufo;
var scale_ratio = 0;
var aspect_ratio;



window.onload = function(){
  game = new Phaser.Game(window.innerWidth, window.innerHeight, Phaser.AUTO, "");
  game.state.add("Boot", boot);
  game.state.add("Preload", preload);
  game.state.add("TitleScreen", titleScreen);
  game.state.add("PlayGame", playGame);
  game.state.add("GameOverScreen",gameOverScreen);
  game.state.start("Boot");
};

// Zum starten des Spiel um einen Ladebildschrim zu initialisieren.
var boot = function(game){};
boot.prototype = {
  preload: function(){
    game.load.images("loadings", "sprites/assets/loading.png");
  },
    create: function(){
      canvas_width = window.innerWidth * window.devicePixelRatio;
      console.log(window.devicePixelRatio);
      canvas_height = window.innerHeight * window.devicePixelRatio;
       aspect_ratio =  canvas_height / canvas_height_max;
      if(aspect_ratio > 1 && window.innerWidth > 363){ 
          scale_ratio = 1.2;

      }else if( window.innerWidth < 1000 ){ 
          scale_ratio = 0.9;
      }
    this.game.scale.fullScreenScaleMode = Phaser.ScaleManager.SHOW_ALL;
    game.scale.pageAlignHorizontally = true;
    game.scale.pageAlignVertically = true;
    this.game.scale.refresh();
      this.game.state.start("Preload");   
  } 

};



var preload = function(game){};
preload.prototype = {
  preload: function(){

    var loadingBar = this.add.sprite(game.width / 2, game.height / 2, "loadings");
        loadingBar.anchor.setTo(0.5);
        game.load.setPreloadSprite(loadingBar);
        game.load.image("startscreen", "sprites/assets/spacebackground.png");
      game.load.image("playbutton", "sprites/assets/playbutton.png");
      game.load.image("ballon", "sprites/assets/ufo.png");
      game.load.image("evilblock", "sprites/assets/evilblock.png");
      game.load.image("coin", "sprites/assets/gold.png");
      game.load.image("eismeteor", "sprites/assets/eismeteor.png");
       game.load.image("meteor", "sprites/assets/meteor.png");
       game.load.image("stoneexplose", "sprites/assets/stoneexplose.png");
       game.load.audio('theme', 'audio/octo.mp3');
       game.load.audio('coinSound', 'audio/coin.mp3');
       game.load.audio('crash', 'audio/bombcrash.mp3');
       game.load.audio('startbutton', 'audio/startbutton.mp3');
      game.load.audio('startmenu', 'audio/startmenu.mp3');
  },
  create: function(){
    this.game.state.start("TitleScreen");
  }
};



var titleScreen = function(game){};
titleScreen.prototype = {
  create: function(){
      var titleBG = game.add.sprite(0, 0, "startscreen");
      var playButton = game.add.button(game.width / 2, game.height - 150, "playbutton", this.startGame);
          playButton.anchor.set(0.5);
          var tween = game.add.tween(playButton).to({
          
               height:220
          }, 1500, "Linear", true, 0, -1); 
          tween.yoyo(true);
      },
   startGame: function(){
          this.game.state.start("PlayGame");     
     }

};



var playGame = function(game){};
playGame.prototype = {
  create: function(){
    var self = this;
    game.physics.startSystem(Phaser.Physics.ARCADE);  
    gameBG = game.add.tileSprite(0, 0, 640, 960, "startscreen");
    theme = game.add.audio('theme');
    coinSound = game.add.audio('coinSound');
    crash = game.add.audio('crash');
    this.ballon = game.add.sprite(game.world.width.centerX, game.world.centerY +150,  "ballon");
    if(aspect_ratio > 1 && window.innerWidth > 363) { 
    this.ballon.scale.setTo(1);
    }else{
       this.ballon.scale.setTo(0.8);
    }
    ufo = this.ballon;
    ufo.anchor.set(0.5);
    game.physics.enable(this.ballon, Phaser.Physics.ARCADE);
    this.ballon.body.collideWorldBounds = true;
    this.ballon.body.allowGravity = false;
    window.addEventListener("deviceorientation", this.handleOrientation, true);
    this.evilMeteor = game.add.group(); 
    this.evilMeteor.scale.setTo(scale_ratio);
    this.timer = game.time.events.loop(1850, this.addRowEvilBlock, this); 
    this.coin = game.add.group();
    coinTimer = game.time.events;
    game.time.events.add(Phaser.Timer.SECOND * 0.925, this.timeOut, this);
    score = 0;
    labelScore = game.add.text(20, 20, "0", {   font: "30px Arial", fill: "#ffffff" }); 
    theme.loopFull(0.6);
    stoneexplose = game.add.emitter(this.x, this.y, 100);
    stoneexplose.makeParticles('stoneexplose');
    stoneexplose.gravity = 200;
     
    
  },
  update: function() {

       
    window.addEventListener("deviceorientation", this.handleOrientation,false);
    
    gameBG.tilePosition.y += 5;
    game.physics.arcade.collide(this.ballon, this.coin, null, function(b,e){
        e.destroy(this.coin);
        coinSound.play();
        score += 1;
        labelScore.text = this.score;  
        e.y = game.world.centerY +150;
    
   });
   game.physics.arcade.collide(this.ballon, this.evilMeteor, null, function(b,e){
    crash.play();
    // navigator.vibrate(100);
    stoneexplose.x = e.x + 52;
    stoneexplose.y = e.y + 52;
    stoneexplose.start(true, 1000, null, 10);
    e.destroy(this.evilMeteor);
    game.time.events.add(Phaser.Timer.SECOND * 1, function(){
      theme.stop();
      game.state.start("GameOverScreen");
    });
    
   });
   

    if (game.input.addMoveCallback){
        this.game.physics.arcade.moveToXY(this.ballon, game.world.centerX, game.world.centerY +150, 500, 700);
       }



   },

    handleOrientation: function(e) {
    var x = e.gamma;
     ufo.body.velocity.x += x*5;
  },

   addOneEvilBlock: function(x, y) {
    // Create a pipe at the position x and y
    var evilblock = game.add.sprite(x, y, 'meteor');
    // Add the pipe to our previously created group
    this.evilMeteor.add(evilblock);
    // Enable physics on the pipe 
    game.physics.arcade.enable(evilblock);
    evilblock.body.velocity.y = 300; 
    // Automatically kill the pipe when it's no longer visible 
    evilblock.checkWorldBounds = true;
    evilblock.outOfBoundsKill = true;
     this.evilMeteor.setAll('anchor.x', 0.5);
  },

  addExtraEvilBlock: function(x,y){
     var evilblock = game.add.sprite(x, y, 'eismeteor');
    // Add the pipe to our previously created group
    this.evilMeteor.add(evilblock);
    // Enable physics on the pipe 
    game.physics.arcade.enable(evilblock);
    evilblock.body.velocity.y = 300;
    switch(randomValue){
    case 1: evilblock.body.velocity.x = Math.floor(Math.random() * 50) *2+50
        break;
    case 2: evilblock.body.velocity.x = Math.floor(Math.random() * -50)*2-50
        break;
    default: 
         evilblock.body.velocity.x = Math.floor(Math.random() * 25) *2+50
         break;
    };
    // Automatically kill the pipe when it's no longer visible 
    evilblock.checkWorldBounds = true;
    evilblock.outOfBoundsKill = true;
    this.evilMeteor.setAll('anchor.x', 0.5);
  },

   addRowEvilBlock: function(){
        // Randomly pick a number between 1 and 5
    // This will be the hole position
    var hole = Math.floor(Math.random() * 5) + 1;
    var other = Math.floor(Math.random() * 6) + 1;
    // Add the 6 pipes 
    // With one big hole at position 'hole' and 'hole + 1'
    if(other == 6 && firstComet !==0){
      for (var i = 0; i < 3; i++){
       this.addExtraEvilBlock(i * 150, -50); 
      }
    }else{
    for (var i = 0; i < 6; i++){
      if(firstComet === 0){
        firstComet += 1;
      }else{
      if(hole === 1 && i !== hole && i !== hole - 1){
        
          this.addOneEvilBlock((i + 0.5)  * 64 , -50); 
      }else if(i !== hole && i !== hole - 1){ 
            this.addOneEvilBlock(i * 64 , -50); 

          }

        }
      }
    
    }
    randomValue = game.rnd.integerInRange(1, 2)

   },

   addCoin: function(x,y){
      var coin = game.add.sprite(x, y, 'coin');
      this.coin.add(coin);
      game.physics.arcade.enable(coin);
       coin.body.velocity.y = 300; 
       coin.checkWorldBounds = true;
         coin.outOfBoundsKill = true;

   },
   addRandomCoin: function(){
    var rndCoin = game.rnd.integerInRange(0, 5);
    for(var i = 0; i < 6; i++){
      if(i === rndCoin){
        if(rndCoin === 5){
            this.addCoin(i *62, -50); 
          }else{
          this.addCoin(i * 70, -50); 
        }

       }
   }
  },

  timeOut: function(){
    this.coinTimer = game.time.events.loop(1850, this.addRandomCoin, this); 
  }, 

};


var gameOverScreen = function(game){};
gameOverScreen.prototype = {
  create: function(){
  
          firstComet = 0;
          score = score;
          labelScore = game.add.text(game.width / 2  , game.height/ 2 -100, score, {   font: "100px Arial", fill: "#ffffff" });  
          labelScore.anchor.set(0.5);

          var playButton = game.add.button(game.width / 2, game.height - 150, "playbutton", this.startGame);
          playButton.anchor.set(0.5);

          var tween = game.add.tween(playButton).to({width: 220,height:220}, 1500, "Linear", true, 0, -1);
          tween.yoyo(true);
     },
  startGame: function(){
          game.state.start("PlayGame");
     }
 };

