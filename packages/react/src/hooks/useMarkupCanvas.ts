import type { MarkupCanvas, Transform } from "@markup-canvas/core";
import { type RefObject, useCallback, useEffect, useRef, useState } from "react";
import type { MarkupCanvasRef, UseMarkupCanvasOptions } from "../types/index.js";

export function useMarkupCanvas(canvasRef: RefObject<MarkupCanvasRef | null>, options: UseMarkupCanvasOptions = {}) {
  const [instance, setInstance] = useState<MarkupCanvas | null>(null);
  const [transform, setTransform] = useState<Transform>({ scale: 1, translateX: 0, translateY: 0 });
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isReady, setIsReady] = useState(false);
  const [themeMode, setThemeModeState] = useState<"light" | "dark">("light");

  const optionsRef = useRef(options);
  optionsRef.current = options;

  const handleCanvasInstance = useCallback((canvas: MarkupCanvas) => {
    setInstance(canvas);
    optionsRef.current.onReady?.(canvas);
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

  const handleReady = useCallback((canvas: MarkupCanvas) => {
    setIsReady(true);
    optionsRef.current.onReady?.(canvas);
  }, []);

  useEffect(() => {
    console.log("useEffect", instance);

    if (!instance) {
      return;
    }

    instance.on("transform", handleTransform);
    instance.on("zoom", handleZoom);
    instance.on("pan", handlePan);
    instance.on("ready", handleReady);

    if (instance.transform) {
      setTransform(instance.transform);
      setZoom(instance.transform.scale);
      setPan({ x: instance.transform.translateX, y: instance.transform.translateY });
    }

    if (instance.isReady) {
      setIsReady(true);
      optionsRef.current.onReady?.(instance);
    }

    return () => {
      instance.off("transform", handleTransform);
      instance.off("zoom", handleZoom);
      instance.off("pan", handlePan);
      instance.off("ready", handleReady);
    };
  }, [instance, handleTransform, handleZoom, handlePan, handleReady]);

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
    toggleGrid,
    isGridVisible,
  };
}
