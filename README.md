# Sivo

## Install dependencies

`npm i`

## Build

`node build.js`

Building steps

1. Transpile ts code from `./src` into js in `./build`
2. Mignify js code with `terser`
3. Embed mignified js into html minimal wrapper in `./dist/index.html`
