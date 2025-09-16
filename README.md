# Markup canvas

A high-performant canvas where you can place HTML elements for an zoomable and panable experience.

## Features

- 🚀 **High Performance**: Hardware-accelerated transforms with optimized matrix calculations
- 📱 **Multi-Platform**: Works on desktop (mouse + keyboard) and mobile (touch)
- 📦 **Zero Dependencies**: Pure Typescript, no external libraries required
- 📝 **TypeScript Support**: Full type definitions included

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
  contentWidth: 2000,
  contentHeight: 2000,
});
```

### Auto-initialization

Add the `data-markup-canvas` attribute to automatically initialize:

```html
<div data-markup-canvas style="width: 800px; height: 600px;">
  <div>Your content here</div>
</div>
```

## API Reference

### Main Functions

#### `createMarkupCanvas(container, options)`

Creates a complete markup canvas with all event handlers.

**Parameters:**

- `container` (HTMLElement): The container element
- `options` (Object): Configuration options

**Options:**

- `contentWidth` (number): Width of the content area (default: 8000)
- `contentHeight` (number): Height of the content area (default: 8000)
- `enableAcceleration` (boolean): Enable hardware acceleration (default: true)
- `enableKeyboardControls` (boolean): Enable built-in keyboard navigation (default: true)
- `enableLeftDrag` (boolean): Enable left mouse button dragging (default: true)
- `enableMiddleDrag` (boolean): Enable middle mouse button dragging (default: true)
- `requireSpaceForMouseDrag` (boolean): Require space key to be held for mouse dragging (default: false)
- `enableClickToZoom` (boolean): Enable click-to-zoom functionality (default: true)
- `clickZoomLevel` (number): Zoom level when clicking on content (default: 1.0 for 100% zoom)
- `clickZoomDuration` (number): Duration in milliseconds for click-to-zoom animation (default: 300)
- `requireOptionForClickZoom` (boolean): Require Option/Alt key to be held for click-to-zoom (default: false)
- `onTransformUpdate` (function): Callback for transform changes

**Returns:** Canvas object or null if initialization fails

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
  contentWidth: 2000,
  contentHeight: 2000,
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
- **Left Click**: Zoom to 100% and center at clicked point (when not dragging)
- **Option/Alt + Left Click**: When `requireOptionForClickZoom` is enabled, hold Option/Alt to zoom
- **Middle Click + Drag**: Pan the content (alternative)
- **Space + Mouse Drag**: When `requireSpaceForMouseDrag` is enabled, hold Space to enable mouse dragging

### Keyboard

- **Arrow Keys**: Pan in direction
- **Shift + Arrow Keys**: Fast pan
- **+ / =**: Zoom in
- **-**: Zoom out
- **0**: Reset view

### Touch (Mobile)

- **Single Touch + Drag**: Pan the content
- **Pinch**: Zoom in/out at gesture center

## Examples

### Basic Image Viewer

```javascript
import { createMarkupCanvas } from "markup-canvas";

const container = document.getElementById("image-container");
const canvas = createMarkupCanvas(container);

// Add an image
const img = document.createElement("img");
img.src = "large-image.jpg";
img.onload = () => {
  canvas.addContent(img, { x: 0, y: 0 });
  canvas.zoomToFitContent();
};
```

### Interactive Diagram

```javascript
const canvas = createMarkupCanvas(container, {
  contentWidth: 5000,
  contentHeight: 3000,
  onTransformUpdate: (transform) => {
    console.log(`Zoom: ${Math.round(transform.scale * 100)}%`);
  },
});

// Add interactive elements
const node = document.createElement("div");
node.className = "diagram-node";
node.style.width = "100px";
node.style.height = "100px";
node.addEventListener("click", () => {
  canvas.zoomToPoint(150, 150, 2.0); // Zoom to this node
});

canvas.addContent(node, { x: 100, y: 100 });
```

### Space-Required Mouse Dragging

For applications where you want to prevent accidental dragging (e.g., when users are selecting text or interacting with UI elements), you can require the space key to be held down:

```javascript
const canvas = createMarkupCanvas(container, {
  requireSpaceForMouseDrag: true,
  contentWidth: 2000,
  contentHeight: 2000,
});

// Now users must hold Space while dragging with the mouse
// Trackpad gestures and wheel zoom still work normally
```

### Option Key Click-to-Zoom

For precise control over when click-to-zoom activates, you can require the Option/Alt key:

```javascript
const canvas = createMarkupCanvas(container, {
  enableClickToZoom: true,
  clickZoomLevel: 1.0, // Zoom to 100% (actual size)
  requireOptionForClickZoom: true, // Require Option/Alt key
  contentWidth: 2000,
  contentHeight: 2000,
});

// Users must hold Option (Mac) or Alt (Windows/Linux) while clicking to zoom
// Regular clicks will work normally for other interactions
```

### Custom Keyboard Controls

For applications with existing keyboard shortcut systems, you can disable built-in keyboard controls and implement your own:

```javascript
const canvas = createMarkupCanvas(container, {
  enableKeyboardControls: false, // Disable built-in keyboard controls
  contentWidth: 2000,
  contentHeight: 2000,
});

// Implement your own keyboard handler
document.addEventListener("keydown", (event) => {
  if (document.activeElement !== canvas.container) return;

  const fastPan = event.shiftKey;
  const panDistance = fastPan ? 150 : 50;
  const zoomFactor = fastPan ? 0.2 : 0.1;

  switch (event.key.toLowerCase()) {
    case "w":
      canvas.panUp(panDistance);
      event.preventDefault();
      break;
    case "s":
      canvas.panDown(panDistance);
      event.preventDefault();
      break;
    case "a":
      canvas.panLeft(panDistance);
      event.preventDefault();
      break;
    case "d":
      canvas.panRight(panDistance);
      event.preventDefault();
      break;
    case "q":
      canvas.zoomOut(zoomFactor);
      event.preventDefault();
      break;
    case "e":
      canvas.zoomIn(zoomFactor);
      event.preventDefault();
      break;
    case "r":
      canvas.resetZoom(0);
      event.preventDefault();
      break;
  }
});
```

**Available Control Functions:**

- `panLeft(distance)` - Pan left by specified pixels (default: 50)
- `panRight(distance)` - Pan right by specified pixels (default: 50)
- `panUp(distance)` - Pan up by specified pixels (default: 50)
- `panDown(distance)` - Pan down by specified pixels (default: 50)
- `zoomIn(factor)` - Zoom in by factor (default: 0.1 = 10%)
- `zoomOut(factor)` - Zoom out by factor (default: 0.1 = 10%)
- `resetZoom(duration)` - Reset to initial zoom with animation duration in ms (default: 0)

### Dynamic Mouse Drag Control

You can enable and disable mouse dragging at runtime, perfect for implementing custom space bar controls or mode switching:

```javascript
const canvas = createMarkupCanvas(container, {
  enableKeyboardControls: false, // Use custom keyboard handling
  contentWidth: 2000,
  contentHeight: 2000,
});

// Custom space bar implementation
let spacePressed = false;

document.addEventListener("keydown", (event) => {
  if (event.key === " " && !spacePressed) {
    spacePressed = true;
    canvas.enableMouseDrag();
    canvas.container.style.cursor = "grab";
    event.preventDefault();
  }
});

document.addEventListener("keyup", (event) => {
  if (event.key === " " && spacePressed) {
    spacePressed = false;
    canvas.disableMouseDrag();
    canvas.container.style.cursor = "default";
    event.preventDefault();
  }
});

// Check current state
if (canvas.isMouseDragEnabled()) {
  console.log("Mouse dragging is currently enabled");
}
```

**Mouse Drag Control Functions:**

- `enableMouseDrag()` - Enable mouse dragging functionality
- `disableMouseDrag()` - Disable mouse dragging functionality
- `isMouseDragEnabled()` - Returns true if mouse dragging is currently enabled

**Additional Utility Functions:**

- `centerContent(duration)` - Center content in the canvas viewport
- `fitToScreen(duration)` - Fit content to screen (same as zoomToFitContent)
- `getVisibleArea()` - Get the currently visible area as `{x, y, width, height}`
- `isPointVisible(x, y)` - Check if a specific point is currently visible
- `scrollToPoint(x, y, duration)` - Scroll to center a specific content point

### Framework Integration

#### React

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
    <div ref={containerRef} style={{ width: "100%", height: "500px" }}>
      <div>Your React content here</div>
    </div>
  );
}
```

## Browser Support

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## Performance Tips

1. **Hardware Acceleration**: Enabled by default, provides smooth 60fps transforms
2. **Content Size**: Larger content areas may impact performance on older devices
3. **Event Handling**: Use modular imports to include only needed functionality
4. **Memory Management**: Call `canvas.cleanup()` when removing components

## License

MIT License - see LICENSE file for details

## Contributing

Contributions are welcome! Please read our contributing guidelines and submit pull requests to our GitHub repository.

## Changelog

### 1.0.0

- Initial release
- Core zoom and pan functionality
- Multi-platform event handling
- TypeScript support
- Modular architecture
