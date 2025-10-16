# @markup-canvas/react

React components and hooks for `@markup-canvas/core`.

## Installation

```bash
npm install @markup-canvas/react @markup-canvas/core
# or
pnpm add @markup-canvas/react @markup-canvas/core
# or
yarn add @markup-canvas/react @markup-canvas/core
```

## Usage

### Component API

```tsx
import { useRef } from 'react';
import { MarkupCanvas, type MarkupCanvasRef } from '@markup-canvas/react';

function App() {
  const canvasRef = useRef<MarkupCanvasRef>(null);

  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <button onClick={() => canvasRef.current?.zoomIn()}>Zoom In</button>
      <button onClick={() => canvasRef.current?.zoomOut()}>Zoom Out</button>
      
      <MarkupCanvas
        ref={canvasRef}
        width={20000}
        height={15000}
        enableZoom={true}
        enablePan={true}
        enableKeyboard={true}
        onZoomChange={(zoom) => console.log('Zoom:', zoom)}
        onReady={(canvas) => console.log('Canvas ready:', canvas)}
      >
        <div style={{ position: 'absolute', top: 100, left: 100 }}>
          <h1>Zoomable Content</h1>
          <p>This content can be panned and zoomed!</p>
        </div>
      </MarkupCanvas>
    </div>
  );
}
```

### Hook API

```tsx
import { useMarkupCanvas } from '@markup-canvas/react';

function App() {
  const { canvas, transform, zoomIn, zoomOut, fitToContent } = useMarkupCanvas({
    onZoomChange: (zoom) => console.log('Zoom:', zoom),
  });

  return (
    <div>
      <button onClick={() => zoomIn()}>Zoom In</button>
      <button onClick={() => zoomOut()}>Zoom Out</button>
      <span>Current zoom: {transform.scale.toFixed(2)}</span>
      
      <div
        ref={(el) => el && canvas?.initialize(el)}
        style={{ width: '100%', height: '500px' }}
      >
        {/* Content */}
      </div>
    </div>
  );
}
```

## API

### Component Props

All props from `MarkupCanvasConfig` plus:

- `children`: React nodes to render inside the canvas
- `className`: CSS class name
- `style`: Inline styles
- `onTransformChange`: Callback for transform changes
- `onZoomChange`: Callback for zoom changes
- `onPanChange`: Callback for pan changes
- `onReady`: Callback when canvas is ready

### Hooks

- `useMarkupCanvas(options)`: Main hook for canvas control
- `useCanvasTransform(canvas)`: Hook for tracking transform state
- `useCanvasEvents(canvas, handlers)`: Hook for event handling

## License

MIT

