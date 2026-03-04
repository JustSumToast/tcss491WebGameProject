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
            }, 2000);
                
        }
    }

    draw(ctx) {
        ctx.fillStyle = "white";
        ctx.font = "30px Arial";

        const time = Math.ceil(this.timeLeft);
        ctx.fillText("Survive: " + time, 10, 80);
    }
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
        game.addEntity(new SecretTimer(game, 5)); //seconds survival
    }
};

//Register to LEVELS
if (typeof LEVELS === 'undefined') window.LEVELS = {};
LEVELS["secret"] = SECRET_LEVEL;