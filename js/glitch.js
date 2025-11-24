const glitchLayer = document.querySelector('.glitch-layer');
let activeBlocks = 0;

function spawnGlitchBlock() {
    if (activeBlocks >= 2) return;

    const block = document.createElement('div');
    block.classList.add('glitch-block');

    const isVertical = Math.random() > 0.5;
    const width = isVertical ? Math.random() * 40 + 20 : Math.random() * 60 + 20;
    const height = isVertical ? Math.random() * 120 + 40 : width;

    block.style.width = width + 'px';
    block.style.height = height + 'px';
    block.style.left = Math.random() * window.innerWidth + 'px';
    block.style.top = Math.random() * window.innerHeight + 'px';

    glitchLayer.appendChild(block);
    activeBlocks++;

    const lifespan = Math.random() * 120 + 50;
    setTimeout(() => {
        block.remove();
        activeBlocks--;
    }, lifespan);
}
function glitchLoop() {
    const delay = Math.random() * 4000 + 2500;
    if (Math.random() > 0.4) spawnGlitchBlock();
    setTimeout(glitchLoop, delay);
}

glitchLoop();
