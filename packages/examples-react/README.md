# React Examples

A React application demonstrating multiple approaches to use `@markup-canvas/react`.

## Examples

Open the app (defaults to the component example) or go directly:

| Route | What it shows |
|-------|-----------------|
| `#/` | **`<MarkupCanvas />`** — declarative component, imperative `ref` for controls |
| `#/component` | Redirects to `#/` (legacy path) |
| `#/hook` | **`useMarkupCanvas`** — same options via a container `ref` + `<div>` wrapper |

Both use the same shared canvas options (`MARKUP_CONFIG` in `src/examples/canvasConfig.ts`).

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
  data: 2.0
}, "*");

// Toggle dark mode
iframe.contentWindow.postMessage({
  source: "markup-canvas",
  canvasName: "canvas",
  action: "toggleThemeMode"
}, "*");
```