import { Observable } from '@nativescript/core';
import { Screen } from '@nativescript/core/platform';

export class GameViewModel extends Observable {
    private player: any;
    private gameContainer: any;
    private obstacles: any[] = [];
    private score: number = 0;
    private speed: number = 5;
    private playerX: number = 0;
    private isGameOver: boolean = false;
    private gameLoop: any;

    constructor() {
        super();

        // Initialize game after a short delay to ensure UI is ready
        setTimeout(() => {
            this.initializeGame();
        }, 100);
    }

    private initializeGame() {
        const page = require('tns-core-modules/ui/page').topmost();
        this.gameContainer = page.getViewById('gameContainer');
        this.player = page.getViewById('player');

        // Set initial player position
        this.playerX = (Screen.mainScreen.widthDIPs - 50) / 2;
        this.updatePlayerPosition();

        // Start game loop
        this.startGameLoop();
    }

    private startGameLoop() {
        this.gameLoop = setInterval(() => {
            if (this.isGameOver) return;

            // Move obstacles
            this.moveObstacles();

            // Spawn new obstacles
            if (Math.random() < 0.02) {
                this.spawnObstacle();
            }

            // Update score
            this.score += 1;
            this.set('score', this.score);

            // Increase speed over time
            if (this.score % 500 === 0) {
                this.speed += 1;
                this.set('speed', this.speed);
            }

            // Check collisions
            this.checkCollisions();
        }, 16); // ~60 FPS
    }

    private moveObstacles() {
        for (let i = this.obstacles.length - 1; i >= 0; i--) {
            const obstacle = this.obstacles[i];
            obstacle.top += this.speed;

            // Remove obstacles that are off screen
            if (obstacle.top > Screen.mainScreen.heightDIPs) {
                this.gameContainer.removeChild(obstacle);
                this.obstacles.splice(i, 1);
            } else {
                obstacle.translateY = obstacle.top;
            }
        }
    }

    private spawnObstacle() {
        const obstacle = new Image();
        obstacle.src = '~/assets/obstacle.png';
        obstacle.width = 40;
        obstacle.height = 40;
        obstacle.top = -50;
        obstacle.left = Math.random() * (Screen.mainScreen.widthDIPs - 40);

        this.gameContainer.addChild(obstacle);
        this.obstacles.push(obstacle);
    }

    private checkCollisions() {
        const playerBounds = {
            left: this.playerX,
            right: this.playerX + 50,
            top: Screen.mainScreen.heightDIPs - 100,
            bottom: Screen.mainScreen.heightDIPs - 50
        };

        for (const obstacle of this.obstacles) {
            const obstacleBounds = {
                left: obstacle.left,
                right: obstacle.left + 40,
                top: obstacle.top,
                bottom: obstacle.top + 40
            };

            if (this.isColliding(playerBounds, obstacleBounds)) {
                this.gameOver();
                break;
            }
        }
    }

    private isColliding(a: any, b: any) {
        return !(
            a.right < b.left ||
            a.left > b.right ||
            a.bottom < b.top ||
            a.top > b.bottom
        );
    }

    private gameOver() {
        this.isGameOver = true;
        clearInterval(this.gameLoop);
        alert(`Game Over! Score: ${this.score}`);
        this.resetGame();
    }

    private resetGame() {
        // Clear obstacles
        for (const obstacle of this.obstacles) {
            this.gameContainer.removeChild(obstacle);
        }
        this.obstacles = [];

        // Reset variables
        this.score = 0;
        this.speed = 5;
        this.isGameOver = false;
        this.set('score', 0);
        this.set('speed', 5);

        // Reset player position
        this.playerX = (Screen.mainScreen.widthDIPs - 50) / 2;
        this.updatePlayerPosition();

        // Restart game loop
        this.startGameLoop();
    }

    onLeftTap() {
        if (this.isGameOver) return;
        this.playerX = Math.max(0, this.playerX - 20);
        this.updatePlayerPosition();
    }

    onRightTap() {
        if (this.isGameOver) return;
        this.playerX = Math.min(Screen.mainScreen.widthDIPs - 50, this.playerX + 20);
        this.updatePlayerPosition();
    }

    private updatePlayerPosition() {
        this.player.translateX = this.playerX;
    }
}