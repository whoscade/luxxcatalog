const glitchCanvas = document.querySelector('.glitch-layer')
const gtx = glitchCanvas.getContext('2d')

function resizeGlitchCanvas() {
  glitchCanvas.width = window.innerWidth
  glitchCanvas.height = window.innerHeight
}

resizeGlitchCanvas()
window.addEventListener('resize', resizeGlitchCanvas)

function random(min, max) {
  return Math.random() * (max - min) + min
}

function spawnGlitchBlock() {
  const maxBlocks = Math.floor(random(1, 5))
  const blocks = []

  for (let i = 0; i < maxBlocks; i++) {
    const w = random(20, 180)
    const h = Math.random() > 0.4 ? random(60, 300) : w
    const x = random(0, glitchCanvas.width)
    const y = random(0, glitchCanvas.height)
    const life = random(20, 60)

    blocks.push({ x, y, w, h, life })
  }

  function drawBlocks() {
    gtx.clearRect(0, 0, glitchCanvas.width, glitchCanvas.height)

    blocks.forEach(block => {
      gtx.fillStyle = 'rgba(0,0,0,1)'
      gtx.fillRect(block.x, block.y, block.w, block.h)
      block.life -= 16
    })

    if (blocks.some(b => b.life > 0)) {
      requestAnimationFrame(drawBlocks)
    } else {
      gtx.clearRect(0, 0, glitchCanvas.width, glitchCanvas.height)
    }
  }

  drawBlocks()
}

function randomGlitchLoop() {
  const delay = random(4000, 30000)

  setTimeout(() => {
    if (Math.random() > 0.35) {
      spawnGlitchBlock()
    }
    randomGlitchLoop()
  }, delay)
}

randomGlitchLoop()
