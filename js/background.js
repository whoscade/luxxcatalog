window.addEventListener("load", () => {
  const canvas = document.querySelector(".background-canvas");
  const gl = canvas.getContext("webgl");

  if (!gl) return;

  function resizeCanvas() {
    const dpr = window.devicePixelRatio || 1;
    const width = window.innerWidth;
    const height = window.innerHeight;

    canvas.style.width = width + "px";
    canvas.style.height = height + "px";
    canvas.width = width * dpr;
    canvas.height = height * dpr;

    gl.viewport(0, 0, canvas.width, canvas.height);
  }

  resizeCanvas();
  window.addEventListener("resize", resizeCanvas);

  let mouse = { x: window.innerWidth / 2, y: window.innerHeight / 2 };

  window.addEventListener("mousemove", e => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });

  const circleColors = [
    [0.4, 0, 0],
    [0.25, 0, 0],
    [0.55, 0.05, 0.05],
    [0, 0, 0],
    [0.2, 0, 0],
    [0, 0, 0]
  ];

  let circles = [];

  function initCircles() {
    circles = [];
    const baseRadius = (window.innerWidth + window.innerHeight) * 0.35;

    for (let i = 0; i < 5; i++) {
      circles.push({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        radius: baseRadius * (Math.random() * 0.8 + 0.4),
        color: circleColors[i],
        vx: (Math.random() - 0.5) * 6,
        vy: (Math.random() - 0.5) * 6,
        interactive: false
      });
    }

    circles.push({
      x: window.innerWidth / 2,
      y: window.innerHeight / 2,
      radius: baseRadius * 0.6,
      color: circleColors[5],
      vx: 0,
      vy: 0,
      interactive: true
    });
  }

  initCircles();

  const vertexSrc = `
attribute vec2 a_position;
varying vec2 v_uv;
void main() {
  v_uv = a_position * 0.5 + 0.5;
  gl_Position = vec4(a_position, 0.0, 1.0);
}
`;

  const fragmentSrc = `
precision mediump float;
varying vec2 v_uv;

uniform vec2 u_resolution;
uniform vec3 u_circlesColor[6];
uniform vec3 u_circlesPosRad[6];
uniform int u_circleCount;

void main() {
  vec2 st = v_uv * u_resolution;

  vec3 topColor = vec3(0.2, 0.0, 0.0);
  vec3 bottomColor = vec3(0.0, 0.0, 0.0);
  vec3 bgColor = mix(topColor, bottomColor, st.y / u_resolution.y);

  float fieldSum = 0.0;
  vec3 weightedColorSum = vec3(0.0);

  for (int i = 0; i < 6; i++) {
    if (i >= u_circleCount) break;
    vec3 posRad = u_circlesPosRad[i];
    vec2 cPos = vec2(posRad.r, posRad.g);
    float radius = posRad.b;
    float dist = length(st - cPos);
    float sigma = radius * 0.6;
    float val = exp(-(dist * dist) / (2.0 * sigma * sigma));
    fieldSum += val;
    weightedColorSum += u_circlesColor[i] * val;
  }

  vec3 finalColor = mix(bgColor, weightedColorSum, clamp(fieldSum * 1.4, 0.0, 1.0));
  gl_FragColor = vec4(finalColor, 0.85);
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
    -1, -1,  1, -1, -1,  1,
    -1,  1,  1, -1,  1,  1
  ]), gl.STATIC_DRAW);

  const posLoc = gl.getAttribLocation(program, "a_position");
  gl.enableVertexAttribArray(posLoc);
  gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0);

  const u_resolution = gl.getUniformLocation(program, "u_resolution");
  const u_circleCount = gl.getUniformLocation(program, "u_circleCount");
  const u_circlesColor = gl.getUniformLocation(program, "u_circlesColor");
  const u_circlesPosRad = gl.getUniformLocation(program, "u_circlesPosRad");

  function update() {
    circles.forEach(c => {
      if (!c.interactive) {
        c.x += c.vx;
        c.y += c.vy;
      }
    });
  }

  function render() {
    update();

    gl.uniform2f(u_resolution, canvas.width, canvas.height);
    gl.uniform1i(u_circleCount, circles.length);

    let colors = [];
    let posRad = [];

    circles.forEach(c => {
      colors.push(...c.color);
      posRad.push(c.x, canvas.height - c.y, c.radius);
    });

    gl.uniform3fv(u_circlesColor, new Float32Array(colors));
    gl.uniform3fv(u_circlesPosRad, new Float32Array(posRad));

    gl.drawArrays(gl.TRIANGLES, 0, 6);
    requestAnimationFrame(render);
  }

  render();
});
