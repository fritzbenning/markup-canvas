import path from "node:path";
import alias from "@rollup/plugin-alias";
import commonjs from "@rollup/plugin-commonjs";
import { nodeResolve } from "@rollup/plugin-node-resolve";
import terser from "@rollup/plugin-terser";
import typescript from "@rollup/plugin-typescript";

const banner = `/**
 * Markup Canvas
 * High-performance markup canvas with zoom and pan capabilities
 * @version ${process.env.npm_package_version || "1.0.0"}
 */`;

export default [
  // ES Module build
  {
    input: "src/index.ts",
    output: {
      file: "dist/markup-canvas.esm.js",
      format: "es",
      banner,
    },
    plugins: [
      alias({
        entries: [{ find: "@", replacement: path.resolve("src") }],
      }),
      nodeResolve(),
      commonjs(),
      typescript({
        declaration: true,
        declarationDir: "dist",
        rootDir: "src",
      }),
    ],
  },

  // CommonJS build
  {
    input: "src/index.ts",
    output: {
      file: "dist/markup-canvas.cjs.js",
      format: "cjs",
      banner,
      exports: "named",
    },
    plugins: [
      alias({
        entries: [{ find: "@", replacement: path.resolve("src") }],
      }),
      nodeResolve(),
      commonjs(),
      typescript({
        declaration: false,
      }),
    ],
  },

  // UMD build for browsers
  {
    input: "src/umd.ts",
    output: {
      file: "dist/markup-canvas.umd.js",
      format: "umd",
      name: "MarkupCanvas",
      banner,
    },
    plugins: [
      alias({
        entries: [{ find: "@", replacement: path.resolve("src") }],
      }),
      nodeResolve(),
      commonjs(),
      typescript({
        declaration: false,
      }),
    ],
  },

  // Minified UMD build
  {
    input: "src/umd.ts",
    output: {
      file: "dist/markup-canvas.umd.min.js",
      format: "umd",
      name: "MarkupCanvas",
      banner,
    },
    plugins: [
      alias({
        entries: [{ find: "@", replacement: path.resolve("src") }],
      }),
      nodeResolve(),
      commonjs(),
      typescript({
        declaration: false,
      }),
      terser({
        format: {
          comments: /^!/,
        },
      }),
    ],
  },
];
