const glitchLayer = document.querySelector('.glitch-layer');

function createGlitchBlock() {
    const block = document.createElement('div');

    const sizeW = Math.random() > 0.5 
        ? Math.random() * 200 + 50
        : Math.random() * 80 + 30;

    const sizeH = Math.random() > 0.5
        ? Math.random() * 200 + 50
        : Math.random() * 80 + 30;

    block.style.position = 'absolute';
    block.style.width = sizeW + 'px';
    block.style.height = sizeH + 'px';
    block.style.background = 'black';
    block.style.top = Math.random() * window.innerHeight + 'px';
    block.style.left = Math.random() * window.innerWidth + 'px';
    block.style.opacity = '1';

    glitchLayer.appendChild(block);

    const lifetime = Math.random() * 120 + 40; 

    setTimeout(() => {
        block.remove();
    }, lifetime);
}

function triggerGlitch() {
    const blocksOnScreen = Math.floor(Math.random() * 2) + 1;

    for (let i = 0; i < blocksOnScreen; i++) {
        createGlitchBlock();
    }

    const nextGlitchDelay = Math.random() * 6000 + 2500;
    setTimeout(triggerGlitch, nextGlitchDelay);
}

triggerGlitch();
