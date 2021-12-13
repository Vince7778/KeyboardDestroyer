
let particles = [];

class Particle {
    constructor(size, color, pos, vel) {
        this.size = size;
        this.origSize = size;
        this.color = color;
        this.vel = vel;
        this.pos = [pos[0], pos[1]];
    }

    tick(dt) {
        this.pos[0] += this.vel[0] * dt/1000;
        this.pos[1] += this.vel[1] * dt/1000;
        this.size -= 0.7*dt/1000;
    }

    draw(ctx, scale) {
        ctx.beginPath();
        ctx.arc(this.pos[0], this.pos[1], this.size*scale, 0, 2*Math.PI);

        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.closePath();
    }
}

function tickAllParticles(dt) {
    particles.forEach(p => p.tick(dt));
    particles = particles.filter(p => p.size > 0);
}

function drawAllParticles(ctx, scale) {
    particles.sort((a, b) => a.size-b.size);
    particles.forEach(p => p.draw(ctx, scale));
}

function spawnRandomParticle(size, pos, maxVel) {
    let randYellow = Math.floor(Math.random()*256);
    let color = `rgb(255, ${randYellow}, 0)`;

    let angle = Math.random()*2*Math.PI;
    let vel = [maxVel*Math.cos(angle), maxVel*Math.sin(angle)];
    particles.push(new Particle(size, color, pos, vel));
}