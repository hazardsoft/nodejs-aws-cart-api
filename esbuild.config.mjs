import * as esbuild from 'esbuild';

const options = {
  format: 'cjs',
  bundle: true,
  platform: 'node',

  sourcemap: false,
  minify: false,
  tsconfig: 'tsconfig.build.json',
  external: [
    'class-validator',
    '@nestjs/microservices',
    '@nestjs/websockets/socket-module',
  ],
};

await esbuild.build({
  entryPoints: ['src/handlers/cart.ts'],
  outfile: 'dist/handlers/cart/cart.js',
  ...options,
});