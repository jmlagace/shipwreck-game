var loadState= {
	
	// The preload function is another standard Phaser function that we
	// use to define and load our assets
    preload: function() {
        
        /*
         to generate sprites http://draeton.github.io/stitches/
        */
        
        // Add a loading label on the screen
        var loadingLabel = game.add.text(80, 150, 'loading...', 
                                         {font: '30px Courier', fill: '#ffffff'});        
                                         
        // Load all assets. The first parameter is the variable that 
        // will point to the image, and the second parameter is the
        // image file itsself.
        game.load.image('background', 'assets/background_003.png');
        game.load.image('brokenWindow', 'assets/broken-window.png');
        game.load.image('splashName', 'assets/game-splash-name.png');
        game.load.image('bullet', 'assets/bullet_01_32x32.png');
        game.load.image('ship', 'assets/airplane_05_48x48_000.png');
        game.load.image('enemy', 'assets/enemy04_32x32.png');
        game.load.image('enemy', 'assets/enemy_red.png');
//        game.load.spritesheet('enemySprite', 'assets/enemy04_32x32_sprite.png', 32, 32, 7);
        game.load.spritesheet('enemySprite', 'assets/enemy_red.png', 32, 32, 1);
        game.load.spritesheet('powerups', 'assets/powerups-spritesheet.png', 32, 32, 2);
        game.load.image('shield', 'assets/shield_000.png');
        game.load.image('message', 'assets/message_message_400x400.png');
        game.load.spritesheet('iconBullets', 'assets/bullets-icon-spritesheet.png', 32, 32, 2);
        game.load.spritesheet('iconPowerLevels', 'assets/powerlevel-icon-spritesheet.png', 100, 32, 11);
        game.load.image('bottomDashboard', 'assets/dashboard-bottom.png');
        game.load.image('brokenGlass', 'assets/broken-glass-spritesheet.png', 880, 880, 4);
        
        game.load.audio('denied', 'assets/audio/249300__suntemple__access-denied.ogg');
        game.load.audio('primaryWeaponLaser', 'assets/audio/151022__bubaproducer__laser-shot-silenced.ogg');
        
    },
    
    create: function() {
        // Call the menu state
        game.state.start('menu');
    }    
};