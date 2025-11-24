const glitchLayer = document.querySelector('.glitch-layer');

function createGlitchBlock() {
    const block = document.createElement('div');

    const isVertical = Math.random() < 0.5;

    const width = isVertical
        ? Math.random() * 40 + 8
        : Math.random() * 40 + 20;

    const height = isVertical
        ? Math.random() * 200 + 40
        : width;

    const x = Math.random() * window.innerWidth;
    const y = Math.random() * window.innerHeight;

    block.style.position = 'absolute';
    block.style.left = `${x}px`;
    block.style.top = `${y}px`;
    block.style.width = `${width}px`;
    block.style.height = `${height}px`;
    block.style.background = 'black';
    block.style.opacity = Math.random() * 0.8 + 0.2;

    glitchLayer.appendChild(block);

    const life = Math.random() * 150 + 30;

    setTimeout(() => {
        block.remove();
    }, life);
}

// rare + unpredictable timing
function glitchLoop() {
    if (Math.random() < 0.15) {
        createGlitchBlock();
    }

    const next = Math.random() * 1200 + 400;
    setTimeout(glitchLoop, next);
}

glitchLoop();
