import type { MarkupCanvasConfig, Transform } from "@markup-canvas/core";
import { type CSSProperties, forwardRef, type ReactNode, useImperativeHandle, useMemo, useRef } from "react";
import { useMarkupCanvas } from "../hooks/useMarkupCanvas";
import type { MarkupCanvasRef } from "../types/index";

export interface MarkupCanvasProps extends Omit<MarkupCanvasConfig, "container" | "initialZoom" | "initialPan"> {
  children?: ReactNode;
  className?: string;
  style?: CSSProperties;
  onTransformChange?: (transform: Transform) => void;
  onZoomChange?: (zoom: number) => void;
  onPanChange?: (pan: { x: number; y: number }) => void;
  onReady?: (canvas: import("@markup-canvas/core").MarkupCanvas) => void;
  /** Initial zoom level; */
  zoom?: number;
  /** Initial pan offset; */
  pan?: { x: number; y: number };
}

export const MarkupCanvas = forwardRef<MarkupCanvasRef, MarkupCanvasProps>(
  ({ children, className, style, onTransformChange, onZoomChange, onPanChange, onReady, zoom, pan, ...options }, ref) => {
    const containerRef = useRef<HTMLDivElement>(null);

    const config = useMemo(
      () =>
        ({
          ...options,
          initialZoom: zoom,
          initialPan: pan,
        }) as MarkupCanvasConfig,
      [options, zoom, pan]
    );

    const { canvas } = useMarkupCanvas({
      containerRef,
      config,
      onTransformChange,
      onZoomChange,
      onPanChange,
      onReady,
    });

    useImperativeHandle(
      ref,
      () => ({
        canvas,
        zoomIn: () => canvas?.zoomIn(),
        zoomOut: () => canvas?.zoomOut(),
        reset: () => canvas?.reset(),
        resetZoom: () => canvas?.resetZoom(),
        panToPoint: (x, y) => canvas?.panToPoint(x, y),
        fitToScreen: () => canvas?.fitToScreen(),
        centerContent: () => canvas?.centerContent(),
        getTransform: () => canvas?.transform || { scale: 1, translateX: 0, translateY: 0 },
        getZoom: () => canvas?.transform?.scale || 1,
        updateThemeMode: (mode: "light" | "dark") => canvas?.updateThemeMode(mode),
        toggleRulers: () => canvas?.toggleRulers(),
        showRulers: () => canvas?.showRulers(),
        hideRulers: () => canvas?.hideRulers(),
        areRulersVisible: () => canvas?.areRulersVisible() ?? false,
        toggleGrid: () => canvas?.toggleGrid(),
        showGrid: () => canvas?.showGrid(),
        hideGrid: () => canvas?.hideGrid(),
        isGridVisible: () => canvas?.isGridVisible() ?? false,
      }),
      [canvas]
    );

    return (
      <div ref={containerRef} className={className} style={{ width: "100%", height: "100%", ...style }}>
        {children}
      </div>
    );
  }
);

MarkupCanvas.displayName = "MarkupCanvas";
