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

  const [instance, setInstance] = useState<MarkupCanvas | null>(null);
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

  // Get instance from window binding
  useEffect(() => {
    if (typeof window === "undefined") {
      optionsRef.current.onCanvasUnavailable?.();
      return;
    }

    const windowInstance = (window as unknown as Record<string, unknown>)[canvasName] as MarkupCanvas | undefined;
    if (windowInstance && typeof windowInstance === "object") {
      handleCanvasInstance(windowInstance);
      optionsRef.current.onCanvasReady?.(windowInstance);

      // Set initial state from instance
      if (windowInstance.transform) {
        setTransform(windowInstance.transform);
        setZoom(windowInstance.transform.scale);
        setPan({ x: windowInstance.transform.translateX, y: windowInstance.transform.translateY });
      }

      if (windowInstance.isReady) {
        setIsReady(true);
        optionsRef.current.onReady?.(windowInstance);
      }

      const config = windowInstance.getConfig();
      setThemeModeState(config.themeMode || "light");

      if (windowInstance.areRulersVisible?.()) {
        setShowRulersState(true);
      }
      if (windowInstance.isGridVisible?.()) {
        setShowGridState(true);
      }
    } else {
      optionsRef.current.onCanvasUnavailable?.();
    }
  }, [canvasName, handleCanvasInstance]);

  // Set up event listeners on canvas instance
  useEffect(() => {
    if (!instance) {
      return;
    }

    instance.on("transform", handleTransform);
    instance.on("zoom", handleZoom);
    instance.on("pan", handlePan);
    instance.on("ready", handleReady);

    return () => {
      instance.off("transform", handleTransform);
      instance.off("zoom", handleZoom);
      instance.off("pan", handlePan);
      instance.off("ready", handleReady);
    };
  }, [instance, handleTransform, handleZoom, handlePan, handleReady]);

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
      instance?.zoomIn(factor);
    },
    [instance]
  );

  const zoomOut = useCallback(
    (factor = 0.5) => {
      instance?.zoomOut(factor);
    },
    [instance]
  );

  const resetZoom = useCallback(() => {
    instance?.resetZoom();
  }, [instance]);

  const panLeft = useCallback(
    (distance?: number) => {
      instance?.panLeft(distance);
    },
    [instance]
  );

  const panRight = useCallback(
    (distance?: number) => {
      instance?.panRight(distance);
    },
    [instance]
  );

  const panUp = useCallback(
    (distance?: number) => {
      instance?.panUp(distance);
    },
    [instance]
  );

  const panDown = useCallback(
    (distance?: number) => {
      instance?.panDown(distance);
    },
    [instance]
  );

  const fitToContent = useCallback(() => {
    instance?.fitToScreen();
  }, [instance]);

  const centerContent = useCallback(() => {
    instance?.centerContent();
  }, [instance]);

  const resetView = useCallback(() => {
    instance?.resetView();
  }, [instance]);

  const setTransitionMode = useCallback(
    (enabled: boolean) => {
      instance?.updateConfig({ enableTransition: enabled });
    },
    [instance]
  );

  const toggleTransitionMode = useCallback(() => {
    if (instance) {
      const currentConfig = instance.getConfig();
      const newEnableTransition = !currentConfig.enableTransition;
      instance.updateConfig({ enableTransition: newEnableTransition });
      return newEnableTransition;
    }
    return false;
  }, [instance]);

  const updateThemeMode = useCallback(
    (mode: "light" | "dark") => {
      setThemeModeState(mode);
      instance?.updateThemeMode(mode);
    },
    [instance]
  );

  const toggleThemeMode = useCallback(() => {
    const newMode = themeMode === "light" ? "dark" : "light";
    updateThemeMode(newMode);
    return newMode;
  }, [themeMode, updateThemeMode]);

  const showRulers = useCallback(() => {
    if (instance?.showRulers?.()) {
      setShowRulersState(true);
    }
  }, [instance]);

  const hideRulers = useCallback(() => {
    if (instance?.hideRulers?.()) {
      setShowRulersState(false);
    }
  }, [instance]);

  const toggleRulers = useCallback(() => {
    if (instance?.toggleRulers?.()) {
      setShowRulersState((prev) => !prev);
    }
  }, [instance]);

  const areRulersVisible = useCallback(() => {
    return instance?.areRulersVisible?.() ?? false;
  }, [instance]);

  const showGrid = useCallback(() => {
    if (instance?.showGrid?.()) {
      setShowGridState(true);
    }
  }, [instance]);

  const hideGrid = useCallback(() => {
    if (instance?.hideGrid?.()) {
      setShowGridState(false);
    }
  }, [instance]);

  const toggleGrid = useCallback(() => {
    if (instance?.toggleGrid?.()) {
      setShowGridState((prev) => !prev);
    }
  }, [instance]);

  const isGridVisible = useCallback(() => {
    return instance?.isGridVisible?.() ?? false;
  }, [instance]);

  return {
    canvas: instance,
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
