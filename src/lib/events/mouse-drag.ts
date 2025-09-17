import type {
  EventCanvas as Canvas,
  ClickState,
  DragState,
  MouseDragOptions,
  Transform,
} from "../../types/index.js";
import { disableSmoothTransitions, enableSmoothTransitions } from "../transform/index.js";
import { CLICK_THRESHOLDS, DEFAULT_MOUSE_DRAG_CONFIG } from "./constants.js";

// Sets up mouse drag functionality for a canvas
export function setupMouseDrag(canvas: Canvas, options: MouseDragOptions = {}): () => void {
  const config: Required<MouseDragOptions> = {
    ...DEFAULT_MOUSE_DRAG_CONFIG,
    ...options,
  };

  const dragState: DragState = {
    isDragging: false,
    lastMouseX: 0,
    lastMouseY: 0,
    dragButton: -1,
    isSpacePressed: false,
  };

  const clickState: ClickState = {
    mouseDownTime: 0,
    mouseDownX: 0,
    mouseDownY: 0,
    hasDragged: false,
  };

  // Cursor management utilities
  const updateCursor = (cursor: string) => {
    canvas.container.style.cursor = cursor;
  };

  const getCursorForState = (): string => {
    if (dragState.isDragging) return "grabbing";
    if (config.requireSpaceForMouseDrag && dragState.isSpacePressed) return "grab";
    return "default";
  };

  const resetDragState = () => {
    dragState.isDragging = false;
    dragState.dragButton = -1;
    updateCursor(getCursorForState());
  };

  const resetClickState = () => {
    clickState.mouseDownTime = 0;
    clickState.hasDragged = false;
  };

  // Set initial cursor state
  updateCursor(getCursorForState());

  function handleKeyDown(event: KeyboardEvent): void {
    if (config.requireSpaceForMouseDrag && event.key === " ") {
      dragState.isSpacePressed = true;
      updateCursor(getCursorForState());
    }
  }

  function handleKeyUp(event: KeyboardEvent): void {
    if (config.requireSpaceForMouseDrag && event.key === " ") {
      dragState.isSpacePressed = false;
      // Stop dragging if currently dragging
      if (dragState.isDragging) {
        resetDragState();
      } else {
        updateCursor(getCursorForState());
      }
    }
  }

  function handleMouseDown(event: MouseEvent): void {
    const isLeftButton = event.button === 0;
    const isMiddleButton = event.button === 1;

    // Track mouse down for click-to-zoom detection
    if (isLeftButton) {
      clickState.mouseDownTime = Date.now();
      clickState.mouseDownX = event.clientX;
      clickState.mouseDownY = event.clientY;
      clickState.hasDragged = false;
    }

    // Check if drag is allowed based on configuration
    const canDrag = config.requireSpaceForMouseDrag ? dragState.isSpacePressed : true;
    const isDragButton =
      (isLeftButton && config.enableLeftDrag) || (isMiddleButton && config.enableMiddleDrag);

    if (canDrag && isDragButton) {
      event.preventDefault();
      dragState.isDragging = true;
      dragState.dragButton = event.button;
      dragState.lastMouseX = event.clientX;
      dragState.lastMouseY = event.clientY;

      updateCursor("grabbing");
      disableSmoothTransitions(canvas.transformLayer);
    }
  }

  const updateClickDragState = (clientX: number, clientY: number) => {
    if (clickState.mouseDownTime > 0) {
      const deltaX = Math.abs(clientX - clickState.mouseDownX);
      const deltaY = Math.abs(clientY - clickState.mouseDownY);
      if (deltaX > CLICK_THRESHOLDS.MAX_MOVEMENT || deltaY > CLICK_THRESHOLDS.MAX_MOVEMENT) {
        clickState.hasDragged = true;
      }
    }
  };

  function handleMouseMove(event: MouseEvent): void {
    updateClickDragState(event.clientX, event.clientY);

    if (!dragState.isDragging) return;

    event.preventDefault();

    const deltaX = event.clientX - dragState.lastMouseX;
    const deltaY = event.clientY - dragState.lastMouseY;

    const newTransform: Partial<Transform> = {
      translateX: canvas.transform.translateX + deltaX,
      translateY: canvas.transform.translateY + deltaY,
    };

    canvas.updateTransform(newTransform);

    dragState.lastMouseX = event.clientX;
    dragState.lastMouseY = event.clientY;
  }

  const handleClickToZoom = (event: MouseEvent) => {
    const clickDuration = Date.now() - clickState.mouseDownTime;
    const shouldZoom = config.requireOptionForClickZoom ? event.altKey : true;

    // Only handle quick clicks that haven't dragged and meet key requirements
    if (
      clickDuration < CLICK_THRESHOLDS.MAX_DURATION &&
      !clickState.hasDragged &&
      !dragState.isDragging &&
      shouldZoom
    ) {
      event.preventDefault();

      // Get click position relative to canvas
      const rect = canvas.container.getBoundingClientRect();
      const clickX = event.clientX - rect.left;
      const clickY = event.clientY - rect.top;

      // Convert canvas coordinates to content coordinates at current scale
      const contentCoords = canvas.canvasToContent(clickX, clickY);

      // Calculate the center of the canvas
      const canvasCenterX = rect.width / 2;
      const canvasCenterY = rect.height / 2;

      // Calculate the new transform to zoom and center the clicked point
      const newScale = config.clickZoomLevel;
      const newTranslateX = canvasCenterX - contentCoords.x * newScale;
      const newTranslateY = canvasCenterY - contentCoords.y * newScale;

      const newTransform: Partial<Transform> = {
        scale: newScale,
        translateX: newTranslateX,
        translateY: newTranslateY,
      };

      // Enable smooth transitions for click-to-zoom
      const duration = config.clickZoomDuration / 1000; // Convert to seconds
      enableSmoothTransitions(canvas.transformLayer, duration);

      canvas.updateTransform(newTransform);

      // Disable transitions after animation completes
      setTimeout(() => {
        if (canvas.transformLayer) {
          disableSmoothTransitions(canvas.transformLayer);
        }
      }, config.clickZoomDuration + 50);
    }
  };

  function handleMouseUp(event: MouseEvent): void {
    if (dragState.isDragging && event.button === dragState.dragButton) {
      resetDragState();
    }

    // Handle click-to-zoom for left button
    if (event.button === 0 && config.enableClickToZoom && clickState.mouseDownTime > 0) {
      handleClickToZoom(event);
    }

    // Reset click tracking
    if (event.button === 0) {
      resetClickState();
    }
  }

  function handleMouseLeave(): void {
    if (dragState.isDragging) {
      resetDragState();
    }
  }

  canvas.container.addEventListener("mousedown", handleMouseDown);
  document.addEventListener("mousemove", handleMouseMove);
  document.addEventListener("mouseup", handleMouseUp);
  canvas.container.addEventListener("mouseleave", handleMouseLeave);

  // Add keyboard listeners if space requirement is enabled
  if (config.requireSpaceForMouseDrag) {
    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("keyup", handleKeyUp);
  }

  return () => {
    canvas.container.removeEventListener("mousedown", handleMouseDown);
    document.removeEventListener("mousemove", handleMouseMove);
    document.removeEventListener("mouseup", handleMouseUp);
    canvas.container.removeEventListener("mouseleave", handleMouseLeave);

    if (config.requireSpaceForMouseDrag) {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("keyup", handleKeyUp);
    }
  };
}
