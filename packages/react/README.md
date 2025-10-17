# @markup-canvas/react

React wrapper for `@markup-canvas/core`.

A lightweight, canvas-like container with smooth pan and zoom capabilities for HTML and React content.

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

### MarkupCanvas Component

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

#### Props

The `MarkupCanvas` component accepts the following props:

**Canvas Dimensions**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `width` | `number` | - | Canvas width in pixels |
| `height` | `number` | - | Canvas height in pixels |
| `enableAcceleration` | `boolean` | `true` | Enable hardware acceleration |

**Interaction Controls**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `enableZoom` | `boolean` | `true` | Enable zoom functionality |
| `enablePan` | `boolean` | `true` | Enable pan functionality |
| `enableTouch` | `boolean` | `true` | Enable touch gestures |
| `enableKeyboard` | `boolean` | `true` | Enable keyboard controls |
| `limitKeyboardEventsToCanvas` | `boolean` | `true` | Limit keyboard events to when canvas is focused |

**Zoom Behavior**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `zoomSpeed` | `number` | `1.2` | Zoom speed factor |
| `minZoom` | `number` | `0.1` | Minimum zoom level |
| `maxZoom` | `number` | `10` | Maximum zoom level |
| `enableTransition` | `boolean` | `false` | Enable smooth transitions |
| `transitionDuration` | `number` | `300` | Transition duration in ms |
| `enableAdaptiveSpeed` | `boolean` | `true` | Enable adaptive zoom speed |

**Pan Behavior**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `enableLeftDrag` | `boolean` | `true` | Enable left mouse button drag |
| `enableMiddleDrag` | `boolean` | `true` | Enable middle mouse button drag |
| `requireSpaceForMouseDrag` | `boolean` | `false` | Require space key for mouse drag |
| `keyboardPanStep` | `number` | `50` | Keyboard pan step size in pixels |
| `keyboardFastMultiplier` | `number` | `3` | Fast pan multiplier (with shift key) |
| `keyboardZoomStep` | `number` | `0.2` | Keyboard zoom step size |

**Click-to-Zoom**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `enableClickToZoom` | `boolean` | `false` | Enable click to zoom |
| `clickZoomLevel` | `number` | `2` | Target zoom level for click-to-zoom |
| `requireOptionForClickZoom` | `boolean` | `false` | Require Option/Alt key for click-to-zoom |

**Visual Elements**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `enableRulers` | `boolean` | `true` | Show rulers on top and left |
| `enableGrid` | `boolean` | `false` | Show background grid |
| `gridColor` | `string` | `"#e0e0e0"` | Grid line color |

**Ruler Styling**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `rulerBackgroundColor` | `string` | `"#f5f5f5"` | Ruler background color |
| `rulerBorderColor` | `string` | `"#d0d0d0"` | Ruler border color |
| `rulerTextColor` | `string` | `"#666666"` | Ruler text color |
| `rulerMajorTickColor` | `string` | `"#666666"` | Major tick mark color |
| `rulerMinorTickColor` | `string` | `"#999999"` | Minor tick mark color |
| `rulerFontSize` | `number` | `12` | Ruler font size in pixels |
| `rulerFontFamily` | `string` | `"monospace"` | Ruler font family |
| `rulerUnits` | `string` | `"px"` | Ruler units label |

**React-Specific Props**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `ReactNode` | - | Content to render inside the canvas |
| `className` | `string` | - | CSS class name |
| `style` | `CSSProperties` | - | Inline styles |

**Callbacks**

| Prop | Type | Description |
|------|------|-------------|
| `onTransformUpdate` | `(transform: Transform) => void` | Called continuously during transform updates |
| `onTransformChange` | `(transform: Transform) => void` | Called when transform change completes |
| `onZoomChange` | `(zoom: number) => void` | Called when zoom level changes |
| `onPanChange` | `(pan: { x: number; y: number }) => void` | Called when pan position changes |
| `onReady` | `(canvas: MarkupCanvas) => void` | Called when canvas is ready |

**Example with Multiple Props**

```tsx
<MarkupCanvas
  ref={canvasRef}
  width={20000}
  height={15000}
  enableZoom={true}
  enablePan={true}
  enableKeyboard={true}
  enableRulers={true}
  enableGrid={true}
  zoomSpeed={1.2}
  minZoom={0.1}
  maxZoom={10}
  gridColor="#e8e8e8"
  rulerBackgroundColor="#fafafa"
  enableClickToZoom={true}
  clickZoomLevel={2}
  onZoomChange={(zoom) => console.log('Zoom:', zoom)}
  onPanChange={(pan) => console.log('Pan:', pan)}
  onReady={(canvas) => console.log('Canvas ready:', canvas)}
  className="custom-canvas"
>
  {/* Canvas content */}
</MarkupCanvas>
```

### useMarkupCanvas Hook

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

## License

**CC BY-NC 4.0** - Creative Commons Attribution-NonCommercial 4.0 International

This project is licensed for non-commercial use only. See the [LICENSE](../../LICENSE) file for details.

