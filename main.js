
const el = n => document.getElementById(n);

const canvas = el("cvs");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

window.addEventListener("resize", () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    scale = 60/1500*canvas.width;
    qwerty.scale = scale;
    activeKeyboard.scale = scale;
});

const ctx = canvas.getContext("2d");

let frameCount = 0;
let lastTime = new Date();
let lastExplode = new Date();
let activeKeyboard;
let splitKeyboards = [];
let scale = 60/1500*canvas.width;
let numBroken = 0;
let fastestTime = 1e99;
let indestructible = false;

function draw() {
    frameCount++;
    ctx.resetTransform();
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    let curTime = new Date();
    let dt = curTime - lastTime;
    lastTime = curTime;

    splitKeyboards = splitKeyboards.filter(kb => kb.tryDelete(canvas));
    if (activeKeyboard.canSplit()) {
        splitKeyboards.push(new SplitKeyboard(activeKeyboard.copy()));
        activeKeyboard = qwerty.copy();
        if (coloredKeyboards) activeKeyboard.color = getRandomColor();
        activeKeyboard.reset();
        addShake(15*scale/30, 1.5, true);
        for (let p = 0; p < 25; p++) {
            spawnRandomParticle(1+Math.random(), [activeKeyboard.calcWidth()*scale/10, activeKeyboard.calcHeight()*scale/10], Math.random()*300+300);
        }
        numBroken++;
        el("broken").innerText = numBroken;
        fastestTime = Math.min(fastestTime, curTime-lastExplode);
        el("fastTime").innerText = (fastestTime/1000).toFixed(3);
        el("lastTime").innerText = ((curTime-lastExplode)/1000).toFixed(3);
        lastExplode = curTime;
    }

    tickShake(dt);
    let shake = getShake(curTime, scale);
    ctx.translate(...shake)

    ctx.translate(canvas.width/2 - activeKeyboard.calcWidth()/2*scale/5, canvas.height/2 - activeKeyboard.calcHeight()/2*scale/5);

    activeKeyboard.draw(ctx);

    splitKeyboards.forEach(k => k.tick(dt));
    splitKeyboards.forEach(k => k.drawSplit(ctx));

    tickAllParticles(dt);
    drawAllParticles(ctx, scale);
    ctx.translate(-canvas.width/2 + activeKeyboard.calcWidth()/2*scale/5, -canvas.height/2 + activeKeyboard.calcHeight()/2*scale/5);

    ctx.translate(...shake.map(v => -v));
    
    el("timer").innerText = ((curTime - lastExplode)/1000).toFixed(3);

    window.requestAnimationFrame(draw);
}

qwerty.scale = scale;
activeKeyboard = qwerty.copy();

draw();
