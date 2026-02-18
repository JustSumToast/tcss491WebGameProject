LEVELS.level8 = {
    playerStart: { x: 80, y: 700 },

    enemies: [
        { x: 100, y: 100,},
        { x: 970, y: 100, angle: 90},
        { x: 100, y: 300,}


    ],

    walls: [
        { x: 100, y: 0, width: 1600, height: 40 }, 
        { x: 0, y: 0, width: 40, height: 1000 },   
        { x: 900, y: 0, width: 40, height: 1400 }, 
        { x: 200, y: 200, width: 800, height: 40 },
        { x: 200, y: 400, width: 800, height: 40 },
        { x: 200, y: 600, width: 1100, height: 40 },
        { x: 200, y: 200, width: 40, height: 200 },
        { x: 760, y: 445, width: 40, height: 350 },
        { x: 200, y: 600, width: 40, height: 200 }
    ],

    goal: {
        x: 100, y: 500, radius: 30
    },
    
    onLoad: function(game) {
        // Add fog ON TOP of everything
        game.entities.unshift(new Fog(game, 200));
    }
};

// Register to global LEVELS object
if (typeof LEVELS === 'undefined') window.LEVELS = {};
LEVELS['level8'] = LEVEL_8;

