const gameEngine = new GameEngine({ debugging: true });
const ASSET_MANAGER = new AssetManager();

// Track game state
gameEngine.gameState = "playing"; // "playing", "won", "lost"
gameEngine.message = "";          // Text to display

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
		]
	}
};

// Load level enemies
function loadLevel(levelName) {
	const levelConfig = LEVELS[levelName];
	if (!levelConfig) {
		console.error(`Level ${levelName} not found`);
		return;
	}
	gameEngine.currentLevel = levelName;

	gameEngine.addEntity(new Background(gameEngine));

	levelConfig.enemies.forEach(enemyData => {
		const enemy = new EnemyShip(gameEngine, enemyData.x, enemyData.y, enemyData.angle);
		gameEngine.addEntity(enemy);
	});
}

// Reset level
function resetLevel(game) {
	game.entities = [];
	game.gameState = "playing";
	game.message = "";

	const canvas = game.ctx.canvas;

	// Add player
	const player = new PlayerShip(game, canvas.width / 2, canvas.height / 2);
	game.addEntity(player);

	// Add goal circle
	const goal = new GoalCircle(game, 500, 300, 30); // x=500, y=300, radius=30
	game.addEntity(goal);

	// Load enemies
	loadLevel(game.currentLevel);
}

// Start game
ASSET_MANAGER.downloadAll(() => {
	const canvas = document.getElementById("gameWorld");
	const ctx = canvas.getContext("2d");

	gameEngine.init(ctx);

	// Player
	const player = new PlayerShip(gameEngine, canvas.width / 2, canvas.height / 2);
	gameEngine.addEntity(player);

	// Goal circle
	const goal = new GoalCircle(gameEngine, 500, 300, 30);
	gameEngine.addEntity(goal);

	// Load enemies
	loadLevel('level1');

	gameEngine.start();
});
