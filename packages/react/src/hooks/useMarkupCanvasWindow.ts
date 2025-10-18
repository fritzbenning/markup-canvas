import type { MarkupCanvas, Transform } from "@markup-canvas/core";
import { useCallback, useEffect, useRef, useState } from "react";
import type { UseMarkupCanvasOptions } from "../types/index.js";

interface UseMarkupCanvasWindowOptions extends UseMarkupCanvasOptions {
  canvasName?: string;
  onCanvasReady?: (canvas: MarkupCanvas) => void;
  onCanvasUnavailable?: () => void;
}

export function useMarkupCanvasWindow(options: UseMarkupCanvasWindowOptions = {}) {
  const { canvasName = "markupCanvas" } = options;

  const [canvasInstance, setCanvasInstance] = useState<MarkupCanvas | null>(null);
  const [transform, setTransform] = useState<Transform>({ scale: 1, translateX: 0, translateY: 0 });
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isReady, setIsReady] = useState(false);
  const [themeMode, setThemeModeState] = useState<"light" | "dark">("light");
  const [showRulersState, setShowRulersState] = useState(false);
  const [showGridState, setShowGridState] = useState(false);

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

  // Get instance from window binding
  useEffect(() => {
    if (typeof window === "undefined") {
      optionsRef.current.onCanvasUnavailable?.();
      return;
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const instance = (window as any)[canvasName] as MarkupCanvas | undefined;
    if (instance && typeof instance === "object") {
      handleCanvasInstance(instance);
      optionsRef.current.onCanvasReady?.(instance);

      // Set initial state from instance
      if (instance.transform) {
        setTransform(instance.transform);
        setZoom(instance.transform.scale);
        setPan({ x: instance.transform.translateX, y: instance.transform.translateY });
      }

      if (instance.isReady) {
        setIsReady(true);
        optionsRef.current.onReady?.(instance);
      }

      const config = instance.getConfig();
      setThemeModeState(config.themeMode || "light");

      if (instance.areRulersVisible?.()) {
        setShowRulersState(true);
      }
      if (instance.isGridVisible?.()) {
        setShowGridState(true);
      }
    } else {
      optionsRef.current.onCanvasUnavailable?.();
    }
  }, [canvasName, handleCanvasInstance]);

  // Set up event listeners on canvas instance
  useEffect(() => {
    if (!canvasInstance) {
      return;
    }

    canvasInstance.on("transform", handleTransform);
    canvasInstance.on("zoom", handleZoom);
    canvasInstance.on("pan", handlePan);
    canvasInstance.on("ready", handleReady);

    return () => {
      canvasInstance.off("transform", handleTransform);
      canvasInstance.off("zoom", handleZoom);
      canvasInstance.off("pan", handlePan);
      canvasInstance.off("ready", handleReady);
    };
  }, [canvasInstance, handleTransform, handleZoom, handlePan, handleReady]);

  // Listen to window messages for state updates
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data.source === "markup-canvas" && event.data.canvasName === canvasName) {
        switch (event.data.event) {
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
      canvasInstance?.zoomIn(factor);
    },
    [canvasInstance]
  );

  const zoomOut = useCallback(
    (factor = 0.5) => {
      canvasInstance?.zoomOut(factor);
    },
    [canvasInstance]
  );

  const resetZoom = useCallback(() => {
    canvasInstance?.resetZoom();
  }, [canvasInstance]);

  const panLeft = useCallback(
    (distance?: number) => {
      canvasInstance?.panLeft(distance);
    },
    [canvasInstance]
  );

  const panRight = useCallback(
    (distance?: number) => {
      canvasInstance?.panRight(distance);
    },
    [canvasInstance]
  );

  const panUp = useCallback(
    (distance?: number) => {
      canvasInstance?.panUp(distance);
    },
    [canvasInstance]
  );

  const panDown = useCallback(
    (distance?: number) => {
      canvasInstance?.panDown(distance);
    },
    [canvasInstance]
  );

  const fitToContent = useCallback(() => {
    canvasInstance?.fitToScreen();
  }, [canvasInstance]);

  const centerContent = useCallback(() => {
    canvasInstance?.centerContent();
  }, [canvasInstance]);

  const resetView = useCallback(() => {
    canvasInstance?.resetView();
  }, [canvasInstance]);

  const setTransitionMode = useCallback(
    (enabled: boolean) => {
      canvasInstance?.updateConfig({ enableTransition: enabled });
    },
    [canvasInstance]
  );

  const toggleTransitionMode = useCallback(() => {
    if (canvasInstance) {
      const currentConfig = canvasInstance.getConfig();
      const newEnableTransition = !currentConfig.enableTransition;
      canvasInstance.updateConfig({ enableTransition: newEnableTransition });
      return newEnableTransition;
    }
    return false;
  }, [canvasInstance]);

  const updateThemeMode = useCallback(
    (mode: "light" | "dark") => {
      setThemeModeState(mode);
      canvasInstance?.updateThemeMode(mode);
    },
    [canvasInstance]
  );

  const toggleThemeMode = useCallback(() => {
    const newMode = themeMode === "light" ? "dark" : "light";
    updateThemeMode(newMode);
    return newMode;
  }, [themeMode, updateThemeMode]);

  const showRulers = useCallback(() => {
    if (canvasInstance?.showRulers?.()) {
      setShowRulersState(true);
    }
  }, [canvasInstance]);

  const hideRulers = useCallback(() => {
    if (canvasInstance?.hideRulers?.()) {
      setShowRulersState(false);
    }
  }, [canvasInstance]);

  const toggleRulers = useCallback(() => {
    if (canvasInstance?.toggleRulers?.()) {
      setShowRulersState((prev) => !prev);
    }
  }, [canvasInstance]);

  const areRulersVisible = useCallback(() => {
    return canvasInstance?.areRulersVisible?.() ?? false;
  }, [canvasInstance]);

  const showGrid = useCallback(() => {
    if (canvasInstance?.showGrid?.()) {
      setShowGridState(true);
    }
  }, [canvasInstance]);

  const hideGrid = useCallback(() => {
    if (canvasInstance?.hideGrid?.()) {
      setShowGridState(false);
    }
  }, [canvasInstance]);

  const toggleGrid = useCallback(() => {
    if (canvasInstance?.toggleGrid?.()) {
      setShowGridState((prev) => !prev);
    }
  }, [canvasInstance]);

  const isGridVisible = useCallback(() => {
    return canvasInstance?.isGridVisible?.() ?? false;
  }, [canvasInstance]);

  return {
    canvas: canvasInstance,
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
