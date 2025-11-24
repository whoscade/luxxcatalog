const glitchCanvas = document.querySelector('.glitch-layer')
const ctx = glitchCanvas.getContext('2d')

function resize() {
    glitchCanvas.width = window.innerWidth
    glitchCanvas.height = window.innerHeight
}
resize()
window.addEventListener('resize', resize)

function randomBetween(min, max) {
    return Math.random() * (max - min) + min
}

function spawnGlitch() {
    const blocks = Math.random() < 0.7 ? 1 : Math.floor(randomBetween(2, 5))

    for (let i = 0; i < blocks; i++) {
        const x = Math.random() * glitchCanvas.width
        const y = Math.random() * glitchCanvas.height

        const w = randomBetween(20, 160)
        const h = randomBetween(20, 220)

        const lifespan = randomBetween(20, 60)

        ctx.fillStyle = 'rgba(0,0,0,1)'
        ctx.fillRect(x, y, w, h)

        setTimeout(() => {
            ctx.clearRect(x, y, w, h)
        }, lifespan)
    }

    scheduleNext()
}

function scheduleNext() {
    const delay = randomBetween(2000, 8000)
    setTimeout(spawnGlitch, delay)
}

scheduleNext()
