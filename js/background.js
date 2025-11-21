window.addEventListener('load', () => {
    const canvas = document.querySelector('.background-canvas');
    const gl = canvas.getContext("webgl");
    if (!gl) return;

    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    function resizeCanvas() {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
        gl.viewport(0, 0, width, height);
    }
    window.addEventListener("resize", resizeCanvas);

    let mouse = { x: width / 2, y: height / 2 };
    window.addEventListener("mousemove", e => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
    });

    const circleColors = [
        [0.7, 0.05, 0.05],
        [0.9, 0.1, 0.1],
        [0.3, 0.0, 0.0],
        [0.1, 0.0, 0.0],
        [0.6, 0.0, 0.0],
        [0.0, 0.0, 0.0]
    ];

    let circles = [];
    function initCircles() {
        circles = [];
        const baseRadius = (width + height) * 0.2;

        for (let i = 0; i < 6; i++) {
            const radius = baseRadius * (0.4 + Math.random() * 1.4);
            const x = Math.random() * width;
            const y = Math.random() * height;
            const speed = Math.random() * 3 + 0.2;
            const vx = (Math.random() - 0.5) * speed;
            const vy = (Math.random() - 0.5) * speed;
            circles.push({ x, y, radius, color: circleColors[i], vx, vy, interactive: false });
        }

        const interactiveRadius = (width + height) * 0.12;
        circles.push({
            x: width / 2,
            y: height / 2,
            radius: interactiveRadius,
            color: [0.8, 0.1, 0.1],
            vx: 0,
            vy: 0,
            interactive: true
        });
    }
    initCircles();

    const vertexSrc = `
        attribute vec2 a_position;
        varying vec2 v_uv;
        void main(void) {
            v_uv = a_position * 0.5 + 0.5;
            v_uv.y = 1.0 - v_uv.y;
            gl_Position = vec4(a_position, 0.0, 1.0);
        }
    `;

    const fragmentSrc = `
        precision mediump float;
        varying vec2 v_uv;
        uniform vec2 u_resolution;
        uniform int u_circleCount;
        uniform vec3 u_circlesColor[7];
        uniform vec3 u_circlesPosRad[7];

        void main(void) {
            vec2 st = v_uv * u_resolution;
            vec3 topColor = vec3(0.15, 0.0, 0.0);
            vec3 bottomColor = vec3(0.02, 0.0, 0.0);
            vec3 bgColor = mix(topColor, bottomColor, st.y / u_resolution.y);

            float fieldSum = 0.0;
            vec3 weightedColorSum = vec3(0.0);

            for (int i = 0; i < 7; i++) {
                if (i >= u_circleCount) break;
                vec3 posRad = u_circlesPosRad[i];
                vec2 cPos = vec2(posRad.r, posRad.g);
                float radius = posRad.b;
                float dist = length(st - cPos);
                float sigma = radius * 0.5;
                float val = exp(- (dist * dist) / (2.0 * sigma * sigma));
                fieldSum += val;
                weightedColorSum += u_circlesColor[i] * val;
            }

            vec3 finalCirclesColor = fieldSum > 0.0 ? weightedColorSum / fieldSum : vec3(0.0);
            float intensity = pow(fieldSum, 1.25);
            vec3 finalColor = mix(bgColor, finalCirclesColor, clamp(intensity, 0.0, 1.0));
            gl_FragColor = vec4(finalColor, 1.0);
        }
    `;

    function createShader(type, source) {
        const shader = gl.createShader(type);
        gl.shaderSource(shader, source);
        gl.compileShader(shader);
        return shader;
    }

    const program = gl.createProgram();
    gl.attachShader(program, createShader(gl.VERTEX_SHADER, vertexSrc));
    gl.attachShader(program, createShader(gl.FRAGMENT_SHADER, fragmentSrc));
    gl.linkProgram(program);
    gl.useProgram(program);

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
        -1,-1, 1,-1, -1,1,
        -1,1, 1,-1, 1,1
    ]), gl.STATIC_DRAW);

    const posLoc = gl.getAttribLocation(program, "a_position");
    gl.enableVertexAttribArray(posLoc);
    gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0);

    const u_resolution = gl.getUniformLocation(program, "u_resolution");
    const u_circleCount = gl.getUniformLocation(program, "u_circleCount");
    const u_circlesColor = gl.getUniformLocation(program, "u_circlesColor");
    const u_circlesPosRad = gl.getUniformLocation(program, "u_circlesPosRad");

    function render() {
        for (let c of circles) {
            if (!c.interactive) {
                c.x += c.vx;
                c.y += c.vy;
                if (c.x - c.radius > width) c.x = -c.radius;
                if (c.x + c.radius < 0) c.x = width + c.radius;
                if (c.y - c.radius > height) c.y = -c.radius;
                if (c.y + c.radius < 0) c.y = height + c.radius;
            } else {
                c.x += (mouse.x - c.x) * 0.03;
                c.y += (mouse.y - c.y) * 0.03;
            }
        }

        let colors = [];
        let posRad = [];

        for (let i = 0; i < 7; i++) {
            if (i < circles.length) {
                const c = circles[i];
                colors.push(...c.color);
                posRad.push(c.x, c.y, c.radius);
            } else {
                colors.push(0,0,0);
                posRad.push(0,0,0);
            }
        }

        gl.uniform2f(u_resolution, width, height);
        gl.uniform1i(u_circleCount, circles.length);
        gl.uniform3fv(u_circlesColor, new Float32Array(colors));
        gl.uniform3fv(u_circlesPosRad, new Float32Array(posRad));

        gl.drawArrays(gl.TRIANGLES, 0, 6);
        requestAnimationFrame(render);
    }

    render();
});
