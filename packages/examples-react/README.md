# React Examples

A React application demonstrating multiple approaches to use `@markup-canvas/react`.

## Examples

This project includes **two different example approaches** accessible via different routes:

### 1. **Default Example** (`/`)
Using the `useMarkupCanvas` hook with a direct ref to the canvas component.

**Best for:**
- Single-window applications
- Canvas in the same component tree
- Direct ref access patterns
- Simpler component hierarchies

**URL:** `http://localhost:3001/#/`

### 2. **Window Example** (`/window`)
Using the `useMarkupCanvasWindow` hook to access a globally-bound canvas instance.

**Best for:**
- Multi-component applications
- Canvas initialized in one place, controlled in another
- Cross-component communication patterns
- Window-based event handling

**URL:** `http://localhost:3001/#/window`

**How it works:**
- Canvas is initialized with `bindToWindow={true}` and a specific `name` prop
- The canvas instance is bound to `window[name]` (e.g., `window.windowCanvas`)
- Components use `useMarkupCanvasWindow()` to access the canvas via window binding
- Events are communicated via `window.postMessage()`

## Setup

### Prerequisites

- Node.js 18+ installed
- pnpm package manager

### Installation

1. Install dependencies from the project root:

```bash
pnpm install
```

2. Navigate to the examples-react directory:

```bash
cd packages/examples-react
```

3. Start the development server:

```bash
pnpm dev
```

The app will open at `http://localhost:3001` with navigation between examples.

## Features

Both examples demonstrate:

- **Pan & Zoom** - Drag to pan, scroll to zoom
- **Zoom Controls** - Programmatic zoom in/out
- **Fit to Content** - Automatically fit content to viewport
- **Reset Zoom** - Return to initial zoom level
- **Center Content** - Center content in viewport
- **Rulers** - Visual rulers for measurement
- **Grid** - Background grid overlay
- **Transitions** - Smooth animations (toggle on/off)
- **Theme Toggle** - Switch between light and dark themes

## Scripts

- `pnpm dev` - Start development server (serves both examples)
- `pnpm build` - Build for production
- `pnpm preview` - Preview production build
- `pnpm lint` - Run linter

## Hooks

### Use `useMarkupCanvas` if:
```tsx
// Canvas is in the same component hierarchy
<CanvasContainer>
  <MarkupCanvasComponent ref={canvasRef} />
  <Controls ref={canvasRef} />  // Pass ref down
</CanvasContainer>
```

### Use `useMarkupCanvasWindow` if:
```tsx
// Canvas in one place, controls in another
<Root>
  <Header>
    <Controls />  {/* Accesses window.windowCanvas */}
  </Header>
  <Main>
    <CanvasContainer>
      <MarkupCanvas bindToWindow={true} name="windowCanvas" />
    </CanvasContainer>
  </Main>
</Root>
```

## PostMessage API - Control Canvas from Outside Iframe

The PostMessage API allows you to control a MarkupCanvas inside an iframe from a parent window or external application.

### Configuration

Enable the PostMessage API in your MarkupCanvas:

```tsx
<MarkupCanvas
  width={20000}
  height={15000}
  name="canvas"
  bindToWindow={true}        // Required: binds canvas to window
  enablePostMessageAPI={true} // Enable postMessage listeners
>
  <Content />
</MarkupCanvas>
```

### Send Commands from Parent

```javascript
// Get reference to the iframe (e.g., in Sandpack or embedded app)
const iframe = document.querySelector('iframe');

// Zoom to 2x (200%)
iframe.contentWindow.postMessage({
  source: "markup-canvas",
  canvasName: "canvas",
  action: "setZoom",
  args: [2.0]
}, "*");

// Toggle dark mode
iframe.contentWindow.postMessage({
  source: "markup-canvas",
  canvasName: "canvas",
  action: "toggleThemeMode"
}, "*");
```

### Available Actions

**View Control:**
- `zoomIn(factor?)` - Zoom in by factor (default 0.1)
- `zoomOut(factor?)` - Zoom out by factor (default 0.1)
- `setZoom(level)` - Set zoom to specific level
- `resetZoom()` - Reset to 100%
- `panLeft(distance?)`, `panRight(distance?)`, `panUp(distance?)`, `panDown(distance?)` - Pan operations
- `fitToScreen()` - Fit content to viewport
- `centerContent()` - Center content
- `panToPoint(x, y)` - Pan to specific coordinates

**Rulers & Grid:**
- `toggleRulers()`, `showRulers()`, `hideRulers()`
- `toggleGrid()`, `showGrid()`, `hideGrid()`

**Theme:**
- `updateThemeMode(mode)` - Set theme ("light" or "dark")
- `toggleThemeMode()` - Toggle between themes

### Error Handling

Listen for errors when PostMessage actions fail:

```javascript
window.addEventListener("message", (event) => {
  if (event.data.source === "markup-canvas-error") {
    console.error(
      `Canvas action failed: ${event.data.action}`,
      event.data.error
    );
  }
});
```

## Learn More

Check out the [main documentation](../../README.md) for more details on using MarkupCanvas.

## License

**CC BY-NC 4.0** - Creative Commons Attribution-NonCommercial 4.0 International

This project is licensed for non-commercial use only. See the [LICENSE](../../LICENSE) file for details.

