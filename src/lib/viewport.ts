/**
 * Viewport Management Functions
 * Functions for creating and managing zoomable viewports
 */

import {
	calculateMatrix,
	clampZoom,
	getZoomToMouseTransform,
	viewportToContent,
} from "./matrix.js";
import {
	applyTransform,
	disableSmoothTransitions,
	enableHardwareAcceleration,
	enableSmoothTransitions,
} from "./transform.js";

// Type definitions
interface Transform {
	scale: number;
	translateX: number;
	translateY: number;
}

interface Point {
	x: number;
	y: number;
}

interface ViewportBounds {
	width: number;
	height: number;
	contentWidth: number;
	contentHeight: number;
	scale: number;
	translateX: number;
	translateY: number;
	visibleArea: {
		x: number;
		y: number;
		width: number;
		height: number;
	};
	scaledContentWidth: number;
	scaledContentHeight: number;
	canPanLeft: boolean;
	canPanRight: boolean;
	canPanUp: boolean;
	canPanDown: boolean;
	canZoomIn: boolean;
	canZoomOut: boolean;
}

interface ViewportOptions {
	contentWidth?: number;
	contentHeight?: number;
	enableAcceleration?: boolean;
	enableEventHandling?: boolean;
	onTransformUpdate?: (transform: Transform) => void;
}

interface AddContentOptions {
	x?: number;
	y?: number;
	absolute?: boolean;
}

interface Viewport {
	container: HTMLElement;
	transformLayer: HTMLElement;
	contentLayer: HTMLElement;
	config: Required<ViewportOptions>;
	transform: Transform;
	getBounds: () => ViewportBounds;
	addContent: (element: HTMLElement, options?: AddContentOptions) => boolean;
	updateTransform: (newTransform: Partial<Transform>) => boolean;
	reset: () => boolean;
	handleResize: () => boolean;
	setZoom: (zoomLevel: number) => boolean;
	setInteractionMode: (mode: string) => boolean;
	viewportToContent: (x: number, y: number) => Point;
	zoomToPoint: (
		x: number,
		y: number,
		targetScale: number,
		duration?: number,
	) => boolean;
	resetView: (duration?: number) => boolean;
	zoomToFitContent: (duration?: number) => boolean;
}

/**
 * Creates and initializes a viewport with the required DOM structure
 */
export function createViewport(
	container: HTMLElement,
	options: ViewportOptions = {},
): Viewport | null {
	// Validate container
	if (!container?.appendChild) {
		console.error("Invalid container element provided to createViewport");
		return null;
	}

	// Set default options
	const config: Required<ViewportOptions> = {
		contentWidth: 8000,
		contentHeight: 8000,
		enableAcceleration: true,
		enableEventHandling: true,
		onTransformUpdate: () => {},
		...options,
	};

	// Validate configuration
	if (typeof config.contentWidth !== "number" || config.contentWidth <= 0) {
		console.warn("Invalid contentWidth, using default 8000px");
		config.contentWidth = 8000;
	}

	if (typeof config.contentHeight !== "number" || config.contentHeight <= 0) {
		console.warn("Invalid contentHeight, using default 8000px");
		config.contentHeight = 8000;
	}

	try {
		// Set up viewport container styles - preserve existing position and dimensions
		const currentPosition = getComputedStyle(container).position;
		if (currentPosition === "static") {
			container.style.position = "relative";
		}
		container.style.overflow = "hidden";
		container.style.cursor = "grab";

		// Make container focusable for keyboard events
		if (!container.hasAttribute("tabindex")) {
			container.setAttribute("tabindex", "0");
		}

		// Ensure container has proper dimensions
		const containerRect = container.getBoundingClientRect();
		const computedStyle = getComputedStyle(container);

		// Only set dimensions if they're truly not set (avoid overriding existing styles)
		if (containerRect.height === 0 && computedStyle.height === "auto") {
			console.warn("Container height is 0, setting to 100vh");
			container.style.height = "100vh";
		}
		if (containerRect.width === 0 && computedStyle.width === "auto") {
			console.warn("Container width is 0, setting to 100vw");
			container.style.width = "100vw";
		}

		// Add viewport-specific classes if not present
		if (!container.classList.contains("viewport-container")) {
			container.classList.add("viewport-container");
		}

		// Store existing content before creating new structure
		const existingContent = Array.from(container.children);

		// Create or find transform layer
		let transformLayer = container.querySelector(
			".transform-layer",
		) as HTMLElement;
		if (!transformLayer) {
			transformLayer = document.createElement("div");
			transformLayer.className = "transform-layer";
			container.appendChild(transformLayer);
		}

		// Set transform layer dimensions and properties
		transformLayer.style.position = "absolute";
		transformLayer.style.top = "0";
		transformLayer.style.left = "0";
		transformLayer.style.width = `${config.contentWidth}px`;
		transformLayer.style.height = `${config.contentHeight}px`;
		transformLayer.style.transformOrigin = "0 0";

		// Add smooth transitions for zoom operations
		transformLayer.style.transition =
			"transform 0.2s cubic-bezier(0.25, 0.46, 0.45, 0.94)";
		transformLayer.style.webkitTransition =
			"transform 0.2s cubic-bezier(0.25, 0.46, 0.45, 0.94)";

		// Create or find content layer
		let contentLayer = transformLayer.querySelector(
			".content-layer",
		) as HTMLElement;
		if (!contentLayer) {
			contentLayer = document.createElement("div");
			contentLayer.className = "content-layer";
			transformLayer.appendChild(contentLayer);

			// Move existing content into the content layer (except the transform layer itself)
			existingContent.forEach((child) => {
				if (
					child !== transformLayer &&
					!child.classList.contains("transform-layer")
				) {
					contentLayer.appendChild(child);
				}
			});
		}

		// Set content layer properties
		contentLayer.style.position = "relative";
		contentLayer.style.width = "100%";
		contentLayer.style.height = "100%";
		contentLayer.style.pointerEvents = "auto";

		// Enable hardware acceleration if requested
		if (config.enableAcceleration) {
			enableHardwareAcceleration(transformLayer);
		}

		// Initialize transform state
		const initialTransform: Transform = {
			scale: 1.0,
			translateX: 0,
			translateY: 0,
		};

		// Apply initial transform
		const initialMatrix = calculateMatrix(
			initialTransform.scale,
			initialTransform.translateX,
			initialTransform.translateY,
		);
		applyTransform(transformLayer, initialMatrix);

		// Create viewport object
		const viewport: Viewport = {
			// DOM references
			container,
			transformLayer,
			contentLayer,

			// Configuration
			config,

			// Current state
			transform: initialTransform,

			// Utility methods
			getBounds: () => getViewportBounds(viewport),
			addContent: (element: HTMLElement, options?: AddContentOptions) =>
				addContentToViewport(viewport, element, options),

			// Transform methods
			updateTransform: (newTransform: Partial<Transform>) => {
				viewport.transform = { ...viewport.transform, ...newTransform };
				const matrix = calculateMatrix(
					viewport.transform.scale,
					viewport.transform.translateX,
					viewport.transform.translateY,
				);
				const result = applyTransform(viewport.transformLayer, matrix);

				// Call update callback if provided
				if (config.onTransformUpdate) {
					config.onTransformUpdate(viewport.transform);
				}

				return result;
			},

			// Reset method
			reset: () => {
				const resetTransform: Transform = {
					scale: 1.0,
					translateX: 0,
					translateY: 0,
				};
				return viewport.updateTransform(resetTransform);
			},

			// Handle viewport resize
			handleResize: () => {
				// Update viewport bounds and ensure proper dimensions
				const newRect = container.getBoundingClientRect();
				console.log("Viewport resized:", {
					width: newRect.width,
					height: newRect.height,
				});

				// Trigger any necessary updates for the new dimensions
				return true;
			},

			// Set zoom level
			setZoom: (zoomLevel: number) => {
				const newScale = clampZoom(zoomLevel);
				return viewport.updateTransform({ scale: newScale });
			},

			// Set interaction mode (placeholder for demo compatibility)
			setInteractionMode: (mode: string) => {
				console.log("Interaction mode set to:", mode);
				return true;
			},

			// Convert viewport coordinates to content coordinates
			viewportToContent: (x: number, y: number) => {
				const matrix = calculateMatrix(
					viewport.transform.scale,
					viewport.transform.translateX,
					viewport.transform.translateY,
				);
				return viewportToContent(x, y, matrix);
			},

			// Zoom to a specific point with animation
			zoomToPoint: (
				x: number,
				y: number,
				targetScale: number,
				duration = 300,
			) => {
				// Enable smooth transitions for programmatic zoom
				enableSmoothTransitions(viewport.transformLayer, duration / 1000);

				const newTransform = getZoomToMouseTransform(
					x,
					y,
					viewport.transform,
					targetScale / viewport.transform.scale,
				);

				const result = viewport.updateTransform(newTransform);

				// Disable transitions after animation completes
				setTimeout(() => {
					if (viewport.transformLayer) {
						disableSmoothTransitions(viewport.transformLayer);
					}
				}, duration + 50);

				return result;
			},

			// Reset view with animation
			resetView: (duration = 300) => {
				// Enable smooth transitions for reset
				enableSmoothTransitions(viewport.transformLayer, duration / 1000);

				const resetTransform: Transform = {
					scale: 1.0,
					translateX: 0,
					translateY: 0,
				};
				const result = viewport.updateTransform(resetTransform);

				// Disable transitions after animation completes
				setTimeout(() => {
					if (viewport.transformLayer) {
						disableSmoothTransitions(viewport.transformLayer);
					}
				}, duration + 50);

				return result;
			},

			// Zoom to fit content in viewport
			zoomToFitContent: (duration = 300) => {
				// Enable smooth transitions for zoom to fit
				enableSmoothTransitions(viewport.transformLayer, duration / 1000);

				const bounds = viewport.getBounds();
				const scaleX = bounds.width / config.contentWidth;
				const scaleY = bounds.height / config.contentHeight;
				const fitScale = clampZoom(Math.min(scaleX, scaleY) * 0.9); // 90% to add padding

				// Center the content
				const scaledWidth = config.contentWidth * fitScale;
				const scaledHeight = config.contentHeight * fitScale;
				const centerX = (bounds.width - scaledWidth) / 2;
				const centerY = (bounds.height - scaledHeight) / 2;

				const result = viewport.updateTransform({
					scale: fitScale,
					translateX: centerX,
					translateY: centerY,
				});

				// Disable transitions after animation completes
				setTimeout(() => {
					if (viewport.transformLayer) {
						disableSmoothTransitions(viewport.transformLayer);
					}
				}, duration + 50);

				return result;
			},
		};

		console.log("Viewport created successfully:", {
			contentSize: `${config.contentWidth}x${config.contentHeight}`,
			acceleration: config.enableAcceleration,
			eventHandling: config.enableEventHandling,
		});

		return viewport;
	} catch (error) {
		console.error("Failed to create viewport:", error);
		return null;
	}
}

/**
 * Gets the current bounds and dimensions of a viewport
 */
export function getViewportBounds(viewport: Viewport): ViewportBounds {
	// Validate viewport
	if (!viewport?.container) {
		console.warn("Invalid viewport provided to getViewportBounds");
		return {
			width: 0,
			height: 0,
			contentWidth: 0,
			contentHeight: 0,
			scale: 1,
			translateX: 0,
			translateY: 0,
			visibleArea: { x: 0, y: 0, width: 0, height: 0 },
			scaledContentWidth: 0,
			scaledContentHeight: 0,
			canPanLeft: false,
			canPanRight: false,
			canPanUp: false,
			canPanDown: false,
			canZoomIn: false,
			canZoomOut: false,
		};
	}

	try {
		const container = viewport.container;
		const config = viewport.config;
		const transform = viewport.transform || {
			scale: 1.0,
			translateX: 0,
			translateY: 0,
		};

		// Get viewport dimensions
		const containerRect = container.getBoundingClientRect();
		const viewportWidth = containerRect.width || container.clientWidth || 0;
		const viewportHeight = containerRect.height || container.clientHeight || 0;

		// Get content dimensions
		const contentWidth = config.contentWidth || 8000;
		const contentHeight = config.contentHeight || 8000;

		// Calculate visible area in content coordinates
		const topLeft = viewportToContent(
			0,
			0,
			calculateMatrix(
				transform.scale,
				transform.translateX,
				transform.translateY,
			),
		);

		const bottomRight = viewportToContent(
			viewportWidth,
			viewportHeight,
			calculateMatrix(
				transform.scale,
				transform.translateX,
				transform.translateY,
			),
		);

		const visibleArea = {
			x: Math.max(0, Math.min(contentWidth, topLeft.x)),
			y: Math.max(0, Math.min(contentHeight, topLeft.y)),
			width: Math.max(
				0,
				Math.min(contentWidth - topLeft.x, bottomRight.x - topLeft.x),
			),
			height: Math.max(
				0,
				Math.min(contentHeight - topLeft.y, bottomRight.y - topLeft.y),
			),
		};

		return {
			// Viewport dimensions
			width: viewportWidth,
			height: viewportHeight,

			// Content dimensions
			contentWidth,
			contentHeight,

			// Current transform
			scale: transform.scale,
			translateX: transform.translateX,
			translateY: transform.translateY,

			// Visible area in content coordinates
			visibleArea,

			// Calculated properties
			scaledContentWidth: contentWidth * transform.scale,
			scaledContentHeight: contentHeight * transform.scale,

			// Bounds checking
			canPanLeft: transform.translateX < 0,
			canPanRight:
				transform.translateX + contentWidth * transform.scale > viewportWidth,
			canPanUp: transform.translateY < 0,
			canPanDown:
				transform.translateY + contentHeight * transform.scale > viewportHeight,

			// Zoom bounds
			canZoomIn: transform.scale < 3.5,
			canZoomOut: transform.scale > 0.1,
		};
	} catch (error) {
		console.error("Failed to calculate viewport bounds:", error);
		return {
			width: 0,
			height: 0,
			contentWidth: 0,
			contentHeight: 0,
			scale: 1,
			translateX: 0,
			translateY: 0,
			visibleArea: { x: 0, y: 0, width: 0, height: 0 },
			scaledContentWidth: 0,
			scaledContentHeight: 0,
			canPanLeft: false,
			canPanRight: false,
			canPanUp: false,
			canPanDown: false,
			canZoomIn: false,
			canZoomOut: false,
		};
	}
}

/**
 * Adds an HTML element to the viewport's content layer
 */
export function addContentToViewport(
	viewport: Viewport,
	element: HTMLElement,
	options: AddContentOptions = {},
): boolean {
	// Validate inputs
	if (!viewport?.contentLayer) {
		console.error("Invalid viewport provided to addContentToViewport");
		return false;
	}

	if (!element?.style) {
		console.error("Invalid element provided to addContentToViewport");
		return false;
	}

	// Set default options
	const config: Required<AddContentOptions> = {
		absolute: true,
		x: 0,
		y: 0,
		...options,
	};

	try {
		// Set positioning if coordinates provided
		if (config.absolute) {
			element.style.position = "absolute";

			if (typeof config.x === "number" && Number.isFinite(config.x)) {
				element.style.left = `${config.x}px`;
			}

			if (typeof config.y === "number" && Number.isFinite(config.y)) {
				element.style.top = `${config.y}px`;
			}
		}

		// Ensure element can receive pointer events
		if (
			!element.style.pointerEvents ||
			element.style.pointerEvents === "none"
		) {
			element.style.pointerEvents = "auto";
		}

		// Add element to content layer
		viewport.contentLayer.appendChild(element);

		// Validate bounds if position was specified
		if (typeof config.x === "number" || typeof config.y === "number") {
			const bounds = getViewportBounds(viewport);
			const x = config.x || 0;
			const y = config.y || 0;

			if (
				x < 0 ||
				x > bounds.contentWidth ||
				y < 0 ||
				y > bounds.contentHeight
			) {
				console.warn(`Element positioned outside content bounds: (${x}, ${y})`);
			}
		}

		return true;
	} catch (error) {
		console.error("Failed to add element to viewport:", error);
		return false;
	}
}
