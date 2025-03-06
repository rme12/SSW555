export class Preloader extends Phaser.Scene {
    constructor() {
        super('Preloader');
    }

    init() {
        // Display the space background with a quantum effect
        this.add.image(512, 384, 'background');

        // Create the progress bar outline
        this.add.rectangle(512, 384, 468, 32).setStrokeStyle(1, 0xffffff);

        // Create the actual progress bar
        const bar = this.add.rectangle(512 - 230, 384, 4, 28, 0xffffff);

        // Use the 'progress' event emitted by the LoaderPlugin to update the progress bar width
        this.load.on('progress', (progress) => {
            bar.width = 4 + (460 * progress);  // Adjust the width based on the loading progress
        });

        // Add a visual effect for loading, like a glowing quantum pulse
        this.loadingPulse = this.add.sprite(512, 384, 'quantumPulse').setOrigin(0.5);
        this.loadingPulse.setAlpha(0.5);
        this.loadingPulse.setScale(0.5);

        // Add animation for the pulse effect (a simple scaling effect for quantum-like visuals)
        this.tweens.add({
            targets: this.loadingPulse,
            scaleX: 1,
            scaleY: 1,
            alpha: 1,
            duration: 1500,
            ease: 'Sine.easeInOut',
            yoyo: true,
            repeat: -1
        });
    }

    preload() {
        // Load assets for the game (adjust the paths to match your project structure)
        this.load.setPath('assets');

        // Load the spaceship (ball) image as the player ship
        this.load.image('quantumShip', 'spaceship.png');  // Quantum-powered spaceship

        // Load other quantum assets like buttons, background, etc.
        this.load.image('quantumButton', 'buttons/quantum_button.png');
        this.load.image('background', 'backgrounds/space_background.png');

        // Load sounds (quantum chime, etc.)
        this.load.audio('quantumChime', 'sounds/quantum_chime.mp3');
        this.load.audio('errorBeep', 'sounds/error_beep.mp3');

        // Load any other necessary assets
        this.load.image('quantumPulse', 'sprites/quantum_pulse.png'); // Example for a quantum pulse animation
    }

    create() {
        // Once all assets are loaded, we can perform any necessary setup
        // Create global game objects or animations here if necessary

        // Transition to the Main Menu or Game Scene
        this.scene.start('Game');
    }
}