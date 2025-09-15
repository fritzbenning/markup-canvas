/**
 * Event Handling Functions
 * Core event handlers for mouse, keyboard, and touch interactions
 */

import { clampZoom, getZoomToMouseTransform } from "./matrix.js";
import {
	disableSmoothTransitions,
	enableSmoothTransitions,
} from "./transform.js";

// Type definitions
interface Viewport {
	container: HTMLElement;
	transformLayer: HTMLElement;
	transform: Transform;
	updateTransform: (newTransform: Partial<Transform>) => boolean;
	getBounds?: () => ViewportBounds;
	viewportToContent: (x: number, y: number) => { x: number; y: number };
	resetView?: (duration?: number) => boolean;
}

interface Transform {
	scale: number;
	translateX: number;
	translateY: number;
}

interface ViewportBounds {
	width: number;
	height: number;
	scale?: number;
	translateX?: number;
	translateY?: number;
}

interface WheelZoomOptions {
	zoomSpeed?: number;
	fineZoomSpeed?: number;
	smoothTransition?: boolean;
	enableAdaptiveSpeed?: boolean;
}

interface MouseDragOptions {
	enableLeftDrag?: boolean;
	enableMiddleDrag?: boolean;
	requireSpaceForMouseDrag?: boolean;
	enableClickToZoom?: boolean;
	clickZoomLevel?: number;
	clickZoomDuration?: number;
	requireOptionForClickZoom?: boolean;
}

interface KeyboardNavigationOptions {
	panStep?: number;
	fastPanMultiplier?: number;
	zoomStep?: number;
	enableAdaptiveSpeed?: boolean;
}

interface TouchEventsOptions {
	enableSingleTouchPan?: boolean;
	enableMultiTouch?: boolean;
}

interface GestureInfo {
	isTrackpad: boolean;
	isTrackpadScroll: boolean;
	isTrackpadPinch: boolean;
	isMouseWheel: boolean;
	isZoomGesture: boolean;
	confidence: number;
}

interface TouchState {
	touches: Touch[];
	lastDistance: number;
	lastCenter: { x: number; y: number };
}

/**
 * Gets display-size adaptive zoom speed based on viewport dimensions
 */
function getAdaptiveZoomSpeed(viewport: Viewport, baseSpeed: number): number {
	if (!viewport?.getBounds) {
		return baseSpeed;
	}

	try {
		const bounds = viewport.getBounds();
		const displayArea = bounds.width * bounds.height;

		// Reference area based on common desktop resolution (1920x1080)
		const referenceArea = 1920 * 1080;

		// Calculate scale factor with aggressive scaling optimized for larger displays
		// Use power of 0.85 for even more dramatic differences on large screens
		const rawScaleFactor = (displayArea / referenceArea) ** 0.85;

		// Wider bounds for more dramatic effect (0.2x to 3x adjustment)
		const clampedScaleFactor = Math.max(0.2, Math.min(3.0, rawScaleFactor));

		return baseSpeed * clampedScaleFactor;
	} catch (error) {
		console.warn(
			"Failed to calculate adaptive zoom speed, using base speed:",
			error,
		);
		return baseSpeed;
	}
}

/**
 * Sets up wheel zoom functionality for a viewport
 */
export function setupWheelZoom(
	viewport: Viewport,
	options: WheelZoomOptions = {},
): () => void {
	const config: Required<WheelZoomOptions> = {
		zoomSpeed: 0.25,
		fineZoomSpeed: 0.1,
		smoothTransition: false,
		enableAdaptiveSpeed: true,
		...options,
	};

	function detectTrackpadGesture(event: WheelEvent): GestureInfo {
		const result: GestureInfo = {
			isTrackpad: false,
			isTrackpadScroll: false,
			isTrackpadPinch: false,
			isMouseWheel: false,
			isZoomGesture: false,
			confidence: 0,
		};

		// Multiple detection criteria for better accuracy
		const criteria = {
			// Trackpad typically has smaller delta values
			smallDelta: Math.abs(event.deltaY) < 50,
			// Trackpad uses pixel mode (deltaMode === 0)
			pixelMode: event.deltaMode === 0,
			// Trackpad often has fractional values
			fractionalDelta: event.deltaY % 1 !== 0,
			// Pinch gestures always have Ctrl/Cmd modifier
			hasCtrlModifier: event.ctrlKey || event.metaKey,
			// Trackpad scroll often has both X and Y deltas
			hasBothAxes: Math.abs(event.deltaX) > 0 && Math.abs(event.deltaY) > 0,
			// Mouse wheel typically has larger, integer deltas
			largeDelta: Math.abs(event.deltaY) >= 100,
			// Check for wheel delta line mode (mouse wheel characteristic)
			lineMode: event.deltaMode === 1,
		};

		// Calculate trackpad probability
		let trackpadScore = 0;
		if (criteria.smallDelta) trackpadScore += 2;
		if (criteria.pixelMode) trackpadScore += 2;
		if (criteria.fractionalDelta) trackpadScore += 1;
		if (criteria.hasBothAxes) trackpadScore += 1;

		// Calculate mouse wheel probability
		let mouseScore = 0;
		if (criteria.largeDelta) mouseScore += 2;
		if (criteria.lineMode) mouseScore += 2;
		if (!criteria.hasBothAxes && Math.abs(event.deltaX) < 1) mouseScore += 1;

		// Determine device type
		result.isTrackpad = trackpadScore > mouseScore;
		result.isMouseWheel = mouseScore > trackpadScore;
		result.confidence = Math.max(trackpadScore, mouseScore) / 6;

		// Determine gesture type - both trackpad and mouse wheel require Cmd/Ctrl to zoom
		if (result.isTrackpad) {
			if (criteria.hasCtrlModifier) {
				result.isTrackpadPinch = true;
				result.isZoomGesture = true;
			} else {
				result.isTrackpadScroll = true;
				result.isZoomGesture = false;
			}
		} else {
			// Mouse wheel: only zoom with Cmd/Ctrl, otherwise pan
			if (criteria.hasCtrlModifier) {
				result.isZoomGesture = true;
			} else {
				result.isTrackpadScroll = true; // Treat as scroll/pan
				result.isZoomGesture = false;
			}
		}

		return result;
	}

	function handleTrackpadPan(event: WheelEvent, viewport: Viewport): boolean {
		if (!event || !viewport?.updateTransform) {
			return false;
		}

		try {
			// Get current transform
			const currentTransform = viewport.transform;

			// Calculate pan delta based on trackpad scroll
			const panSensitivity = 1.0;
			const deltaX = event.deltaX * panSensitivity;
			const deltaY = event.deltaY * panSensitivity;

			// Apply pan by adjusting translation
			const newTransform: Partial<Transform> = {
				scale: currentTransform.scale,
				translateX: currentTransform.translateX - deltaX,
				translateY: currentTransform.translateY - deltaY,
			};

			// Disable smooth transitions for real-time panning
			disableSmoothTransitions(viewport.transformLayer);

			// Apply the new transform
			return viewport.updateTransform(newTransform);
		} catch (error) {
			console.error("Error handling trackpad pan:", error);
			return false;
		}
	}

	function handleWheel(event: WheelEvent): boolean {
		// Validate inputs
		if (!event || typeof event.deltaY !== "number") {
			console.warn("Invalid wheel event provided");
			return false;
		}

		if (!viewport?.updateTransform) {
			console.warn("Invalid viewport provided to handleWheelEvent");
			return false;
		}

		try {
			// Prevent default scrolling behavior
			event.preventDefault();

			// Get mouse position relative to viewport
			const rect = viewport.container.getBoundingClientRect();
			const mouseX = event.clientX - rect.left;
			const mouseY = event.clientY - rect.top;

			// Determine base zoom speed based on modifier keys
			const isCtrlPressed = event.ctrlKey || event.metaKey;
			const baseZoomSpeed = isCtrlPressed
				? config.fineZoomSpeed
				: config.zoomSpeed;

			// Apply display-size adaptive scaling if enabled
			const currentZoomSpeed = config.enableAdaptiveSpeed
				? getAdaptiveZoomSpeed(viewport, baseZoomSpeed)
				: baseZoomSpeed;

			// Calculate zoom delta based on wheel direction with exponential scaling
			const zoomDirection = event.deltaY < 0 ? 1 : -1;

			// Enhanced trackpad detection using multiple criteria
			const gestureInfo = detectTrackpadGesture(event);

			// Handle different gesture types
			if (gestureInfo.isTrackpadScroll) {
				// Handle trackpad scroll as pan
				return handleTrackpadPan(event, viewport);
			}

			if (!gestureInfo.isZoomGesture) {
				// Not a zoom gesture, ignore
				return false;
			}

			// Adjust zoom speed based on detected gesture type
			let deviceZoomSpeed = currentZoomSpeed;

			if (gestureInfo.isTrackpadPinch) {
				// Trackpad pinch-to-zoom needs slower speed, but still apply adaptive scaling
				const baseTrackpadSpeed = config.zoomSpeed * 0.25;
				deviceZoomSpeed = config.enableAdaptiveSpeed
					? getAdaptiveZoomSpeed(viewport, baseTrackpadSpeed)
					: baseTrackpadSpeed;
			} else if (gestureInfo.isMouseWheel) {
				// Mouse wheel uses the already calculated adaptive speed
				deviceZoomSpeed = currentZoomSpeed;
			}

			// Apply confidence-based adjustment for uncertain detections
			if (gestureInfo.confidence < 0.7) {
				// Lower confidence, use more conservative speed
				deviceZoomSpeed *= 0.8;
			}

			// Use exponential zoom for more natural feel
			const zoomMultiplier =
				zoomDirection > 0 ? 1 + deviceZoomSpeed : 1 / (1 + deviceZoomSpeed);
			const zoomFactor = zoomMultiplier;

			// Get current transform state
			const currentTransform = viewport.transform;

			// Calculate new transform using zoom-to-mouse algorithm
			const newTransform = getZoomToMouseTransform(
				mouseX,
				mouseY,
				currentTransform,
				zoomFactor,
			);

			// Check if zoom actually changed (might be at bounds)
			if (Math.abs(newTransform.scale - currentTransform.scale) < 0.001) {
				// At zoom bounds, no change needed
				return false;
			}

			// Enable smooth transitions for zoom operations
			enableSmoothTransitions(viewport.transformLayer, 0.15);

			// Apply the new transform with smooth transition
			const result = viewport.updateTransform(newTransform);

			// Disable transitions after a short delay to avoid interfering with subsequent operations
			setTimeout(() => {
				if (viewport.transformLayer) {
					disableSmoothTransitions(viewport.transformLayer);
				}
			}, 200);

			return result;
		} catch (error) {
			console.error("Error handling wheel event:", error);
			return false;
		}
	}

	viewport.container.addEventListener("wheel", handleWheel, { passive: false });

	return () => {
		viewport.container.removeEventListener("wheel", handleWheel);
	};
}
/**
 * Sets up mouse drag functionality for a viewport
 */
export function setupMouseDrag(
	viewport: Viewport,
	options: MouseDragOptions = {},
): () => void {
	const config: Required<MouseDragOptions> = {
		enableLeftDrag: true,
		enableMiddleDrag: true,
		requireSpaceForMouseDrag: false,
		enableClickToZoom: true,
		clickZoomLevel: 1.0, // Changed to 100% zoom (1.0 scale)
		clickZoomDuration: 300, // Duration in milliseconds for click-to-zoom animation
		requireOptionForClickZoom: false, // Require Option/Alt key for click-to-zoom
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
		viewport.container.style.cursor = "default";
	}

	function handleKeyDown(event: KeyboardEvent): void {
		if (config.requireSpaceForMouseDrag && event.key === " ") {
			isSpacePressed = true;
			// Update cursor to indicate drag is available
			if (!isDragging) {
				viewport.container.style.cursor = "grab";
			}
		}
	}

	function handleKeyUp(event: KeyboardEvent): void {
		if (config.requireSpaceForMouseDrag && event.key === " ") {
			isSpacePressed = false;
			// Reset cursor if not dragging
			if (!isDragging) {
				viewport.container.style.cursor = "default";
			}
			// Stop dragging if currently dragging
			if (isDragging) {
				isDragging = false;
				dragButton = -1;
				viewport.container.style.cursor = "default";
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

		if (
			canDrag &&
			((isLeftButton && config.enableLeftDrag) ||
				(isMiddleButton && config.enableMiddleDrag))
		) {
			event.preventDefault();
			isDragging = true;
			dragButton = event.button;
			lastMouseX = event.clientX;
			lastMouseY = event.clientY;

			viewport.container.style.cursor = "grabbing";
			disableSmoothTransitions(viewport.transformLayer);
		}
	}

	function handleMouseMove(event: MouseEvent): void {
		// Track if mouse has moved significantly (for click detection)
		if (mouseDownTime > 0) {
			const deltaX = Math.abs(event.clientX - mouseDownX);
			const deltaY = Math.abs(event.clientY - mouseDownY);
			if (deltaX > 5 || deltaY > 5) {
				hasDragged = true;
			}
		}

		if (!isDragging) return;

		event.preventDefault();

		const deltaX = event.clientX - lastMouseX;
		const deltaY = event.clientY - lastMouseY;

		const newTransform: Partial<Transform> = {
			translateX: viewport.transform.translateX + deltaX,
			translateY: viewport.transform.translateY + deltaY,
		};

		viewport.updateTransform(newTransform);

		lastMouseX = event.clientX;
		lastMouseY = event.clientY;
	}

	function handleMouseUp(event: MouseEvent): void {
		if (isDragging && event.button === dragButton) {
			isDragging = false;
			dragButton = -1;
			viewport.container.style.cursor = "grab";
		}

		// Handle click-to-zoom for left button
		if (event.button === 0 && config.enableClickToZoom && mouseDownTime > 0) {
			const clickDuration = Date.now() - mouseDownTime;

			// Check if Option/Alt key is required and pressed
			const optionKeyPressed = event.altKey;
			const shouldZoom = config.requireOptionForClickZoom
				? optionKeyPressed
				: true;

			// Only handle quick clicks that haven't dragged and meet key requirements
			if (clickDuration < 300 && !hasDragged && !isDragging && shouldZoom) {
				event.preventDefault();

				// Get click position relative to viewport
				const rect = viewport.container.getBoundingClientRect();
				const clickX = event.clientX - rect.left;
				const clickY = event.clientY - rect.top;

				// Convert viewport coordinates to content coordinates at current scale
				const contentCoords = viewport.viewportToContent(clickX, clickY);

				// Calculate the center of the viewport
				const viewportCenterX = rect.width / 2;
				const viewportCenterY = rect.height / 2;

				// Calculate the new transform to zoom and center the clicked point
				const newScale = config.clickZoomLevel;

				// Calculate where the clicked content point should be positioned
				// to appear at the center of the viewport after zooming
				const newTranslateX = viewportCenterX - contentCoords.x * newScale;
				const newTranslateY = viewportCenterY - contentCoords.y * newScale;

				const newTransform: Partial<Transform> = {
					scale: newScale,
					translateX: newTranslateX,
					translateY: newTranslateY,
				};

				// Enable smooth transitions for click-to-zoom
				const duration = config.clickZoomDuration / 1000; // Convert to seconds
				enableSmoothTransitions(viewport.transformLayer, duration);

				viewport.updateTransform(newTransform);

				// Disable transitions after animation completes
				setTimeout(() => {
					if (viewport.transformLayer) {
						disableSmoothTransitions(viewport.transformLayer);
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
			viewport.container.style.cursor = "grab";
		}
	}

	viewport.container.addEventListener("mousedown", handleMouseDown);
	document.addEventListener("mousemove", handleMouseMove);
	document.addEventListener("mouseup", handleMouseUp);
	viewport.container.addEventListener("mouseleave", handleMouseLeave);

	// Add keyboard listeners if space requirement is enabled
	if (config.requireSpaceForMouseDrag) {
		document.addEventListener("keydown", handleKeyDown);
		document.addEventListener("keyup", handleKeyUp);
	}

	return () => {
		viewport.container.removeEventListener("mousedown", handleMouseDown);
		document.removeEventListener("mousemove", handleMouseMove);
		document.removeEventListener("mouseup", handleMouseUp);
		viewport.container.removeEventListener("mouseleave", handleMouseLeave);

		if (config.requireSpaceForMouseDrag) {
			document.removeEventListener("keydown", handleKeyDown);
			document.removeEventListener("keyup", handleKeyUp);
		}
	};
}

/**
 * Sets up keyboard navigation for a viewport
 */
export function setupKeyboardNavigation(
	viewport: Viewport,
	options: KeyboardNavigationOptions = {},
): () => void {
	const config: Required<KeyboardNavigationOptions> = {
		panStep: 50,
		fastPanMultiplier: 3,
		zoomStep: 0.1,
		enableAdaptiveSpeed: true,
		...options,
	};

	function handleKeyDown(event: KeyboardEvent): void {
		// Only handle if viewport container is focused
		if (document.activeElement !== viewport.container) return;

		const isFastPan = event.shiftKey;
		const panDistance =
			config.panStep * (isFastPan ? config.fastPanMultiplier : 1);

		let handled = false;
		const newTransform: Partial<Transform> = {};

		switch (event.key) {
			case "ArrowLeft":
				newTransform.translateX = viewport.transform.translateX + panDistance;
				handled = true;
				break;
			case "ArrowRight":
				newTransform.translateX = viewport.transform.translateX - panDistance;
				handled = true;
				break;
			case "ArrowUp":
				newTransform.translateY = viewport.transform.translateY + panDistance;
				handled = true;
				break;
			case "ArrowDown":
				newTransform.translateY = viewport.transform.translateY - panDistance;
				handled = true;
				break;
			case "=":
			case "+":
				{
					const adaptiveZoomStep = config.enableAdaptiveSpeed
						? getAdaptiveZoomSpeed(viewport, config.zoomStep)
						: config.zoomStep;
					newTransform.scale = clampZoom(
						viewport.transform.scale * (1 + adaptiveZoomStep),
					);
					handled = true;
				}
				break;
			case "-":
				{
					const adaptiveZoomStep = config.enableAdaptiveSpeed
						? getAdaptiveZoomSpeed(viewport, config.zoomStep)
						: config.zoomStep;
					newTransform.scale = clampZoom(
						viewport.transform.scale * (1 - adaptiveZoomStep),
					);
					handled = true;
				}
				break;
			case "0":
				if (viewport.resetView) {
					viewport.resetView(0); // No transition for keyboard reset
				}
				handled = true;
				break;
		}

		if (handled) {
			event.preventDefault();
			if (Object.keys(newTransform).length > 0) {
				viewport.updateTransform(newTransform);
			}
		}
	}

	viewport.container.addEventListener("keydown", handleKeyDown);

	return () => {
		viewport.container.removeEventListener("keydown", handleKeyDown);
	};
}

/**
 * Sets up basic touch events for mobile support
 */
export function setupTouchEvents(
	viewport: Viewport,
	options: TouchEventsOptions = {},
): () => void {
	const config: Required<TouchEventsOptions> = {
		enableSingleTouchPan: true,
		enableMultiTouch: true,
		...options,
	};

	const touchState: TouchState = {
		touches: [],
		lastDistance: 0,
		lastCenter: { x: 0, y: 0 },
	};

	function getTouchDistance(touch1: Touch, touch2: Touch): number {
		const dx = touch1.clientX - touch2.clientX;
		const dy = touch1.clientY - touch2.clientY;
		return Math.sqrt(dx * dx + dy * dy);
	}

	function getTouchCenter(
		touch1: Touch,
		touch2: Touch,
	): { x: number; y: number } {
		return {
			x: (touch1.clientX + touch2.clientX) / 2,
			y: (touch1.clientY + touch2.clientY) / 2,
		};
	}

	function handleTouchStart(event: TouchEvent): void {
		event.preventDefault();

		touchState.touches = Array.from(event.touches);

		if (touchState.touches.length === 2 && config.enableMultiTouch) {
			touchState.lastDistance = getTouchDistance(
				touchState.touches[0],
				touchState.touches[1],
			);
			touchState.lastCenter = getTouchCenter(
				touchState.touches[0],
				touchState.touches[1],
			);
		}

		disableSmoothTransitions(viewport.transformLayer);
	}

	function handleTouchMove(event: TouchEvent): void {
		event.preventDefault();

		const currentTouches = Array.from(event.touches);

		if (currentTouches.length === 1 && config.enableSingleTouchPan) {
			// Single touch pan
			if (touchState.touches.length === 1) {
				const deltaX =
					currentTouches[0].clientX - touchState.touches[0].clientX;
				const deltaY =
					currentTouches[0].clientY - touchState.touches[0].clientY;

				const newTransform: Partial<Transform> = {
					translateX: viewport.transform.translateX + deltaX,
					translateY: viewport.transform.translateY + deltaY,
				};

				viewport.updateTransform(newTransform);
			}
		} else if (currentTouches.length === 2 && config.enableMultiTouch) {
			// Two finger pinch zoom
			const currentDistance = getTouchDistance(
				currentTouches[0],
				currentTouches[1],
			);
			const currentCenter = getTouchCenter(
				currentTouches[0],
				currentTouches[1],
			);

			if (touchState.lastDistance > 0) {
				const zoomFactor = currentDistance / touchState.lastDistance;

				// Get center relative to viewport
				const rect = viewport.container.getBoundingClientRect();
				const centerX = currentCenter.x - rect.left;
				const centerY = currentCenter.y - rect.top;

				const newTransform = getZoomToMouseTransform(
					centerX,
					centerY,
					viewport.transform,
					zoomFactor,
				);

				viewport.updateTransform(newTransform);
			}

			touchState.lastDistance = currentDistance;
			touchState.lastCenter = currentCenter;
		}

		touchState.touches = currentTouches;
	}

	function handleTouchEnd(event: TouchEvent): void {
		touchState.touches = Array.from(event.touches);

		if (touchState.touches.length < 2) {
			touchState.lastDistance = 0;
		}
	}

	viewport.container.addEventListener("touchstart", handleTouchStart, {
		passive: false,
	});
	viewport.container.addEventListener("touchmove", handleTouchMove, {
		passive: false,
	});
	viewport.container.addEventListener("touchend", handleTouchEnd, {
		passive: false,
	});

	return () => {
		viewport.container.removeEventListener("touchstart", handleTouchStart);
		viewport.container.removeEventListener("touchmove", handleTouchMove);
		viewport.container.removeEventListener("touchend", handleTouchEnd);
	};
}
