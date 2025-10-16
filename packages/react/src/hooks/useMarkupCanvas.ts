import type { MarkupCanvas, Transform } from "@markup-canvas/core";
import { type RefObject, useCallback, useEffect, useRef, useState } from "react";
import type { MarkupCanvasRef, UseMarkupCanvasOptions } from "../types/index.js";

export function useMarkupCanvas(canvasRef: RefObject<MarkupCanvasRef | null>, options: UseMarkupCanvasOptions = {}) {
  const [canvasInstance, setCanvasInstance] = useState<MarkupCanvas | null>(null);
  const [transform, setTransform] = useState<Transform>({ scale: 1, translateX: 0, translateY: 0 });
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isReady, setIsReady] = useState(false);

  const optionsRef = useRef(options);
  optionsRef.current = options;

  const handleCanvasInstance = useCallback((canvas: MarkupCanvas) => {
    setCanvasInstance(canvas);
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
    console.log("useEffect", canvasInstance);

    if (!canvasInstance) {
      return;
    }

    canvasInstance.on("transform", handleTransform);
    canvasInstance.on("zoom", handleZoom);
    canvasInstance.on("pan", handlePan);
    canvasInstance.on("ready", handleReady);

    if (canvasInstance.transform) {
      setTransform(canvasInstance.transform);
      setZoom(canvasInstance.transform.scale);
      setPan({ x: canvasInstance.transform.translateX, y: canvasInstance.transform.translateY });
    }

    if (canvasInstance.isReady) {
      setIsReady(true);
      optionsRef.current.onReady?.(canvasInstance);
    }

    return () => {
      canvasInstance.off("transform", handleTransform);
      canvasInstance.off("zoom", handleZoom);
      canvasInstance.off("pan", handlePan);
      canvasInstance.off("ready", handleReady);
    };
  }, [canvasInstance]);

  const zoomIn = useCallback(
    (factor = 0.5) => {
      canvasRef.current?.zoomIn(factor);
    },
    [canvasRef]
  );

  const zoomOut = useCallback(
    (factor = 0.5) => {
      canvasRef.current?.zoomOut(factor);
    },
    [canvasRef]
  );

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
  };
}
