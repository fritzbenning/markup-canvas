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
  transform: Transform;
}
