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
| `showRulers` | `boolean` | `true` | Initially show rulers (only applies if `enableRulers` is true) |
| `showGrid` | `boolean` | `false` | Initially show grid (only applies if `enableGrid` is true) |
| `gridColor` | `string` | `"#e0e0e0"` | Grid line color |

**Ruler Styling**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `rulerBackgroundColor` | `string` | `"#f5f5f5"` | Ruler background color |
| `rulerBorderColor` | `string` | `"#d0d0d0"` | Ruler border color |
| `rulerTextColor` | `string` | `"#666666"` | Ruler text color |
| `rulerTickColor` | `string` | `"#cccccc"` | Tick mark color |
| `rulerFontSize` | `number` | `12` | Ruler font size in pixels |
| `rulerFontFamily` | `string` | `"monospace"` | Ruler font family |
| `rulerUnits` | `string` | `"px"` | Ruler units label |

**Dark Theme Support**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `themeMode` | `"light" \| "dark"` | `"light"` | Current theme mode |
| `rulerBackgroundColorDark` | `string` | `"rgba(30, 30, 30, 0.95)"` | Dark mode ruler background color |
| `rulerBorderColorDark` | `string` | `"#444"` | Dark mode ruler border color |
| `rulerTextColorDark` | `string` | `"#aaa"` | Dark mode ruler text color |
| `rulerTickColorDark` | `string` | `"#383838"` | Dark mode tick mark color |
| `gridColorDark` | `string` | `"rgba(255, 255, 255, 0.1)"` | Dark mode grid line color |

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
  themeMode="light"
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

**Theme Switching Example**

```tsx
import { useRef, useState } from 'react';
import { MarkupCanvas, type MarkupCanvasRef } from '@markup-canvas/react';

function App() {
  const canvasRef = useRef<MarkupCanvasRef>(null);
  const [themeMode, setThemeMode] = useState<'light' | 'dark'>('light');

  const handleThemeToggle = () => {
    const newMode = themeMode === 'light' ? 'dark' : 'light';
    setThemeMode(newMode);
    canvasRef.current?.updateThemeMode(newMode);
  };

  return (
    <div>
      <button onClick={handleThemeToggle}>Toggle Theme</button>
      
      <MarkupCanvas
        ref={canvasRef}
        width={20000}
        height={15000}
        themeMode={themeMode}
        enableRulers={true}
        enableGrid={true}
      >
        <div>Your content here</div>
      </MarkupCanvas>
    </div>
  );
}
```

### useMarkupCanvas Hook

The `useMarkupCanvas` hook provides convenient access to canvas methods.
**Important:** You must pass `initCanvasUtils` to the `onReady` prop for the hook to work properly.

```tsx
import { useRef } from 'react';
import { MarkupCanvas, type MarkupCanvasRef, useMarkupCanvas } from '@markup-canvas/react';

function App() {
  const canvasRef = useRef<MarkupCanvasRef>(null);

  const { 
    initCanvasUtils, 
    zoom, 
    zoomIn, 
    zoomOut, 
    fitToContent, 
    resetZoom,
    themeMode,
    toggleThemeMode,
    updateThemeMode,
  } = useMarkupCanvas(canvasRef);

  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <button onClick={() => zoomIn()}>Zoom In</button>
      <button onClick={() => zoomOut()}>Zoom Out</button>
      <button onClick={() => fitToContent()}>Fit to Content</button>
      <button onClick={toggleThemeMode}>
        Toggle Theme (Current: {themeMode})
      </button>
      <span>Current zoom: {zoom.toFixed(2)}</span>
      
      <MarkupCanvas
        ref={canvasRef}
        width={20000}
        height={15000}
        enableZoom={true}
        enablePan={true}
        themeMode={themeMode}
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

**Hook Return Values**

The `useMarkupCanvas` hook returns an object with the following properties and methods:

| Property/Method | Type | Description |
|-----------------|------|-------------|
| `canvas` | `MarkupCanvas \| null` | The canvas instance |
| `initCanvasUtils` | `(canvas: MarkupCanvas) => void` | Initialize function to pass to `onReady` |
| `transform` | `Transform` | Current canvas transform |
| `zoom` | `number` | Current zoom level |
| `pan` | `{ x: number; y: number }` | Current pan position |
| `isReady` | `boolean` | Whether canvas is ready |
| `zoomIn` | `(factor?: number) => void` | Zoom in by factor |
| `zoomOut` | `(factor?: number) => void` | Zoom out by factor |
| `resetZoom` | `() => void` | Reset zoom to 100% |
| `panTo` | `(x: number, y: number) => void` | Pan to specific coordinates |
| `fitToContent` | `() => void` | Fit content to viewport |
| `centerContent` | `() => void` | Center content on canvas |
| `setTransitionMode` | `(enabled: boolean) => void` | Enable/disable transitions |
| `toggleTransitionMode` | `() => boolean` | Toggle transition mode |
| `themeMode` | `"light" \| "dark"` | Current theme mode |
| `updateThemeMode` | `(mode: "light" \| "dark") => void` | Update theme mode |
| `toggleThemeMode` | `() => "light" \| "dark"` | Toggle between themes |
| `toggleRulers` | `() => void` | Toggle rulers visibility |
| `showRulers` | `() => void` | Show rulers |
| `hideRulers` | `() => void` | Hide rulers |
| `areRulersVisible` | `() => boolean` | Check if rulers are visible |
| `showRulersState` | `boolean` | Current rulers visibility state |
| `toggleGrid` | `() => void` | Toggle grid visibility |
| `showGrid` | `() => void` | Show grid |
| `hideGrid` | `() => void` | Hide grid |
| `isGridVisible` | `() => boolean` | Check if grid is visible |
| `showGridState` | `boolean` | Current grid visibility state |
  
  ## License

**CC BY-NC 4.0** - Creative Commons Attribution-NonCommercial 4.0 International

This project is licensed for non-commercial use only. See the [LICENSE](../../LICENSE) file for details.