
document.addEventListener("keydown", e => {
    if (!activeKeyboard) return;
    if (e.key == "F12") return;
    if (document.activeElement) {
        let el = document.activeElement;
        if (el.nodeName === "INPUT" && el.type === "number") return;
    }

    e.preventDefault();
    activeKeyboard.press(e.code);
});

el("threshold").addEventListener("change", () => {
    let val = el("threshold").value;
    if (val < 1 || val > 100) {
        el("threshold").value = 50;
        return;
    }
    KEY_RESET_RATIO = val/100;
    console.log("Changed ratio to", KEY_RESET_RATIO);
});

el("colorBox").addEventListener("change", () => {
    let isChecked = el("colorBox").checked;
    coloredKeyboards = isChecked;
    if (activeKeyboard) {
        if (coloredKeyboards) {
            activeKeyboard.color = getRandomColor();
        } else {
            activeKeyboard.color = [65, 65, 65];
        }
    }
});

el("particleBox").addEventListener("change", () => {
    let isChecked = el("particleBox").checked;
    showParticles = !isChecked;
    particles = [];
});

el("shakeSize").addEventListener("change", () => {
    let val = el("shakeSize").value;
    if (val < 0) {
        el("shakeSize").value = 100;
        return;
    }
    shakeSize = val/100;
});