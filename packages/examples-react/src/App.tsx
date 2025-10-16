import { MarkupCanvas, type MarkupCanvasRef, useMarkupCanvas } from "@markup-canvas/react";
import { ZoomIn, ZoomOut } from "lucide-react";
import { useRef } from "react";
import "./App.css";
import { Button } from "./components/Button";
import { Content } from "./components/Content";
import { Controls } from "./components/Controls";
import { ZoomDisplay } from "./components/ZoomDisplay";

function App() {
  const canvasRef = useRef<MarkupCanvasRef>(null);

  const { initCanvasUtils, zoom, zoomIn, zoomOut, fitToContent, resetZoom, centerContent, toggleTransitionMode } =
    useMarkupCanvas(canvasRef);

  return (
    <div className="app">
      <Controls>
        <Button onClick={() => zoomIn()}>
          <ZoomIn size={16} />
          Zoom In
        </Button>
        <Button onClick={() => zoomOut()}>
          <ZoomOut size={16} />
          Zoom Out
        </Button>
        <Button onClick={fitToContent}>Fit to Content</Button>
        <Button onClick={resetZoom}>Reset Zoom</Button>
        <Button onClick={centerContent}>Center Content</Button>
        <Button onClick={toggleTransitionMode}> Toggle Transition Mode</Button>
      </Controls>
      <ZoomDisplay zoom={zoom} />
      <MarkupCanvas
        ref={canvasRef}
        width={20000}
        height={15000}
        enableKeyboard={true}
        requireSpaceForMouseDrag={false}
        requireOptionForClickZoom={false}
        enableClickToZoom={true}
        enableTransition={false}
        enableRulers={true}
        enableGrid={true}
        onReady={initCanvasUtils}
      >
        <Content />
      </MarkupCanvas>
    </div>
  );
}

export default App;
