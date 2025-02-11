class Game {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.scoreElement = document.getElementById('score');
        this.speedElement = document.getElementById('speed');
        
        // Set canvas size
        this.resizeCanvas();
        window.addEventListener('resize', () => this.resizeCanvas());

        // Game state
        this.score = 0;
        this.speed = 5;
        this.isGameOver = false;
        
        // Player state
        this.playerWidth = 50;
        this.playerHeight = 80;
        this.playerX = this.canvas.width / 2 - this.playerWidth / 2;
        this.playerY = this.canvas.height - this.playerHeight - 20;
        
        // Obstacles
        this.obstacles = [];
        this.obstacleWidth = 60;
        this.obstacleHeight = 60;
        
        // Controls
        this.keys = {
            left: false,
            right: false
        };
        
        this.setupControls();
        this.startGameLoop();
    }

    resizeCanvas() {
        this.canvas.width = Math.min(600, window.innerWidth - 40);
        this.canvas.height = this.canvas.width * 1.5;
        this.playerY = this.canvas.height - this.playerHeight - 20;
    }

    setupControls() {
        // Keyboard controls
        window.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') this.keys.left = true;
            if (e.key === 'ArrowRight') this.keys.right = true;
        });
        
        window.addEventListener('keyup', (e) => {
            if (e.key === 'ArrowLeft') this.keys.left = false;
            if (e.key === 'ArrowRight') this.keys.right = false;
        });

        // Touch controls
        const leftBtn = document.getElementById('leftBtn');
        const rightBtn = document.getElementById('rightBtn');

        leftBtn.addEventListener('touchstart', () => this.keys.left = true);
        leftBtn.addEventListener('touchend', () => this.keys.left = false);
        rightBtn.addEventListener('touchstart', () => this.keys.right = true);
        rightBtn.addEventListener('touchend', () => this.keys.right = false);
    }

    startGameLoop() {
        const gameLoop = () => {
            if (!this.isGameOver) {
                this.update();
                this.draw();
                requestAnimationFrame(gameLoop);
            }
        };
        gameLoop();
    }

    update() {
        // Update player position
        if (this.keys.left) {
            this.playerX = Math.max(0, this.playerX - 5);
        }
        if (this.keys.right) {
            this.playerX = Math.min(this.canvas.width - this.playerWidth, this.playerX + 5);
        }

        // Spawn obstacles
        if (Math.random() < 0.02) {
            this.obstacles.push({
                x: Math.random() * (this.canvas.width - this.obstacleWidth),
                y: -this.obstacleHeight
            });
        }

        // Update obstacles
        for (let i = this.obstacles.length - 1; i >= 0; i--) {
            const obstacle = this.obstacles[i];
            obstacle.y += this.speed;

            // Check collision
            if (this.checkCollision(obstacle)) {
                this.gameOver();
                return;
            }

            // Remove off-screen obstacles
            if (obstacle.y > this.canvas.height) {
                this.obstacles.splice(i, 1);
                this.score += 10;
                this.scoreElement.textContent = `Score: ${this.score}`;

                // Increase speed every 100 points
                if (this.score % 100 === 0) {
                    this.speed += 0.5;
                    this.speedElement.textContent = `Speed: ${Math.floor(this.speed)}`;
                }
            }
        }
    }

    draw() {
        // Clear canvas
        this.ctx.fillStyle = '#34495e';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // Draw road lines
        this.ctx.fillStyle = '#ffffff';
        for (let y = (this.score * 2) % 40; y < this.canvas.height; y += 40) {
            this.ctx.fillRect(this.canvas.width / 2 - 2, y, 4, 20);
        }

        // Draw player
        this.ctx.fillStyle = '#e74c3c';
        this.ctx.fillRect(this.playerX, this.playerY, this.playerWidth, this.playerHeight);

        // Draw obstacles
        this.ctx.fillStyle = '#2ecc71';
        this.obstacles.forEach(obstacle => {
            this.ctx.fillRect(obstacle.x, obstacle.y, this.obstacleWidth, this.obstacleHeight);
        });
    }

    checkCollision(obstacle) {
        return (
            this.playerX < obstacle.x + this.obstacleWidth &&
            this.playerX + this.playerWidth > obstacle.x &&
            this.playerY < obstacle.y + this.obstacleHeight &&
            this.playerY + this.playerHeight > obstacle.y
        );
    }

    gameOver() {
        this.isGameOver = true;
        alert(`Game Over! Score: ${this.score}`);
        location.reload();
    }
}

// Start game when page loads
window.addEventListener('load', () => new Game());