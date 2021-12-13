
// width is measured in fifths of keys

let KEY_RESET_RATIO = 0.5;
const MAX_VEL = 500;

class Key {
    constructor(key, keyCode, width, disabled) {
        this.key = key;
        this.width = width || 5;
        this.keyCode = keyCode || "Key"+key;
        this.active = !disabled;
        this.startActive = !disabled;
    }

    draw(ctx, scale) {
        if (!this.active) return;
        ctx.fillStyle = "#222222";
        ctx.fillRect(0, 0, scale*this.width/5, scale);

        ctx.fillStyle = "#FFFFFF";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.font = `${Math.floor(scale/2)}px Arial`;
        ctx.fillText(this.key, scale*this.width/10, scale/2);
    }

    isKey(eKey) {
        return this.keyCode === eKey;
    }

    press() {
        this.active = false;
    }

    unpress() {
        if (this.startActive) this.active = true;
    }
}

class Keyboard {
    constructor(keys, scale) {
        this.keys = keys;
        this.scale = scale || 1;
        this.keysPressed = 0;
    }

    rowWidth(r) {
        let total = 1;
        for (let key of r) {
            total += key.width + 1;
        }
        return total;
    }

    calcWidth() {
        let max = 0;
        for (let row of this.keys) {
            max = Math.max(max, this.rowWidth(row));
        }
        return max;
    }

    calcHeight() {
        return this.keys.length * 6 + 1;
    }

    calcPos(row, col) {
        let curX = 1;
        for (let i = 0; i < col && i < this.keys[row].length; i++) {
            curX += this.keys[row][i].width+1;
        }
        return [curX*this.scale/5, (row*6+1)*this.scale/5];
    }

    totalKeys() {
        return this.keys.reduce((v, c) => v+c.length, 0);
    }

    // scale = pixels per key
    draw(ctx) {
        let width = this.calcWidth();
        let height = this.calcHeight();

        ctx.fillStyle = "#555555";
        ctx.fillRect(0, 0, width*this.scale/5, height*this.scale/5);

        let curX = 1, curY = 1;
        for (let row of this.keys) {
            curX = 1;
            for (let key of row) {
                ctx.translate(curX*this.scale/5, curY*this.scale/5);
                key.draw(ctx, this.scale);
                ctx.translate(-curX*this.scale/5, -curY*this.scale/5);
                curX += key.width+1;
            }
            curY += 6;
        }
    }

    press(eKey) {
        this.keys.forEach((r, ri) => {
            r.forEach((c, ci) => {
                if (c.isKey(eKey) && c.active) {
                    c.press();
                    let pos = this.calcPos(ri, ci);
                    let midPt = [pos[0]+c.width/5*this.scale/2, pos[1]+this.scale/2];
                    for (let p = 0; p < 5; p++) {
                        spawnRandomParticle(0.5, midPt, Math.random()*100+100);
                    }
                    addShake(5, 0.2, true);
                    this.keysPressed++;
                }
            });
        });
    }

    canSplit() {
        return this.keysPressed/this.totalKeys() >= KEY_RESET_RATIO; 
    }

    reset() {
        this.keysPressed = 0;
        for (let row of this.keys) {
            for (let k of row) {
                k.unpress();
            }
        }
    }

    copy() {
        let nkeys = [];
        for (let row of this.keys) {
            let nrow = [];
            for (let k of row) {
                nrow.push(new Key(k.key, k.keyCode, k.width, !k.active));
            }
            nkeys.push(nrow);
        }
        let kboard = new Keyboard(nkeys, this.scale);
        kboard.keysPressed = this.keysPressed;
        return kboard;
    }
}

class SplitKeyboard extends Keyboard {
    constructor(kboard) {
        super(kboard.keys, kboard.scale);
        this.lpos = [0, 0];
        this.rpos = [this.calcWidth()*this.scale/10, 0];
        this.lvel = [Math.random()*-MAX_VEL, 0];
        this.rvel = [Math.random()*MAX_VEL, 0];
        this.lrot = 0; this.rrot = 0
        this.icanvas = document.createElement("canvas");
        this.icanvas.width = this.calcWidth()*this.scale/5;
        this.icanvas.height = this.calcHeight()*this.scale/5;
        this.ictx = this.icanvas.getContext("2d");
        this.draw(this.ictx);
        this.deleted = false;
    }

    tick(dt) {
        this.lvel[1] += dt/2;
        this.rvel[1] += dt/2;
        this.lpos[0] += this.lvel[0]*dt/1000;
        this.lpos[1] += this.lvel[1]*dt/1000;
        this.rpos[0] += this.rvel[0]*dt/1000;
        this.rpos[1] += this.rvel[1]*dt/1000;
        this.lrot -= dt/2000;
        this.rrot += dt/2000;
    }

    drawSplit(ctx) {
        let w = this.calcWidth()*this.scale/5, h = this.calcHeight()*this.scale/5;

        ctx.translate(this.lpos[0]+w/2, this.lpos[1]+h);
        ctx.rotate(this.lrot);
        ctx.drawImage(this.ictx.canvas, 0, 0, w/2, h, -w/2, -h, w/2, h);
        ctx.rotate(-this.lrot);
        ctx.translate(-this.lpos[0]-w/2, -this.lpos[1]-h);

        ctx.translate(this.rpos[0], this.rpos[1]+h);
        ctx.rotate(this.rrot);
        ctx.drawImage(this.ictx.canvas, w/2, 0, w/2, h, 0, -h, w/2, h);
        ctx.rotate(-this.rrot);
        ctx.translate(-this.rpos[0], -this.rpos[1]-h);
    }

    tryDelete(canvas) {
        if (this.lpos[1] <= 2*canvas.height || this.rpos[1] <= 2*canvas.height) {
            return true;
        }
        this.delete();
        return false;
    }

    delete() {
        this.ictx.canvas.remove();
        this.deleted = true;
    }
}

let qwerty = new Keyboard([
    [new Key("`", "Backquote"), new Key("1", "Digit1"), new Key("2", "Digit2"), new Key("3", "Digit3"), new Key("4", "Digit4"), new Key("5", "Digit5"), new Key("6", "Digit6"), new Key("7", "Digit7"), new Key("8", "Digit8"), new Key("9", "Digit9"), new Key("0", "Digit0"), new Key("-", "Minus"), new Key("=", "Equal"), new Key("Back", "Backspace", 8)],
    [new Key("Tab", "Tab", 8), new Key("Q"), new Key("W"), new Key("E"), new Key("R"), new Key("T"), new Key("Y"), new Key("U"), new Key("I"), new Key("O"), new Key("P"), new Key("[", "BracketLeft"), new Key("]", "BracketRight"), new Key("\\", "Backslash")],
    [new Key("Caps", "CapsLock", 9), new Key("A"), new Key("S"), new Key("D"), new Key("F"), new Key("G"), new Key("H"), new Key("J"), new Key("K"), new Key("L"), new Key(";", "Semicolon"), new Key("'", "Quote"), new Key("Enter", "Enter", 10)],
    [new Key("Shift", "ShiftLeft", 12), new Key("Z"), new Key("X"), new Key("C"), new Key("V"), new Key("B"), new Key("N"), new Key("M"), new Key(",", "Comma"), new Key(".", "Period"), new Key("/", "Slash"), new Key("Shift", "ShiftRight", 13)],
    [new Key("Ctrl", "ControlLeft", 9), new Key("Alt", "AltLeft", 8), new Key("Space", "Space", 29), new Key("Alt", "AltRight", 8), new Key("Ctrl", "ControlRight", 10), new Key("<", "ArrowLeft"), new Key("^\nv", "ArrowUp"), new Key(">", "ArrowRight")]
], 30);
