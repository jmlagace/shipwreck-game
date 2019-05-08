// "PlayGame" state
var playState = function(){}
playGame.prototype = {
  
  // when the state preloads
	preload: function(){

  },
  
    // once the state has been created
    create: function(){

      game.world.resize(2000, 2000);

      centerX = game.world.width / 2;
      centerY = game.world.height / 2;

      game.stage.backgroundColor = "#000000";
      game.add.image(0, 0, 'background');

    //  Creates 30 bullets, using the 'bullet' graphic
    weapon = game.add.weapon(30, 'bullet');

    //  The bullet will be automatically killed when it leaves the world bounds
    weapon.bulletKillType = Phaser.Weapon.KILL_WORLD_BOUNDS;
    weapon.bulletKillType = Phaser.Weapon.KILL_NEVER;


    //  The bullet will be automatically killed when it leaves the world bounds
    weapon.bulletKillType = Phaser.Weapon.KILL_LIFESPAN;

    //  Bullets live for 2 seconds
    weapon.bulletLifespan = 1000;

    //  The speed at which the bullet is fired
    weapon.bulletSpeed = 500;

    //  Speed-up the rate of fire, allowing them to shoot 1 bullet every 60ms
    weapon.fireRate = 100;

    //  Add a variance to the bullet angle by +- this value
    weapon.bulletAngleVariance = 0;

    sprite = this.add.sprite(centerX, centerY, 'ship');

    sprite.anchor.set(0.5);

    game.physics.arcade.enable(sprite);

    sprite.body.drag.set(70);
    sprite.body.maxVelocity.set(200);
    sprite.body.collideWorldBounds = true;
    game.camera.follow(sprite);


    shield = sprite.addChild(game.make.sprite(-38, -39, 'shield'));
    shield.alpha = 0;

    cursors = this.input.keyboard.createCursorKeys();

    fireButton = this.input.keyboard.addKey(Phaser.KeyCode.SPACEBAR);

    weaponButton = game.input.keyboard.addKey(Phaser.Keyboard.W);
    weaponButton.onDown.add(toggleWeaponStyle);

    enemys = game.add.group();
    game.physics.arcade.enable(enemys);
    enemys.enableBody = true;

    thirdX = game.world.width / 3;
    thirdY = game.world.height / 3;

    for (i =0; i < 600; i++) {
      positionX = Math.random() * game.world.width;
      positionY = Math.random() * game.world.height;

      if (Math.abs(positionX - centerX) < 60) {
        positionX = positionX + 60;
      }

      if (Math.abs(positionY - centerY) < 60) {
        positionY = positionY + 60;
      }

      var enemy = enemys.create(positionX, positionY, 'enemy');
      enemy.body.acceleration.x = (Math.random() * 50) - 25;
      enemy.body.acceleration.y = (Math.random() * 50) - 25;
      enemy.body.collideWorldBounds = true;
      enemy.body.bounce.setTo(1,1);
    }

    firstaids = game.add.group();
    game.physics.arcade.enable(firstaids);
    firstaids.enableBody = true;
    for (i = 0; i < 15; i++) {
    positionX = Math.random() * game.world.width;
    positionY = Math.random() * game.world.height;

    if (Math.abs(positionX - centerX) < 60) {
      positionX = positionX + 60;
    }

    if (Math.abs(positionY - centerY) < 60) {
      positionY = positionY + 60;
    }
    var firstaid = firstaids.create(positionX, positionY, 'firstaid');
    firstaid.body.acceleration.x = (Math.random() * 50) - 25;
    firstaid.body.acceleration.y = (Math.random() * 50) - 25;
    firstaid.body.collideWorldBounds = true;
    firstaid.body.bounce.setTo(1,1);
    }

    //  The score
    scoreText = game.add.text(16, 16, 'Score: 0', { fontSize: '32px', fill: 'rgba(255,255,255,0.5)'  });
    score = 0;
    scoreText.fixedToCamera = true;
    scoreText.cameraOffset.setTo(16, 16);

    energyLevelText = game.add.text(16, 48, 'Energy: 100%', { fontSize: '32px', fill: 'rgba(255,255,255,0.5)' });
    energyLevelText.fixedToCamera = true;
    energyLevelText.cameraOffset.setTo(16, 48);
    energyLevel= 100;
    updateEnergyLevel(0);


    gameOver = false;

    },
  
    update: function(){

          if (shield.alpha < 1) {
            shield.alpha += 0.1;
          }

          game.physics.arcade.collide([enemys,firstaids]);
          game.physics.arcade.collide(enemys,firstaids);
          game.physics.arcade.collide(sprite, enemys, killShip);
          game.physics.arcade.collide(sprite, firstaids, touchFirstAidKit);
          game.physics.arcade.collide(weapon.bullets, enemys, killenemy); 
          game.physics.arcade.collide(weapon.bullets, firstaids, killFirstAidKit); 

          if (!gameOver) {
            if (cursors.up.isDown)
            {
                game.physics.arcade.accelerationFromRotation(sprite.rotation, 300, sprite.body.acceleration);
                updateEnergyLevel(-0.005);
            }
            else
            {
                sprite.body.acceleration.set(0);
            }

            if (cursors.left.isDown)
            {
                sprite.body.angularVelocity = -300;
                updateEnergyLevel(-0.005);
            }
            else if (cursors.right.isDown)
            {
                sprite.body.angularVelocity = 300;
                updateEnergyLevel(-0.005);
            }
            else
            {
                sprite.body.angularVelocity = 0;
            }

            if (fireButton.isDown)
            {

              weapon.fire();
              updateEnergyLevel(-0.05);
      
            }
  
      }
      
      render: function() 
      {
      //    weapon.debug();
      }
  
      killShip: function(sprite, enemys)
      {
        shield.alpha = 0;
        updateEnergyLevel(-1);
      }
  
      touchFirstAidKit: function(sprite, kit)
      {
        kit.kill();
        updateEnergyLevel(100);
      }
  
      killenemy: function(bullet, enemy) 
      {
        bullet.kill();
        enemy.kill();
        score += 5;
        scoreText.text = 'Score: ' + score;
      }
  
      killFirstAidKit: function(bullet, kit) 
      {
        kit.kill();
      }
  
      updateEnergyLevel: function(points) 
      {
        energyLevel += points;
        if (energyLevel < 0) {
          energyLevel = 0;
          sprite.kill();
          gameOver = true;
        } else if (energyLevel > 100.0) {
          energyLevel = 100.0;
        }
    
        if (gameOver) {
            energyLevelText.text = 'GAME OVER';
        } else {
            energyLevelText.text = 'Energy: ' + Math.round(energyLevel,0) + '%';
        }

      }
  
      toggleWeaponStyle: function()
      {
        if (weapon.bulletAngleVariance == 0) {
            weapon.bulletAngleVariance = 30;
        } else {
            weapon.bulletAngleVariance = 0;
        }
    
      }
}