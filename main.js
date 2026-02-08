const gameEngine = new GameEngine({ debugging: false });
const ASSET_MANAGER = new AssetManager();

// Load assets
ASSET_MANAGER.queueDownload("./images/playership.png");

// Track game state
gameEngine.gameState = "menu"; // "menu", "playing", "won", "lost"
gameEngine.message = "";
gameEngine.elapsedTime = 0;

// Level configurations
const VERTICAL_ANGLE = Math.PI / 2;
const SLOT_WIDTH = 20;
const BUFFER_SPACE = 50;

const GAP_1X = SLOT_WIDTH + BUFFER_SPACE + SLOT_WIDTH;
const GAP_2X = SLOT_WIDTH + (BUFFER_SPACE + SLOT_WIDTH * 2);
const GAP_3X = SLOT_WIDTH + (BUFFER_SPACE + SLOT_WIDTH * 3);

const LEVELS = {
    level1: {
        enemies: [
            { x: 100, y: 150, angle: VERTICAL_ANGLE },
            { x: 100 + GAP_1X, y: 150, angle: VERTICAL_ANGLE },
            { x: 100 + GAP_1X + GAP_2X, y: 150, angle: VERTICAL_ANGLE },
            { x: 100 + GAP_1X + GAP_2X + GAP_1X, y: 150, angle: VERTICAL_ANGLE },
            { x: 100, y: 400, angle: VERTICAL_ANGLE },
            { x: 100 + GAP_3X, y: 400, angle: VERTICAL_ANGLE },
            { x: 100 + GAP_3X + GAP_2X, y: 400, angle: VERTICAL_ANGLE },
            { x: 100 + GAP_3X + GAP_2X + GAP_1X, y: 400, angle: VERTICAL_ANGLE },
            { x: 100 + GAP_3X + GAP_2X + GAP_1X + GAP_3X, y: 400, angle: VERTICAL_ANGLE }
        ],
        walls: [
            { x: 300, y: 90, width: 500, height: 30 },
            { x: 400, y: 450, width: 700, height: 30 }
        ],
        goal: { x: 500, y: 300, radius: 30 },
        playerStart: { x: 255, y: 650 } // 
    },
    level2: {
        enemies: [
            { x: 150, y: 100, angle: VERTICAL_ANGLE },
            { x: 400, y: 200, angle: VERTICAL_ANGLE },
            { x: 600, y: 300, angle: VERTICAL_ANGLE }
        ],
        walls: [
            { x: 200, y: 150, width: 400, height: 30 },
            { x: 500, y: 400, width: 300, height: 30 }
        ],
        goal: { x: 700, y: 100, radius: 30 },
        playerStart: { x: 100, y: 384 } 
    }
};

// Load level enemies, walls, goal
function loadLevel(levelName) {
    const levelConfig = LEVELS[levelName];
    const canvas = gameEngine.ctx.canvas;
    if (!levelConfig) return console.error(`Level ${levelName} not found`);

    gameEngine.currentLevel = levelName;
    gameEngine.addEntity(new Background(gameEngine));

    levelConfig.enemies.forEach(enemyData => {
        const enemy = new EnemyShip(gameEngine, enemyData.x, enemyData.y, enemyData.angle);
        gameEngine.addEntity(enemy);
    });

    if (levelConfig.walls) {
        levelConfig.walls.forEach(w => {
            const x = w.x === "center" ? canvas.width / 2 : w.x;
            const width = w.width === "full" ? canvas.width : w.width;
            gameEngine.addEntity(new Wall(gameEngine, x, w.y, width, w.height));
        });
    }

    if (levelConfig.goal) {
        const g = levelConfig.goal;
        gameEngine.addEntity(new GoalCircle(gameEngine, g.x, g.y, g.radius));
    }
}

// Reset level
function resetLevel(game) {
    game.entities = [];
    game.gameState = "playing";
    game.message = "";
    game.elapsedTime = 0;

    const canvas = game.ctx.canvas;
    const levelConfig = LEVELS[game.currentLevel];

    // Player start position
    let startX = canvas.width / 2;
    let startY = canvas.height / 2;
    if (levelConfig.playerStart) {
        startX = levelConfig.playerStart.x ?? startX;
        startY = levelConfig.playerStart.y ?? startY;
    }

    const player = new PlayerShip(game, startX, startY);
    game.addEntity(player);

    loadLevel(game.currentLevel);
}

// Level switching
function nextLevel() {
    if (gameEngine.currentLevel === 'level1') {
        gameEngine.currentLevel = 'level2';
    } else {
        gameEngine.currentLevel = 'level1';
    }
    resetLevel(gameEngine);
}

// Menu start level
function startLevel(levelName) {
    gameEngine.currentLevel = levelName;
    resetLevel(gameEngine);
    gameEngine.gameState = "playing";
    document.getElementById("gameMenu").style.display = "none";
}

// Global flag for bounding circle debug
gameEngine.showBoundingCircles = true;

// Listen for key presses
window.addEventListener("keydown", function(e) {
    if (e.key === "5") { // toggle debug on/off
        gameEngine.showBoundingCircles = !gameEngine.showBoundingCircles;
        console.log("Bounding circles debug:", gameEngine.showBoundingCircles);
    }
});


// Start game
ASSET_MANAGER.downloadAll(() => {
    const canvas = document.getElementById("gameWorld");
    const ctx = canvas.getContext("2d");

    gameEngine.init(ctx);

    // Center menu
    const menu = document.getElementById("gameMenu");
    menu.style.position = "absolute";
    menu.style.top = "50%";
    menu.style.left = "50%";
    menu.style.transform = "translate(-50%, -50%)";

    menu.style.display = "block";
    gameEngine.start();
});
