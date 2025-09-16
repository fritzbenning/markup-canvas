/**
 * Dynamic Ruler System
 * Creates horizontal and vertical rulers that show canvas dimensions and scale
 */

// Type definitions
interface Canvas {
	container: HTMLElement;
	transformLayer?: HTMLElement;
	transform: Transform;
	updateTransform: (newTransform: Partial<Transform>) => boolean;
	getBounds: () => CanvasBounds;
}

interface Transform {
	scale: number;
	translateX: number;
	translateY: number;
}

interface CanvasBounds {
	width: number;
	height: number;
	scale?: number;
	translateX?: number;
	translateY?: number;
}

interface RulerOptions {
	rulerSize?: number;
	backgroundColor?: string;
	borderColor?: string;
	textColor?: string;
	majorTickColor?: string;
	minorTickColor?: string;
	fontSize?: number;
	fontFamily?: string;
	showGrid?: boolean;
	gridColor?: string;
	units?: string;
}

interface RulerSystem {
	horizontalRuler: HTMLElement;
	verticalRuler: HTMLElement;
	cornerBox: HTMLElement;
	gridOverlay?: HTMLElement;
	update: () => void;
	show: () => void;
	hide: () => void;
	toggleGrid: () => void;
	destroy: () => void;
}

/**
 * Creates dynamic rulers for a zoomable canvas
 */
export function createRulers(
	canvas: Canvas,
	options: RulerOptions = {},
): RulerSystem | null {
	if (!canvas?.container) {
		console.error("Invalid canvas provided to createRulers");
		return null;
	}

	const config: Required<RulerOptions> = {
		rulerSize: 24,
		backgroundColor: "rgba(255, 255, 255, 0.95)",
		borderColor: "#ddd",
		textColor: "#666",
		majorTickColor: "#999",
		minorTickColor: "#ccc",
		fontSize: 10,
		fontFamily: "Monaco, Menlo, monospace",
		showGrid: true,
		gridColor: "rgba(0, 123, 255, 0.1)",
		units: "px",
		...options,
	};

	let horizontalRuler!: HTMLElement;
	let verticalRuler!: HTMLElement;
	let cornerBox!: HTMLElement;
	let gridOverlay: HTMLElement | undefined;
	let isDestroyed = false;

	// Create ruler elements
	function createRulerElements(): void {
		const container = canvas.container;

		// Horizontal ruler
		horizontalRuler = document.createElement("div");
		horizontalRuler.className = "canvas-ruler horizontal-ruler";
		horizontalRuler.style.cssText = `
			position: absolute;
			top: 0;
			left: ${config.rulerSize}px;
			right: 0;
			height: ${config.rulerSize}px;
			background: ${config.backgroundColor};
			border-bottom: 1px solid ${config.borderColor};
			border-right: 1px solid ${config.borderColor};
			z-index: 1000;
			pointer-events: none;
			font-family: ${config.fontFamily};
			font-size: ${config.fontSize}px;
			color: ${config.textColor};
			overflow: hidden;
		`;

		// Vertical ruler
		verticalRuler = document.createElement("div");
		verticalRuler.className = "canvas-ruler vertical-ruler";
		verticalRuler.style.cssText = `
			position: absolute;
			top: ${config.rulerSize}px;
			left: 0;
			bottom: 0;
			width: ${config.rulerSize}px;
			background: ${config.backgroundColor};
			border-right: 1px solid ${config.borderColor};
			border-bottom: 1px solid ${config.borderColor};
			z-index: 1000;
			pointer-events: none;
			font-family: ${config.fontFamily};
			font-size: ${config.fontSize}px;
			color: ${config.textColor};
			overflow: hidden;
		`;

		// Corner box
		cornerBox = document.createElement("div");
		cornerBox.className = "canvas-ruler corner-box";
		cornerBox.style.cssText = `
			position: absolute;
			top: 0;
			left: 0;
			width: ${config.rulerSize}px;
			height: ${config.rulerSize}px;
			background: ${config.backgroundColor};
			border-right: 1px solid ${config.borderColor};
			border-bottom: 1px solid ${config.borderColor};
			z-index: 1001;
			display: flex;
			align-items: center;
			justify-content: center;
			font-family: ${config.fontFamily};
			font-size: ${config.fontSize - 2}px;
			color: ${config.textColor};
			pointer-events: none;
		`;
		cornerBox.textContent = config.units;

		// Grid overlay (optional)
		if (config.showGrid) {
			gridOverlay = document.createElement("div");
			gridOverlay.className = "canvas-ruler grid-overlay";
			gridOverlay.style.cssText = `
				position: absolute;
				top: ${config.rulerSize}px;
				left: ${config.rulerSize}px;
				right: 0;
				bottom: 0;
				pointer-events: none;
				z-index: 100;
				background-image: 
					linear-gradient(${config.gridColor} 1px, transparent 1px),
					linear-gradient(90deg, ${config.gridColor} 1px, transparent 1px);
				background-size: 100px 100px;
				opacity: 0.5;
			`;
		}

		// Add elements to container
		container.appendChild(horizontalRuler);
		container.appendChild(verticalRuler);
		container.appendChild(cornerBox);
		if (gridOverlay) {
			container.appendChild(gridOverlay);
		}

		// Adjust canvas content area
		if (canvas.transformLayer) {
			canvas.transformLayer.style.top = `${config.rulerSize}px`;
			canvas.transformLayer.style.left = `${config.rulerSize}px`;
			canvas.transformLayer.style.width = `calc(100% - ${config.rulerSize}px)`;
			canvas.transformLayer.style.height = `calc(100% - ${config.rulerSize}px)`;
		}
	}

	// Update ruler markings based on current canvas state
	function updateRulers(): void {
		if (isDestroyed || !horizontalRuler || !verticalRuler) return;

		const bounds = canvas.getBounds();
		const scale = bounds.scale || 1;
		const translateX = bounds.translateX || 0;
		const translateY = bounds.translateY || 0;

		// Calculate visible content area
		const canvasWidth = bounds.width - config.rulerSize;
		const canvasHeight = bounds.height - config.rulerSize;

		// Calculate content coordinates of visible area
		const contentLeft = -translateX / scale;
		const contentTop = -translateY / scale;
		const contentRight = contentLeft + canvasWidth / scale;
		const contentBottom = contentTop + canvasHeight / scale;

		// Update horizontal ruler
		updateHorizontalRuler(contentLeft, contentRight, canvasWidth, scale);

		// Update vertical ruler
		updateVerticalRuler(contentTop, contentBottom, canvasHeight, scale);

		// Update grid if enabled
		if (gridOverlay) {
			updateGrid(scale, translateX, translateY);
		}
	}

	// Update horizontal ruler markings
	function updateHorizontalRuler(
		contentLeft: number,
		contentRight: number,
		canvasWidth: number,
		scale: number,
	): void {
		const rulerWidth = canvasWidth;
		const contentWidth = contentRight - contentLeft;

		// Calculate appropriate tick spacing
		const tickSpacing = calculateTickSpacing(contentWidth, rulerWidth);

		// Clear existing content
		horizontalRuler.innerHTML = "";

		// Create tick marks and labels
		const startTick = Math.floor(contentLeft / tickSpacing) * tickSpacing;
		const endTick = Math.ceil(contentRight / tickSpacing) * tickSpacing;

		for (let pos = startTick; pos <= endTick; pos += tickSpacing) {
			const pixelPos = (pos - contentLeft) * scale;

			if (pixelPos >= -50 && pixelPos <= rulerWidth + 50) {
				createHorizontalTick(pos, pixelPos, tickSpacing, scale);
			}
		}
	}

	// Update vertical ruler markings
	function updateVerticalRuler(
		contentTop: number,
		contentBottom: number,
		canvasHeight: number,
		scale: number,
	): void {
		const rulerHeight = canvasHeight;
		const contentHeight = contentBottom - contentTop;

		// Calculate appropriate tick spacing
		const tickSpacing = calculateTickSpacing(contentHeight, rulerHeight);

		// Clear existing content
		verticalRuler.innerHTML = "";

		// Create tick marks and labels
		const startTick = Math.floor(contentTop / tickSpacing) * tickSpacing;
		const endTick = Math.ceil(contentBottom / tickSpacing) * tickSpacing;

		for (let pos = startTick; pos <= endTick; pos += tickSpacing) {
			const pixelPos = (pos - contentTop) * scale;

			if (pixelPos >= -50 && pixelPos <= rulerHeight + 50) {
				createVerticalTick(pos, pixelPos, tickSpacing, scale);
			}
		}
	}

	// Calculate appropriate tick spacing based on zoom level
	function calculateTickSpacing(
		contentSize: number,
		canvasSize: number,
	): number {
		const targetTicks = Math.max(5, Math.min(20, canvasSize / 50));
		const rawSpacing = contentSize / targetTicks;

		// Round to nice numbers
		const magnitude = 10 ** Math.floor(Math.log10(rawSpacing));
		const normalized = rawSpacing / magnitude;

		let niceSpacing: number;
		if (normalized <= 1) niceSpacing = 1;
		else if (normalized <= 2) niceSpacing = 2;
		else if (normalized <= 5) niceSpacing = 5;
		else niceSpacing = 10;

		return niceSpacing * magnitude;
	}

	// Create horizontal tick mark
	function createHorizontalTick(
		position: number,
		pixelPos: number,
		tickSpacing: number,
		scale: number,
	): void {
		const tick = document.createElement("div");
		const isMajor = position % (tickSpacing * 5) === 0;
		const tickHeight = isMajor ? 6 : 4;

		tick.style.cssText = `
			position: absolute;
			left: ${pixelPos}px;
			bottom: 0;
			width: 1px;
			height: ${tickHeight}px;
			background: ${isMajor ? config.majorTickColor : config.minorTickColor};
		`;

		horizontalRuler.appendChild(tick);

		// Add label for major ticks
		if (isMajor) {
			const label = document.createElement("div");
			label.style.cssText = `
				position: absolute;
				left: ${pixelPos}px;
				bottom: ${tickHeight}px;
				font-size: ${config.fontSize}px;
				color: ${config.textColor};
				white-space: nowrap;
				pointer-events: none;
			`;
			label.textContent = Math.round(position).toString();
			horizontalRuler.appendChild(label);
		}
	}

	// Create vertical tick mark
	function createVerticalTick(
		position: number,
		pixelPos: number,
		tickSpacing: number,
		scale: number,
	): void {
		const tick = document.createElement("div");
		const isMajor = position % (tickSpacing * 5) === 0;
		const tickWidth = isMajor ? 8 : 4;

		tick.style.cssText = `
			position: absolute;
			top: ${pixelPos}px;
			right: 0;
			width: ${tickWidth}px;
			height: 1px;
			background: ${isMajor ? config.majorTickColor : config.minorTickColor};
		`;

		verticalRuler.appendChild(tick);

		// Add label for major ticks
		if (isMajor) {
			const label = document.createElement("div");
			label.style.cssText = `
				position: absolute;
				top: ${pixelPos - 6}px;
				right: ${tickWidth + 6}px;
				font-size: ${config.fontSize}px;
				color: ${config.textColor};
				white-space: nowrap;
				pointer-events: none;
				transform: rotate(-90deg);
				transform-origin: right center;
			`;
			label.textContent = Math.round(position).toString();
			verticalRuler.appendChild(label);
		}
	}

	// Update grid overlay
	function updateGrid(
		scale: number,
		translateX: number,
		translateY: number,
	): void {
		if (!gridOverlay) return;

		// Calculate grid size based on scale
		const baseGridSize = 100;
		let gridSize = baseGridSize * scale;

		// Adjust grid size for readability
		while (gridSize < 20) gridSize *= 2;
		while (gridSize > 200) gridSize /= 2;

		gridOverlay.style.backgroundSize = `${gridSize}px ${gridSize}px`;
		gridOverlay.style.backgroundPosition = `${translateX % gridSize}px ${
			translateY % gridSize
		}px`;
	}

	// Set up event listeners
	function setupEventListeners(): () => void {
		// Listen for canvas transform updates
		const originalUpdateTransform = canvas.updateTransform;
		canvas.updateTransform = function (
			newTransform: Partial<Transform>,
		): boolean {
			const result = originalUpdateTransform.call(this, newTransform);
			updateRulers();
			return result;
		};

		// Listen for window resize
		const resizeHandler = (): void => {
			if (!isDestroyed) {
				setTimeout(updateRulers, 100);
			}
		};
		window.addEventListener("resize", resizeHandler);

		// Store cleanup function
		return () => {
			window.removeEventListener("resize", resizeHandler);
			canvas.updateTransform = originalUpdateTransform;
		};
	}

	// Initialize rulers
	try {
		createRulerElements();
		const cleanupEvents = setupEventListeners();
		updateRulers();

		// Return ruler system object
		return {
			horizontalRuler,
			verticalRuler,
			cornerBox,
			gridOverlay,

			// Update rulers manually
			update: updateRulers,

			// Show/hide rulers
			show: () => {
				if (horizontalRuler) horizontalRuler.style.display = "block";
				if (verticalRuler) verticalRuler.style.display = "block";
				if (cornerBox) cornerBox.style.display = "flex";
				if (gridOverlay) gridOverlay.style.display = "block";
			},

			hide: () => {
				if (horizontalRuler) horizontalRuler.style.display = "none";
				if (verticalRuler) verticalRuler.style.display = "none";
				if (cornerBox) cornerBox.style.display = "none";
				if (gridOverlay) gridOverlay.style.display = "none";
			},

			// Toggle grid
			toggleGrid: () => {
				if (gridOverlay) {
					const isVisible = gridOverlay.style.display !== "none";
					gridOverlay.style.display = isVisible ? "none" : "block";
				}
			},

			// Cleanup
			destroy: () => {
				isDestroyed = true;
				cleanupEvents();

				if (horizontalRuler?.parentNode) {
					horizontalRuler.parentNode.removeChild(horizontalRuler);
				}
				if (verticalRuler?.parentNode) {
					verticalRuler.parentNode.removeChild(verticalRuler);
				}
				if (cornerBox?.parentNode) {
					cornerBox.parentNode.removeChild(cornerBox);
				}
				if (gridOverlay?.parentNode) {
					gridOverlay.parentNode.removeChild(gridOverlay);
				}

				// Restore canvas transform layer positioning
				if (canvas.transformLayer) {
					canvas.transformLayer.style.top = "0";
					canvas.transformLayer.style.left = "0";
					canvas.transformLayer.style.width = "100%";
					canvas.transformLayer.style.height = "100%";
				}
			},
		};
	} catch (error) {
		console.error("Failed to create rulers:", error);
		return null;
	}
}
