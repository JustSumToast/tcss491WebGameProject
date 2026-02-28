// Level 2 - Neptune's Secluded Spot :D
const LEVEL_2_VERTICAL_ANGLE = Math.PI / 2;

const LEVEL_2 = {
    name: 'level2',
    enemies: [
        { x: 400, y: 100, angle: VERTICAL_ANGLE},
        { x: 600, y: 100, angle: VERTICAL_ANGLE},
        { x: 700, y: 250, angle: VERTICAL_ANGLE},
        { x: 400, y: 500, angle: VERTICAL_ANGLE},

    ],
    walls: [
        { x: 500, y: 750, width: 1050, height: 55 }, // borders
        { x: 500, y: 25, width: 1050, height: 55 },
        { x: 0, y: 500, width: 100, height: 1000 },
        { x: 1025, y: 500, width: 100, height: 1000 },

        { x: 100, y: 300, width: 1050, height: 55 }, // wall obstacles
        { x: 800, y: 460, width: 500, height: 55 },
        { x: 500, y: 100, width: 100, height: 100},
        { x: 800, y: 250, width: 100, height: 100}, // blocks
        { x: 100, y: 525, width: 100, height: 100},
        { x: 300, y: 500, width: 100, height: 100},
        { x: 500, y: 480, width: 100, height: 150},
        { x: 600, y: 550, width: 100, height: 150},


    ],
    goal: { x: 810, y: 605, radius: 30 },
    playerStart: { x: 150, y: 165}
};

// Register to global LEVELS object
if (typeof LEVELS === 'undefined') window.LEVELS = {};
LEVELS['level2'] = LEVEL_2;
