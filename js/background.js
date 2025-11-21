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
    [0.3, 0.0, 0.0],
    [0.5, 0.0, 0.0],
    [0.2, 0.0, 0.0],
    [0.1, 0.0, 0.0],
    [0.0, 0.0, 0.0],
    [0.6, 0.0, 0.0]
  ];

  let circles = [];

  function initCircles() {
    circles = [];
    const baseRadius = (width + height) * 0.25;

    for (let i = 0; i < 5; i++) {
      circles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: baseRadius,
        color: circleColors[i],
        vx: (Math.random() - 0.5) * 2,
        vy: (Math.random() - 0.5) * 2,
        interactive: false
      });
    }

    circles.push({
      x: width / 2,
      y: height / 2,
      radius: (width + height) * 0.15,
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
      v_uv.y = 1.0 - v_uv.y;
      gl_Position = vec4(a_position, 0.0, 1.0);
    }
  `;

  const fragmentSrc = `
    precision mediump float;
    varying vec2 v_uv;
    uniform vec2 u_resolution;
    uniform int u_circleCount;
    uniform vec3 u_circlesColor[6];
    uniform vec3 u_circlesPosRad[6];

    void main() {
      vec2 st = v_uv * u_resolution;

      vec3 topColor = vec3(0.15, 0.0, 0.0);
      vec3 bottomColor = vec3(0.0, 0.0, 0.0);
      vec3 bgColor = mix(topColor, bottomColor, st.y / u_resolution.y);

      float fieldSum = 0.0;
      vec3 weightedColorSum = vec3(0.0);

      for(int i = 0; i < 6; i++) {
        if(i >= u_circleCount) break;
        vec3 posRad = u_circlesPosRad[i];
        float dist = length(st - posRad.xy);
        float sigma = posRad.z * 0.45;
        float val = exp(- (dist * dist) / (2.0 * sigma * sigma));
        fieldSum += val;
        weightedColorSum += u_circlesColor[i] * val;
      }

      vec3 finalColor = mix(bgColor, weightedColorSum / fieldSum, clamp(fieldSum, 0.0, 1.0));
      gl_FragColor = vec4(finalColor, 1.0);
    }
  `;

  function createShader(type, src) {
    const s = gl.createShader(type);
    gl.shaderSource(s, src);
    gl.compileShader(s);
    return s;
  }

  const program = gl.createProgram();
  gl.attachShader(program, createShader(gl.VERTEX_SHADER, vertexSrc));
  gl.attachShader(program, createShader(gl.FRAGMENT_SHADER, fragmentSrc));
  gl.linkProgram(program);
  gl.useProgram(program);

  const buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1,1,-1,-1,1,-1,1,1,-1,1,1]), gl.STATIC_DRAW);

  const posLoc = gl.getAttribLocation(program, "a_position");
  gl.enableVertexAttribArray(posLoc);
  gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0);

  const u_resolution = gl.getUniformLocation(program, "u_resolution");
  const u_circleCount = gl.getUniformLocation(program, "u_circleCount");
  const u_circlesColor = gl.getUniformLocation(program, "u_circlesColor");
  const u_circlesPosRad = gl.getUniformLocation(program, "u_circlesPosRad");

  function updateCircles() {
    circles.forEach(c => {
      if (!c.interactive) {
        c.x += c.vx;
        c.y += c.vy;
      } else {
        c.x += (mouse.x - c.x) * 0.12;
        c.y += (mouse.y - c.y) * 0.12;
      }
    });
  }

  function render() {
    updateCircles();

    let colors = [];
    let posRad = [];

    circles.forEach(c => {
      colors.push(...c.color);
      posRad.push(c.x, c.y, c.radius);
    });

    gl.uniform2f(u_resolution, width, height);
    gl.uniform1i(u_circleCount, circles.length);
    gl.uniform3fv(u_circlesColor, new Float32Array(colors));
    gl.uniform3fv(u_circlesPosRad, new Float32Array(posRad));

    gl.drawArrays(gl.TRIANGLES, 0, 6);
    requestAnimationFrame(render);
  }

  render();
});
