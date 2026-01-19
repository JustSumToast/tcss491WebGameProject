const gameEngine = new GameEngine({
    debugging: true
});

const ASSET_MANAGER = new AssetManager();

// Level configurations
// Angle: 90 degrees (vertical parking)
const VERTICAL_ANGLE = Math.PI / 2;

const LEVELS = {
	level1: {
		enemies: [
			// Top row of parking spots (vertical parking)
			{ x: 100, y: 150, angle: VERTICAL_ANGLE },  // Slot 1
			{ x: 140, y: 150, angle: VERTICAL_ANGLE },  // Slot 2 (1x gap)
			// Slot 3 is EMPTY (2x gap)
			{ x: 260, y: 150, angle: VERTICAL_ANGLE },  // Slot 4 (2x gap from slot 2)
			{ x: 300, y: 150, angle: VERTICAL_ANGLE },  // Slot 5 (1x gap)
			// Slot 6 is EMPTY - TARGET (3x gap)

			// Bottom row of parking spots (vertical parking)
			{ x: 100, y: 400, angle: VERTICAL_ANGLE },  // Slot 1
			// Slot 2 is EMPTY (3x gap)
			{ x: 260, y: 400, angle: VERTICAL_ANGLE },  // Slot 3 (3x gap from slot 1)
			{ x: 320, y: 400, angle: VERTICAL_ANGLE },  // Slot 4 (2x gap)
			{ x: 360, y: 400, angle: VERTICAL_ANGLE },  // Slot 5 (1x gap)
			{ x: 440, y: 400, angle: VERTICAL_ANGLE }   // Slot 6 (3x gap)
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
