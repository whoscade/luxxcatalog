const glitchCanvas = document.querySelector('.glitch-layer');
const ctx = glitchCanvas.getContext('2d');

function resizeGlitch() {
    glitchCanvas.width = window.innerWidth;
    glitchCanvas.height = window.innerHeight;
}

window.addEventListener('resize', resizeGlitch);
resizeGlitch();

function drawGlitch() {
    ctx.clearRect(0, 0, glitchCanvas.width, glitchCanvas.height);

    const squareCount = Math.floor(Math.random() * 8) + 2;

    for (let i = 0; i < squareCount; i++) {
        const size = Math.random() * 120 + 20;
        const x = Math.random() * glitchCanvas.width;
        const y = Math.random() * glitchCanvas.height;
        ctx.fillStyle = 'black';
        ctx.fillRect(x, y, size, size);
    }

    setTimeout(() => {
        ctx.clearRect(0, 0, glitchCanvas.width, glitchCanvas.height);
    }, 40);
}

function randomGlitchLoop() {
    const delay = Math.random() * 5000 + 2000;
    setTimeout(() => {
        drawGlitch();
        randomGlitchLoop();
    }, delay);
}

randomGlitchLoop();
