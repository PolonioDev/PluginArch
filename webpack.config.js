import { dirname, resolve } from 'node:path';
import TSConfigPathsResolver from 'tsconfig-paths-webpack-plugin';
import { fileURLToPath } from 'node:url';
const __dirname = dirname(fileURLToPath(import.meta.url));

const ESBuildConfig = {
    target: 'es2015',
    platform: 'neutral',
    format: 'esm'
};

export default ['mjs', 'cjs'].map((format, i) => {
    const isModule = format === 'mjs';
    return {
        context: __dirname,
        entry: './src/index.ts',
        target: 'node16',
        output: {
            filename: `[name].${format}`,
            clean: i==0,
            library: {
                type: isModule ? 'module' : 'commonjs2',
                export: !isModule? 'default' : undefined 
            }
        },
        experiments: {
            outputModule: isModule
        },
        resolve: {
            plugins: [
                new TSConfigPathsResolver()
            ]
        },
        module: {
            rules: [
                {
                    test: /\.[jt]sx?$/,
                    loader: 'esbuild-loader',
                    exclude: /node_modules/,
                    options: ESBuildConfig
                }        
            ]
        }
    };
});