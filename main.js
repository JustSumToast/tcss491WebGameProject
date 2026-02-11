// LEVELS object is populated by individual level files (levels/level1.js, levels/level2.js, etc.)
// Each level file registers itself to the global LEVELS object
if (typeof LEVELS === 'undefined') window.LEVELS = {};

const gameEngine = new GameEngine({ debugging: false });
const ASSET_MANAGER = new AssetManager();

// load assets
ASSET_MANAGER.queueDownload("./images/playership.png");
ASSET_MANAGER.queueDownload("./images/blackhole.png");

// track game state
gameEngine.gameState = "menu"; // "menu", "playing", "won", "lost"
gameEngine.message = "";

// load level enemies, walls, goal
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

    // call level-specific onLoad if defined
    if (levelConfig.onLoad) {
        levelConfig.onLoad(gameEngine);
    }
}

// reset level
function resetLevel(game) {
    game.entities = [];
    game.gameState = "playing";
    game.message = "";

    const canvas = game.ctx.canvas;
    const levelConfig = LEVELS[game.currentLevel];

    // player start position
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

// level switching - goes to next level, returns to menu on final level
function nextLevel() {
    const levelNames = Object.keys(LEVELS);
    const currentIndex = levelNames.indexOf(gameEngine.currentLevel);
    const nextIndex = currentIndex + 1;

    if (nextIndex >= levelNames.length) {
        // final level completed - return to menu
        gameEngine.entities = [];
        gameEngine.gameState = "menu";
        gameEngine.message = "";
        document.getElementById("gameMenu").style.display = "block";
        return;
    }

    gameEngine.currentLevel = levelNames[nextIndex];
    resetLevel(gameEngine);
}

// menu start level
function startLevel(levelName) {
    gameEngine.currentLevel = levelName;
    resetLevel(gameEngine);
    gameEngine.gameState = "playing";
    document.getElementById("gameMenu").style.display = "none";
}

// global flag for bounding circle debug
gameEngine.showBoundingCircles = true;

// listen for key presses
window.addEventListener("keydown", function(e) {
    if (e.key === "5") { // toggle debug on/off
        gameEngine.showBoundingCircles = !gameEngine.showBoundingCircles;
        console.log("Bounding circles debug:", gameEngine.showBoundingCircles);
    }
});

// start game
ASSET_MANAGER.downloadAll(() => {
    const canvas = document.getElementById("gameWorld");
    const ctx = canvas.getContext("2d");

    gameEngine.init(ctx);

    // add background (stars visible even on menu)
    const menuBackground = new Background(gameEngine);
    gameEngine.addEntity(menuBackground);

    // --- AUDIO SETUP ---
    const menuMusic = new Audio('./sounds/titlemenu.ogg');
    menuMusic.loop = true;
    menuMusic.volume = 0.5;

    const level1Music = new Audio('./sounds/level1.ogg');
    level1Music.loop = true;
    level1Music.volume = 0.5;

    // track if menu music has been played
    let menuMusicStarted = false;

    // play menu music on first user interaction
    function startMenuMusic() {
        if (!menuMusicStarted) {
            menuMusic.play().catch(e => console.log("Menu music blocked:", e));
            menuMusicStarted = true;
        }
        window.removeEventListener('click', startMenuMusic);
        window.removeEventListener('keydown', startMenuMusic);
    }

    window.addEventListener('click', startMenuMusic);
    window.addEventListener('keydown', startMenuMusic);

    // override startLevel to stop menu music and start level music
    const originalStartLevel = window.startLevel;
    window.startLevel = function(levelName) {
        // if menu music hasn't played yet, try to start it for autoplay policy
        if (!menuMusicStarted) {
            menuMusic.play().catch(e => console.log("Menu music blocked on start:", e));
            menuMusicStarted = true;
        }

        // stop menu music
        menuMusic.pause();
        menuMusic.currentTime = 0;

        // start level1 music if level1
        if (levelName === 'level1') {
            level1Music.play().catch(e => console.log("Level1 music blocked:", e));
        }

        // call original startLevel
        originalStartLevel(levelName);
    }
    // --- END AUDIO SETUP ---

    // center menu
    const menu = document.getElementById("gameMenu");
    menu.style.position = "absolute";
    menu.style.top = "50%";
    menu.style.left = "50%";
    menu.style.transform = "translate(-50%, -50%)";

    menu.style.display = "block";
    gameEngine.start();
});
