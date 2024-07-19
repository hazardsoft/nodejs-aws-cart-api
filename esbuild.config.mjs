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
    'class-transformer',
    '@nestjs/microservices',
    '@nestjs/microservices/microservices-module',
    '@nestjs/websockets/socket-module',
  ],
};

await esbuild.build({
  entryPoints: ['src/main.ts'],
  outfile: 'dist/handlers/cart/cart.js',
  ...options,
});
