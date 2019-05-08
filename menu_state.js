var menuState = {
    
    //  The Google Fonts we want to load (specify as many as you like in the array)
    google: {
        families: ["VT323"],
    },
  
    create: function () {
		
        game.world.resize(800, 600);
        
        game.stage.backgroundColor = "#000000";
        game.add.image(0, 0, 'background');
        
		// Here we display the name of the game. When defining text, the
		// first two parameters are x and y positional values, then the
		// actual text, and then the 'font' defines the font (of course)
		// and 'fill' refers to the font color.
/*        var nameLabel = game.add.text(0, 0, "Spaceship\nWreck",
                                    { font: "75px VT323,monospace", fill: '#ffffff', boundsAlignH: "center", boundsAlignV: "middle"});
        nameLabel.font = "VT323,monospace";
        nameLabel.setTextBounds(0,250,800,50);
*/        
        var splashNameImage = game.add.image(140,250,'splashName');
        splashNameImage.alpha = 0;
        game.add.tween(splashNameImage).to( { alpha: 1 }, 3000, Phaser.Easing.Exponential.Out, true, 0, 0, false);
                
        // We give the player instructions on how to start the game
        var startLabel = game.add.text(0, 0,
                                       'press the "W" to start',
                                {font: '25px monospace', fill: '#ffffff', boundsAlignH: "center", boundsAlignV: "middle"});
        startLabel.setTextBounds(0,game.world.height-80,800,25);
                
        game.add.image(0, 0, 'brokenWindow');
        
        // We define the wkey as Phaser.Keyboard.W so that we can act
        // when the player presses it
        var wkey = game.input.keyboard.addKey(Phaser.Keyboard.W);
        
        // When the player presses the W key, we call the start function
        wkey.onDown.addOnce(this.start, this);
    },
    
    // The start function calls the play state    
    start: function () {
        game.state.start('play');    
    },    
};