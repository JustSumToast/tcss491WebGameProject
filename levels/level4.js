// Level 4 - Black Hole Challenge

const LEVEL_4_CENTER_X = 512;
const LEVEL_4_CENTER_Y = 384;
const LEVEL_4_BLACKHOLE_RADIUS = 120;
const LEVEL_4_ENEMY_RADIUS = 20; // enemy bounding box radius

// Blackhole entity
class Blackhole {
    constructor(game, x, y, size) {
        this.game = game;
        this.x = x;
        this.y = y;
        this.size = size;
        this.rotation = 0;
        this.rotationSpeed = 1;
        this.image = ASSET_MANAGER.getAsset("./images/blackhole.png");
        this.removeFromWorld = false;
        // no boundingCircle = no collision
    }

    update() {
        this.rotation += this.rotationSpeed * this.game.clockTick;
    }

    draw(ctx) {
        if (this.image) {
            ctx.save();
            ctx.translate(this.x, this.y);
            ctx.rotate(this.rotation);
            ctx.drawImage(this.image, -this.size / 2, -this.size / 2, this.size, this.size);
            ctx.restore();
        }
    }
}

// Orbiting enemy ship - circles around a center point
// orbitSpeed: radians per second (positive = clockwise, negative = counter-clockwise)
// startAngle: starting angle in radians (0 = right, PI/2 = bottom, PI = left, 3PI/2 = top)
class OrbitingEnemy extends EnemyShip {
    constructor(game, centerX, centerY, orbitDistance, orbitSpeed, startAngle = 0) {
        super(game, centerX + orbitDistance, centerY, 0);
        this.centerX = centerX;
        this.centerY = centerY;
        this.orbitDistance = orbitDistance;
        this.orbitSpeed = orbitSpeed;
        this.orbitAngle = startAngle;
    }

    update() {
        this.orbitAngle += this.orbitSpeed * this.game.clockTick;
        this.x = this.centerX + Math.cos(this.orbitAngle) * this.orbitDistance;
        this.y = this.centerY + Math.sin(this.orbitAngle) * this.orbitDistance;
        this.angle = this.orbitAngle + Math.PI / 2; // face direction of movement
        super.update();
    }
}

const LEVEL_4 = {
    name: 'level4',
    enemies: [],
    walls: [
        // level borders
        { x: 500, y: 750, width: 1050, height: 55 },
        { x: 500, y: 25, width: 1050, height: 55 },
        { x: 0, y: 500, width: 100, height: 1000 },
        { x: 1025, y: 500, width: 100, height: 1000 }
    ],
    goal: { x: 512, y: 384, radius: 25 },
    playerStart: { x: 150, y: 150 },

    onLoad: function(game) {
        // add blackhole at center
        game.addEntity(new Blackhole(game, LEVEL_4_CENTER_X, LEVEL_4_CENTER_Y, 240));

        // first enemy - clockwise, distance x2, speed 1, start at right
        const orbitDistance1 = LEVEL_4_BLACKHOLE_RADIUS + (LEVEL_4_ENEMY_RADIUS * 2);
        game.addEntity(new OrbitingEnemy(game, LEVEL_4_CENTER_X, LEVEL_4_CENTER_Y, orbitDistance1, 1, 0));

        // second enemy - counter-clockwise, distance x5, speed 1.5, start at left
        const orbitDistance2 = LEVEL_4_BLACKHOLE_RADIUS + (LEVEL_4_ENEMY_RADIUS * 5);
        game.addEntity(new OrbitingEnemy(game, LEVEL_4_CENTER_X, LEVEL_4_CENTER_Y, orbitDistance2, -1.5, Math.PI));

        // second enemy - clockwise, distance x8 speed 2, start at vertical position
        const orbitDistance3 = LEVEL_4_BLACKHOLE_RADIUS + (LEVEL_4_ENEMY_RADIUS * 8);
        game.addEntity(new OrbitingEnemy(game, LEVEL_4_CENTER_X, LEVEL_4_CENTER_Y, orbitDistance3, 2, 3*Math.PI/2));
    }
};

// Register to global LEVELS object
if (typeof LEVELS === 'undefined') window.LEVELS = {};
LEVELS['level4'] = LEVEL_4;
