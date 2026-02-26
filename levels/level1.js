// Level 1 - Pluto's Parking Lot
const VERTICAL_ANGLE = Math.PI;
const HORIZONTAL_ANGLE = Math.PI*3/2;
const SLOT_WIDTH = 25;
const BUFFER_SPACE = 55;

const GAP_1X = SLOT_WIDTH + BUFFER_SPACE + SLOT_WIDTH;
const GAP_2X = SLOT_WIDTH + (BUFFER_SPACE + SLOT_WIDTH * 2);
const GAP_3X = SLOT_WIDTH + (BUFFER_SPACE + SLOT_WIDTH * 3);

const ENEMY_D1 = { path: "./images/enemyShipD1.png", frameWidth: 632, frameHeight: 395, frameCount: 1, scale: 0.2 };

const LEVEL_1 = {
    name: 'level1',
    enemies: [
        // top row
        { x: 200, y: 150, angle: VERTICAL_ANGLE},
        { x: 200 + GAP_1X, y: 150, angle: HORIZONTAL_ANGLE, spriteConfig: ENEMY_D1},
        { x: 200 + GAP_1X * 2, y: 150, angle: VERTICAL_ANGLE},
        { x: 200 + GAP_1X * 3, y: 150, angle: HORIZONTAL_ANGLE, spriteConfig: ENEMY_D1},
        { x: 200 + GAP_1X * 4, y: 150, angle: VERTICAL_ANGLE},
        { x: 200 + GAP_1X * 5, y: 150, angle: HORIZONTAL_ANGLE, spriteConfig: ENEMY_D1},
        { x: 200 + GAP_1X * 6, y: 150, angle: VERTICAL_ANGLE},

        // middle row
        { x: 200, y: 300, angle: HORIZONTAL_ANGLE, spriteConfig: ENEMY_D1},
        { x: 200 + GAP_1X, y: 300, angle: VERTICAL_ANGLE},
        { x: 200 + GAP_1X * 2, y: 300, angle: HORIZONTAL_ANGLE, spriteConfig: ENEMY_D1},
        { x: 200 + GAP_1X * 3, y: 300, angle: VERTICAL_ANGLE},
        { x: 200 + GAP_1X * 4, y: 300, angle: HORIZONTAL_ANGLE, spriteConfig: ENEMY_D1},
        { x: 200 + GAP_1X * 5, y: 300, angle: VERTICAL_ANGLE},
        { x: 200 + GAP_1X * 6, y: 300, angle: HORIZONTAL_ANGLE, spriteConfig: ENEMY_D1},

        // bottom row
        { x: 200, y: 450, angle: VERTICAL_ANGLE},
        { x: 200 + GAP_1X, y: 450, angle: VERTICAL_ANGLE},
        { x: 200 + GAP_1X * 2, y: 450, angle: HORIZONTAL_ANGLE, spriteConfig: ENEMY_D1},
        { x: 200 + GAP_1X * 3, y: 450, angle: VERTICAL_ANGLE},
        { x: 200 + GAP_1X * 4, y: 450, angle: VERTICAL_ANGLE},
        { x: 200 + GAP_1X * 6, y: 450, angle: VERTICAL_ANGLE}

    ],
    walls: [
        // level borders
        { x: 500, y: 750, width: 1050, height: 55},
        { x: 500, y: 25, width: 1050, height: 55},  
        { x: 0, y: 500, width: 100, height: 1000},  
        { x: 1025, y: 500, width: 100, height: 1000},  

        { x: 500, y: 750, width: 1050, height: 55}, // this + three down = level borders...
        { x: 500, y: 25, width: 1050, height: 55},  
        { x: 0, y: 500, width: 100, height: 1000},  
        { x: 1025, y: 500, width: 100, height: 1000}

    ],
    goal: { x: 725, y: 450, radius: 25},

    playerStart: { x: 500, y: 650 }
};

// Register to global LEVELS object
if (typeof LEVELS === 'undefined') window.LEVELS = {};
LEVELS['level1'] = LEVEL_1;
