const glitchCanvas = document.querySelector('.glitch-layer');
const ctx = glitchCanvas.getContext('2d');

let w = window.innerWidth;
let h = window.innerHeight;

function resize() {
    w = window.innerWidth;
    h = window.innerHeight;
    glitchCanvas.width = w;
    glitchCanvas.height = h;
}
resize();
window.addEventListener('resize', resize);

let glitches = [];

function spawnGlitch() {
    if (glitches.length >= 4) return;

    const vertical = Math.random() > 0.5;

    glitches.push({
        x: Math.random() * w,
        y: Math.random() * h,
        width: vertical ? 10 + Math.random() * 30 : 40 + Math.random() * 120,
        height: vertical ? 60 + Math.random() * 180 : 10 + Math.random() * 30,
        life: 10 + Math.random() * 15
    });
}

function loop() {
    ctx.clearRect(0, 0, w, h);

    if (Math.random() < 0.15) {
        spawnGlitch();
    }

    glitches.forEach(g => {
        ctx.fillStyle = "#000";
        ctx.fillRect(g.x, g.y, g.width, g.height);
        g.life--;
    });

    glitches = glitches.filter(g => g.life > 0);

    requestAnimationFrame(loop);
}

loop();
