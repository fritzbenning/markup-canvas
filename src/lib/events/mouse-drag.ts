/**
 * Mouse drag functionality for canvas
 */

import { disableSmoothTransitions, enableSmoothTransitions } from "../transform/index.js";
import type { EventCanvas as Canvas, MouseDragOptions, Transform } from "../../types/index.js";
import { DEFAULT_MOUSE_DRAG_CONFIG, CLICK_THRESHOLDS } from "./constants.js";

/**
 * Sets up mouse drag functionality for a canvas
 */
export function setupMouseDrag(canvas: Canvas, options: MouseDragOptions = {}): () => void {
  const config: Required<MouseDragOptions> = {
    ...DEFAULT_MOUSE_DRAG_CONFIG,
    ...options,
  };

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

  // Set initial cursor state
  if (config.requireSpaceForMouseDrag) {
    canvas.container.style.cursor = "default";
  }

  function handleKeyDown(event: KeyboardEvent): void {
    if (config.requireSpaceForMouseDrag && event.key === " ") {
      isSpacePressed = true;
      // Update cursor to indicate drag is available
      if (!isDragging) {
        canvas.container.style.cursor = "grab";
      }
    }
  }

  function handleKeyUp(event: KeyboardEvent): void {
    if (config.requireSpaceForMouseDrag && event.key === " ") {
      isSpacePressed = false;
      // Reset cursor if not dragging
      if (!isDragging) {
        canvas.container.style.cursor = "default";
      }
      // Stop dragging if currently dragging
      if (isDragging) {
        isDragging = false;
        dragButton = -1;
        canvas.container.style.cursor = "default";
      }
    }
  }

  function handleMouseDown(event: MouseEvent): void {
    const isLeftButton = event.button === 0;
    const isMiddleButton = event.button === 1;

    // Track mouse down for click-to-zoom detection
    if (isLeftButton) {
      mouseDownTime = Date.now();
      mouseDownX = event.clientX;
      mouseDownY = event.clientY;
      hasDragged = false;
    }

    // Check if drag is allowed based on configuration
    const canDrag = config.requireSpaceForMouseDrag ? isSpacePressed : true;

    if (canDrag && ((isLeftButton && config.enableLeftDrag) || (isMiddleButton && config.enableMiddleDrag))) {
      event.preventDefault();
      isDragging = true;
      dragButton = event.button;
      lastMouseX = event.clientX;
      lastMouseY = event.clientY;

      canvas.container.style.cursor = "grabbing";
      disableSmoothTransitions(canvas.transformLayer);
    }
  }

  function handleMouseMove(event: MouseEvent): void {
    // Track if mouse has moved significantly (for click detection)
    if (mouseDownTime > 0) {
      const deltaX = Math.abs(event.clientX - mouseDownX);
      const deltaY = Math.abs(event.clientY - mouseDownY);
      if (deltaX > CLICK_THRESHOLDS.MAX_MOVEMENT || deltaY > CLICK_THRESHOLDS.MAX_MOVEMENT) {
        hasDragged = true;
      }
    }

    if (!isDragging) return;

    event.preventDefault();

    const deltaX = event.clientX - lastMouseX;
    const deltaY = event.clientY - lastMouseY;

    const newTransform: Partial<Transform> = {
      translateX: canvas.transform.translateX + deltaX,
      translateY: canvas.transform.translateY + deltaY,
    };

    canvas.updateTransform(newTransform);

    lastMouseX = event.clientX;
    lastMouseY = event.clientY;
  }

  function handleMouseUp(event: MouseEvent): void {
    if (isDragging && event.button === dragButton) {
      isDragging = false;
      dragButton = -1;
      canvas.container.style.cursor = "grab";
    }

    // Handle click-to-zoom for left button
    if (event.button === 0 && config.enableClickToZoom && mouseDownTime > 0) {
      const clickDuration = Date.now() - mouseDownTime;

      // Check if Option/Alt key is required and pressed
      const optionKeyPressed = event.altKey;
      const shouldZoom = config.requireOptionForClickZoom ? optionKeyPressed : true;

      // Only handle quick clicks that haven't dragged and meet key requirements
      if (clickDuration < CLICK_THRESHOLDS.MAX_DURATION && !hasDragged && !isDragging && shouldZoom) {
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

        // Calculate where the clicked content point should be positioned
        // to appear at the center of the canvas after zooming
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
    }

    // Reset click tracking
    if (event.button === 0) {
      mouseDownTime = 0;
      hasDragged = false;
    }
  }

  function handleMouseLeave(): void {
    if (isDragging) {
      isDragging = false;
      dragButton = -1;
      canvas.container.style.cursor = "grab";
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
