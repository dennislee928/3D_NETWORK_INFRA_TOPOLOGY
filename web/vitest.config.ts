import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react-swc";

export default defineConfig({
  plugins: [react()],
  define: {
    "import.meta.env.VITE_SDN_ADAPTER_URL": JSON.stringify("http://localhost:4000"),
  },
  test: {
    environment: "jsdom",
    setupFiles: "./src/test/setup.ts",
    globals: true,
  }
});
