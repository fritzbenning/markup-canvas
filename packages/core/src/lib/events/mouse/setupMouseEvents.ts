import { handleKeyDown } from "@/lib/events/keyboard/handlers/handleKeyDown";
import { handleKeyUp } from "@/lib/events/keyboard/handlers/handleKeyUp";
import { updateCursor } from "@/lib/events/mouse/cursor/updateCursor";
import { handleMouseDown } from "@/lib/events/mouse/handlers/handleMouseDown";
import { handleMouseLeave } from "@/lib/events/mouse/handlers/handleMouseLeave";
import { handleMouseMove } from "@/lib/events/mouse/handlers/handleMouseMove";
import { handleMouseUp } from "@/lib/events/mouse/handlers/handleMouseUp";
import { resetDragState } from "@/lib/events/shared/resetDragState";
import type { MarkupCanvas } from "@/lib/MarkupCanvas";
import type { MouseDragControls } from "@/types/events";
import type { MarkupCanvasConfig } from "@/types/index";

/**
 * Registers mouse and optional keyboard listeners for pan, click-to-zoom, and space-to-pan.
 *
 * Listeners attach to `canvas.container` and `document` as needed. When `withControls` is `true`,
 * returns enable/disable API plus `cleanup`; otherwise returns a single `cleanup` function.
 *
 * @param canvas - Canvas instance (uses `container`).
 * @param config - Resolved config.
 * @param withControls - When `true`, expose drag enable/disable; when `false`, only return `cleanup`.
 * @returns Drag controls with `cleanup`, or only `cleanup` when `withControls` is `false`.
 *
 * @example
 * ```ts
 * const drag = setupMouseEvents(canvas, config, true);
 * drag.cleanup();
 * ```
 */
export function setupMouseEvents(
  canvas: MarkupCanvas,
  _config: Required<MarkupCanvasConfig>,
  withControls: true,
): MouseDragControls;
export function setupMouseEvents(
  canvas: MarkupCanvas,
  _config: Required<MarkupCanvasConfig>,
  withControls: false,
): () => void;
export function setupMouseEvents(
  canvas: MarkupCanvas,
  _config: Required<MarkupCanvasConfig>,
  withControls: boolean = true,
): MouseDragControls | (() => void) {
  // State management
  let isDragEnabled = true;
  let isDragging = false;
  let lastMouseX = 0;
  let lastMouseY = 0;
  let dragButton = -1;
  let isSpacePressed = false;

  // Click-to-zoom tracking
  let mouseDownTime = 0;
  let mouseDownX = 0;
  let mouseDownY = 0;
  let hasDragged = false;

  // State setters for passing to functions
  const setters = {
    setIsDragging: (value: boolean) => {
      isDragging = value;
    },
    setDragButton: (value: number) => {
      dragButton = value;
    },
    setIsSpacePressed: (value: boolean) => {
      isSpacePressed = value;
    },
    setMouseDownTime: (value: number) => {
      mouseDownTime = value;
    },
    setMouseDownX: (value: number) => {
      mouseDownX = value;
    },
    setMouseDownY: (value: number) => {
      mouseDownY = value;
    },
    setHasDragged: (value: boolean) => {
      hasDragged = value;
    },
    setLastMouseX: (value: number) => {
      lastMouseX = value;
    },
    setLastMouseY: (value: number) => {
      lastMouseY = value;
    },
  };

  // Event handler wrappers
  const keyDownHandler = (event: KeyboardEvent) => {
    handleKeyDown(event, canvas, canvas.config, isDragEnabled, isDragging, {
      setIsSpacePressed: setters.setIsSpacePressed,
    });
  };

  const keyUpHandler = (event: KeyboardEvent) => {
    handleKeyUp(event, canvas, canvas.config, isDragEnabled, isDragging, {
      setIsSpacePressed: setters.setIsSpacePressed,
      setIsDragging: setters.setIsDragging,
      setDragButton: setters.setDragButton,
    });
  };

  const mouseDownHandler = (event: MouseEvent) => {
    handleMouseDown(event, canvas, canvas.config, isDragEnabled, isSpacePressed, setters);
  };

  const mouseMoveHandler = (event: MouseEvent) => {
    handleMouseMove(
      event,
      canvas,
      canvas.config,
      isDragEnabled,
      isDragging,
      isSpacePressed,
      mouseDownTime,
      mouseDownX,
      mouseDownY,
      lastMouseX,
      lastMouseY,
      {
        setHasDragged: setters.setHasDragged,
        setIsDragging: setters.setIsDragging,
        setLastMouseX: setters.setLastMouseX,
        setLastMouseY: setters.setLastMouseY,
      },
    );
  };

  const mouseUpHandler = (event: MouseEvent) => {
    handleMouseUp(
      event,
      canvas,
      canvas.config,
      isDragEnabled,
      isSpacePressed,
      isDragging,
      dragButton,
      mouseDownTime,
      hasDragged,
      {
        setIsDragging: setters.setIsDragging,
        setDragButton: setters.setDragButton,
        setMouseDownTime: setters.setMouseDownTime,
        setHasDragged: setters.setHasDragged,
      },
    );
  };

  const mouseLeaveHandler = () => {
    handleMouseLeave(canvas, canvas.config, isDragEnabled, isSpacePressed, isDragging, {
      setIsDragging: setters.setIsDragging,
      setDragButton: setters.setDragButton,
    });
  };

  // Set up event listeners
  canvas.container.addEventListener("mousedown", mouseDownHandler);
  document.addEventListener("mousemove", mouseMoveHandler);
  document.addEventListener("mouseup", mouseUpHandler);
  canvas.container.addEventListener("mouseleave", mouseLeaveHandler);

  document.addEventListener("keydown", keyDownHandler);
  document.addEventListener("keyup", keyUpHandler);

  updateCursor(canvas, canvas.config, isDragEnabled, isSpacePressed, isDragging);

  const cleanup = () => {
    canvas.container.removeEventListener("mousedown", mouseDownHandler);
    document.removeEventListener("mousemove", mouseMoveHandler);
    document.removeEventListener("mouseup", mouseUpHandler);
    canvas.container.removeEventListener("mouseleave", mouseLeaveHandler);

    document.removeEventListener("keydown", keyDownHandler);
    document.removeEventListener("keyup", keyUpHandler);
  };

  if (withControls) {
    return {
      cleanup,
      enable: () => {
        isDragEnabled = true;
        updateCursor(canvas, canvas.config, isDragEnabled, isSpacePressed, isDragging);
        return true;
      },
      disable: () => {
        isDragEnabled = false;
        // Stop any current dragging
        if (isDragging) {
          resetDragState(canvas, canvas.config, isDragEnabled, isSpacePressed, {
            setIsDragging: setters.setIsDragging,
            setDragButton: setters.setDragButton,
          });
        }
        updateCursor(canvas, canvas.config, isDragEnabled, isSpacePressed, isDragging);
        return true;
      },
      isEnabled: () => isDragEnabled,
    };
  }

  return cleanup;
}
