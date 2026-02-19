LEVELS.level5 = {
    playerStart: { x: 300, y: 100 },

    enemies: [
        { x: 900, y: 650, angle: VERTICAL_ANGLE,},
        { x: 100, y: 650},
        { x: 950, y: 400, angle: VERTICAL_ANGLE,},
        { x: 500, y: 200},
        { x: 500, y: 730, angle: 200,},
        { x: 320, y: 300, angle: VERTICAL_ANGLE,},
        { x: 320, y: 500, angle: VERTICAL_ANGLE,}
        
    ],

    walls: [
        { x: 0,   y: 0,   width: 800, height: 100 }, //horizontal NW
        { x: 0,   y: 760,   width: 800, height: 100 },//horizontal SW
        { x: 1000,   y: 0,   width: 800, height: 100 }, //horizontal NE
        { x: 1000,   y: 760,   width: 800, height: 100 }, //horizontal SE
        { x: 0,   y: 0,   width: 100, height: 600 }, //vertical NW
        { x: 1000,   y: 0,   width: 59, height: 600 }, //vertical NE
        { x: 1000,   y: 800,   width: 59, height: 600 }, //vertical SE
        { x: 0,   y: 800,   width: 100, height: 600 }, //vertical SW
        { x: 400,   y: 0,   width: 70, height: 600 }, //vertical L
        { x: 565,   y: 300,   width: 400, height: 70 }, //horizontal L
        { x: 565,   y: 500,   width: 400, height: 70 },
        { x: 400,   y: 790,   width: 800, height: 50}

    ],

    goal: {
        x: 515, y: 60, radius: 30
    },

    onLoad: function(game) {
        game.gravityType = "distanceFromGoal";
        game.minGravity = 200;   // always at least this much pull
        game.maxGravity = 45000;  // maximum pull when far away
    }
    
};
// Register to global LEVELS object
if (typeof LEVELS === 'undefined') window.LEVELS = {};
LEVELS['level5'] = LEVEL_5;