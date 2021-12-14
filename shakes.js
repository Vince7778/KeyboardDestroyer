
let shakes = [];

class Shake {
    constructor(mag, time, decreasing) {
        this.mag = mag;
        this.time = time;
        this.initTime = time;
        this.decreasing = !!decreasing;
    }

    tick(dt) {
        this.time -= dt/1000;
    }

    getMag() {
        return this.mag * this.time / this.initTime;
    }
}

function tickShake(dt) {
    shakes.forEach(s => s.tick(dt));
    shakes = shakes.filter(s => s.time > 0);
}

let lastShake = [0, 0];
let lastShakeTime = new Date();
const shakeThreshold = 1/60;
let shakeSize = 1;

function getShake(curTime, scale) {
    if (curTime - lastShakeTime < shakeThreshold*1000) return lastShake;
    if (shakes.length === 0) return [0, 0];

    let magSum = shakes.reduce((v, c) => v+c.getMag(), 0) * scale/60 * shakeSize;
    let angle = Math.random()*2*Math.PI;
    let shake = [magSum*Math.cos(angle), magSum*Math.sin(angle)];

    lastShake = shake;
    lastShakeTime = curTime;
    return shake;
}

function addShake(mag, time, decreasing) {
    shakes.push(new Shake(mag, time, decreasing));
}