// the game itself
var game;

// when the window loads...
window.onload = function() {

    // The first two integers are the dimensions of the game screen as x
    // and y values. We are setting it to 640 pixels across, and 480 pixels
    // down. Note also that the 'gameDiv' parameter matches the div element
    // defined in our index.html file 
    game = new Phaser.Game(800, 600, Phaser.CANVAS, 'game');

    // Here we add each state. We give it a casual name that we use when
    // calling it (i.e. 'boot'), and an official name that we use when 
    // defining it (i.e. bootState), as you'll see in the boot.js file
    game.state.add('boot', bootState);
    game.state.add('load', loadState);
    game.state.add('menu', menuState);
    game.state.add('play', playState);
    game.state.add('gameover', gameOverState);
    
    // After all of the states are added, we start the game by calling the
    // boot state
    game.state.start('boot');
}

