const CopyPlugin = require('copy-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');

module.exports = (options, webpack) => {
  const lazyImports = [
    '@nestjs/microservices/microservices-module',
    '@nestjs/websockets/socket-module',
  ];

  return {
    ...options,
    entry: './src/handlers/cart.ts',
    output: {
      ...options.output,
      libraryTarget: 'commonjs2',
      filename: 'handlers/cart/cart.js',
    },
    externals: [],
    optimization: {
      minimizer: [
        new TerserPlugin({
          terserOptions: {
            keep_classnames: true,
          },
        }),
      ],
    },
    plugins: [
      ...options.plugins,
      new webpack.IgnorePlugin({
        checkResource(resource) {
          if (lazyImports.includes(resource)) {
            try {
              require.resolve(resource);
            } catch (err) {
              return true;
            }
          }
          return false;
        },
      }),
      new CopyPlugin({
        patterns: [
          {
            from: 'node_modules/.prisma/client/libquery_engine-rhel-openssl-3.0.x.so.node',
            to: 'handlers/cart',
          },
        ],
      }),
    ],
  };
};