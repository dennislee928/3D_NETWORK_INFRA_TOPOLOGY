import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (
            id.includes("/node_modules/three/examples/") ||
            id.includes("/node_modules/three-stdlib/")
          ) {
            return "three-extras";
          }

          if (id.includes("/node_modules/three/")) {
            return "three-core";
          }

          if (id.includes("/node_modules/@react-three/fiber/")) {
            return "react-three-fiber";
          }

          if (
            id.includes("/node_modules/@react-three/drei/") ||
            id.includes("/node_modules/camera-controls/") ||
            id.includes("/node_modules/meshline/") ||
            id.includes("/node_modules/maath/") ||
            id.includes("/node_modules/stats.js/")
          ) {
            return "react-three-drei";
          }

          return undefined;
        }
      }
    }
  },
  server: {
    port: 5173
  }
});
