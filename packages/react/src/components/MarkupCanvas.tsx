import { MarkupCanvas as CoreMarkupCanvas, type MarkupCanvasConfig, type Transform } from "@markup-canvas/core";
import {
  type CSSProperties,
  forwardRef,
  type ReactNode,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from "react";
import type { MarkupCanvasRef } from "../types/index.js";

export interface MarkupCanvasProps extends Omit<MarkupCanvasConfig, "container"> {
  children?: ReactNode;
  className?: string;
  style?: CSSProperties;
  onTransformChange?: (transform: Transform) => void;
  onZoomChange?: (zoom: number) => void;
  onPanChange?: (pan: { x: number; y: number }) => void;
  onReady?: (canvas: CoreMarkupCanvas) => void;
}

export const MarkupCanvas = forwardRef<MarkupCanvasRef, MarkupCanvasProps>(
  ({ children, className, style, onTransformChange, onZoomChange, onPanChange, onReady, ...options }, ref) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [canvasInstance, setCanvasInstance] = useState<CoreMarkupCanvas | null>(null);

    useImperativeHandle(
      ref,
      () => ({
        canvas: canvasInstance,
        zoomIn: (factor = 0.1) => canvasInstance?.zoomIn(factor),
        zoomOut: (factor = 0.1) => canvasInstance?.zoomOut(factor),
        resetZoom: () => canvasInstance?.resetZoom(),
        panTo: (x, y) => canvasInstance?.scrollToPoint(x, y),
        fitToContent: () => canvasInstance?.fitToScreen(),
        centerContent: () => canvasInstance?.centerContent(),
        getTransform: () => canvasInstance?.transform || { scale: 1, translateX: 0, translateY: 0 },
        getZoom: () => canvasInstance?.transform?.scale || 1,
      }),
      [canvasInstance]
    );

    const onTransformChangeRef = useRef(onTransformChange);
    const onZoomChangeRef = useRef(onZoomChange);
    const onPanChangeRef = useRef(onPanChange);
    const onReadyRef = useRef(onReady);

    onTransformChangeRef.current = onTransformChange;
    onZoomChangeRef.current = onZoomChange;
    onPanChangeRef.current = onPanChange;
    onReadyRef.current = onReady;

    const handleTransformChange = useCallback((transform: Transform) => {
      onTransformChangeRef.current?.(transform);
    }, []);

    const handleZoomChange = useCallback((zoom: number) => {
      onZoomChangeRef.current?.(zoom);
    }, []);

    const handlePanChange = useCallback((pan: { x: number; y: number }) => {
      onPanChangeRef.current?.(pan);
    }, []);

    const handleReady = useCallback((canvas: CoreMarkupCanvas) => {
      onReadyRef.current?.(canvas);
    }, []);

    const stableOptions = useMemo(() => options, Object.values(options));

    useEffect(() => {
      if (!containerRef.current) return;

      const canvas = new CoreMarkupCanvas(containerRef.current, stableOptions);
      setCanvasInstance(canvas);

      canvas.on("transform", handleTransformChange);
      canvas.on("zoom", handleZoomChange);
      canvas.on("pan", handlePanChange);
      canvas.on("ready", handleReady);

      if (canvas.isReady) {
        handleReady(canvas);
      }

      if (canvas.container && typeof canvas.container.focus === "function") {
        canvas.container.focus();
      }

      return () => {
        canvas.off("transform", handleTransformChange);
        canvas.off("zoom", handleZoomChange);
        canvas.off("pan", handlePanChange);
        canvas.off("ready", handleReady);
        canvas.cleanup();
        setCanvasInstance(null);
      };
    }, [stableOptions, handleTransformChange, handleZoomChange, handlePanChange, handleReady]);

    return (
      <div ref={containerRef} className={className} style={{ width: "100%", height: "100%", ...style }}>
        {children}
      </div>
    );
  }
);

MarkupCanvas.displayName = "MarkupCanvas";
