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
        { x: 768, y: 512, width: 597, height: 50 }
    ],
    goal: { x: 896, y: 640, radius: 30 },
    playerStart: { x: 128, y: 128 },

    onLoad: function(game) {
        game.addEntity(new FlyingEnemy(game, 550, 420, 800, 130, 200));

        game.addEntity(new FlyingEnemy(game, 85, 398, 427, 640, 120))
    }
};

class FlyingEnemy extends EnemyShip {
    constructor(game, startX, startY, endX, endY, speed) {
        super(game, startX, startY, 0);
        this.startX = startX;
        this.startY = startY;
        this.endX = endX;
        this.endY = endY;
        this.speed = speed;
        this.direction = 1; // 1 = moving towards end, -1 = moving towards start
        this.totalDistance = Math.sqrt(Math.pow(endX - startX, 2) + Math.pow(endY - startY, 2));
        this.distanceTraveled = 0;
    }

    update() {
        this.distanceTraveled += this.speed * this.game.clockTick * this.direction;
        if (this.distanceTraveled >= this.totalDistance) {
            this.distanceTraveled = this.totalDistance;
            this.direction = -1; // reverse direction
        } else if (this.distanceTraveled <= 0) {
            this.distanceTraveled = 0;
            this.direction = 1; // reverse direction
        }
        const t = this.totalDistance > 0 ? this.distanceTraveled / this.totalDistance : 0;
        this.x = this.startX + (this.endX - this.startX) * t;
        this.y = this.startY + (this.endY - this.startY) * t;
        const dx = this.endX - this.startX;
        const dy = this.endY - this.startY;
        let baseAngle = Math.atan2(dy, dx) + Math.PI;
        // Face the direction of movement
        this.angle = this.direction === 1 ? baseAngle + Math.PI : baseAngle;

        super.update();
    }
}



if (typeof LEVELS === 'undefined') window.LEVELS = {};
LEVELS['levelmars'] = LEVEL_MARS;