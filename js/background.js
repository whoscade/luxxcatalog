const canvas = document.querySelector('.background-canvas');
const ctx = canvas.getContext('2d');

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

window.addEventListener('resize', resizeCanvas);
resizeCanvas();

const logoText = "LUXXCATALOG";
const logo = document.getElementById('logo');
const fonts = ['Experimento', 'GadetyperRegular', 'timesnewarial'];

function randomizeLogo() {
    logo.innerHTML = '';
    for (let char of logoText) {
        const span = document.createElement('span');
        span.classList.add('letter');
        span.textContent = char;
        span.style.fontFamily = fonts[Math.floor(Math.random() * fonts.length)];
        logo.appendChild(span);
    }
}

randomizeLogo();
setInterval(randomizeLogo, 117);

let circles = [];

function createCircle() {
    const size = Math.random() * 120 + 20;
    circles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: size,
        dx: (Math.random() - 0.5) * 0.4,
        dy: (Math.random() - 0.5) * 0.4,
        alpha: Math.random() * 0.4 + 0.35,
        color: Math.random() > 0.3 ? '120,0,0' : '0,0,0'
    });
}

for (let i = 0; i < 35; i++) {
    createCircle();
}

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    circles.forEach(c => {
        ctx.beginPath();
        ctx.arc(c.x, c.y, c.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${c.color}, ${c.alpha})`;
        ctx.fill();

        c.x += c.dx;
        c.y += c.dy;

        if (c.x < -c.r) c.x = canvas.width + c.r;
        if (c.x > canvas.width + c.r) c.x = -c.r;
        if (c.y < -c.r) c.y = canvas.height + c.r;
        if (c.y > canvas.height + c.r) c.y = -c.r;
    });

    requestAnimationFrame(animate);
}

animate();
