import { MarkupCanvas, type MarkupCanvasRef, useMarkupCanvas } from "@markup-canvas/react";
import { Moon, Sun, ZoomIn, ZoomOut } from "lucide-react";
import { useRef } from "react";
import "../App.css";
import { Button } from "../components/Button";
import { Content } from "../components/Content";
import { Controls } from "../components/Controls";
import { ZoomDisplay } from "../components/ZoomDisplay";

function RefExample() {
  const canvasRef = useRef<MarkupCanvasRef>(null);

  const {
    initCanvasUtils,
    zoom,
    zoomIn,
    zoomOut,
    fitToContent,
    resetZoom,
    centerContent,
    toggleTransitionMode,
    themeMode,
    toggleThemeMode,
  } = useMarkupCanvas(canvasRef);

  return (
    <main className="app">
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
        <Button onClick={toggleThemeMode}>
          {themeMode === "light" ? <Sun size={16} /> : <Moon size={16} />}
          {themeMode === "light" ? "Light" : "Dark"}
        </Button>
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
        themeMode={themeMode}
        onReady={initCanvasUtils}
      >
        <Content />
      </MarkupCanvas>
    </main>
  );
}

export default RefExample;
