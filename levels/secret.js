class SecretTimer {
    constructor(game, time) {
        this.game = game;
        this.timeLeft = time;
        this.winSound = new Audio("./audio/win.mp3");
    }

    update() {

        this.timeLeft -= this.game.clockTick;

        if (this.timeLeft <= 0) {
            this.timeLeft = 0;
            this.finished = true;

            console.log("Secret level complete!");
            this.game.gameState = "won";
            this.game.messageColor = "pink";
            this.game.message = "Poptarts Collected: " + this.game.poptartCount;
            this.removeFromWorld = true;
            setTimeout(() => {
                nextLevel();
            }, 5000);
                
        }
    }

    draw(ctx) {
        // ctx.fillStyle = "white";
        // ctx.font = "30px Arial";

        // const time = Math.ceil(this.timeLeft);
        // ctx.fillText("Survive: " + time, 10, 80);
    }
}

class PoptartSpawner {
    constructor(game) {
        this.game = game;
        this.spawnTimer = 0;
        this.spawnInterval = 0.5; // seconds
    }

    update() {

        if (this.game.gameState !== "playing") return;

        this.spawnTimer += this.game.clockTick;

        if (this.spawnTimer >= this.spawnInterval) {

            this.spawnTimer = 0;

            const canvas = this.game.ctx.canvas;

            for (let i = 0; i < 2; i++) {

                const x = Math.random() * this.game.ctx.canvas.width;
                const y = Math.random() * this.game.ctx.canvas.height;

                const poptart = new Interactable(this.game, x, y, "poptart");

                this.game.addEntity(poptart);
            }
            
        }

        if (this.game.gameState === "win") return;
    }

    draw(ctx) {}
}

const SECRET_LEVEL = {
    name: "secret",
    enemies: [],
    walls: [],
    interactables: [],

    goal: null,
    playerStart: {x: 500, y: 600},

    onLoad: function(game) {
        game.poptartCount = 0;
        const cat = new CatEntity(game, 500, 300);
        game.addEntity(cat);
        game.addEntity(new SecretTimer(game, 30));
        game.addEntity(new PoptartSpawner(game));
        const player = game.entities.find(e => e.constructor.name === "Player");
    }
};

//Register to LEVELS
if (typeof LEVELS === 'undefined') window.LEVELS = {};
LEVELS["secret"] = SECRET_LEVEL;