var playState = {
    
    weaponBulletLifespan: 1000,
    weaponBulletSpeed: 500,
    weaponFireRate: 100,
    
    playerSpriteInitialEnergy: 100,
    numberOfEnemies: 100,
    numberOfFirstAids: 15,
    
    gameDurationSeconds: 160,

    activePrimaryWeapon: 0,
    primaryWeapons: [],
    activeSecondaryWeapon: 0,
    secondaryWeapons: [],
    
    activeWeaponsBullets: [],

    playerSpriteAlive: true,
    
    energyBrokenWindowsCount: 20,
    energyMinimumStartBrokenWindows: 60,
    
    objectsAboveSprite: [],
    
    create: function () {
        
        game.world.resize(4000, 4000);
        
        this.centerX = game.world.width / 2;
        this.centerY = game.world.height / 2;
                
        game.stage.backgroundColor = "#000000";
        game.add.tileSprite(0, 0, 4000, 4000, 'background');
//        game.add.image(0, 0, 'background');
                
        this.createPlayer();
        
        this.createEnemies();
        this.createPowerUps();
        
        this.setupKeyboard();
        
        this.setupSound();
        
        this.createDashboard();
        
        this.createBrokenGlass();
        
        this.setDefaults();
    },
    
    update: function () {
        
//        game.physics.arcade.collide([this.enemies, this.powerups]);
        game.physics.arcade.collide(this.enemies, this.powerups);
        game.physics.arcade.collide(this.playerSprite, this.enemies, this.collidePlayerEnemy, false, this);
        game.physics.arcade.collide(this.playerSprite, this.powerups, this.collidePlayerPowerUp, false, this);
        game.physics.arcade.overlap(this.activeWeaponsBullets, this.enemies, this.collideBulletTarget, false, this); 
        game.physics.arcade.overlap(this.activeWeaponsBullets, this.powerups, this.collideBulletTool, false, this); 
        
        for (i = 0; i < this.numberOfEnemies; i++) {
            game.physics.arcade.accelerateToObject(this.enemies.children[i], this.playerSprite, 300, 300, 300);
        }
        
        
        this.enemies.forEachDead(function(enemy) {
            this.positionEnemy(enemy);
            enemy.revive();
        }, this);
        
        
        if (this.playerSpriteAlive) {
            if (this.shield.alpha < 1) {
              this.shield.alpha += 0.1;
            } else {
              this.shield.alpha = 1;
            }
        
            if (this.cursors.up.isDown)
            {
                game.physics.arcade.accelerationFromRotation(this.playerSprite.rotation, 300, this.playerSprite.body.acceleration);
                this.updateEnergyLevel(-0.005);
            }
            else
            {
                this.playerSprite.body.acceleration.set(0);
            }

            if (this.cursors.left.isDown)
            {
                this.playerSprite.body.angularVelocity = -300;
                this.updateEnergyLevel(-0.005);
            }
            else if (this.cursors.right.isDown)
            {
                this.playerSprite.body.angularVelocity = 300;
                this.updateEnergyLevel(-0.005);
            }
            else
            {
                this.playerSprite.body.angularVelocity = 0;
            }
        
        
            if (this.fireButton.isDown) {
                this.primaryWeapons[this.activePrimaryWeapon].fireWeapon(this);
            }
        
            if (this.fireSecondaryWeaponButton.isDown) {
                this.fireSecondaryWeapon();
            }
        }
        
        this.updateEndGameTimer();
    },
    
    render: function () {
//        this.primaryWeapons[this.activePrimaryWeapon].weapon.debug()
      /*
        game.debug.spriteInfo(this.playerSprite, 32, 32);
        if (this.selectedTarget) {
            game.debug.spriteInfo(this.selectedTarget, 32, 200);
        }
      */
    },
    
    setDefaults: function () {
        this.activePrimaryWeapon = 0;
        this.primaryWeapons[this.activePrimaryWeapon].activate();
        this.iconBulletsState.frame = this.primaryWeapons[this.activePrimaryWeapon].stateFrame;
    },
        
    createPlayer: function () {
        
        this.playerSprite = this.add.sprite(this.centerX, this.centerY, 'ship');

        this.playerSprite.anchor.set(0.5);

        game.physics.arcade.enable(this.playerSprite);

        this.playerSprite.body.drag.set(10);
        this.playerSprite.body.maxVelocity.set(300);
        this.playerSprite.body.collideWorldBounds = true;
        
        game.camera.follow(this.playerSprite);
//        game.camera.follow(this.playerSprite, Phaser.Camera.FOLLOW_LOCKON, 0.1, 0.1);
        
        this.createPlayerShield();
        
        this.objectsAboveSprite.push(this.playerSprite);
        
        this.equipPrimaryWeapon(weaponBullet);
        
        this.playerSpriteAlive = true;
    },
    
    createPlayerShield: function () {
        
        this.shield = this.playerSprite.addChild(game.make.sprite(-38, -39, 'shield'));
        this.shield.alpha = 0;
        
    },
    
    createEnemies: function () {
        
        this.enemies = game.add.group();
        game.physics.arcade.enable(this.enemies);
        this.enemies.enableBody = true;

        for (i =0; i < this.numberOfEnemies; i++) {
            var enemy = this.enemies.create(0, 0, 'enemySprite', Math.floor(Math.random() * 7));
            this.positionEnemy(enemy);
        }
        
    },
    
    positionEnemy: function(enemy) {
        
        var positionX = Math.random() * game.world.width;
        var positionY = Math.random() * game.world.height;
        
        if (Math.abs(positionX - this.playerSprite.x) < 100) {
            positionX = positionX + 125;
        }
        
        if (Math.abs(positionY - this.playerSprite.y) < 100) {
            positionY = positionY + 125;
        }
        
        enemy.x = positionX;
        enemy.y = positionY;
        enemy.body.collideWorldBounds = true;
        enemy.body.bounce.setTo(0.2,0.2);
        
    },
    
    createPowerUps: function () {
      
        this.powerups = game.add.group();
        game.physics.arcade.enable(this.powerups);
        this.powerups.enableBody = true;
        for (i = 0; i < this.numberOfFirstAids; i++) {
            var positionX = Math.random() * game.world.width;
            var positionY = Math.random() * game.world.height;

            if (Math.abs(positionX - this.centerX) < 60) {
                positionX = positionX + 60;
            }

            if (Math.abs(positionY - this.centerY) < 60) {
                positionY = positionY + 60;
            }
            var powerup = this.powerups.create(positionX, positionY, 'powerups', 0);
            powerup.body.acceleration.x = (Math.random() * 20) - 10;
            powerup.body.acceleration.y = (Math.random() * 20) - 10;
            powerup.body.collideWorldBounds = true;
            powerup.body.bounce.setTo(1,1);
        }
        
    },
    
    createDashboard: function () {

        var bottomDashboard = game.add.image(0, 600 - 56, 'bottomDashboard');
        bottomDashboard.fixedToCamera = true;
        bottomDashboard.cameraOffset.setTo(0, 600 - 56);
        
        this.createScoreText(bottomDashboard);
        this.createEnergyLevelText(bottomDashboard);
        this.createTimerText(bottomDashboard);

        this.iconBulletsState = game.add.image(120, 15, 'iconBullets', 1);
        bottomDashboard.addChild(this.iconBulletsState);
        
        this.objectsAboveSprite.push(bottomDashboard);
    },
    
    createScoreText: function(dashboard) {
        
        //  The score
        this.scoreText = game.add.text(600, 12, 'Score: 0', { fontSize: '32px', fill: '#ffffff' });
        this.score = 0;
        dashboard.addChild(this.scoreText);
        
    },
    
    createEnergyLevelText: function(dashboard) {
        
        this.energyLevelIcon = game.add.image(15, 15, 'iconPowerLevels', 10);
        this.energyLevelIcon.visible = false;
        dashboard.addChild(this.energyLevelIcon);
        this.energyLevel= this.playerSpriteInitialEnergy;
        this.updateEnergyLevel(0);
        
        this.energyBrokenWindows = game.add.group();
        for (i = 0; i < this.energyBrokenWindowsCount; i++) {
            var brokenGlass = this.energyBrokenWindows.create(0, 0, 'brokenGlass', (i % 4));
            newImageScale = (((Math.random() * 300) + 200) / 880);
            brokenGlass.scale.setTo(newImageScale, newImageScale);
            brokenGlass.angle = Math.floor(Math.random() * 360);
            brokenGlass.anchor.setTo(0.5, 0.5);
            brokenGlass.smoothed = true;
            brokenGlass.fixedToCamera = true;
            brokenGlass.cameraOffset.setTo(Math.random() * 800, Math.random() * 600);
            brokenGlass.visible = false;
            this.objectsAboveSprite.push(brokenGlass);
        }
        this.energyBrokenWindowsWatermark = this.energyBrokenWindowsCount - 1;
        
    },
    
    createTimerText: function(dashboard) {
        // Create a custom timer
        this.endGameTimer = game.time.create();
        this.endGameTimerEvent = this.endGameTimer.add(Phaser.Timer.SECOND * this.gameDurationSeconds, this.endGameTimerDone, this);
        this.endGameTimer.start();
        
        //  The game timer
        this.endGameTimerText = game.add.text(0, 0, '##:##', { fontSize: '32px', fill: '#ffffff', boundsAlignH: "center", boundsAlignV: "middle"});
        dashboard.addChild(this.scoreText);
       this.endGameTimerText.setTextBounds(370,16,60,32);
       dashboard.addChild(this.endGameTimerText);        
    },
    
    createBrokenGlass: function () {
        this.brokenGlass = game.add.image(0, 0, 'brokenWindow');
        this.brokenGlass.fixedToCamera = true;
        this.brokenGlass.cameraOffset.setTo(0, 0);
        this.brokenGlass.visible = false;
        
        this.objectsAboveSprite.push(this.brokenGlass);
    },
    
    equipPrimaryWeapon: function(weapon) {
        this.primaryWeapons.push(weapon);
        weapon.init(this.playerSprite);
        
        var bullets = weapon.bullets();
        if (bullets instanceof Array) {
            bullets.forEach(function(elem) {
                this.activeWeaponsBullets.push(elem);
            }, this);
        } else {
            this.activeWeaponsBullets.push(bullets);
        }

        this.objectsAboveSprite.forEach(function(element) {
            game.world.bringToTop(element);
        });
        
    },
    
    setupKeyboard: function () {
        
        this.fireButton = this.input.keyboard.addKey(Phaser.KeyCode.SPACEBAR);
        this.fireSecondaryWeaponButton = game.input.keyboard.addKey(Phaser.Keyboard.A);
        this.cursors = this.input.keyboard.createCursorKeys();
        
        var weaponButton = game.input.keyboard.addKey(Phaser.Keyboard.W);
        weaponButton.onDown.add(this.toggleWeaponStyle, this);
        
        var quitButton = game.input.keyboard.addKey(Phaser.Keyboard.T);
        quitButton.onDown.add(this.quitGame, this);
        
        var pauseButton = game.input.keyboard.addKey(Phaser.Keyboard.P);
        pauseButton.onDown.add(this.togglePauseGame, this);

    },
    
    setupSound: function () {
        
        this.deniedSound = game.add.audio('denied');
        this.primaryWeaponLaserSound = game.add.audio('primaryWeaponLaser');
        
    },
    
    fireSecondaryWeapon: function () {
        
        if (this.secondaryWeapons.length > 0) {
            
            this.weapon.fire();
            this.updateEnergyLevel(-0.05);
            
        } else {
            
            this.deniedSound.play();
            
        }
        
        
    },
    
    collidePlayerEnemy: function(player, enemy) {
        this.shield.alpha = 0;
        game.camera.shake(0.005, 250);
        this.updateEnergyLevel(-1);
    },
    
    collideBulletTarget: function (bullet, target) {
        bullet.kill();
        target.kill();
        this.score += 5;
        this.scoreText.text = 'Score: ' + this.score;  
    },

    collideBulletTool: function (bullet, target) {
        bullet.kill();
        target.kill();
    },
    
    collidePlayerPowerUp: function(player, kit) {
      kit.kill();
      switch(kit.frame) {
      case 0:
          this.updateEnergyLevel(100);
          break;
      case 1:
          this.wideshotEnabled = true;
          this.toggleWeaponStyle();
          break;
      } 

    },
    
    toggleWeaponStyle: function () {
        
        this.primaryWeapons[this.activePrimaryWeapon].deactivate();
        this.activePrimaryWeapon = (this.activePrimaryWeapon + 1) % this.primaryWeapons.length;
        this.primaryWeapons[this.activePrimaryWeapon].activate();
        this.iconBulletsState.frame = this.primaryWeapons[this.activePrimaryWeapon].stateFrame;
        
    },
    
    endGameTimerDone: function () {
        this.endGameTimer.stop();
        this.killPlayer();
        this.gameOver("Time's up!");
    },
    
    quitGame: function () {
        this.updateEnergyLevel(-10);
    },
    
    updateEndGameTimer: function() {
        if (this.endGameTimer.running) {
            this.endGameTimerText.text = this.formatTime(Math.round((this.endGameTimerEvent.delay - this.endGameTimer.ms) / 1000));
        } else {
            this.endGameTimerText.text = "00:00";
        }
    },
    
    updateEnergyLevel: function(points) {
        this.energyLevel += points;
        if (this.energyLevel <= 0) {
            this.energyLevel = 0;
            this.killPlayer();
            this.gameOver("GAME OVER!");
        } else if (this.energyLevel > 100.0) {
            this.energyLevel = 100.0;
        }
        this.energyLevelIcon.frame = Math.floor(this.energyLevel / 10);
        
        try {
            
            if (this.energyLevel <= this.energyMinimumStartBrokenWindows) {
                newWatermark = Math.ceil(this.energyLevel / this.energyMinimumStartBrokenWindows * this.energyBrokenWindowsCount) - 1; 
            } else {
                newWatermark = this.energyBrokenWindowsCount - 1
            }
            if (newWatermark != this.energyBrokenWindowsWatermark) {
                
                for (i = this.energyBrokenWindowsWatermark; i <= newWatermark; i++) {
                    this.energyBrokenWindows.children[i].visible = false;
                }
                for (i = this.energyBrokenWindowsWatermark; i > newWatermark; i--) {
                    this.energyBrokenWindows.children[i].visible = true;
                }
                if (newWatermark == this.energyBrokenWindowsCount) {
                    newWatermark =  this.energyBrokenWindowsCount - 1;
                }
                this.energyBrokenWindowsWatermark = newWatermark;
            }
            
        }
        catch (err) {
            console.log(err);
        }
    },
    
    formatTime: function(s) {
        // Convert seconds (s) to a nicely formatted and padded time string
        var minutes = "0" + Math.floor(s / 60);
        var seconds = "0" + (s - minutes * 60);
        return minutes.substr(-2) + ":" + seconds.substr(-2);   
    },
    
    
    killPlayer: function () {
        this.playerSpriteAlive = false;
        var tween = game.add.tween(this.playerSprite).to( { alpha: 0 }, 500, Phaser.Easing.Exponential.Out, true, 0, 0, false);
        tween.onComplete.add(function () {
            this.playerSprite.kill();
        }, this);
    },
    
    
    togglePauseGame: function () {
        game.paused = !game.paused;
    },
    
    gameOver: function(message) {
        this.brokenGlass.visible = true;   
        game.time.events.add(Phaser.Timer.SECOND * 1.25, function () {
            game.state.start('gameover', false, false, {message: message, score: this.score});
        }, this);
    },
    
};

var weaponBullet = {
    id: 'weaponBullet',
    stateFrame: 1,
    fireWeapon: function(board) {
        this.weapon.fire();
        board.updateEnergyLevel(-0.05);
    },
    init: function(sprite) {
        
        this.weapon = game.add.weapon(30, 'bullet');
        this.weapon.bulletKillType = Phaser.Weapon.KILL_LIFESPAN;
        this.weapon.bulletLifespan = 1000;
        this.weapon.bulletSpeed = 500;
        this.weapon.fireRate = 100;
        this.weapon.bulletAngleVariance = 0;
        
        this.weapon.trackSprite(sprite, 0, 0, true);
    },
    bullets: function () {
        return this.weapon.bullets;
    },
    activate: function () {
        
    },
    deactivate: function () {
        
    },
};
        
var weaponHighspeedBullet = {
    id: 'weaponHighspeedBullet',
    stateFrame: 1,
    fireWeapon: function(board) {
        this.weapon.fire();
        board.updateEnergyLevel(-0.1);
    },
    init: function(sprite) {
        
        this.weapon = game.add.weapon(5, 'bullet');
        this.weapon.bulletKillType = Phaser.Weapon.KILL_LIFESPAN;
        this.weapon.bulletLifespan = 500;
        this.weapon.bulletSpeed = 1000;
        this.weapon.fireRate = 50;
        this.weapon.bulletAngleVariance = 0;
        
        this.weapon.trackSprite(sprite, 0, 0, true);
    },
    bullets: function () {
        return this.weapon.bullets;
    },
    activate: function () {
        
    },
    deactivate: function () {
        
    },
};

var weaponRandomWide = {
    id: 'weaponRandomWide',
    stateFrame: 0,
    fireWeapon: function(board) {
        this.weapon.fire();
        board.updateEnergyLevel(-0.07);
    },
    init: function(sprite) {
        
        this.weapon = game.add.weapon(30, 'bullet');
        this.weapon.bulletKillType = Phaser.Weapon.KILL_LIFESPAN;
        this.weapon.bulletLifespan = 1000;
        this.weapon.bulletSpeed = 500;
        this.weapon.fireRate = 200;
        this.weapon.bulletAngleVariance = 30;
        
        this.weapon.trackSprite(sprite, 0, 0, true);
    },
    bullets: function () {
        return this.weapon.bullets;
    },
    activate: function () {
        
    },
    deactivate: function () {
        
    },
};

var weaponRandom360 = {
    id: 'weaponRandom360',
    stateFrame: 0,
    fireWeapon: function(board) {
        this.weapon.fire();
        board.updateEnergyLevel(-0.09);
    },
    init: function(sprite) {
        
        this.weapon = game.add.weapon(30, 'bullet');
        this.weapon.bulletKillType = Phaser.Weapon.KILL_LIFESPAN;
        this.weapon.bulletLifespan = 1000;
        this.weapon.bulletSpeed = 500;
        this.weapon.fireRate = 100;
        this.weapon.bulletAngleVariance = 360;
        
        this.weapon.trackSprite(sprite, 0, 0, true);
    },
    bullets: function () {
        return this.weapon.bullets;
    },
    activate: function () {
        
    },
    deactivate: function () {
        
    },
};

var weaponGuidedBullet = {
    id: 'weaponDualGun',
    stateFrame: 0,
    fireWeapon: function(board) {
        if (target = game.physics.arcade.closest(this.sprite, board.enemies.getAll('alive',true), true, true)) {
            board.selectedTarget = target;
//            this.weapon.fireAtSprite(target);
            this.weapon.fireAtXY(target.x, target.y);
        }
        board.updateEnergyLevel(-0.08);
    },
    init: function(sprite) {
        this.sprite = sprite;
        this.weapon = game.add.weapon(30, 'bullet');
        this.weapon.bulletKillType = Phaser.Weapon.KILL_LIFESPAN;
        this.weapon.bulletLifespan = 1000;
        this.weapon.bulletSpeed = 500;
        this.weapon.fireRate = 100;
        this.weapon.bulletAngleVariance = 0;
        
        this.weapon.trackSprite(sprite, 0, 0, true);
    },
    bullets: function () {
        return this.weapon.bullets;
    },
    activate: function () {
        
    },
    deactivate: function () {
        
    },
};

var weaponDualShooter = {
    id: 'weaponDualGun',
    stateFrame: 0,
    fireWeapon: function(board) {
        this.weaponLeft.fire();
        this.weaponRight.fire();
        board.updateEnergyLevel(-0.1);
    },
    init: function(sprite) {

        this.weaponLeft = game.add.weapon(15, 'bullet');
        this.weaponLeft.bulletKillType = Phaser.Weapon.KILL_LIFESPAN;
        this.weaponLeft.bulletLifespan = 1000;
        this.weaponLeft.bulletSpeed = 500;
        this.weaponLeft.fireRate = 100;
        this.weaponLeft.bulletAngleVariance = 0;        
        this.weaponLeft.trackSprite(sprite, 0, -15, true);

        this.weaponRight = game.add.weapon(15, 'bullet');
        this.weaponRight.bulletKillType = Phaser.Weapon.KILL_LIFESPAN;
        this.weaponRight.bulletLifespan = 1000;
        this.weaponRight.bulletSpeed = 500;
        this.weaponRight.fireRate = 100;
        this.weaponRight.bulletAngleVariance = 0;        
        this.weaponRight.trackSprite(sprite, 0, 15, true);
    },
    bullets: function () {
        return [this.weaponLeft.bullets, this.weaponRight.bullets];
    },
    activate: function () {
        
    },
    deactivate: function () {
        
    },
};


/* fireAngle : integer
The angle at which the bullets are fired. This can be a const such as Phaser.ANGLE_UP
or it can be any number from 0 to 360 inclusive, where 0 degrees is to the right.*/