# Markup Canvas 🤿

A high-performance canvas-like container for placing HTML elements with zoom and pan support.

## Features

⚡️ **High Performance**: Hardware-accelerated transforms with optimized matrix calculations
📦 **Zero Dependencies**: Pure Typescript, no external libraries required
📝 **TypeScript Support**: Full type definitions available

## Installation

```bash
npm install markup-canvas
```

## Quick Start

### HTML

```html
<div id="markup-canvas" style="width: 800px; height: 600px;">
  <div>Your content here</div>
</div>
```

### JavaScript

```javascript
import { createMarkupCanvas } from "markup-canvas";

const container = document.getElementById("markup-canvas");
const canvas = createMarkupCanvas(container, {
  width: 8000,
  height: 8000,
});
```

## API Reference

### Main Functions

#### `createMarkupCanvas(container, options)`

Creates a complete markup canvas with all event handlers.

**Parameters:**

- `container` (HTMLElement): The container element
- `options` (Object): Configuration options

**Options:**

- `width` (number): Width of the content area (default: 8000)
- `height` (number): Height of the content area (default: 8000)
- `enableAcceleration` (boolean): Enable hardware acceleration (default: true)
- `enableKeyboardControls` (boolean): Enable built-in keyboard navigation (default: true)
- `enableLeftDrag` (boolean): Enable left mouse button dragging (default: true)
- `enableMiddleDrag` (boolean): Enable middle mouse button dragging (default: true)
- `requireSpaceForMouseDrag` (boolean): Require space key to be held for mouse dragging (default: false)
- `enableClickToZoom` (boolean): Enable click-to-zoom functionality (default: true)
- `clickZoomLevel` (number): Zoom level when clicking on content (default: 1.0 for 100% zoom)
- `clickZoomDuration` (number): Duration in milliseconds for click-to-zoom animation (default: 300)
- `requireOptionForClickZoom` (boolean): Require Option/Alt key to be held for click-to-zoom (default: false)
- `rulerSize` (number): Size of rulers in pixels, enables rulers and grid when > 0 (default: 0)
- `showGrid` (boolean): Show grid overlay when rulers are enabled (default: true)
- `gridColor` (string): Grid line color (default: 'rgba(0, 123, 255, 0.1)')
- `onTransformUpdate` (function): Callback for transform changes

**Returns:** Canvas object

### Canvas Methods

```javascript
// Zoom controls
canvas.setZoom(1.5); // Set zoom to 150%
canvas.zoomToPoint(400, 300, 2.0); // Zoom to 200% at point (400, 300)
canvas.zoomToFitContent(); // Fit content in canvas

// View controls
canvas.resetView(); // Reset to initial state
canvas.reset(); // Same as resetView

// Coordinate conversion
const contentCoords = canvas.canvasToContent(mouseX, mouseY);

// Add content
canvas.addContent(element, { x: 100, y: 100 });

// Get canvas information
const bounds = canvas.getBounds();

// Exposed control functions for custom keyboard implementation
canvas.panLeft(50); // Pan left by 50 pixels (default)
canvas.panRight(100); // Pan right by 100 pixels
canvas.panUp(75); // Pan up by 75 pixels
canvas.panDown(25); // Pan down by 25 pixels
canvas.zoomIn(0.1); // Zoom in by 10% (default)
canvas.zoomOut(0.2); // Zoom out by 20%
canvas.resetZoom(300); // Reset zoom with 300ms animation

// Mouse drag control functions
canvas.enableMouseDrag(); // Enable mouse dragging
canvas.disableMouseDrag(); // Disable mouse dragging
canvas.isMouseDragEnabled(); // Check if mouse drag is enabled

// Grid control functions (when rulers are enabled)
canvas.toggleGrid(); // Toggle grid visibility
canvas.showGrid(); // Show grid
canvas.hideGrid(); // Hide grid
canvas.isGridVisible(); // Check if grid is visible

// Additional utility functions
canvas.centerContent(300); // Center content in canvas with animation
canvas.fitToScreen(300); // Fit content to screen (alias for zoomToFitContent)
canvas.getVisibleArea(); // Get currently visible area coordinates
canvas.isPointVisible(x, y); // Check if a point is currently visible
canvas.scrollToPoint(x, y, 300); // Scroll to center a specific point

// Cleanup
canvas.cleanup(); // Remove all event listeners
```

### Dynamic Rulers

Add dynamic rulers that show canvas dimensions and scale:

```javascript
import { createMarkupCanvas, createRulers } from "markup-canvas";

// Initialize canvas
const canvas = createMarkupCanvas(container);

// Add rulers
const rulers = createRulers(canvas, {
  rulerSize: 30,
  showGrid: true,
  backgroundColor: "rgba(255, 255, 255, 0.95)",
  gridColor: "rgba(0, 123, 255, 0.1)",
});

// Control rulers
rulers.show();
rulers.hide();
rulers.toggleGrid();
rulers.destroy();
```

**Ruler Options:**

- `rulerSize` (number): Size of rulers in pixels (default: 30)
- `backgroundColor` (string): Background color of rulers (default: 'rgba(255, 255, 255, 0.95)')
- `borderColor` (string): Border color (default: '#ddd')
- `textColor` (string): Text color for labels (default: '#666')
- `majorTickColor` (string): Color for major tick marks (default: '#999')
- `minorTickColor` (string): Color for minor tick marks (default: '#ccc')
- `fontSize` (number): Font size for labels (default: 11)
- `fontFamily` (string): Font family (default: 'Monaco, Menlo, monospace')
- `showGrid` (boolean): Show grid overlay (default: true)
- `gridColor` (string): Grid line color (default: 'rgba(0, 123, 255, 0.1)')
- `units` (string): Unit label in corner (default: 'px')

### Modular Usage

You can also use individual components:

```javascript
import {
  createCanvas,
  setupWheelZoom,
  setupMouseDrag,
  setupKeyboardNavigation,
  createRulers,
} from "markup-canvas";

// Create canvas without automatic event handling
const canvas = createCanvas(container, {
  width: 2000,
  height: 2000,
  enableEventHandling: false,
});

// Set up only the events you need
const wheelCleanup = setupWheelZoom(canvas);
const dragCleanup = setupMouseDrag(canvas);

// Add rulers
const rulers = createRulers(canvas);
```

## Controls

### Mouse

- **Wheel**: Zoom in/out at cursor position
- **Ctrl/Cmd + Wheel**: Fine zoom control
- **Left Click + Drag**: Pan the content
- **Left Click**: Zoom to clicked point (100%)
- **Option/Alt + Left Click**: When `requireOptionForClickZoom` is enabled, hold Option/Alt to zoom
- **Space + Mouse Drag**: When `requireSpaceForMouseDrag` is enabled, hold Space to enable mouse dragging

### Keyboard

- **Arrow Keys**: Pan in direction
- **Shift + Arrow Keys**: Fast pan
- **+ / =**: Zoom in
- **-**: Zoom out
- **0**: Reset view
- **G**: Toggle grid (when rulers are enabled)

### Touch/Trackpad (Mobile)

- **Single Touch + Drag**: Pan the content
- **Pinch**: Zoom in/out at gesture center

## Framework Integration

### React

```jsx
import { useEffect, useRef } from "react";
import { createMarkupCanvas } from "markup-canvas";

function MarkupCanvasComponent() {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    if (containerRef.current) {
      canvasRef.current = createMarkupCanvas(containerRef.current);
    }

    return () => {
      if (canvasRef.current) {
        canvasRef.current.cleanup();
      }
    };
  }, []);

  return (
    <div ref={containerRef} style={{ width: "100vw", height: "100vh" }}>
      <div>Your React content here</div>
    </div>
  );
}
```

## License

MIT License - see LICENSE file for details
