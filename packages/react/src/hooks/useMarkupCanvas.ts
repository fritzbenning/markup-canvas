import { MarkupCanvas, type MarkupCanvasConfig, type Transform } from "@markup-canvas/core";
import { type RefObject, useCallback, useEffect, useRef, useState } from "react";
import type { UseMarkupCanvasOptions, UseMarkupCanvasReturn } from "../types/index";

export interface UseMarkupCanvasHookOptions extends UseMarkupCanvasOptions {
  /** Ref to the DOM element that will host the canvas (the same wrapper `MarkupCanvas` uses). */
  containerRef: RefObject<HTMLElement | null>;
  /** Passed to `new MarkupCanvas(container, config)`. Remounts when its JSON snapshot changes (see mount effect). */
  config: MarkupCanvasConfig;
}

export function useMarkupCanvas(options: UseMarkupCanvasHookOptions): UseMarkupCanvasReturn {
  const { containerRef, config } = options;

  const configRef = useRef(config);
  configRef.current = config;

  const configKey = JSON.stringify(config);

  const [canvas, setCanvas] = useState<MarkupCanvas | null>(null);
  const [transform, setTransform] = useState<Transform>({ scale: 1, translateX: 0, translateY: 0 });
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isReady, setIsReady] = useState(false);
  const [transitionEnabled, setTransitionEnabled] = useState(() => config.enableTransition ?? true);
  const [requireSpaceForMouseDrag, setRequireSpaceForMouseDragState] = useState(
    () => config.requireSpaceForMouseDrag ?? false,
  );
  const [enableClickToZoom, setEnableClickToZoomState] = useState(() => config.enableClickToZoom ?? true);
  const [requireOptionForClickZoom, setRequireOptionForClickZoomState] = useState(
    () => config.requireOptionForClickZoom ?? false,
  );
  const [themeMode, setThemeMode] = useState<"light" | "dark">("light");
  const [rulersVisible, setRulersVisible] = useState(false);
  const [gridVisible, setGridVisible] = useState(false);

  const optionsRef = useRef(options);
  optionsRef.current = options;

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

  const handleRulersVisibilityChange = useCallback((isVisible: boolean) => {
    setRulersVisible(isVisible);
  }, []);

  const handleGridVisibilityChange = useCallback((isVisible: boolean) => {
    setGridVisible(isVisible);
  }, []);

  const initCanvas = useCallback((instance: MarkupCanvas) => {
    setIsReady(true);
    const t = instance.transform;
    setTransform(t);
    setZoom(t.scale);
    setPan({ x: t.translateX, y: t.translateY });
    setTransitionEnabled(instance.config.enableTransition);
    setRequireSpaceForMouseDragState(instance.config.requireSpaceForMouseDrag);
    setEnableClickToZoomState(instance.config.enableClickToZoom);
    setRequireOptionForClickZoomState(instance.config.requireOptionForClickZoom);
    setThemeMode(instance.config.themeMode);
    setRulersVisible(instance.areRulersVisible());
    setGridVisible(instance.isGridVisible());
    optionsRef.current.onReady?.(instance);
  }, []);

  useEffect(() => {
    const el = containerRef.current;

    if (!el) {
      return;
    }

    const instance = new MarkupCanvas(el, configRef.current);
    setCanvas(instance);

    instance.on("transform", handleTransform);
    instance.on("zoom", handleZoom);
    instance.on("pan", handlePan);
    instance.on("rulersVisibility", handleRulersVisibilityChange);
    instance.on("gridVisibility", handleGridVisibilityChange);
    instance.on("ready", initCanvas);

    if (instance.isReady) {
      initCanvas(instance);
    }

    if (instance.container && typeof instance.container.focus === "function") {
      instance.container.focus();
    }

    return () => {
      instance.off("transform", handleTransform);
      instance.off("zoom", handleZoom);
      instance.off("pan", handlePan);
      instance.off("rulersVisibility", handleRulersVisibilityChange);
      instance.off("gridVisibility", handleGridVisibilityChange);
      instance.off("ready", initCanvas);
      instance.cleanup();
      setCanvas(null);
      setIsReady(false);
    };
  }, [
    configKey,
    containerRef,
    handleTransform,
    handleZoom,
    handlePan,
    handleRulersVisibilityChange,
    handleGridVisibilityChange,
    initCanvas,
  ]);

  const postMessageIdentifier = config.name ?? "markupCanvas";

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const handleMessage = (event: MessageEvent) => {
      if (event.data.source === "markup-canvas" && event.data.canvasName === postMessageIdentifier) {
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
            setIsReady(true);
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
  }, [postMessageIdentifier, handleTransform, handleZoom, handlePan]);

  const zoomIn = useCallback(
    (factor = 0.5) => {
      canvas?.zoomIn(factor);
    },
    [canvas]
  );

  const zoomOut = useCallback(
    (factor = 0.5) => {
      canvas?.zoomOut(factor);
    },
    [canvas]
  );

  const resetZoom = useCallback(() => {
    canvas?.resetZoom();
  }, [canvas]);

  const panLeft = useCallback(
    (distance?: number) => {
      canvas?.panLeft(distance);
    },
    [canvas]
  );

  const panRight = useCallback(
    (distance?: number) => {
      canvas?.panRight(distance);
    },
    [canvas]
  );

  const panUp = useCallback(
    (distance?: number) => {
      canvas?.panUp(distance);
    },
    [canvas]
  );

  const panDown = useCallback(
    (distance?: number) => {
      canvas?.panDown(distance);
    },
    [canvas]
  );

  const fitToScreen = useCallback(() => {
    canvas?.fitToScreen();
  }, [canvas]);

  const centerContent = useCallback(() => {
    canvas?.centerContent();
  }, [canvas]);

  const panToPoint = useCallback(
    (x: number, y: number) => {
      canvas?.panToPoint(x, y);
    },
    [canvas]
  );

  const reset = useCallback(() => {
    canvas?.reset();
  }, [canvas]);

  const setTransitionMode = useCallback(
    (enabled: boolean) => {
      canvas?.updateTransition(enabled);
      setTransitionEnabled(enabled);
    },
    [canvas]
  );

  const toggleTransitionMode = useCallback(() => {
    if (!canvas) {
      return false;
    }
    const next = canvas.toggleTransitionMode();
    setTransitionEnabled(next);
    return next;
  }, [canvas]);

  const setRequireSpaceForMouseDrag = useCallback(
    (enabled: boolean) => {
      canvas?.updateRequireSpaceForMouseDrag(enabled);
      setRequireSpaceForMouseDragState(enabled);
    },
    [canvas]
  );

  const setEnableClickToZoom = useCallback(
    (enabled: boolean) => {
      canvas?.updateEnableClickToZoom(enabled);
      setEnableClickToZoomState(enabled);
    },
    [canvas]
  );

  const setRequireOptionForClickZoom = useCallback(
    (enabled: boolean) => {
      canvas?.updateRequireOptionForClickZoom(enabled);
      setRequireOptionForClickZoomState(enabled);
    },
    [canvas]
  );

  const updateThemeMode = useCallback(
    (mode: "light" | "dark") => {
      setThemeMode(mode);
      canvas?.updateThemeMode(mode);
    },
    [canvas]
  );

  const toggleThemeMode = useCallback(() => {
    if (!canvas) {
      return "light";
    }
    const newMode = canvas.toggleThemeMode();

    setThemeMode(newMode);
    return newMode;
  }, [canvas]);

  const showRulers = useCallback(() => {
    canvas?.showRulers();
  }, [canvas]);

  const hideRulers = useCallback(() => {
    canvas?.hideRulers();
  }, [canvas]);

  const toggleRulers = useCallback(() => {
    canvas?.toggleRulers();
  }, [canvas]);

  const areRulersVisible = useCallback(() => {
    return canvas?.areRulersVisible() ?? false;
  }, [canvas]);

  const showGrid = useCallback(() => {
    canvas?.showGrid();
  }, [canvas]);

  const hideGrid = useCallback(() => {
    canvas?.hideGrid();
  }, [canvas]);

  const toggleGrid = useCallback(() => {
    canvas?.toggleGrid();
  }, [canvas]);

  const isGridVisible = useCallback(() => {
    return canvas?.isGridVisible() ?? false;
  }, [canvas]);

  return {
    canvas,
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
    panToPoint,
    fitToScreen,
    centerContent,
    reset,
    transitionEnabled,
    setTransitionMode,
    toggleTransitionMode,
    requireSpaceForMouseDrag,
    setRequireSpaceForMouseDrag,
    enableClickToZoom,
    setEnableClickToZoom,
    requireOptionForClickZoom,
    setRequireOptionForClickZoom,
    themeMode,
    updateThemeMode,
    toggleThemeMode,
    toggleRulers,
    showRulers,
    hideRulers,
    areRulersVisible,
    rulersVisible,
    toggleGrid,
    showGrid,
    hideGrid,
    isGridVisible,
    gridVisible,
  };
}
