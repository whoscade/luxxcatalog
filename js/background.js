const canvas = document.querySelector('.background-canvas');
const ctx = canvas.getContext('2d');

let width, height;
let circles = [];

function resizeCanvas() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
}

window.addEventListener('resize', resizeCanvas);
resizeCanvas();

function createCircles() {
    circles = [];
    for (let i = 0; i < 40; i++) {
        circles.push({
            x: Math.random() * width,
            y: Math.random() * height,
            radius: Math.random() * 120 + 20,
            dx: (Math.random() - 0.5) * 0.3,
            dy: (Math.random() - 0.5) * 0.3,
            color: Math.random() > 0.6 ? 'rgba(0, 0, 0, 0.35)' : 'rgba(120, 0, 0, 0.35)'
        });
    }
}

createCircles();

let mouse = { x: 0, y: 0 };

window.addEventListener('mousemove', e => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
});

function animate() {
    ctx.clearRect(0, 0, width, height);

    circles.forEach(circle => {
        const dx = mouse.x - circle.x;
        const dy = mouse.y - circle.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < 300) {
            circle.x -= dx * 0.002;
            circle.y -= dy * 0.002;
        }

        circle.x += circle.dx;
        circle.y += circle.dy;

        if (circle.x < 0 || circle.x > width) circle.dx *= -1;
        if (circle.y < 0 || circle.y > height) circle.dy *= -1;

        ctx.beginPath();
        ctx.arc(circle.x, circle.y, circle.radius, 0, Math.PI * 2);
        ctx.fillStyle = circle.color;
        ctx.fill();
    });

    requestAnimationFrame(animate);
}

animate();
