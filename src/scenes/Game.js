/*
* The ball asset is taken from: https://gamedeveloperstudio.itch.io/balls
*
*/
export class Game extends Phaser.Scene {
   constructor() {
        super('Game');
        this.score = 0;
        this.isGameOver = false;
        this.spawnTimer = null;
        this.scoreText = null;
        this.ship = null;
        this.shipSpeed = 300;
        this.anomalies = [];
        this.particles = [];
        this.spawnDelay = 1000;
        this.shipHealth = 3;
        this.healthText = null;
        this.shipSprite = null;
    }

    create() {
        // Set space-themed background
        this.cameras.main.setBackgroundColor(0x000000); // Black space background

        // Add space background image if available
        if (this.textures.exists('spaceBackground')) {
            this.add.image(this.game.config.width / 2, this.game.config.height / 2, 'spaceBackground')
                .setDisplaySize(this.game.config.width, this.game.config.height)
                .setAlpha(0.2);
        }

        // Set up physics
        this.physics.world.setBounds(0, 0, this.game.config.width, this.game.config.height);
        this.physics.world.gravity.y = 0;

        // Create quantum anomalies (obstacles)
        this.createAnomalies();

        // Create the player's spaceship
        this.createSpaceship();

        // Create score display
        this.scoreText = this.add.text(16, 16, 'Score: 0', {
            fontFamily: 'Arial Black', fontSize: 24, color: '#ffffff',
            stroke: '#000000', strokeThickness: 6
        });

        // Create health display
        this.healthText = this.add.text(16, 50, 'Health: 3', {
            fontFamily: 'Arial Black', fontSize: 18, color: '#ffffff',
            stroke: '#000000', strokeThickness: 5
        });

        // Start spawning particles
        this.spawnTimer = this.time.addEvent({
            delay: this.spawnDelay,
            callback: this.spawnQuantumParticle,
            callbackScope: this,
            loop: true
        });

        // Tutorial text
        const tutorialText = this.add.text(this.game.config.width / 2, 584, 'Move ship to collect quantum particles and avoid anomalies!', {
            fontFamily: 'Arial Black', fontSize: 18, color: '#ffffff',
            stroke: '#000000', strokeThickness: 5,
            align: 'center'
        }).setOrigin(0.5);

        // Add fadeout for tutorial text
        this.tweens.add({
            targets: tutorialText,
            alpha: 0,
            delay: 5000,
            duration: 1000
        });

        // Set up input for spaceship control - mouse/touch movement
        this.input.on('pointermove', (pointer) => {
            if (!this.isGameOver) {
                const targetX = Phaser.Math.Clamp(
                    pointer.x,
                    this.ship.displayWidth / 2,
                    this.game.config.width - this.ship.displayWidth / 2
                );
                this.targetShipX = targetX;
            }
        });

        this.input.on('pointerdown', (pointer) => {
            if (!this.isGameOver) {
                const targetX = Phaser.Math.Clamp(
                    pointer.x,
                    this.ship.displayWidth / 2,
                    this.game.config.width - this.ship.displayWidth / 2
                );
                this.targetShipX = targetX;
            }
        });

        // Add keyboard controls
        this.cursors = this.input.keyboard.createCursorKeys();
    }

    createAnomalies() {
        // Create quantum anomalies (e.g., black holes or gravity wells)
        const anomalyRadius = 30;
        const anomalyColor = 0xFF5733; // Space anomaly color
        const startX = 80;
        const startY = 120;
        const cols = 5;
        const rows = 3;
        const xSpacing = (this.game.config.width - 160) / cols;
        const ySpacing = 100;

        for (let row = 0; row < rows; row++) {
            const offsetX = (row % 2 === 0) ? 0 : xSpacing / 2;
            for (let col = 0; col < cols; col++) {
                const x = startX + offsetX + col * xSpacing;
                const y = startY + row * ySpacing;

                // Create the space anomaly (black hole or gravity well)
                const anomaly = this.add.circle(x, y, anomalyRadius, anomalyColor);
                this.physics.add.existing(anomaly, true); // static anomaly

                this.anomalies.push(anomaly);
            }
        }
    }

    createSpaceship() {
        const shipY = this.game.config.height - 50; // Position at the very bottom

        // Create a spaceship graphic
        this.shipSprite = this.add.graphics();
        this.shipSprite.x = this.game.config.width / 2;
        this.shipSprite.y = shipY;

        // Main spaceship body
        this.shipSprite.fillStyle(0x1E90FF, 1); // Bright blue spaceship
        this.shipSprite.fillTriangle(-40, -20, 0, -50, 40, -20);

        // Now create the physics body for the spaceship
        this.ship = this.physics.add.existing(
            this.add.rectangle(
                this.game.config.width / 2,
                shipY,
                80, // Width of the spaceship
                40, // Height of the spaceship
                0x000000
            ),
            true // Static physics body
        );

        // Make the physics body invisible
        this.ship.setAlpha(0);

        // Initialize the target position for smooth movement
        this.targetShipX = this.game.config.width / 2;
    }

    spawnQuantumParticle() {
        if (this.isGameOver) return;

        const x = Phaser.Math.Between(50, this.game.config.width - 50);
        const particleRadius = 15;

        const itemType = Math.random() > 0.3 ? 'quantumParticle' : 'quantumAnomaly';

        let container = this.add.container(x, 20);
        let mainSprite;

        if (itemType === 'quantumParticle') {
            mainSprite = this.add.sprite(0, 0, 'quantumParticle'); // Add quantum particle texture

            container.add(mainSprite);

            this.physics.world.enable(container);
            container.body.setCircle(particleRadius);
            container.body.setBounce(0.6 + Math.random() * 0.2);
            container.body.setVelocityX(Phaser.Math.Between(-50, 50));
            container.body.setCollideWorldBounds(true);

            container.itemType = 'quantumParticle';

            this.particles.push(container);
        } else {
            // Create quantum anomaly (black hole or similar)
            mainSprite = this.add.circle(0, 0, particleRadius, 0x000000);

            container.add(mainSprite);

            this.physics.world.enable(container);
            container.body.setCircle(particleRadius);
            container.body.setBounce(0.5 + Math.random() * 0.2);
            container.body.setCollideWorldBounds(true);

            container.itemType = 'quantumAnomaly';

            this.anomalies.push(container);
        }

        // Add overlap detection with ship for collection or collision
        this.physics.add.overlap(container, this.ship, this.collectItem, null, this);
    }

    collectItem(item, ship) {
        if (item.itemType === 'quantumParticle') {
            this.score += 10;
            this.scoreText.setText('Score: ' + this.score);

            const flash = this.add.circle(this.ship.x, this.ship.y, 50, 0x00ff00, 0.7);
            this.tweens.add({
                targets: flash,
                alpha: 0,
                scale: 1.5,
                duration: 300,
                onComplete: () => flash.destroy()
            });

            // Remove from active particles list
            const index = this.particles.indexOf(item);
            if (index > -1) {
                this.particles.splice(index, 1);
            }

            item.destroy();
        } else {
            // Hit by quantum anomaly
            this.shipHealth--;
            this.healthText.setText('Health: ' + this.shipHealth);

            const explosion = this.add.circle(item.x, item.y, 20, 0xFF0000);

            this.tweens.add({
                targets: explosion,
                scale: 2,
                alpha: 0,
                duration: 500,
                onComplete: () => explosion.destroy()
            });

            this.cameras.main.shake(200, 0.03); // Camera shake on collision

            // Remove from active anomalies list
            const index = this.anomalies.indexOf(item);
            if (index > -1) {
                this.anomalies.splice(index, 1);
            }

            item.destroy();

            // Check game over condition
            if (this.shipHealth <= 0) {
                this.isGameOver = true;
                this.gameOver();
            }
        }
    }

    gameOver() {
        // Display game over screen
        this.add.text(this.game.config.width / 2, this.game.config.height / 2, 'Game Over', {
            fontFamily: 'Arial Black',
            fontSize: 48,
            color: '#FF0000',
            stroke: '#000000',
            strokeThickness: 8
        }).setOrigin(0.5);

        // Restart game after a brief delay
        this.time.delayedCall(2000, () => {
            this.scene.restart();
        });
    }

    update() {
        if (this.isGameOver) return;

        if (this.ship) {
            // Update the spaceship position smoothly towards the target position
            this.ship.x = Phaser.Math.Linear(this.ship.x, this.targetShipX, 0.1);
        
            // Optional: Implement ship propulsion with keyboard
            if (this.cursors.left.isDown) {
                this.ship.x -= this.shipSpeed * this.game.loop.delta / 1000;
            } else if (this.cursors.right.isDown) {
                this.ship.x += this.shipSpeed * this.game.loop.delta / 1000;
            }
        }
    }
}
