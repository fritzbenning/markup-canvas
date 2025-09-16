/**
 * Canvas-related type definitions
 */

export interface Transform {
	scale: number;
	translateX: number;
	translateY: number;
}

export interface CanvasOptions {
	width?: number;
	height?: number;
	enableAcceleration?: boolean;
	enableEventHandling?: boolean;
	rulerSize?: number;
	onTransformUpdate?: (transform: Transform) => void;
}

export interface AddContentOptions {
	x?: number;
	y?: number;
	absolute?: boolean;
}

export interface CanvasBounds {
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

export interface BaseCanvas {
	container: HTMLElement;
	transformLayer: HTMLElement;
	contentLayer: HTMLElement;
	config: Required<CanvasOptions>;
	transform: Transform;
	getBounds: () => CanvasBounds;
	addContent: (element: HTMLElement, options?: AddContentOptions) => boolean;
	updateTransform: (newTransform: Partial<Transform>) => boolean;
	reset: () => boolean;
	handleResize: () => boolean;
	setZoom: (zoomLevel: number) => boolean;
	setInteractionMode: (mode: string) => boolean;
	canvasToContent: (x: number, y: number) => { x: number; y: number };
	zoomToPoint: (
		x: number,
		y: number,
		targetScale: number,
		duration?: number,
	) => boolean;
	resetView: (duration?: number) => boolean;
	zoomToFitContent: (duration?: number) => boolean;
}

export interface Canvas extends BaseCanvas {
	cleanup?: () => void;
	// Exposed control functions for custom keyboard implementation
	panLeft: (distance?: number) => boolean;
	panRight: (distance?: number) => boolean;
	panUp: (distance?: number) => boolean;
	panDown: (distance?: number) => boolean;
	zoomIn: (factor?: number) => boolean;
	zoomOut: (factor?: number) => boolean;
	resetZoom: (duration?: number) => boolean;
	// Mouse drag control functions
	enableMouseDrag: () => boolean;
	disableMouseDrag: () => boolean;
	isMouseDragEnabled: () => boolean;
	// Grid control functions
	toggleGrid?: () => boolean;
	showGrid?: () => boolean;
	hideGrid?: () => boolean;
	isGridVisible?: () => boolean;
	// Additional utility functions
	centerContent: (duration?: number) => boolean;
	fitToScreen: (duration?: number) => boolean;
	getVisibleArea: () => { x: number; y: number; width: number; height: number };
	isPointVisible: (x: number, y: number) => boolean;
	scrollToPoint: (x: number, y: number, duration?: number) => boolean;
}

export interface MarkupCanvasOptions {
	width?: number;
	height?: number;
	enableAcceleration?: boolean;
	enableEventHandling?: boolean;
	enableKeyboardControls?: boolean;
	smoothTransition?: boolean;
	zoomSpeed?: number;
	fineZoomSpeed?: number;
	enableLeftDrag?: boolean;
	enableMiddleDrag?: boolean;
	requireSpaceForMouseDrag?: boolean;
	enableClickToZoom?: boolean;
	clickZoomLevel?: number;
	clickZoomDuration?: number;
	requireOptionForClickZoom?: boolean;
	rulerSize?: number;
	showGrid?: boolean;
	gridColor?: string;
	onTransformUpdate?: (transform: Transform) => void;
}
