import * as esbuild from 'esbuild';
import { copy } from 'esbuild-plugin-copy';

const baseOptions = {
  format: 'cjs',
  bundle: true,
  platform: 'node',

  sourcemap: false,
  minify: false,
  tsconfig: 'tsconfig.build.json',
};

const prismaOptions = {
  plugins: [
    copy({
      assets: [
        {
          from: [
            'node_modules/.prisma/client/libquery_engine-rhel-openssl-3.0.x.so.node',
          ],
          to: [''],
        },
      ],
    }),
  ],
};

await esbuild.build({
  entryPoints: ['src/handlers/cart.ts'],
  outfile: 'dist/handlers/cart/cart.js',
  external: ['@nestjs/microservices', '@nestjs/websockets/socket-module'],
  ...baseOptions,
  ...prismaOptions,
});
