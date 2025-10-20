import type { MarkupCanvas, Transform } from "@markup-canvas/core";
import { type RefObject, useCallback, useEffect, useRef, useState } from "react";
import type { MarkupCanvasRef, UseMarkupCanvasOptions } from "../types/index.js";

export function useMarkupCanvas(canvasRef: RefObject<MarkupCanvasRef | null>, options: UseMarkupCanvasOptions = {}) {
  const [canvas, setCanvas] = useState<MarkupCanvas | null>(null);
  const [transform, setTransform] = useState<Transform>({ scale: 1, translateX: 0, translateY: 0 });
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isReady, setIsReady] = useState(false);
  const [themeMode, setThemeModeState] = useState<"light" | "dark">("light");
  const [showRulersState, setShowRulersState] = useState(false);
  const [showGridState, setShowGridState] = useState(false);

  const optionsRef = useRef(options);
  optionsRef.current = options;

  const handleCanvasInstance = useCallback((markupCanvas: MarkupCanvas) => {
    setCanvas(markupCanvas);
    optionsRef.current.onReady?.(markupCanvas);
  }, []);

  const handleTransform = useCallback((newTransform: Transform) => {
    setTransform(newTransform);
    optionsRef.current.onTransformChange?.(newTransform);
  }, []);

  const handleZoom = useCallback((newZoom: number) => {
    setZoom(newZoom);
    optionsRef.current.onZoomChange?.(newZoom);
  }, []);

  const handlePan = useCallback((newPan: { x: number; y: number }) => {
    setPan(newPan);
    optionsRef.current.onPanChange?.(newPan);
  }, []);

  const handleReady = useCallback((markupCanvas: MarkupCanvas) => {
    setIsReady(true);
    optionsRef.current.onReady?.(markupCanvas);
  }, []);

  const handleRulersVisibilityChange = useCallback((isVisible: boolean) => {
    setShowRulersState(isVisible);
  }, []);

  const handleGridVisibilityChange = useCallback((isVisible: boolean) => {
    setShowGridState(isVisible);
  }, []);

  useEffect(() => {
    if (!canvas) {
      return;
    }

    canvas.on("transform", handleTransform);
    canvas.on("zoom", handleZoom);
    canvas.on("pan", handlePan);
    canvas.on("ready", handleReady);
    canvas.on("rulersVisibility", handleRulersVisibilityChange);
    canvas.on("gridVisibility", handleGridVisibilityChange);

    if (canvas.transform) {
      setTransform(canvas.transform);
      setZoom(canvas.transform.scale);
      setPan({ x: canvas.transform.translateX, y: canvas.transform.translateY });
    }

    if (canvas.isReady) {
      setIsReady(true);
      optionsRef.current.onReady?.(canvas);
    }

    return () => {
      canvas.off("transform", handleTransform);
      canvas.off("zoom", handleZoom);
      canvas.off("pan", handlePan);
      canvas.off("ready", handleReady);
      canvas.off("rulersVisibility", handleRulersVisibilityChange);
      canvas.off("gridVisibility", handleGridVisibilityChange);
    };
  }, [canvas, handleTransform, handleZoom, handlePan, handleReady, handleRulersVisibilityChange, handleGridVisibilityChange]);

  const zoomIn = useCallback(() => {
    canvasRef.current?.zoomIn();
  }, [canvasRef]);

  const zoomOut = useCallback(() => {
    canvasRef.current?.zoomOut();
  }, [canvasRef]);

  const resetZoom = useCallback(() => {
    canvasRef.current?.resetZoom();
  }, [canvasRef]);

  const panTo = useCallback(
    (x: number, y: number) => {
      canvasRef.current?.panTo(x, y);
    },
    [canvasRef]
  );

  const fitToContent = useCallback(() => {
    canvasRef.current?.fitToContent();
  }, [canvasRef]);

  const centerContent = useCallback(() => {
    canvasRef.current?.centerContent();
  }, [canvasRef]);

  const setTransitionMode = useCallback(
    (enabled: boolean) => {
      if (canvasRef.current?.canvas) {
        canvasRef.current.canvas.updateConfig({ enableTransition: enabled });
      }
    },
    [canvasRef]
  );

  const toggleTransitionMode = useCallback(() => {
    if (canvasRef.current?.canvas) {
      const currentConfig = canvasRef.current.canvas.getConfig();
      const newEnableTransition = !currentConfig.enableTransition;
      canvasRef.current.canvas.updateConfig({ enableTransition: newEnableTransition });
      return newEnableTransition;
    }
    return false;
  }, [canvasRef]);

  const updateThemeMode = useCallback(
    (mode: "light" | "dark") => {
      setThemeModeState(mode);
      canvasRef.current?.updateThemeMode(mode);
    },
    [canvasRef]
  );

  const toggleThemeMode = useCallback(() => {
    const newMode = themeMode === "light" ? "dark" : "light";
    updateThemeMode(newMode);
    return newMode;
  }, [themeMode, updateThemeMode]);

  const toggleRulers = useCallback(() => {
    canvasRef.current?.toggleRulers();
  }, [canvasRef]);

  const areRulersVisible = useCallback(() => {
    return canvasRef.current?.areRulersVisible() ?? false;
  }, [canvasRef]);

  const toggleGrid = useCallback(() => {
    canvasRef.current?.toggleGrid();
  }, [canvasRef]);

  const isGridVisible = useCallback(() => {
    return canvasRef.current?.isGridVisible() ?? false;
  }, [canvasRef]);

  return {
    canvas: canvasRef.current?.canvas || null,
    initCanvasUtils: handleCanvasInstance,
    transform,
    zoom,
    pan,
    isReady,
    zoomIn,
    zoomOut,
    resetZoom,
    panTo,
    fitToContent,
    centerContent,
    setTransitionMode,
    toggleTransitionMode,
    themeMode,
    updateThemeMode,
    toggleThemeMode,
    toggleRulers,
    areRulersVisible,
    showRulersState,
    toggleGrid,
    isGridVisible,
    showGridState,
  };
}
