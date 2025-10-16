# @markup-canvas/react

React component and hook for `@markup-canvas/core`.

## ✨ Live Demo

Check out the live demo: [https://markup-canvas.vercel.app/](https://markup-canvas.vercel.app/)

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

The `useMarkupCanvas` hook provides convenient access to canvas methods.
**Important:** You must pass `initCanvasUtils` to the `onReady` prop for the hook to work properly.

```tsx
import { useRef } from 'react';
import { MarkupCanvas, type MarkupCanvasRef, useMarkupCanvas } from '@markup-canvas/react';

function App() {
  const canvasRef = useRef<MarkupCanvasRef>(null);

  const { initCanvasUtils, zoom, zoomIn, zoomOut, fitToContent, resetZoom } = useMarkupCanvas(canvasRef);

  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <button onClick={() => zoomIn()}>Zoom In</button>
      <button onClick={() => zoomOut()}>Zoom Out</button>
      <button onClick={() => fitToContent()}>Fit to Content</button>
      <span>Current zoom: {zoom.toFixed(2)}</span>
      
      <MarkupCanvas
        ref={canvasRef}
        width={20000}
        height={15000}
        enableZoom={true}
        enablePan={true}
        onReady={initCanvasUtils} // Required for hook to work
      >
        <div style={{ position: 'absolute', top: 100, left: 100 }}>
          <h1>Zoomable Content</h1>
        </div>
      </MarkupCanvas>
    </div>
  );
}
```

## API

### Component Props

#### Canvas Dimensions
- `width?: number` - Canvas width in pixels
- `height?: number` - Canvas height in pixels
- `enableAcceleration?: boolean` - Enable hardware acceleration

#### Interaction Controls
- `enableZoom?: boolean` - Enable zoom functionality
- `enablePan?: boolean` - Enable pan functionality
- `enableTouch?: boolean` - Enable touch gestures
- `enableKeyboard?: boolean` - Enable keyboard controls
- `limitKeyboardEventsToCanvas?: boolean` - Limit keyboard events to when canvas is focused

#### Zoom Behavior
- `zoomSpeed?: number` - Zoom speed factor
- `minZoom?: number` - Minimum zoom level
- `maxZoom?: number` - Maximum zoom level
- `enableTransition?: boolean` - Enable smooth transitions
- `transitionDuration?: number` - Transition duration in ms
- `enableAdaptiveSpeed?: boolean` - Enable adaptive zoom speed

#### Pan Behavior
- `enableLeftDrag?: boolean` - Enable left mouse button drag
- `enableMiddleDrag?: boolean` - Enable middle mouse button drag
- `requireSpaceForMouseDrag?: boolean` - Require space key for mouse drag
- `keyboardPanStep?: number` - Keyboard pan step size
- `keyboardFastMultiplier?: number` - Fast pan multiplier (with shift)
- `keyboardZoomStep?: number` - Keyboard zoom step size

#### Click-to-Zoom
- `enableClickToZoom?: boolean` - Enable click to zoom
- `clickZoomLevel?: number` - Target zoom level for click-to-zoom
- `requireOptionForClickZoom?: boolean` - Require Option/Alt key for click-to-zoom

#### Visual Elements
- `enableRulers?: boolean` - Show rulers
- `enableGrid?: boolean` - Show background grid
- `gridColor?: string` - Grid line color

#### Ruler Styling
- `rulerBackgroundColor?: string` - Ruler background color
- `rulerBorderColor?: string` - Ruler border color
- `rulerTextColor?: string` - Ruler text color
- `rulerMajorTickColor?: string` - Major tick mark color
- `rulerMinorTickColor?: string` - Minor tick mark color
- `rulerFontSize?: number` - Ruler font size
- `rulerFontFamily?: string` - Ruler font family
- `rulerUnits?: string` - Ruler units label

#### React-Specific Props
- `children?: ReactNode` - Content to render inside the canvas
- `className?: string` - CSS class name
- `style?: CSSProperties` - Inline styles

#### Callbacks
- `onTransformUpdate?: (transform: Transform) => void` - Called on transform update
- `onTransformChange?: (transform: Transform) => void` - Called on transform change
- `onZoomChange?: (zoom: number) => void` - Called on zoom change
- `onPanChange?: (pan: { x: number; y: number }) => void` - Called on pan change
- `onReady?: (canvas: MarkupCanvas) => void` - Called when canvas is ready

## License

**CC BY-NC 4.0** - Creative Commons Attribution-NonCommercial 4.0 International

This project is licensed for non-commercial use only. See the [LICENSE](../../LICENSE) file for details.

