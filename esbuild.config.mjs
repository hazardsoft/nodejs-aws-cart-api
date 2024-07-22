import * as esbuild from 'esbuild';
import { copy } from 'esbuild-plugin-copy';

const options = {
  format: 'cjs',
  bundle: true,
  platform: 'node',

  sourcemap: false,
  minify: false,
  tsconfig: 'tsconfig.build.json',
  external: ['@nestjs/microservices', '@nestjs/websockets/socket-module'],
  plugins: [
    copy({
      resolveFrom: 'cwd',
      assets: [
        {
          from: [
            'node_modules/.prisma/client/libquery_engine-rhel-openssl-3.0.x.so.node',
          ],
          to: ['dist/handlers/cart'],
        },
      ],
    }),
  ],
};

await esbuild.build({
  entryPoints: ['src/handlers/cart.ts'],
  outfile: 'dist/handlers/cart/cart.js',
  ...options,
});
