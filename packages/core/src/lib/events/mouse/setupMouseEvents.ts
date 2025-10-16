import { handleKeyDown } from "@/lib/events/keyboard/handleKeyDown.js";
import { handleKeyUp } from "@/lib/events/keyboard/handleKeyUp.js";
import { handleMouseDown } from "@/lib/events/mouse/handleMouseDown.js";
import { handleMouseLeave } from "@/lib/events/mouse/handleMouseLeave.js";
import { handleMouseMove } from "@/lib/events/mouse/handleMouseMove.js";
import { handleMouseUp } from "@/lib/events/mouse/handleMouseUp.js";
import { resetDragState } from "@/lib/events/utils/resetDragState.js";
import { updateCursor } from "@/lib/events/utils/updateCursor.js";
import type { MouseDragControls } from "@/types/events.js";
import type { Canvas, MarkupCanvasConfig } from "@/types/index.js";

export function setupMouseEvents(canvas: Canvas, config: Required<MarkupCanvasConfig>, withControls: true): MouseDragControls;
export function setupMouseEvents(canvas: Canvas, config: Required<MarkupCanvasConfig>, withControls: false): () => void;
export function setupMouseEvents(
  canvas: Canvas,
  config: Required<MarkupCanvasConfig>,
  withControls: boolean = true
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
    handleKeyDown(event, canvas, config, isDragEnabled, isDragging, {
      setIsSpacePressed: setters.setIsSpacePressed,
    });
  };

  const keyUpHandler = (event: KeyboardEvent) => {
    handleKeyUp(event, canvas, config, isDragEnabled, isDragging, {
      setIsSpacePressed: setters.setIsSpacePressed,
      setIsDragging: setters.setIsDragging,
      setDragButton: setters.setDragButton,
    });
  };

  const mouseDownHandler = (event: MouseEvent) => {
    handleMouseDown(event, canvas, config, isDragEnabled, isSpacePressed, setters);
  };

  const mouseMoveHandler = (event: MouseEvent) => {
    handleMouseMove(event, canvas, isDragEnabled, isDragging, mouseDownTime, mouseDownX, mouseDownY, lastMouseX, lastMouseY, {
      setHasDragged: setters.setHasDragged,
      setIsDragging: setters.setIsDragging,
      setLastMouseX: setters.setLastMouseX,
      setLastMouseY: setters.setLastMouseY,
    });
  };

  const mouseUpHandler = (event: MouseEvent) => {
    handleMouseUp(event, canvas, config, isDragEnabled, isSpacePressed, isDragging, dragButton, mouseDownTime, hasDragged, {
      setIsDragging: setters.setIsDragging,
      setDragButton: setters.setDragButton,
      setMouseDownTime: setters.setMouseDownTime,
      setHasDragged: setters.setHasDragged,
    });
  };

  const mouseLeaveHandler = () => {
    handleMouseLeave(canvas, config, isDragEnabled, isSpacePressed, isDragging, {
      setIsDragging: setters.setIsDragging,
      setDragButton: setters.setDragButton,
    });
  };

  // Set up event listeners
  canvas.container.addEventListener("mousedown", mouseDownHandler);
  document.addEventListener("mousemove", mouseMoveHandler);
  document.addEventListener("mouseup", mouseUpHandler);
  canvas.container.addEventListener("mouseleave", mouseLeaveHandler);

  if (config.requireSpaceForMouseDrag) {
    document.addEventListener("keydown", keyDownHandler);
    document.addEventListener("keyup", keyUpHandler);
  }

  updateCursor(canvas, config, isDragEnabled, isSpacePressed, isDragging);

  const cleanup = () => {
    canvas.container.removeEventListener("mousedown", mouseDownHandler);
    document.removeEventListener("mousemove", mouseMoveHandler);
    document.removeEventListener("mouseup", mouseUpHandler);
    canvas.container.removeEventListener("mouseleave", mouseLeaveHandler);

    if (config.requireSpaceForMouseDrag) {
      document.removeEventListener("keydown", keyDownHandler);
      document.removeEventListener("keyup", keyUpHandler);
    }
  };

  if (withControls) {
    return {
      cleanup,
      enable: () => {
        isDragEnabled = true;
        updateCursor(canvas, config, isDragEnabled, isSpacePressed, isDragging);
        return true;
      },
      disable: () => {
        isDragEnabled = false;
        // Stop any current dragging
        if (isDragging) {
          resetDragState(canvas, config, isDragEnabled, isSpacePressed, {
            setIsDragging: setters.setIsDragging,
            setDragButton: setters.setDragButton,
          });
        }
        updateCursor(canvas, config, isDragEnabled, isSpacePressed, isDragging);
        return true;
      },
      isEnabled: () => isDragEnabled,
    };
  }

  return cleanup;
}
