# Markup canvas

A high-performant canvas where you can place HTML elements for an zoomable and panable experience.

## Features

- 🚀 **High Performance**: Hardware-accelerated transforms with optimized matrix calculations
- 📱 **Multi-Platform**: Works on desktop (mouse + keyboard) and mobile (touch)
- 🎯 **Precise Control**: Zoom to mouse cursor, boundary management, and smooth animations
- 🔧 **Modular Design**: Use individual components or the complete solution
- 📦 **Zero Dependencies**: Pure JavaScript, no external libraries required
- 🎨 **Framework Agnostic**: Works with vanilla JS, React, Vue, Angular, etc.
- 📝 **TypeScript Support**: Full type definitions included

## Installation

```bash
npm install markup-canvas
```

## Quick Start

### HTML

```html
<div id="my-container" style="width: 800px; height: 600px;">
  <div>Your content here</div>
</div>
```

### JavaScript

```javascript
import { initializeMarkupCanvas } from "markup-canvas";

const container = document.getElementById("my-container");
const viewport = initializeMarkupCanvas(container, {
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

#### `initializeMarkupCanvas(container, options)`

Creates a complete markup canvas with all event handlers.

**Parameters:**

- `container` (HTMLElement): The container element
- `options` (Object): Configuration options

**Options:**

- `contentWidth` (number): Width of the content area (default: 8000)
- `contentHeight` (number): Height of the content area (default: 8000)
- `enableAcceleration` (boolean): Enable hardware acceleration (default: true)
- `enableLeftDrag` (boolean): Enable left mouse button dragging (default: true)
- `enableMiddleDrag` (boolean): Enable middle mouse button dragging (default: true)
- `requireSpaceForMouseDrag` (boolean): Require space key to be held for mouse dragging (default: false)
- `enableClickToZoom` (boolean): Enable click-to-zoom functionality (default: true)
- `clickZoomLevel` (number): Zoom level when clicking on content (default: 1.0 for 100% zoom)
- `clickZoomDuration` (number): Duration in milliseconds for click-to-zoom animation (default: 300)
- `requireOptionForClickZoom` (boolean): Require Option/Alt key to be held for click-to-zoom (default: false)
- `onTransformUpdate` (function): Callback for transform changes

**Returns:** Viewport object or null if initialization fails

### Viewport Methods

```javascript
// Zoom controls
viewport.setZoom(1.5); // Set zoom to 150%
viewport.zoomToPoint(400, 300, 2.0); // Zoom to 200% at point (400, 300)
viewport.zoomToFitContent(); // Fit content in viewport

// View controls
viewport.resetView(); // Reset to initial state
viewport.reset(); // Same as resetView

// Coordinate conversion
const contentCoords = viewport.viewportToContent(mouseX, mouseY);

// Add content
viewport.addContent(element, { x: 100, y: 100 });

// Get viewport information
const bounds = viewport.getBounds();

// Cleanup
viewport.cleanup(); // Remove all event listeners
```

### Dynamic Rulers

Add dynamic rulers that show viewport dimensions and scale:

```javascript
import { initializeMarkupCanvas, createRulers } from "markup-canvas";

// Initialize viewport
const viewport = initializeMarkupCanvas(container);

// Add rulers
const rulers = createRulers(viewport, {
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
  createViewport,
  setupWheelZoom,
  setupMouseDrag,
  setupKeyboardNavigation,
  createRulers,
} from "markup-canvas";

// Create viewport without automatic event handling
const viewport = createViewport(container, {
  contentWidth: 2000,
  contentHeight: 2000,
  enableEventHandling: false,
});

// Set up only the events you need
const wheelCleanup = setupWheelZoom(viewport);
const dragCleanup = setupMouseDrag(viewport);

// Add rulers
const rulers = createRulers(viewport);
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
import { initializeMarkupCanvas } from "markup-canvas";

const container = document.getElementById("image-container");
const viewport = initializeMarkupCanvas(container);

// Add an image
const img = document.createElement("img");
img.src = "large-image.jpg";
img.onload = () => {
  viewport.addContent(img, { x: 0, y: 0 });
  viewport.zoomToFitContent();
};
```

### Interactive Diagram

```javascript
const viewport = initializeMarkupCanvas(container, {
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
  viewport.zoomToPoint(150, 150, 2.0); // Zoom to this node
});

viewport.addContent(node, { x: 100, y: 100 });
```

### Space-Required Mouse Dragging

For applications where you want to prevent accidental dragging (e.g., when users are selecting text or interacting with UI elements), you can require the space key to be held down:

```javascript
const viewport = initializeMarkupCanvas(container, {
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
const viewport = initializeMarkupCanvas(container, {
  enableClickToZoom: true,
  clickZoomLevel: 1.0, // Zoom to 100% (actual size)
  requireOptionForClickZoom: true, // Require Option/Alt key
  contentWidth: 2000,
  contentHeight: 2000,
});

// Users must hold Option (Mac) or Alt (Windows/Linux) while clicking to zoom
// Regular clicks will work normally for other interactions
```

### Framework Integration

#### React

```jsx
import { useEffect, useRef } from "react";
import { initializeMarkupCanvas } from "markup-canvas";

function MarkupCanvasComponent() {
  const containerRef = useRef(null);
  const viewportRef = useRef(null);

  useEffect(() => {
    if (containerRef.current) {
      viewportRef.current = initializeMarkupCanvas(containerRef.current);
    }

    return () => {
      if (viewportRef.current) {
        viewportRef.current.cleanup();
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
4. **Memory Management**: Call `viewport.cleanup()` when removing components

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
