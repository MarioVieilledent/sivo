// Types
type Pixel = number[];
type Vector = number[];

// Shortening Constants
const pi = Math.PI;
const pi2 = pi * 2;
const cos = Math.cos;
const sin = Math.sin;

// Constants
const windowAddEventListener = window.addEventListener;
const canvas = document.getElementById("a") as HTMLCanvasElement;
const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
const scale = 300;
const updateFrequency = 1000 / 60;
const keyMap: Partial<Record<string, keyof typeof move>> = {
  KeyW: "forward",
  KeyA: "left",
  KeyS: "backward",
  KeyD: "right",
  KeyQ: "turnLeft",
  KeyE: "turnRight",
  ArrowUp: "up",
  ArrowDown: "down",
};

// Canvas Variables
let height = 0;
let width = 0;
let halfHeight = 0;
let halfWidth = 0;

// Player Variables
const camera = {
  x: 0,
  y: 0,
  z: 0,
  focal: 0.9,
  angle: pi / 2,
  unitX: 0,
  unitZ: -1,
  normalX: 1,
  normalZ: 0,
};
const move = {
  forward: false,
  left: false,
  backward: false,
  right: false,
  up: false,
  down: false,
  turnLeft: false,
  turnRight: false,
};
let horizontalSpeed = updateFrequency / 1000;
let verticalSpeed = updateFrequency / 1000;
let turningSpeed = (updateFrequency * pi2) / 1000 / 2;

// Game Variables
let tick = 0;

// Canvas Functions
function fill(color: string) {
  ctx.fillStyle = color;
  ctx.fillRect(0, 0, width, height);
}

function drawTriangle(a: Pixel, b: Pixel, c: Pixel, color: string) {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.moveTo(a[0], a[1]);
  ctx.lineTo(b[0], b[1]);
  ctx.lineTo(c[0], c[1]);
  ctx.closePath();
  ctx.fill();
}

// 3D Engine Functions
function plot(px: number, py: number, pz: number) {
  const ux = camera.unitX;
  const uz = camera.unitZ;
  const nx = camera.normalX;
  const nz = camera.normalZ;

  const dx = px - camera.x;
  const dz = pz - camera.z;

  let y = (dz * ux - dx * uz) / (nz * ux - nx * uz);
  let x = Math.abs(ux) > Math.abs(uz) ? (dx - y * nx) / ux : (dz - y * nz) / uz;

  const pixelX = scale * ((camera.focal * y) / x) + halfWidth;
  const pixelY = -scale * ((camera.focal * (py - camera.y)) / x) + halfHeight;

  return [pixelX, pixelY];
}

function drawCube(x: number, y: number, z: number) {
  const a = plot(x, y + 1, z);
  const b = plot(x + 1, y + 1, z);
  const c = plot(x + 1, y + 1, z + 1);
  const d = plot(x, y + 1, z + 1);
  const e = plot(x, y, z);
  const f = plot(x + 1, y, z);
  const g = plot(x + 1, y, z + 1);
  const h = plot(x, y, z + 1);
  drawTriangle(a, b, d, "blue");
  drawTriangle(c, b, d, "blue");
  drawTriangle(e, f, h, "blue");
  drawTriangle(f, h, g, "blue");
  drawTriangle(a, e, h, "blue");
  drawTriangle(a, h, d, "blue");
}

function computeUnitAndNormal() {
  const cosTheta = cos(camera.angle);
  const sinTheta = sin(camera.angle);
  camera.unitX = cosTheta;
  camera.unitZ = -sinTheta;
  camera.normalX = sinTheta;
  camera.normalZ = cosTheta;
}

function render() {
  // Clear canvas
  fill("black");

  // Test triangle
  const a = plot(-0.5, 0.7, -3);
  const b = plot(0.5, 0.6, -3);
  const c = plot(0, -0.2, -3);
  drawTriangle(a, b, c, "green");

  // Test cube
  drawCube(0, 0, -2);

  // Rendering loop
  requestAnimationFrame(render);
}

// Hooks
windowAddEventListener("resize", (event) => {
  const windowTarget = event.target as Window;
  height = windowTarget.innerHeight;
  width = windowTarget.innerWidth;
  ctx.canvas.height = height;
  ctx.canvas.width = width;
  halfHeight = height / 2;
  halfWidth = width / 2;
  render();
});

windowAddEventListener("keydown", (event) => {
  move[keyMap[event.code]] = true;
});

windowAddEventListener("keyup", (event) => {
  move[keyMap[event.code]] = false;
});

// Update
function update() {
  // Increment tick
  tick++;

  // Process player movement
  if (move.forward) {
    camera.x += camera.unitX * horizontalSpeed;
    camera.z += camera.unitZ * horizontalSpeed;
  }
  if (move.backward) {
    camera.x -= camera.unitX * horizontalSpeed;
    camera.z -= camera.unitZ * horizontalSpeed;
  }
  if (move.left) {
    camera.x -= camera.normalX * horizontalSpeed;
    camera.z -= camera.normalZ * horizontalSpeed;
  }
  if (move.right) {
    camera.x += camera.normalX * horizontalSpeed;
    camera.z += camera.normalZ * horizontalSpeed;
  }
  move.up ? (camera.y += horizontalSpeed) : {};
  move.down ? (camera.y -= horizontalSpeed) : {};
  if (move.turnLeft) {
    camera.angle += turningSpeed;
    computeUnitAndNormal();
  }
  if (move.turnRight) {
    camera.angle -= turningSpeed;
    computeUnitAndNormal();
  }
}

// Scene

// Main

window.dispatchEvent(new Event("resize")); // Render first frame
setInterval(update, updateFrequency); // Start update loop
requestAnimationFrame(render); // Start render loop
