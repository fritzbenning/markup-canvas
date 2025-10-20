import type { Transform } from "@markup-canvas/core";
import { useCallback, useEffect, useRef, useState } from "react";
import type { UseMarkupCanvasOptions } from "../types/index.js";

interface MarkupCanvasWindowAPI {
  transform: {
    update: (transform: Transform) => void;
    reset: () => void;
  };
  zoom: {
    set: (zoomLevel: number) => void;
    toPoint: (x: number, y: number, zoomLevel: number) => void;
    in: (factor?: number) => void;
    out: (factor?: number) => void;
    reset: () => void;
    resetView: () => void;
    resetViewToCenter: () => void;
  };
  pan: {
    left: (distance?: number) => void;
    right: (distance?: number) => void;
    up: (distance?: number) => void;
    down: (distance?: number) => void;
    toPoint: (x: number, y: number) => void;
    center: () => void;
    fitToScreen: () => void;
  };
  mouseDrag: {
    enable: () => void;
    disable: () => void;
    isEnabled: () => boolean;
  };
  grid: {
    toggle: () => void;
    show: () => void;
    hide: () => void;
    isVisible: () => boolean;
  };
  rulers: {
    toggle: () => void;
    show: () => void;
    hide: () => void;
    isVisible: () => boolean;
  };
  utils: {
    canvasToContent: (x: number, y: number) => { x: number; y: number };
    getVisibleArea: () => Record<string, unknown>;
    isPointVisible: (x: number, y: number) => boolean;
    getBounds: () => Record<string, unknown>;
    getConfig: () => Record<string, unknown>;
    updateConfig: (config: Record<string, unknown>) => void;
    updateThemeMode: (mode: "light" | "dark") => void;
  };
  event: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    on: (event: string, handler: (...args: any[]) => void) => void; // eslint-disable-line @typescript-eslint/no-explicit-any
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    off: (event: string, handler: (...args: any[]) => void) => void; // eslint-disable-line @typescript-eslint/no-explicit-any
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    emit: (event: string, ...args: any[]) => void; // eslint-disable-line @typescript-eslint/no-explicit-any
  };
  lifecycle: {
    cleanup: () => void;
    destroy: () => void;
  };
  state: {
    readonly isReady: boolean;
    readonly isTransforming: boolean;
    readonly visibleBounds: Record<string, unknown>;
    readonly transform: Transform;
  };
  readonly config: Record<string, unknown>;
}

interface UseMarkupCanvasWindowOptions extends Omit<UseMarkupCanvasOptions, "onReady"> {
  canvasName?: string;
  onCanvasReady?: (canvas: MarkupCanvasWindowAPI) => void;
  onCanvasUnavailable?: () => void;
  onReady?: (canvas: MarkupCanvasWindowAPI) => void;
}

export function useMarkupCanvasWindow(options: UseMarkupCanvasWindowOptions = {}) {
  const { canvasName = "markupCanvas" } = options;

  const [instance, setInstance] = useState<MarkupCanvasWindowAPI | null>(null);
  const [transform, setTransform] = useState<Transform>({ scale: 1, translateX: 0, translateY: 0 });
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isReady, setIsReady] = useState(false);
  const [themeMode, setThemeModeState] = useState<"light" | "dark">("light");
  const [showRulersState, setShowRulersState] = useState(false);
  const [showGridState, setShowGridState] = useState(false);

  const optionsRef = useRef(options);
  optionsRef.current = options;

  const handleCanvasInstance = useCallback((canvas: MarkupCanvasWindowAPI) => {
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

  const handleReady = useCallback((canvas: MarkupCanvasWindowAPI) => {
    setIsReady(true);
    optionsRef.current.onReady?.(canvas);
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
      optionsRef.current.onCanvasUnavailable?.();
      return;
    }

    const windowInstance = (window as unknown as Record<string, unknown>)[canvasName] as MarkupCanvasWindowAPI;
    if (windowInstance && typeof windowInstance === "object") {
      handleCanvasInstance(windowInstance);
      optionsRef.current.onCanvasReady?.(windowInstance);

      // Set initial state from instance
      if (windowInstance.state?.transform) {
        const transform = windowInstance.state.transform;
        setTransform(transform);
        setZoom(transform.scale);
        setPan({ x: transform.translateX, y: transform.translateY });
      }

      if (windowInstance.state?.isReady) {
        setIsReady(true);
        optionsRef.current.onReady?.(windowInstance);
      }

      const config = windowInstance.config;
      setThemeModeState((config?.themeMode as "light" | "dark" | undefined) || "light");

      if (windowInstance.rulers?.isVisible?.()) {
        setShowRulersState(true);
      }
      if (windowInstance.grid?.isVisible?.()) {
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

    instance.event.on("transform", handleTransform);
    instance.event.on("zoom", handleZoom);
    instance.event.on("pan", handlePan);
    instance.event.on("ready", handleReady);
    instance.event.on("rulersVisibility", handleRulersVisibilityChange);
    instance.event.on("gridVisibility", handleGridVisibilityChange);

    return () => {
      instance.event.off("transform", handleTransform);
      instance.event.off("zoom", handleZoom);
      instance.event.off("pan", handlePan);
      instance.event.off("ready", handleReady);
      instance.event.off("rulersVisibility", handleRulersVisibilityChange);
      instance.event.off("gridVisibility", handleGridVisibilityChange);
    };
  }, [instance, handleTransform, handleZoom, handlePan, handleReady, handleRulersVisibilityChange, handleGridVisibilityChange]);

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
      instance?.zoom?.in?.(factor);
    },
    [instance]
  );

  const zoomOut = useCallback(
    (factor = 0.5) => {
      instance?.zoom?.out?.(factor);
    },
    [instance]
  );

  const resetZoom = useCallback(() => {
    instance?.zoom?.reset?.();
  }, [instance]);

  const panLeft = useCallback(
    (distance?: number) => {
      instance?.pan?.left?.(distance);
    },
    [instance]
  );

  const panRight = useCallback(
    (distance?: number) => {
      instance?.pan?.right?.(distance);
    },
    [instance]
  );

  const panUp = useCallback(
    (distance?: number) => {
      instance?.pan?.up?.(distance);
    },
    [instance]
  );

  const panDown = useCallback(
    (distance?: number) => {
      instance?.pan?.down?.(distance);
    },
    [instance]
  );

  const fitToContent = useCallback(() => {
    instance?.pan?.fitToScreen?.();
  }, [instance]);

  const centerContent = useCallback(() => {
    instance?.pan?.center?.();
  }, [instance]);

  const resetView = useCallback(() => {
    instance?.zoom?.resetView?.();
  }, [instance]);

  const setTransitionMode = useCallback(
    (enabled: boolean) => {
      instance?.utils?.updateConfig?.({ enableTransition: enabled });
    },
    [instance]
  );

  const toggleTransitionMode = useCallback(() => {
    if (instance) {
      const currentConfig = instance.config;
      const newEnableTransition = !currentConfig?.enableTransition;
      instance.utils?.updateConfig?.({ enableTransition: newEnableTransition });
      return newEnableTransition;
    }
    return false;
  }, [instance]);

  const updateThemeMode = useCallback(
    (mode: "light" | "dark") => {
      setThemeModeState(mode);
      instance?.utils?.updateThemeMode?.(mode);
    },
    [instance]
  );

  const toggleThemeMode = useCallback(() => {
    const newMode = themeMode === "light" ? "dark" : "light";
    updateThemeMode(newMode);
    return newMode;
  }, [themeMode, updateThemeMode]);

  const showRulers = useCallback(() => {
    instance?.rulers?.show?.();
  }, [instance]);

  const hideRulers = useCallback(() => {
    instance?.rulers?.hide?.();
  }, [instance]);

  const toggleRulers = useCallback(() => {
    instance?.rulers?.toggle?.();
  }, [instance]);

  const areRulersVisible = useCallback(() => {
    return instance?.rulers?.isVisible?.() ?? false;
  }, [instance]);

  const showGrid = useCallback(() => {
    instance?.grid?.show?.();
  }, [instance]);

  const hideGrid = useCallback(() => {
    instance?.grid?.hide?.();
  }, [instance]);

  const toggleGrid = useCallback(() => {
    instance?.grid?.toggle?.();
  }, [instance]);

  const isGridVisible = useCallback(() => {
    return instance?.grid?.isVisible?.() ?? false;
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
