var gameOverState = {
    
    init: function(params) {
        this.score = params['score'];
        this.message = params['message'];
    },

    create: function() {	
        
        var messageWindow = game.add.image(0, 0, 'message');
        messageWindow.fixedToCamera = true;
        messageWindow.cameraOffset.setTo(200, 100);
        messageWindow.alpha = 0.75;
        
        var winLabel = game.add.text(0, 0, this.message,
                                            {font: '50px Arial', fill: '#00FF00', boundsAlignH: "center", boundsAlignV: "middle"});
        winLabel.setTextBounds(0,60,420,150);
        messageWindow.addChild(winLabel);

        var scoreLabel = game.add.text(0, 0, 'Score: ' + this.score,
                                            {font: '50px Arial', fill: '#FFFFFF', boundsAlignH: "center", boundsAlignV: "middle"});
        scoreLabel.setTextBounds(0,150,420,150);
        messageWindow.addChild(scoreLabel);

        highScore = store.get('highscore') ? store.get('highscore') : 0;
        var highscoreLabel = game.add.text(0, 0, 'Highscore: ' + highScore,
                                            {font: '25px Arial', fill: '#FFFFFF', boundsAlignH: "center", boundsAlignV: "middle"});
        highscoreLabel.setTextBounds(0,200,420,150);
        messageWindow.addChild(highscoreLabel);

        if (this.score > highScore) {
            store.set('highscore', this.score);
        }
        
        // We give the player instructions on how to restart the game
        var startLabel = game.add.text(0, 0,
                                            'press the "W" to restart',
                                            {font: '25px Arial', fill: '#ffffff', boundsAlignH: "center", boundsAlignV: "middle"});
        startLabel.setTextBounds(0,400 - 80,420,80);
        messageWindow.addChild(startLabel);
        
        // We define the wkey as Phaser.Keyboard.W so that we can act
        // when the player presses it
        var wkey = game.input.keyboard.addKey(Phaser.Keyboard.W);
        
        // When the player presses the W key, we call the restart function
        wkey.onDown.addOnce(this.restart, this);
    },
    
    // The restart function calls the menu state    
    restart: function () {
        game.state.start('menu');    
    }, 	
}