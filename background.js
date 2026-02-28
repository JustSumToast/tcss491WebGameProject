class Background {
    constructor(game) {
        this.game = game;
        this.ctx = game.ctx;
        this.spriteSheet = ASSET_MANAGER.getAsset("./images/Klik&PlayGraphicLibrarySpace.png");
        console.log("SpritSheet:", this.spriteSheet);
        const levelName = this.game.currentLevel;

        this.planets = {
        level1: {sx: 1348, sy:345, sw:33, sh:31, x: 100, y: 550},//Pluto
        level2: {sx: 1282, sy:311, sw:54, sh:99, x: 750, y: 500},//Neptune
        //level3: {sx: 1282, sy:311, sw:54, sh:99 x: , y: },// Uranus 
        level4: {sx: 1245, sy:416, sw:178, sh:102, x: 650, y: 400}, //Saturn
        level5: {sx: 1057, sy:409, sw:184, sh:110, x: 50, y: 500}, //Jupiter
        levelmars: {sx: 1230, sy:336, sw:38, sh:40, x: 100, y: 333}, //Mars
        //level7: {sx: 1165, sy:325, sw:62, sh:66 x: , y: }, //Earth
        level8: {sx: 1000, sy:413, sw:43, sh:44, x: 700, y: 100 }, //Venus
        //level9: {sx: 1079, sy:347, sw:28, sh:27 x: , y: }, // Mercury
        //level10: {sx: 1000, sy:330, sw:69, sh:73 x: , y: } //Sun

         };

        this.planet = this.planets[levelName] || null;
        this.scale = 2
        if (this.planet) { 
            this.planetX = this.planet.x;
            this.planetY = this.planet.y;
        }



        this.stars = [];
        this.STAR_COUNT = 150;
        this.speedX = 0.2; // horizontal speed (pixels per frame)
        this.speedY = 0.3; // vertical speed (pixels per frame)

        this.makeStars();

        if (!this.spriteSheet) {
            console.error("Background image not loaded!")
        }
    }

    makeStars() {
        const w = this.game.ctx.canvas.width;
        const h = this.game.ctx.canvas.height;

        this.stars = [];
        for (let i = 0; i < this.STAR_COUNT; i++) {
            this.stars.push({
                x: Math.random() * w,
                y: Math.random() * h,
                size: Math.random() < 0.85 ? 1 : 2
            });
        }
    }

    update() {
        const w = this.game.ctx.canvas.width;
        const h = this.game.ctx.canvas.height;

        for (const s of this.stars) {
            s.x += this.speedX;
            s.y += this.speedY;

            // wrap around horizontally
            if (s.x > w) s.x = 0;
            if (s.x < 0) s.x = w;

            // wrap around vertically
            if (s.y > h) s.y = 0;
            if (s.y < 0) s.y = h;
        }
    }

    draw(ctx) {
        const w = this.game.ctx.canvas.width;
        const h = this.game.ctx.canvas.height;
        ctx.save();

        //ctx.globalAlpha = 1;
        //ctx.globalCompositeOperation = "source-over";
        //ctx.setTransform(1, 0, 0, 1, 0, 0);

        ctx.fillStyle = "white";
        for (const s of this.stars) {
            ctx.fillRect((s.x | 0), (s.y | 0), s.size, s.size);
        }

        if (this.spriteSheet && this.planet) {
            ctx.drawImage(
                this.spriteSheet,
                this.planet.sx,
                this.planet.sy,
                this.planet.sw,
                this.planet.sh,
                this.planetX,
                this.planetY,
                this.planet.sw * this.scale,
                this.planet.sh * this.scale
            );
        }

        ctx.restore();
    }
}
