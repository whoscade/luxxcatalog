window.addEventListener("load", () => {
  const canvas = document.querySelector(".background-canvas")
  const gl = canvas.getContext("webgl")
  if (!gl) return

  function resize() {
    const dpr = window.devicePixelRatio || 1
    canvas.style.width = window.innerWidth + "px"
    canvas.style.height = window.innerHeight + "px"
    canvas.width = window.innerWidth * dpr
    canvas.height = window.innerHeight * dpr
    gl.viewport(0, 0, canvas.width, canvas.height)
  }

  resize()
  window.addEventListener("resize", resize)

  let mouse = { x: window.innerWidth / 2, y: window.innerHeight / 2 }
  window.addEventListener("mousemove", e => {
    mouse.x = e.clientX
    mouse.y = e.clientY
  })

  const colors = [
    [0.5, 0, 0],
    [0.3, 0, 0],
    [0.6, 0.05, 0.05],
    [0, 0, 0],
    [0.2, 0, 0],
    [0, 0, 0]
  ]

  let circles = []

  function initCircles() {
    circles = []
    const base = (window.innerWidth + window.innerHeight) * 0.3

    for (let i = 0; i < 5; i++) {
      circles.push({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        radius: base * (Math.random() + 0.4),
        color: colors[i],
        vx: (Math.random() - 0.5) * 4,
        vy: (Math.random() - 0.5) * 4,
        interactive: false
      })
    }

    circles.push({
      x: window.innerWidth / 2,
      y: window.innerHeight / 2,
      radius: base * 0.6,
      color: colors[5],
      vx: 0,
      vy: 0,
      interactive: true
    })
  }

  initCircles()

  const vert = `
attribute vec2 a_position;
varying vec2 v_uv;
void main(){
  v_uv = a_position * 0.5 + 0.5;
  gl_Position = vec4(a_position,0.0,1.0);
}`

  const frag = `
precision mediump float;
varying vec2 v_uv;
uniform vec2 u_resolution;
uniform vec3 u_circlesColor[6];
uniform vec3 u_circlesPosRad[6];
uniform int u_circleCount;

void main(){
  vec2 st = v_uv * u_resolution;
  vec3 bg = mix(vec3(0.15,0.0,0.0), vec3(0.0), st.y/u_resolution.y);

  float sum = 0.0;
  vec3 colorSum = vec3(0.0);

  for(int i=0;i<6;i++){
    if(i>=u_circleCount) break;
    vec3 pr = u_circlesPosRad[i];
    float dist = length(st - pr.xy);
    float sigma = pr.z * 0.6;
    float val = exp(-(dist*dist)/(2.0*sigma*sigma));
    sum += val;
    colorSum += u_circlesColor[i] * val;
  }

  vec3 final = mix(bg, colorSum, clamp(sum * 1.3,0.0,1.0));
  gl_FragColor = vec4(final,0.9);
}`

  function shader(type, src){
    const s = gl.createShader(type)
    gl.shaderSource(s, src)
    gl.compileShader(s)
    return s
  }

  const program = gl.createProgram()
  gl.attachShader(program, shader(gl.VERTEX_SHADER, vert))
  gl.attachShader(program, shader(gl.FRAGMENT_SHADER, frag))
  gl.linkProgram(program)
  gl.useProgram(program)

  const buffer = gl.createBuffer()
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
    -1,-1, 1,-1, -1,1,
    -1,1, 1,-1, 1,1
  ]), gl.STATIC_DRAW)

  const pos = gl.getAttribLocation(program,"a_position")
  gl.enableVertexAttribArray(pos)
  gl.vertexAttribPointer(pos,2,gl.FLOAT,false,0,0)

  const u_res = gl.getUniformLocation(program,"u_resolution")
  const u_count = gl.getUniformLocation(program,"u_circleCount")
  const u_color = gl.getUniformLocation(program,"u_circlesColor")
  const u_pos = gl.getUniformLocation(program,"u_circlesPosRad")

  function update(){
    circles.forEach(c=>{
      if(c.interactive){
        c.x += (mouse.x - c.x) * 0.08
        c.y += (mouse.y - c.y) * 0.08
      } else {
        c.x += c.vx
        c.y += c.vy
      }
    })
  }

  function draw(){
    update()

    gl.uniform2f(u_res, canvas.width, canvas.height)
    gl.uniform1i(u_count, circles.length)

    let cols=[], pos=[]
    circles.forEach(c=>{
      cols.push(...c.color)
      pos.push(c.x, canvas.height - c.y, c.radius)
    })

    gl.uniform3fv(u_color, new Float32Array(cols))
    gl.uniform3fv(u_pos, new Float32Array(pos))

    gl.drawArrays(gl.TRIANGLES,0,6)
    requestAnimationFrame(draw)
  }

  draw()
})
