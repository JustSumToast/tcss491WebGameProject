// Level 2 - Scattered Obstacles
const LEVEL_2_VERTICAL_ANGLE = Math.PI / 2;

const LEVEL_2 = {
    name: 'level2',
    enemies: [
        { x: 150, y: 100, angle: LEVEL_2_VERTICAL_ANGLE },
        { x: 400, y: 200, angle: LEVEL_2_VERTICAL_ANGLE },
        { x: 600, y: 300, angle: LEVEL_2_VERTICAL_ANGLE }
    ],
    walls: [
        { x: 200, y: 150, width: 400, height: 30 },
        { x: 500, y: 400, width: 300, height: 30 }
    ],
    goal: { x: 700, y: 100, radius: 30 },
    playerStart: { x: 100, y: 384 }
};

// Register to global LEVELS object
if (typeof LEVELS === 'undefined') window.LEVELS = {};
LEVELS['level2'] = LEVEL_2;
