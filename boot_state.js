var bootState = {
    
    create: function() {
        
        // Starting the physics system - in this case we are using the
        // simple (but effective) ARCADE physics engine
        game.physics.startSystem(Phaser.Physics.ARCADE);
        
        // Calling the load state
        game.state.start('load');
    }
};