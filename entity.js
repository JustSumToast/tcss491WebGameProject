/**
 * Base Entity class for all game objects
 * Provides common properties and collision detection support
 */
class Entity {
    constructor(game, x, y, width, height) {
        this.game = game;
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.removeFromWorld = false;

        // Calculate radius for bounding circle (use larger dimension)
        this.radius = Math.max(width, height) / 2;

        // Initialize bounding circle
        this.updateBoundingCircle();
    }

    updateBoundingCircle() {
        // Create bounding circle centered on entity position
        this.boundingCircle = new BoundingCircle(this.x, this.y, this.radius);
    }

    update() {
        // Override in child classes
    }

    draw(ctx) {
        // Override in child classes
    }
}
