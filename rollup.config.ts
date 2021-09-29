import typescript from '@rollup/plugin-typescript';
import {nodeResolve} from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import {RollupOptions} from 'rollup';
import {terser} from "rollup-plugin-terser";
import license from "rollup-plugin-license";
import path from 'path';
import copy from 'rollup-plugin-copy'
import json from "@rollup/plugin-json";
import sass from "sass";
import * as fs from "fs";
import {promisify} from "util";

const isProd = (process.env.BUILD === 'production');

// noinspection JSUnusedGlobalSymbols
export default {
  input: 'main.ts',
  output: {
    dir: './dist',
    sourcemap: 'inline',
    sourcemapExcludeSources: isProd,
    format: 'cjs',
    exports: 'default'
  },
  external: ['obsidian'],
  plugins: [
    typescript({
      // FIXME Rollup warn that the module isn't esnext. But it should be
      tsconfig: "tsconfig.app.json"
    }),
    nodeResolve({browser: true}),
    commonjs(),
    json(),
    terser({
      format: {comments: false}
    }),
    license({
      thirdParty: {
        includePrivate: true,
        output: {
          file: path.join(__dirname, 'dist', 'license.txt'),
          encoding: 'utf-8', // Default is utf-8.
        },
      },
    }),
    copy({
      targets: [
        {src: 'manifest.json', dest: 'dist'},
        {src: 'versions.json', dest: 'dist'},
        {
          src: 'styles.scss',
          dest: 'dist',
          transform: (contents) =>
            sass.renderSync({
              data: contents.toString(),
              outputStyle: "compressed",
              sourceMap: !isProd
            }).css.toString(),
          rename: (name) => `${name}.css`
        }
      ],
      filter: (src) =>
         promisify(fs.stat)(src).then(({size}) => size > 0)
    })
  ]
} as RollupOptions
