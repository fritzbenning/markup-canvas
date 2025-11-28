import { MarkupCanvas, useMarkupCanvas } from "@markup-canvas/react";
import { Moon, Sun, ZoomIn, ZoomOut } from "lucide-react";
import "../App.css";
import { useCallback, useEffect, useState } from "react";
import { Button } from "../components/Button";
import { Content } from "../components/Content";
import { Controls } from "../components/Controls";
import { ZoomDisplay } from "../components/ZoomDisplay";

const CANVAS_NAME = "canvas-1";

export default function WindowExample() {
  const [themeMode, setThemeMode] = useState<"light" | "dark">("light");

  const {
    zoom,
    zoomIn,
    zoomOut,
    fitToContent,
    resetZoom,
    centerContent,
    toggleTransitionMode,
    toggleRulers,
    showRulersState,
    toggleGrid,
    showGridState,
  } = useMarkupCanvas({
    canvasName: CANVAS_NAME,
    onReady: (canvas) => {
      console.log("✅ Canvas ready with initial transform!", canvas);
    },
    onError: () => {
      console.warn("⚠️ Canvas not found on window");
    },
  });

  const toggleTheme = useCallback(() => {
    const newMode = themeMode === "light" ? "dark" : "light";
    setThemeMode(newMode);
    document.body.style.colorScheme = newMode;
  }, [themeMode]);

  const handleMessage = useCallback((event: MessageEvent) => {
    if (event.data.source === "markup-canvas" && event.data.canvasName === CANVAS_NAME) {
      if (event.data.event === "zoom") {
        // Handle zoom events if needed
      }
    }
  }, []);

  useEffect(() => {
    window.addEventListener("message", handleMessage);

    return () => {
      window.removeEventListener("message", handleMessage);
    };
  }, [handleMessage]);

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
        <Button onClick={toggleTheme}>
          {themeMode === "light" ? <Sun size={16} /> : <Moon size={16} />}
          {themeMode === "light" ? "Light" : "Dark"}
        </Button>
      </Controls>
      <ZoomDisplay zoom={zoom} />
      <MarkupCanvas
        width={20000}
        height={15000}
        name={CANVAS_NAME}
        enablePostMessageAPI={true}
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
