import type { Transform, WindowAPI } from "@markup-canvas/core";
import { useCallback, useEffect, useRef, useState } from "react";
import type { UseMarkupCanvasOptions } from "../types/index.js";

interface UseMarkupCanvasHookOptions extends Omit<UseMarkupCanvasOptions, "onReady"> {
  canvasName?: string;
  onError?: () => void;
  onReady?: (canvas: WindowAPI) => void;
}

export function useMarkupCanvas(options: UseMarkupCanvasHookOptions = {}) {
  const { canvasName = "markupCanvas" } = options;

  const [canvas, setCanvas] = useState<WindowAPI | null>(null);
  const [transform, setTransform] = useState<Transform>({ scale: 1, translateX: 0, translateY: 0 });
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isReady, setIsReady] = useState(false);
  const [themeMode, setThemeModeState] = useState<"light" | "dark">("light");
  const [showRulersState, setShowRulersState] = useState(false);
  const [showGridState, setShowGridState] = useState(false);

  const optionsRef = useRef(options);
  optionsRef.current = options;

  const handleCanvasInstance = useCallback((canvasInstance: WindowAPI) => {
    setCanvas(canvasInstance);
    optionsRef.current.onReady?.(canvasInstance);
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

  const handleReady = useCallback((canvasInstance: WindowAPI) => {
    setIsReady(true);
    optionsRef.current.onReady?.(canvasInstance);
  }, []);

  const handleRulersVisibilityChange = useCallback((isVisible: boolean) => {
    setShowRulersState(isVisible);
  }, []);

  const handleGridVisibilityChange = useCallback((isVisible: boolean) => {
    setShowGridState(isVisible);
  }, []);

  // Get instance from window binding
  useEffect(() => {
    if (typeof window === "undefined") {
      optionsRef.current.onError?.();
      return;
    }

    const windowCanvas = (window as unknown as Record<string, unknown>)[canvasName] as WindowAPI;

    if (windowCanvas && typeof windowCanvas === "object") {
      handleCanvasInstance(windowCanvas);
      optionsRef.current.onReady?.(windowCanvas);

      // Set initial state from instance
      if (windowCanvas.state?.transform) {
        const transform = windowCanvas.state.transform;
        setTransform(transform);
        setZoom(transform.scale);
        setPan({ x: transform.translateX, y: transform.translateY });
      }

      if (windowCanvas.state?.isReady) {
        setIsReady(true);
        optionsRef.current.onReady?.(windowCanvas);
      }

      setThemeModeState((windowCanvas?.theme?.current as "light" | "dark" | undefined) || "light");

      if (windowCanvas.rulers?.isVisible?.()) {
        setShowRulersState(true);
      }
      if (windowCanvas.grid?.isVisible?.()) {
        setShowGridState(true);
      }
    } else {
      optionsRef.current.onError?.();
    }
  }, [canvasName, handleCanvasInstance]);

  // Set up event listeners on canvas instance
  useEffect(() => {
    if (!canvas) {
      return;
    }

    canvas.event.on("transform", handleTransform);
    canvas.event.on("zoom", handleZoom);
    canvas.event.on("pan", handlePan);
    canvas.event.on("ready", handleReady);
    canvas.event.on("rulersVisibility", handleRulersVisibilityChange);
    canvas.event.on("gridVisibility", handleGridVisibilityChange);

    return () => {
      canvas.event.off("transform", handleTransform);
      canvas.event.off("zoom", handleZoom);
      canvas.event.off("pan", handlePan);
      canvas.event.off("ready", handleReady);
      canvas.event.off("rulersVisibility", handleRulersVisibilityChange);
      canvas.event.off("gridVisibility", handleGridVisibilityChange);
    };
  }, [canvas, handleTransform, handleZoom, handlePan, handleReady, handleRulersVisibilityChange, handleGridVisibilityChange]);

  // Listen to window messages for state updates
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data.source === "markup-canvas" && event.data.canvasName === canvasName) {
        switch (event.data.action) {
          case "transform":
            handleTransform(event.data.data);
            break;
          case "zoom":
            handleZoom(event.data.data);
            break;
          case "pan":
            handlePan(event.data.data);
            break;
          case "ready":
            handleReady(event.data.data);
            break;
          default:
            break;
        }
      }
    };

    window.addEventListener("message", handleMessage);

    return () => {
      window.removeEventListener("message", handleMessage);
    };
  }, [canvasName, handleTransform, handleZoom, handlePan, handleReady]);

  // Action methods
  const zoomIn = useCallback(
    (factor = 0.5) => {
      canvas?.zoom?.in?.(factor);
    },
    [canvas]
  );

  const zoomOut = useCallback(
    (factor = 0.5) => {
      canvas?.zoom?.out?.(factor);
    },
    [canvas]
  );

  const resetZoom = useCallback(() => {
    canvas?.zoom?.reset?.();
  }, [canvas]);

  const panLeft = useCallback(
    (distance?: number) => {
      canvas?.pan?.left?.(distance);
    },
    [canvas]
  );

  const panRight = useCallback(
    (distance?: number) => {
      canvas?.pan?.right?.(distance);
    },
    [canvas]
  );

  const panUp = useCallback(
    (distance?: number) => {
      canvas?.pan?.up?.(distance);
    },
    [canvas]
  );

  const panDown = useCallback(
    (distance?: number) => {
      canvas?.pan?.down?.(distance);
    },
    [canvas]
  );

  const fitToContent = useCallback(() => {
    canvas?.zoom?.fitToScreen?.();
  }, [canvas]);

  const centerContent = useCallback(() => {
    canvas?.pan?.toCenter?.();
  }, [canvas]);

  const resetView = useCallback(() => {
    canvas?.zoom?.resetToCenter?.();
  }, [canvas]);

  const setTransitionMode = useCallback(
    (enabled: boolean) => {
      canvas?.transition?.set?.(enabled);
    },
    [canvas]
  );

  const toggleTransitionMode = useCallback(() => {
    return canvas?.transition?.toggle?.() ?? false;
  }, [canvas]);

  const updateThemeMode = useCallback(
    (mode: "light" | "dark") => {
      setThemeModeState(mode);
      canvas?.theme?.update?.(mode);
    },
    [canvas]
  );

  const toggleThemeMode = useCallback(() => {
    canvas?.theme?.toggle?.();
  }, [canvas]);

  const showRulers = useCallback(() => {
    canvas?.rulers?.show?.();
  }, [canvas]);

  const hideRulers = useCallback(() => {
    canvas?.rulers?.hide?.();
  }, [canvas]);

  const toggleRulers = useCallback(() => {
    canvas?.rulers?.toggle?.();
  }, [canvas]);

  const areRulersVisible = useCallback(() => {
    return canvas?.rulers?.isVisible?.() ?? false;
  }, [canvas]);

  const showGrid = useCallback(() => {
    canvas?.grid?.show?.();
  }, [canvas]);

  const hideGrid = useCallback(() => {
    canvas?.grid?.hide?.();
  }, [canvas]);

  const toggleGrid = useCallback(() => {
    canvas?.grid?.toggle?.();
  }, [canvas]);

  const isGridVisible = useCallback(() => {
    return canvas?.grid?.isVisible?.() ?? false;
  }, [canvas]);

  return {
    canvas: canvas,
    transform,
    zoom,
    pan,
    isReady,
    zoomIn,
    zoomOut,
    resetZoom,
    panLeft,
    panRight,
    panUp,
    panDown,
    fitToContent,
    centerContent,
    resetView,
    setTransitionMode,
    toggleTransitionMode,
    themeMode,
    updateThemeMode,
    toggleThemeMode,
    toggleRulers,
    showRulers,
    hideRulers,
    areRulersVisible,
    showRulersState,
    toggleGrid,
    showGrid,
    hideGrid,
    isGridVisible,
    showGridState,
  };
}
