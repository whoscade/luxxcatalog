const glitchCanvas = document.querySelector('.glitch-layer');
const ctx = glitchCanvas.getContext('2d');

let width = window.innerWidth;
let height = window.innerHeight;

function resize() {
    width = window.innerWidth;
    height = window.innerHeight;
    glitchCanvas.width = width;
    glitchCanvas.height = height;
}
resize();
window.addEventListener('resize', resize);

let glitches = [];
let nextGlitchTime = performance.now() + Math.random() * 3000 + 1500;

function createGlitch() {
    if (glitches.length >= 5) return;

    const vertical = Math.random() > 0.5;
    const w = vertical ? Math.random() * 40 + 10 : Math.random() * 120 + 20;
    const h = vertical ? Math.random() * 200 + 40 : Math.random() * 40 + 10;

    glitches.push({
        x: Math.random() * width,
        y: Math.random() * height,
        w,
        h,
        life: Math.random() * 80 + 40
    });
}

function renderGlitch(time) {
    ctx.globalCompositeOperation = "source-over";
    ctx.clearRect(0, 0, glitchCanvas.width, glitchCanvas.height);

    if (time > nextGlitchTime) {
        createGlitch();
        if (Math.random() > 0.6) createGlitch();
        nextGlitchTime = time + Math.random() * 7000 + 4000;
    }

    glitches = glitches.filter(g => {
        g.life -= 16;
        return g.life > 0;
    });

    ctx.fillStyle = "#000";
    glitches.forEach(g => {
        ctx.fillRect(g.x, g.y, g.w, g.h);
    });

    requestAnimationFrame(renderGlitch);
}

requestAnimationFrame(renderGlitch);
