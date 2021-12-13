
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
let activeKeyboard;
let splitKeyboards = [];
let scale = 60/1500*canvas.width;
let numBroken = 0;

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
        activeKeyboard.reset();
        addShake(15*scale/30, 1.5, true);
        for (let p = 0; p < 5; p++) {
            spawnRandomParticle(2+Math.random(), [activeKeyboard.calcWidth()*scale/10, activeKeyboard.calcHeight()*scale/10], Math.random()*300+300);
        }
        numBroken++;
        el("broken").innerText = numBroken;
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
    ctx.translate(-100, -100);

    ctx.translate(...shake.map(v => -v));
    
    window.requestAnimationFrame(draw);
}

qwerty.scale = scale;
activeKeyboard = qwerty.copy();

draw();
