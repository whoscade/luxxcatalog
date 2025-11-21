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
            dx: (Math.random() - 0.5) * 0.2,
            dy: (Math.random() - 0.5) * 0.2,
            color: Math.random() > 0.6 ? 'rgba(0, 0, 0, 0.45)' : 'rgba(120, 0, 0, 0.45)'
        });
    }
}

createCircles();

let mouse = { x: width / 2, y: height / 2 };

window.addEventListener('mousemove', e => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
});

function animate() {
    ctx.clearRect(0, 0, width, height);

    circles.forEach(circle => {
        const dx = mouse.x - circle.x;
        const dy = mouse.y - circle.y;

        circle.x += dx * 0.0008 + circle.dx;
        circle.y += dy * 0.0008 + circle.dy;

        if (circle.x < -200) circle.x = width + 200;
        if (circle.x > width + 200) circle.x = -200;
        if (circle.y < -200) circle.y = height + 200;
        if (circle.y > height + 200) circle.y = -200;

        ctx.beginPath();
        ctx.arc(circle.x, circle.y, circle.radius, 0, Math.PI * 2);
        ctx.fillStyle = circle.color;
        ctx.fill();
    });

    requestAnimationFrame(animate);
}

animate();
