export class GameOver extends Phaser.Scene {
    constructor() {
        super('GameOver');
    }

    init(data) {
        // Receive the score from the QuantumGame scene
        this.finalScore = data.score;
    }

    create() {
        // Set background color
        this.cameras.main.setBackgroundColor(0xff0000); // Red background

        // Add background image with transparency
        this.add.image(512, 384, 'background').setAlpha(0.5);

        // Display Game Over text
        this.add.text(512, 200, 'Game Over', {
            fontFamily: 'Arial Black',
            fontSize: 64,
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 8,
            align: 'center'
        }).setOrigin(0.5);

        // Display the final score
        this.add.text(512, 300, `Score: ${this.finalScore}`, {
            fontFamily: 'Arial Black',
            fontSize: 48,
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 6,
            align: 'center'
        }).setOrigin(0.5);

        // Restart the game when clicked
        this.add.text(512, 450, 'Click to Restart', {
            fontFamily: 'Arial Black',
            fontSize: 32,
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 6,
            align: 'center'
        }).setOrigin(0.5).setInteractive().on('pointerdown', () => {
            this.scene.start('QuantumGame'); // Restart the game
        });
    }
}
