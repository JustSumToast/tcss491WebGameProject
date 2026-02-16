const VERT_ANGLE = Math.PI / 2;

const LEVEL_MARS = {
    name: 'levelmars',
    enemies: [
        
    ],
    walls: [
         // level borders
        { x: 500, y: 759, width: 1050, height: 27 },
        { x: 500, y: 12, width: 1050, height: 27 },
        { x: 0, y: 500, width: 50, height: 1000 },
        { x: 1025, y: 500, width: 50, height: 1000 },
        { x: 298, y: 256, width: 597, height: 50 },
        { x: 939, y: 256, width: 171, height: 50 },
        { x: 597, y: 512, width: 597, height: 50 }
    ],
    goal: { x: 896, y: 640, radius: 30 },
    playerStart: { x: 128, y: 128 }
};

if (typeof LEVELS === 'undefined') window.LEVELS = {};
LEVELS['levelmars'] = LEVEL_MARS;