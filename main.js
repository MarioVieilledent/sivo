// Constants
const canvas = document.getElementById("a");
const ctx = canvas.getContext("2d");
const pi = Math.PI;
const scale = 300;

// Variables
let camera = {
  x: 0,
  y: 0,
  z: 0,
  focal: 0.2,
  angle: pi / 2,
  ux: 0,
  uz: -1,
  nx: 1,
  nz: 0,
};
let height = 0;
let width = 0;
let halfHeight = 0;
let halfWidth = 0;

// Graphical Functions
function fill(color) {
  ctx.fillStyle = color;
  ctx.fillRect(0, 0, width, height);
}

function triangle(a, b, c, color) {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.moveTo(a[0], a[1]);
  ctx.lineTo(b[0], b[1]);
  ctx.lineTo(c[0], c[1]);
  ctx.closePath();
  ctx.fill();
}

// 3D Engine Functions
function plot(px, py, pz) {
  const cx = camera.x;
  const cy = camera.y;
  const cz = camera.z;
  const ux = camera.ux;
  const uz = camera.uz;
  const nx = camera.nx;
  const nz = camera.nz;
  const f = camera.focal;

  const dx = px - cx;
  const dy = py - cy;
  const dz = pz - cz;

  let y = (dz * ux - dx * uz) / (nz * ux - nx * uz);
  let x = Math.abs(ux) > Math.abs(uz) ? (dx - y * nx) / ux : (dz - y * nz) / uz;

  const pixelX = scale * ((f * y) / x) + halfWidth;
  const pixelY = -scale * ((f * py) / x) + halfHeight;

  return [pixelX, pixelY];
}

// Hooks
window.addEventListener("resize", (event) => {
  height = event.target.innerHeight;
  width = event.target.innerWidth;
  ctx.canvas.height = height;
  ctx.canvas.width = width;
  halfHeight = height / 2;
  halfWidth = width / 2;
  fill("black");
  const a = plot(-0.5, 0.7, -3);
  const b = plot(0.5, 0.6, -3);
  const c = plot(0, -0.2, -3);
  console.log(a, b, c);
  triangle(a, b, c, "green");
});
window.dispatchEvent(new Event("resize"));

// Scene
const testTriangle = [0, 0, -2];

// Main
