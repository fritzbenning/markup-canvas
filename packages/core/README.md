# @markup-canvas/core

High-performance canvas-like container with pan and zoom capabilities.

## Installation

```bash
npm install @markup-canvas/core
# or
pnpm add @markup-canvas/core
# or
yarn add @markup-canvas/core
```

## Usage

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

// Listen to events
canvas.on('zoom', (zoom) => {
  console.log('Zoom level:', zoom);
});

canvas.on('transform', (transform) => {
  console.log('Transform:', transform);
});

// Control the canvas
canvas.zoomIn(0.1);
canvas.zoomOut(0.1);
canvas.resetZoom();
canvas.fitToScreen();
canvas.centerContent();

// Cleanup
canvas.cleanup();
```

## Features

- 🚀 **High Performance**: 60fps smooth animations with GPU acceleration
- 🎯 **Precise Control**: Zoom, pan, and navigate with mouse, keyboard, or touch
- 📏 **Rulers & Grid**: Optional rulers and grid overlay
- 🎨 **Pure HTML**: Use any HTML content or framework components
- 🔧 **Event System**: Built-in EventEmitter for reactive updates
- 📦 **TypeScript**: Full TypeScript support with comprehensive types

## API

See the [main documentation](../../README.md) for full API reference.

## License

MIT

