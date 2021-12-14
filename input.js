
document.addEventListener("keydown", e => {
    if (!activeKeyboard) return;
    if (e.key == "F12") return;
    if (document.activeElement && document.activeElement.id === "threshold") return;

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