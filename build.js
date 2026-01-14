// build-html.js
const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

// Paths
const jsPath = path.join(__dirname, "main.js");
const minJsPath = path.join(__dirname, "main.min.js");
const htmlPath = path.join(__dirname, "index.html");

// terser command that can save me if it's too unsafe:
// `npx terser "${jsPath}" -c -m -o "${minJsPath}"`
// `npx terser "${jsPath}" -c keep_fnames=false,passes=3 -m toplevel,keep_fnames=false --mangle-fnames -o "${minJsPath}"`
// `npx terser "${jsPath}" -c unsafe,unsafe_math,unsafe_arrows,keep_fnames=false -m toplevel,keep_fnames=false --mangle-fnames -o "${minJsPath}"`

try {
  // Minify JS with Terser
  execSync(
    `npx terser "${jsPath}" -c unsafe,unsafe_math,unsafe_arrows,keep_fnames=false -m toplevel,keep_fnames=false --mangle-fnames -o "${minJsPath}"`,
    {
      stdio: "inherit",
    }
  );

  // Read minified JS
  const minJs = fs.readFileSync(minJsPath, "utf8");

  // Build minimal HTML with embedded script
  const html = `<body style="margin: 0"><canvas id="a"></canvas></body><script>${minJs}</script>`;

  // Write/overwrite index.html
  fs.writeFileSync(htmlPath, html);

  console.log("✅ index.html generated successfully!");
} catch (err) {
  console.error("❌ Build failed:", err);
}
