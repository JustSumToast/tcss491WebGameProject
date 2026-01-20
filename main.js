const gameEngine = new GameEngine({
    debugging: true
});

const ASSET_MANAGER = new AssetManager();

// Level configurations
const VERTICAL_ANGLE = Math.PI / 2;
const SLOT_WIDTH = 20;  // Width of vertical parking slot
const BUFFER_SPACE = 15;  // Buffer space between slots to prevent collision

// Spacing calculations
const GAP_1X = SLOT_WIDTH + BUFFER_SPACE + SLOT_WIDTH;
const GAP_2X = SLOT_WIDTH + (BUFFER_SPACE + SLOT_WIDTH * 2);
const GAP_3X = SLOT_WIDTH + (BUFFER_SPACE + SLOT_WIDTH * 3);

const LEVELS = {
	level1: {
		enemies: [
			// Top row of parking spots (vertical parking)
			{ x: 100, y: 150, angle: VERTICAL_ANGLE },  // Slot 1
			{ x: 100 + GAP_1X, y: 150, angle: VERTICAL_ANGLE },  // Slot 2
			// Slot 3 is EMPTY
			{ x: 100 + GAP_1X + GAP_2X, y: 150, angle: VERTICAL_ANGLE },  // Slot 4
			{ x: 100 + GAP_1X + GAP_2X + GAP_1X, y: 150, angle: VERTICAL_ANGLE },  // Slot 5


			// Bottom row of parking spots (vertical parking)
			{ x: 100, y: 400, angle: VERTICAL_ANGLE },  // Slot 1
			// Slot 2 is EMPTY
			{ x: 100 + GAP_3X, y: 400, angle: VERTICAL_ANGLE },  // Slot 3
			{ x: 100 + GAP_3X + GAP_2X, y: 400, angle: VERTICAL_ANGLE },  // Slot 4
			{ x: 100 + GAP_3X + GAP_2X + GAP_1X, y: 400, angle: VERTICAL_ANGLE },  // Slot 5
			{ x: 100 + GAP_3X + GAP_2X + GAP_1X + GAP_3X, y: 400, angle: VERTICAL_ANGLE }  // Slot 6
		]
	}
	// Add level2, level3, etc. here later
};

function loadLevel(levelName) {
	const levelConfig = LEVELS[levelName];
	if (!levelConfig) {
		console.error(`Level ${levelName} not found`);
		return;
	}

	gameEngine.addEntity(new Background(gameEngine));

	// Create enemy ships (already parked)
	levelConfig.enemies.forEach(enemyData => {
		const enemy = new EnemyShip(gameEngine, enemyData.x, enemyData.y, enemyData.angle);
		gameEngine.addEntity(enemy);
	});
}

ASSET_MANAGER.downloadAll(() => {
	const canvas = document.getElementById("gameWorld");
	const ctx = canvas.getContext("2d");

	gameEngine.init(ctx);

	// Create player ship in the center of the canvas
	const player = new PlayerShip(gameEngine, canvas.width / 2, canvas.height / 2);
	gameEngine.addEntity(player);

	// Load level 1
	loadLevel('level1');

	gameEngine.start();
});
