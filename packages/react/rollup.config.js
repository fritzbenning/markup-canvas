import { nodeResolve } from "@rollup/plugin-node-resolve";
import typescript from "@rollup/plugin-typescript";
import peerDepsExternal from "rollup-plugin-peer-deps-external";

const banner = `/**
 * Markup Canvas React
 * React components and hooks for markup-canvas
 * @version ${process.env.npm_package_version || "0.1.0"}
 */`;

export default [
  // ES Module build
  {
    input: "src/index.ts",
    output: {
      file: "dist/index.esm.js",
      format: "es",
      banner,
      sourcemap: true,
    },
    plugins: [
      peerDepsExternal(),
      typescript({
        declaration: true,
        declarationDir: "dist",
        rootDir: "src",
      }),
      nodeResolve(),
    ],
    external: ["react", "react-dom", "@markup-canvas/core"],
  },

  // CommonJS build
  {
    input: "src/index.ts",
    output: {
      file: "dist/index.cjs.js",
      format: "cjs",
      banner,
      exports: "named",
      sourcemap: true,
    },
    plugins: [
      peerDepsExternal(),
      typescript({
        declaration: false,
      }),
      nodeResolve(),
    ],
    external: ["react", "react-dom", "@markup-canvas/core"],
  },
];
