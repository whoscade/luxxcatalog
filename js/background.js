window.addEventListener('load', () => {

    const logoText = "LUXXCATALOG"
    const logo = document.getElementById('logo')
    const fonts = ['Experimento', 'GadetyperRegular', 'timesnewarial']

    function randomizeLogo() {
        logo.innerHTML = ''
        for (let char of logoText) {
            const span = document.createElement('span')
            span.classList.add('letter')
            span.textContent = char
            span.style.fontFamily = fonts[Math.floor(Math.random() * fonts.length)]
            logo.appendChild(span)
        }
    }

    randomizeLogo()
    setInterval(randomizeLogo, 117)

    const canvas = document.createElement('canvas')
    canvas.className = 'background-canvas'
    document.body.appendChild(canvas)

    const gl = canvas.getContext('webgl')
    if (!gl) return

    let width = canvas.width = window.innerWidth
    let height = canvas.height = window.innerHeight

    function resizeCanvas() {
        width = canvas.width = window.innerWidth
        height = canvas.height = window.innerHeight
        gl.viewport(0, 0, width, height)
    }

    window.addEventListener('resize', resizeCanvas)

    let mouse = { x: width / 2, y: height / 2 }

    window.addEventListener('mousemove', e => {
        mouse.x = e.clientX
        mouse.y = e.clientY
    })

    const circleColors = [
        [0.4, 0, 0],
        [0.6, 0, 0],
        [0.2, 0, 0],
        [0, 0, 0],
        [0.3, 0, 0],
        [0.05, 0, 0]
    ]

    let circles = []

    function initCircles() {
        circles = []
        const baseRadius = (width + height) * 0.25

        for (let i = 0; i < 6; i++) {
            circles.push({
                x: Math.random() * width,
                y: Math.random() * height,
                radius: baseRadius * (Math.random() * 1.2 + 0.4),
                color: circleColors[i],
                vx: (Math.random() - 0.5) * 0.8,
                vy: (Math.random() - 0.5) * 0.8,
                interactive: i === 5
            })
        }
    }

    initCircles()

    const vertexSrc = `
attribute vec2 a_position;
varying vec2 v_uv;
void main() {
    v_uv = a_position * 0.5 + 0.5;
    v_uv.y = 1.0 - v_uv.y;
    gl_Position = vec4(a_position, 0.0, 1.0);
}`

    const fragmentSrc = `
precision mediump float;
varying vec2 v_uv;

uniform vec2 u_resolution;
uniform vec3 u_circlesColor[6];
uniform vec3 u_circlesPosRad[6];

void main() {
    vec2 st = v_uv * u_resolution;

    vec3 topColor = vec3(0.08, 0.0, 0.0);
    vec3 bottomColor = vec3(0.0, 0.0, 0.0);
    vec3 bgColor = mix(topColor, bottomColor, st.y / u_resolution.y);

    float fieldSum = 0.0;
    vec3 weightedColorSum = vec3(0.0);

    for (int i = 0; i < 6; i++) {
        vec3 posRad = u_circlesPosRad[i];
        vec2 cPos = vec2(posRad.r, posRad.g);
        float radius = posRad.b;
        float dist = length(st - cPos);
        float sigma = radius * 0.6;
        float val = exp(-(dist * dist) / (2.0 * sigma * sigma));
        fieldSum += val;
        weightedColorSum += u_circlesColor[i] * val;
    }

    vec3 finalCirclesColor = weightedColorSum / max(fieldSum, 0.0001);
    float intensity = clamp(pow(fieldSum, 1.3), 0.0, 1.0);
    vec3 finalColor = mix(bgColor, finalCirclesColor, intensity);

    gl_FragColor = vec4(finalColor, 0.85);
}`

    function createShader(type, source) {
        const shader = gl.createShader(type)
        gl.shaderSource(shader, source)
        gl.compileShader(shader)
        return shader
    }

    const program = gl.createProgram()
    gl.attachShader(program, createShader(gl.VERTEX_SHADER, vertexSrc))
    gl.attachShader(program, createShader(gl.FRAGMENT_SHADER, fragmentSrc))
    gl.linkProgram(program)
    gl.useProgram(program)

    const buffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
        -1,-1, 1,-1, -1,1,
        -1,1, 1,-1, 1,1
    ]), gl.STATIC_DRAW)

    const pos = gl.getAttribLocation(program, 'a_position')
    gl.enableVertexAttribArray(pos)
    gl.vertexAttribPointer(pos, 2, gl.FLOAT, false, 0, 0)

    const u_resolution = gl.getUniformLocation(program, 'u_resolution')
    const u_circlesColor = gl.getUniformLocation(program, 'u_circlesColor')
    const u_circlesPosRad = gl.getUniformLocation(program, 'u_circlesPosRad')

    function update() {

        circles.forEach(c => {
            if (c.interactive) {
                c.x += (mouse.x - c.x) * 0.05
                c.y += (mouse.y - c.y) * 0.05
            } else {
                c.x += c.vx
                c.y += c.vy
            }
        })

        gl.uniform2f(u_resolution, width, height)

        let colors = []
        let posRad = []

        circles.forEach(c => {
            colors.push(...c.color)
            posRad.push(c.x, c.y, c.radius)
        })

        gl.uniform3fv(u_circlesColor, new Float32Array(colors))
        gl.uniform3fv(u_circlesPosRad, new Float32Array(posRad))

        gl.drawArrays(gl.TRIANGLES, 0, 6)
        requestAnimationFrame(update)
    }

    update()

})
