// Sun Level

const SUN_LEVEL_CENTER_X = 512;
const SUN_LEVEL_CENTER_Y = 384;

const SUN_LEVEL = {
    name: 'sun',
    enemies: [],
    walls: [
        // level borders
        { x: 500, y: 750, width: 1050, height: 55 },
        { x: 500, y: 25, width: 1050, height: 55 },
        { x: 0, y: 500, width: 100, height: 1000 },
        { x: 1025, y: 500, width: 100, height: 1000 }
    ],
    goal: { x: 880, y: 384, radius: 25 },
    playerStart: { x: 150, y: 650 },

    onLoad: function(game) {
        // add sun at center
        game.addEntity(new Sun(game, SUN_LEVEL_CENTER_X, SUN_LEVEL_CENTER_Y, 240));
    }
};

// Register to global LEVELS object
if (typeof LEVELS === 'undefined') window.LEVELS = {};
LEVELS['sun'] = SUN_LEVEL;
