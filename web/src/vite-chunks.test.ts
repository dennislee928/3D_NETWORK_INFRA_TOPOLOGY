// @vitest-environment node

import config from "../vite.config";

describe("vite chunk strategy", () => {
  it("splits heavy topology dependencies into dedicated chunks", () => {
    const output = config.build?.rollupOptions?.output;
    if (!output || Array.isArray(output) || typeof output.manualChunks !== "function") {
      throw new Error("manualChunks is not configured");
    }

    expect(output.manualChunks("/workspace/web/node_modules/three/build/three.module.js")).toBe("three-core");
    expect(output.manualChunks("/workspace/web/node_modules/three/examples/jsm/loaders/GLTFLoader.js")).toBe(
      "three-extras"
    );
    expect(output.manualChunks("/workspace/web/node_modules/@react-three/fiber/dist/index.mjs")).toBe(
      "react-three-fiber"
    );
    expect(output.manualChunks("/workspace/web/node_modules/@react-three/drei/index.js")).toBe(
      "react-three-drei"
    );
  });
});
