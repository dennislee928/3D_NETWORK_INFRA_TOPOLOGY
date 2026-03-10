import { Canvas } from "@react-three/fiber";
import { OrbitControls, Html } from "@react-three/drei";
import { Suspense } from "react";
import { ServiceGraph } from "./ServiceGraph";

export function SceneCanvas() {
  return (
    <Canvas
      camera={{ position: [0, 10, 26], fov: 50 }}
      gl={{ antialias: true }}
      dpr={Math.min(window.devicePixelRatio, 2)}
    >
      <color attach="background" args={["#020617"]} />
      <ambientLight intensity={0.4} />
      <directionalLight intensity={0.6} position={[10, 15, 10]} />

      <Suspense
        fallback={
          <Html center style={{ color: "#e5e7eb", fontSize: "14px" }}>
            Loading topology...
          </Html>
        }
      >
        <ServiceGraph />
      </Suspense>

      <OrbitControls makeDefault enablePan enableZoom />
    </Canvas>
  );
}

