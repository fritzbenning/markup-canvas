import { MarkupCanvas, useMarkupCanvasWindow } from "@markup-canvas/react";
import { Moon, Sun, ZoomIn, ZoomOut } from "lucide-react";
import "../App.css";
import { Button } from "../components/Button";
import { Content } from "../components/Content";
import { Controls } from "../components/Controls";
import { ZoomDisplay } from "../components/ZoomDisplay";

function WindowExample() {
  const {
    zoom,
    zoomIn,
    zoomOut,
    fitToContent,
    resetZoom,
    centerContent,
    toggleTransitionMode,
    themeMode,
    updateThemeMode,
    toggleRulers,
    showRulersState,
    toggleGrid,
    showGridState,
  } = useMarkupCanvasWindow({
    canvasName: "canvas",
    onCanvasReady: (canvas) => {
      console.log("✅ Canvas found and bound to window!", canvas);
    },
    onCanvasUnavailable: () => {
      console.warn("⚠️ Canvas not found on window");
    },
  });

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
        <Button onClick={toggleRulers}>{showRulersState ? "Hide" : "Show"} Rulers</Button>
        <Button onClick={toggleGrid}>{showGridState ? "Hide" : "Show"} Grid</Button>
        <Button onClick={() => updateThemeMode(themeMode === "light" ? "dark" : "light")}>
          {themeMode === "light" ? <Sun size={16} /> : <Moon size={16} />}
          {themeMode === "light" ? "Light" : "Dark"}
        </Button>
      </Controls>
      <ZoomDisplay zoom={zoom} />
      <MarkupCanvas
        width={20000}
        height={15000}
        name="canvas"
        bindToWindow={true}
        enableKeyboard={true}
        requireSpaceForMouseDrag={false}
        requireOptionForClickZoom={false}
        enableClickToZoom={true}
        enableTransition={false}
        enableRulers={true}
        enableGrid={true}
      >
        <Content />
      </MarkupCanvas>
    </main>
  );
}

export default WindowExample;
