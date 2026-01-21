import { defineConfig, Plugin } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// Custom plugin to handle d3-shape resolution
const d3ShapeResolverPlugin = (): Plugin => ({
  name: 'd3-shape-resolver',
  enforce: 'pre',
  resolveId(id) {
    if (id === 'd3-shape') {
      return path.resolve(__dirname, 'node_modules/d3-shape/src/index.js');
    }
    return null;
  },
});

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    d3ShapeResolverPlugin(),
    react(),
    mode === 'development' &&
    componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    commonjsOptions: {
      include: [/node_modules/],
      transformMixedEsModules: true,
      defaultIsModuleExports: 'auto',
    },
  },
  optimizeDeps: {
    esbuildOptions: {
      resolveExtensions: ['.js', '.mjs', '.ts', '.tsx', '.json'],
    },
    include: [
      'd3-shape',
      'd3-array',
      'd3-color',
      'd3-format',
      'd3-interpolate',
      'd3-path',
      'd3-scale',
      'd3-time',
      'd3-time-format',
    ],
  },
}));
