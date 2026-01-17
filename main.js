const gameEngine = new GameEngine({
    debugging: true
});

const ASSET_MANAGER = new AssetManager();

ASSET_MANAGER.downloadAll(() => {
	const canvas = document.getElementById("gameWorld");
	const ctx = canvas.getContext("2d");

	gameEngine.init(ctx);

	// Create player ship in the center of the canvas
	const player = new PlayerShip(gameEngine, canvas.width / 2, canvas.height / 2);
	gameEngine.addEntity(player);

	gameEngine.start();
});
