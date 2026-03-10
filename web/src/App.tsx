import { SceneCanvas } from "./components/3d/SceneCanvas";
import { ServiceDetailsPanel } from "./panels/ServiceDetailsPanel";

export function App() {
  return (
    <div style={{ display: "flex", width: "100vw", height: "100vh", overflow: "hidden" }}>
      <div style={{ flex: 3, background: "#020617" }}>
        <SceneCanvas />
      </div>
      <div
        style={{
          flex: 1,
          minWidth: 320,
          maxWidth: 480,
          borderLeft: "1px solid #1f2937",
          background: "#020617",
          color: "#e5e7eb",
          padding: "1rem",
          boxSizing: "border-box"
        }}
      >
        <ServiceDetailsPanel />
      </div>
    </div>
  );
}

