
document.addEventListener("keydown", e => {
    if (!activeKeyboard) return;
    if (e.key == "F12") return;
    if (document.activeElement && document.activeElement.id === "threshold") return;

    e.preventDefault();
    activeKeyboard.press(e.code);
});

el("threshold").addEventListener("change", () => {
    let val = el("threshold").value;
    if (val < 1 || val > 100) return;
    KEY_RESET_RATIO = val/100;
    console.log("Changed ratio to", KEY_RESET_RATIO);
});