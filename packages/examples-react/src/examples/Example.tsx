import { useMarkupCanvas } from "@markup-canvas/react";
import { useEffect, useRef } from "react";
import { Content } from "../components/Content";
import { MARKUP_CONFIG } from "./config";
import { FloatingToolbar } from "./FloatingToolbar";

export default function Example() {
  const containerRef = useRef<HTMLDivElement>(null);

  const {
    zoom,
    zoomIn,
    zoomOut,
    fitToScreen,
    reset,
    transitionEnabled,
    setTransitionMode,
    requireSpaceForMouseDrag,
    setRequireSpaceForMouseDrag,
    enableClickToZoom,
    setEnableClickToZoom,
    requireOptionForClickZoom,
    setRequireOptionForClickZoom,
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
    onReady: (instance) => {
      console.log("✅ [hook] Canvas ready", instance);
    },
  });

  useEffect(() => {
    document.body.style.colorScheme = themeMode;
  }, [themeMode]);

  return (
    <main className="fixed inset-0 overflow-hidden bg-[#f6f6f6]">
      <FloatingToolbar
        tools={{
          zoom,
          onZoomIn: () => zoomIn(),
          onZoomOut: () => zoomOut(),
          onFitToScreen: fitToScreen,
          onResetCanvas: reset,
        }}
        settings={{
          themeMode,
          onThemeModeChange: updateThemeMode,
          transitionEnabled,
          onTransitionChange: setTransitionMode,
          rulersVisible,
          onRulersChange: (visible) => {
            if (visible) showRulers();
            else hideRulers();
          },
          gridVisible,
          onGridChange: (visible) => {
            if (visible) showGrid();
            else hideGrid();
          },
          requireSpaceForMouseDrag,
          onRequireSpaceForMouseDragChange: setRequireSpaceForMouseDrag,
          enableClickToZoom,
          onEnableClickToZoomChange: setEnableClickToZoom,
          requireOptionForClickZoom,
          onRequireOptionForClickZoomChange: setRequireOptionForClickZoom,
        }}
      />
      <div ref={containerRef} style={{ width: "100%", height: "100%", flex: 1, minHeight: 0 }}>
        <Content />
      </div>
    </main>
  );
}
