import { useMarkupCanvas } from "@markup-canvas/react";
import "../App.css";
import { useEffect, useRef, useState } from "react";
import { Content } from "../components/Content";
import { MARKUP_CONFIG } from "./config";
import { FloatingToolbar } from "./FloatingToolbar";

export default function Example() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [transitionEnabled, setTransitionEnabled] = useState<boolean>(MARKUP_CONFIG.enableTransition);

  const {
    zoom,
    zoomIn,
    zoomOut,
    fitToScreen,
    reset,
    centerContent,
    setTransitionMode,
    themeMode,
    updateThemeMode,
    showRulers,
    hideRulers,
    rulersVisible,
    showGrid,
    hideGrid,
    gridVisible,
  } = useMarkupCanvas({
    containerRef,
    config: MARKUP_CONFIG,
    onReady: (canvas) => {
      setTransitionEnabled(canvas.config.enableTransition);
      console.log("✅ [hook] Canvas ready", canvas);
    },
  });

  useEffect(() => {
    document.body.style.colorScheme = themeMode;
  }, [themeMode]);

  return (
    <main className="app">
      <FloatingToolbar
        zoom={zoom}
        onZoomIn={() => zoomIn()}
        onZoomOut={() => zoomOut()}
        onFitToScreen={fitToScreen}
        onResetCanvas={reset}
        onCenterContent={centerContent}
        transitionEnabled={transitionEnabled}
        onTransitionChange={(enabled) => {
          setTransitionMode(enabled);
          setTransitionEnabled(enabled);
        }}
        rulersVisible={rulersVisible}
        onRulersChange={(visible) => {
          if (visible) showRulers();
          else hideRulers();
        }}
        gridVisible={gridVisible}
        onGridChange={(visible) => {
          if (visible) showGrid();
          else hideGrid();
        }}
        themeMode={themeMode}
        onThemeModeChange={updateThemeMode}
      />
      <div ref={containerRef} style={{ width: "100%", height: "100%", flex: 1, minHeight: 0 }}>
        <Content />
      </div>
    </main>
  );
}
