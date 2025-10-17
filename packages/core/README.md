# @markup-canvas/core

Lightweight, canvas-like container with smooth pan and zoom capabilities. Simply add your HTML or React content inside.

## Features

- 🚀 **High Performance**: 60fps smooth animations with GPU acceleration
- 🎯 **Precise Control**: Zoom, pan, and navigate with mouse, keyboard, or touch
- 📏 **Rulers & Grid**: Optional rulers and grid overlay
- 🔧 **Event System**: Built-in EventEmitter for reactive updates
- 📦 **TypeScript**: Full TypeScript support with comprehensive types

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

### Config Options

#### Canvas Dimensions

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `width` | `number` | - | Canvas width in pixels |
| `height` | `number` | - | Canvas height in pixels |
| `enableAcceleration` | `boolean` | `true` | Enable hardware acceleration |

#### Interaction Controls

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `enableZoom` | `boolean` | `true` | Enable zoom functionality |
| `enablePan` | `boolean` | `true` | Enable pan functionality |
| `enableTouch` | `boolean` | `true` | Enable touch gestures |
| `enableKeyboard` | `boolean` | `true` | Enable keyboard controls |
| `limitKeyboardEventsToCanvas` | `boolean` | `true` | Limit keyboard events to when canvas is focused |

#### Zoom Behavior

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `zoomSpeed` | `number` | `1.2` | Zoom speed factor |
| `minZoom` | `number` | `0.1` | Minimum zoom level |
| `maxZoom` | `number` | `10` | Maximum zoom level |
| `enableTransition` | `boolean` | `false` | Enable smooth transitions |
| `transitionDuration` | `number` | `300` | Transition duration in ms |
| `enableAdaptiveSpeed` | `boolean` | `true` | Enable adaptive zoom speed |

#### Pan Behavior

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `enableLeftDrag` | `boolean` | `true` | Enable left mouse button drag |
| `enableMiddleDrag` | `boolean` | `true` | Enable middle mouse button drag |
| `requireSpaceForMouseDrag` | `boolean` | `false` | Require space key for mouse drag |
| `keyboardPanStep` | `number` | `50` | Keyboard pan step size in pixels |
| `keyboardFastMultiplier` | `number` | `3` | Fast pan multiplier (with shift key) |
| `keyboardZoomStep` | `number` | `0.2` | Keyboard zoom step size |

#### Click-to-Zoom

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `enableClickToZoom` | `boolean` | `false` | Enable click to zoom |
| `clickZoomLevel` | `number` | `2` | Target zoom level for click-to-zoom |
| `requireOptionForClickZoom` | `boolean` | `false` | Require Option/Alt key for click-to-zoom |

#### Visual Elements

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `enableRulers` | `boolean` | `true` | Show rulers on top and left |
| `enableGrid` | `boolean` | `false` | Show background grid |
| `gridColor` | `string` | `"#e0e0e0"` | Grid line color |

#### Ruler Styling

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `rulerBackgroundColor` | `string` | `"#f5f5f5"` | Ruler background color |
| `rulerBorderColor` | `string` | `"#d0d0d0"` | Ruler border color |
| `rulerTextColor` | `string` | `"#666666"` | Ruler text color |
| `rulerMajorTickColor` | `string` | `"#666666"` | Major tick mark color |
| `rulerMinorTickColor` | `string` | `"#999999"` | Minor tick mark color |
| `rulerFontSize` | `number` | `12` | Ruler font size in pixels |
| `rulerFontFamily` | `string` | `"monospace"` | Ruler font family |
| `rulerUnits` | `string` | `"px"` | Ruler units label |

#### Callbacks

| Option | Type | Description |
|--------|------|-------------|
| `onTransformUpdate` | `(transform: Transform) => void` | Called continuously during transform updates |

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

## API

See the [main documentation](../../README.md) for full API reference.

## License

**CC BY-NC 4.0** - Creative Commons Attribution-NonCommercial 4.0 International

This project is licensed for non-commercial use only. See the [LICENSE](../../LICENSE) file for details.

