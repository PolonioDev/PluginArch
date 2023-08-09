import TSConfigPathsResolver from 'tsconfig-paths-webpack-plugin';
import {fileURLToPath} from 'node:url';
const __dirname = dirname(fileURLToPath(import.meta.url));
import WebpackShellPluginNext from 'webpack-shell-plugin-next';
import {dirname} from 'node:path';

export default (_env, webpack) => {
  const formats = ['mjs', 'cjs'];
  const bundleCli = './node_modules/.bin/dts-bundle-generator';
  const isDevMode = webpack.mode === 'development';
  const ESBuildConfig = {
    target: 'es2015',
    platform: 'neutral',
    format: 'esm',
    sourcemap: isDevMode
  };
  return formats.map((format, i) => {
    const isModule = format === 'mjs';
    return {
      devtool: isDevMode ? 'source-map' : undefined,
      context: __dirname,
      entry: './src/index.ts',
      target: 'node16',
      output: {
        filename: `[name].${format}`,
        library: {
          type: isModule ? 'module' : 'commonjs2',
          export: isModule ? undefined : 'default',
        },
      },
      experiments: {
        outputModule: isModule,
      },
      resolve: {
        plugins: [new TSConfigPathsResolver()],
      },
      plugins: i === 0 ? [
        new WebpackShellPluginNext({
          onBuildStart: {
            scripts: [
              'npm run clear',
              `"${bundleCli}" --silent --no-banner -o ./dist/main.d.ts ./src/index.ts`
            ],
            blocking: true,
            parallel: false
          }
        })
      ] : [],
      module: {
        rules: [
          {
            test: /\.tsx?$/,
            loader: 'esbuild-loader',
            exclude: /node_modules/,
            options: ESBuildConfig,
          },
        ],
      },
    };
  });
};
