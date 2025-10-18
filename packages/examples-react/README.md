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

**URL:** `http://localhost:5173/#/`

### 2. **Window Example** (`/window`)
Using the `useMarkupCanvasWindow` hook to access a globally-bound canvas instance.

**Best for:**
- Multi-component applications
- Canvas initialized in one place, controlled in another
- Cross-component communication patterns
- Window-based event handling

**URL:** `http://localhost:5173/#/window`

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

The app will open at `http://localhost:5173` with navigation between examples.

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

## Learn More

Check out the [main documentation](../../README.md) for more details on using MarkupCanvas.

## License

**CC BY-NC 4.0** - Creative Commons Attribution-NonCommercial 4.0 International

This project is licensed for non-commercial use only. See the [LICENSE](../../LICENSE) file for details.

