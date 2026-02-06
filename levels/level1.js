// Level 1 - Parking Lot
const VERTICAL_ANGLE = Math.PI / 2;
const SLOT_WIDTH = 20;
const BUFFER_SPACE = 50;

const GAP_1X = SLOT_WIDTH + BUFFER_SPACE + SLOT_WIDTH;
const GAP_2X = SLOT_WIDTH + (BUFFER_SPACE + SLOT_WIDTH * 2);
const GAP_3X = SLOT_WIDTH + (BUFFER_SPACE + SLOT_WIDTH * 3);

const LEVEL_1 = {
    name: 'level1',
    enemies: [
        // Top row
        { x: 100, y: 150, angle: VERTICAL_ANGLE },
        { x: 100 + GAP_1X, y: 150, angle: VERTICAL_ANGLE },
        { x: 100 + GAP_1X + GAP_2X, y: 150, angle: VERTICAL_ANGLE },
        { x: 100 + GAP_1X + GAP_2X + GAP_1X, y: 150, angle: VERTICAL_ANGLE },
        // Bottom row
        { x: 100, y: 400, angle: VERTICAL_ANGLE },
        { x: 100 + GAP_3X, y: 400, angle: VERTICAL_ANGLE },
        { x: 100 + GAP_3X + GAP_2X, y: 400, angle: VERTICAL_ANGLE },
        { x: 100 + GAP_3X + GAP_2X + GAP_1X, y: 400, angle: VERTICAL_ANGLE },
        { x: 100 + GAP_3X + GAP_2X + GAP_1X + GAP_3X, y: 400, angle: VERTICAL_ANGLE }
    ],
    walls: [
        { x: 300, y: 90, width: 500, height: 30 },
        { x: 400, y: 450, width: 700, height: 30 }
    ],
    goal: { x: 500, y: 300, radius: 30 },
    playerStart: { x: 255, y: 650 }
};

// Register to global LEVELS object
if (typeof LEVELS === 'undefined') window.LEVELS = {};
LEVELS['level1'] = LEVEL_1;
