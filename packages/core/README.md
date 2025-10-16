# @markup-canvas/core

High-performance canvas-like container with pan and zoom capabilities.

## ✨ Live Demo

Check out the live demo: [https://markup-canvas.vercel.app/](https://markup-canvas.vercel.app/)

## Installation

```bash
npm install @markup-canvas/core
# or
pnpm add @markup-canvas/core
# or
yarn add @markup-canvas/core
```

**Using React?** Check out [`@markup-canvas/react`](../react) for a React component and hooks.

## Usage

### Basic Setup

```javascript
import { MarkupCanvas } from '@markup-canvas/core';

const container = document.getElementById('canvas');

const canvas = new MarkupCanvas(container, {
  width: 20000,
  height: 15000,
  enableZoom: true,
  enablePan: true,
  enableKeyboard: true,
  enableRulers: true,
  enableGrid: true,
});
```

### Event Handling

Listen to various events emitted by the canvas:

```javascript
// Zoom changes
canvas.on('zoom', (zoom) => {
  console.log('Zoom level:', zoom);
});

// Transform changes (includes zoom and pan)
canvas.on('transform', (transform) => {
  console.log('Transform:', transform);
  // { scale: 1.5, translateX: 100, translateY: 50 }
});

// Pan changes
canvas.on('pan', (pan) => {
  console.log('Pan position:', pan);
  // { x: 100, y: 50 }
});

// Canvas is ready
canvas.on('ready', () => {
  console.log('Canvas is ready!');
});
```

### Programmatic Control

Control the canvas programmatically with these methods:

```javascript
// Zoom controls
canvas.zoomIn(0.1);      // Zoom in by 10%
canvas.zoomOut(0.1);     // Zoom out by 10%
canvas.resetZoom();      // Reset to 100%
canvas.setZoom(2.0);     // Set specific zoom level

// Pan controls
canvas.scrollToPoint(x, y);  // Pan to specific coordinates
canvas.centerContent();      // Center the content

// Fit to screen
canvas.fitToScreen();    // Fit content to viewport

// Get current state
const zoom = canvas.transform.scale;
const pan = {
  x: canvas.transform.translateX,
  y: canvas.transform.translateY
};
```

### Cleanup

Always cleanup when you're done:

```javascript
canvas.cleanup();
```

### Complete Example

Here's a complete example with HTML:

```html
<!DOCTYPE html>
<html>
<head>
  <style>
    #canvas-container {
      width: 100vw;
      height: 100vh;
      position: relative;
    }
    
    .controls {
      position: fixed;
      top: 20px;
      left: 20px;
      z-index: 1000;
    }
    
    .content {
      width: 800px;
      height: 600px;
      background: white;
      padding: 20px;
    }
  </style>
</head>
<body>
  <div class="controls">
    <button onclick="canvas.zoomIn()">Zoom In</button>
    <button onclick="canvas.zoomOut()">Zoom Out</button>
    <button onclick="canvas.resetZoom()">Reset</button>
    <button onclick="canvas.fitToScreen()">Fit</button>
    <span id="zoom-display">100%</span>
  </div>
  
  <div id="canvas-container">
    <div class="content">
      <h1>Your Content Here</h1>
      <p>This content can be panned and zoomed!</p>
    </div>
  </div>

  <script type="module">
    import { MarkupCanvas } from '@markup-canvas/core';
    
    const container = document.getElementById('canvas-container');
    
    window.canvas = new MarkupCanvas(container, {
      width: 20000,
      height: 15000,
      enableZoom: true,
      enablePan: true,
      enableKeyboard: true,
      enableRulers: true,
      enableGrid: true,
    });
    
    // Update zoom display
    canvas.on('zoom', (zoom) => {
      document.getElementById('zoom-display').textContent = 
        `${Math.round(zoom * 100)}%`;
    });
  </script>
</body>
</html>
```

## Features

- 🚀 **High Performance**: 60fps smooth animations with GPU acceleration
- 🎯 **Precise Control**: Zoom, pan, and navigate with mouse, keyboard, or touch
- 📏 **Rulers & Grid**: Optional rulers and grid overlay
- 🎨 **Pure HTML**: Use any HTML content or framework components
- 🔧 **Event System**: Built-in EventEmitter for reactive updates
- 📦 **TypeScript**: Full TypeScript support with comprehensive types

## Configuration Options

### Canvas Dimensions
- `width?: number` - Canvas width in pixels
- `height?: number` - Canvas height in pixels
- `enableAcceleration?: boolean` - Enable hardware acceleration

### Interaction Controls
- `enableZoom?: boolean` - Enable zoom functionality
- `enablePan?: boolean` - Enable pan functionality
- `enableTouch?: boolean` - Enable touch gestures
- `enableKeyboard?: boolean` - Enable keyboard controls
- `limitKeyboardEventsToCanvas?: boolean` - Limit keyboard events to when canvas is focused

### Zoom Behavior
- `zoomSpeed?: number` - Zoom speed factor
- `minZoom?: number` - Minimum zoom level
- `maxZoom?: number` - Maximum zoom level
- `enableTransition?: boolean` - Enable smooth transitions
- `transitionDuration?: number` - Transition duration in ms
- `enableAdaptiveSpeed?: boolean` - Enable adaptive zoom speed

### Pan Behavior
- `enableLeftDrag?: boolean` - Enable left mouse button drag
- `enableMiddleDrag?: boolean` - Enable middle mouse button drag
- `requireSpaceForMouseDrag?: boolean` - Require space key for mouse drag
- `keyboardPanStep?: number` - Keyboard pan step size
- `keyboardFastMultiplier?: number` - Fast pan multiplier (with shift)
- `keyboardZoomStep?: number` - Keyboard zoom step size

### Click-to-Zoom
- `enableClickToZoom?: boolean` - Enable click to zoom
- `clickZoomLevel?: number` - Target zoom level for click-to-zoom
- `requireOptionForClickZoom?: boolean` - Require Option/Alt key for click-to-zoom

### Visual Elements
- `enableRulers?: boolean` - Show rulers
- `enableGrid?: boolean` - Show background grid
- `gridColor?: string` - Grid line color

### Ruler Styling
- `rulerBackgroundColor?: string` - Ruler background color
- `rulerBorderColor?: string` - Ruler border color
- `rulerTextColor?: string` - Ruler text color
- `rulerMajorTickColor?: string` - Major tick mark color
- `rulerMinorTickColor?: string` - Minor tick mark color
- `rulerFontSize?: number` - Ruler font size
- `rulerFontFamily?: string` - Ruler font family
- `rulerUnits?: string` - Ruler units label

### Callbacks
- `onTransformUpdate?: (transform: Transform) => void` - Called on transform update

## API

See the [main documentation](../../README.md) for full API reference.

## License

**CC BY-NC 4.0** - Creative Commons Attribution-NonCommercial 4.0 International

This project is licensed for non-commercial use only. See the [LICENSE](../../LICENSE) file for details.

