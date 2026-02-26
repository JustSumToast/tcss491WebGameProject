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
        this.zIndex = 0;

        // Calculate radius for bounding circle (use larger dimension)
        this.radius = Math.max(width, height) / 2;

        // Initialize bounding circle
        this.updateBoundingCircle();
    }

    updateBoundingCircle() {
        // Pass game reference to bounding circle for debug toggle
        this.boundingCircle = new BoundingCircle(this.x, this.y, this.radius, this.game);
    }

    update() {
        // Override in child classes
    }

    draw(ctx) {
        // Override in child classes
    }

    // Set up sprite for this entity
    setupSprite(config) {
        this.spriteSheet = ASSET_MANAGER.getAsset(config.path);
        this.frameWidth = config.frameWidth;
        this.frameHeight = config.frameHeight;
        this.frameCount = config.frameCount || 1;
        this.spriteScale = config.scale || 1;
    }

    // Draw a specific frame of the sprite
    drawSprite(ctx, x, y, angle, frameIndex) {
        if (!this.spriteSheet) return;

        const drawWidth = this.frameWidth * this.spriteScale;
        const drawHeight = this.frameHeight * this.spriteScale;
        const frameX = frameIndex * this.frameWidth;

        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(angle);
        ctx.drawImage(
            this.spriteSheet,
            frameX, 0,
            this.frameWidth, this.frameHeight,
            -drawWidth / 2, -drawHeight / 2,
            drawWidth, drawHeight
        );
        ctx.restore();
    }
}
