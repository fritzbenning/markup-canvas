# PostMessage API - Cross-Iframe Control

The PostMessage API allows you to control a MarkupCanvas instance from outside its iframe. This is particularly useful when using Sandpack or other sandbox environments where you need parent-level control over the canvas.

## Configuration

Enable the PostMessage API by setting two config options:

```tsx
<MarkupCanvas
  bindToWindow={true}        // Required: binds canvas to window
  enablePostMessageAPI={true} // Enable postMessage listeners
  name="canvas"              // Canvas instance name
  // ... other config
/>
```

## Usage

### From Parent Window (Outside Iframe)

```javascript
// Get reference to the iframe
const iframe = document.querySelector('iframe');

// Send a command to the canvas
iframe.contentWindow.postMessage({
  source: "markup-canvas",
  canvasName: "canvas",      // Must match the canvas name
  action: "zoomIn",
  args: [0.1]
}, "*");
```

### Error Handling

Listen for error messages if an action fails:

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

## Available Actions

### View Methods

- **zoomIn** - `args: [factor?: number]` (default 0.1)
- **zoomOut** - `args: [factor?: number]` (default 0.1)
- **resetZoom** - `args: []`
- **panLeft** - `args: [distance?: number]` (keyboard pan step by default)
- **panRight** - `args: [distance?: number]`
- **panUp** - `args: [distance?: number]`
- **panDown** - `args: [distance?: number]`
- **fitToScreen** - `args: []` - Fit content to visible area
- **centerContent** - `args: []` - Center content on canvas
- **scrollToPoint** - `args: [x: number, y: number]` - Scroll to specific point
- **resetView** - `args: []` - Reset to original view

### Ruler & Grid Methods

- **toggleRulers** - `args: []`
- **showRulers** - `args: []`
- **hideRulers** - `args: []`
- **toggleGrid** - `args: []`
- **showGrid** - `args: []`
- **hideGrid** - `args: []`

### Configuration Methods

- **updateThemeMode** - `args: ["light" | "dark"]`
- **toggleThemeMode** - `args: []` - Toggle between light and dark

## Examples

### Zoom Control

```javascript
// Zoom in by 20%
iframe.contentWindow.postMessage({
  source: "markup-canvas",
  canvasName: "canvas",
  action: "zoomIn",
  args: [0.2]
}, "*");

// Zoom out by 10%
iframe.contentWindow.postMessage({
  source: "markup-canvas",
  canvasName: "canvas",
  action: "zoomOut",
  args: [0.1]
}, "*");
```

### Pan Control

```javascript
// Pan 100 pixels to the left
iframe.contentWindow.postMessage({
  source: "markup-canvas",
  canvasName: "canvas",
  action: "panLeft",
  args: [100]
}, "*");
```

### Theme Control

```javascript
// Toggle dark mode
iframe.contentWindow.postMessage({
  source: "markup-canvas",
  canvasName: "canvas",
  action: "toggleThemeMode"
}, "*");

// Set light mode explicitly
iframe.contentWindow.postMessage({
  source: "markup-canvas",
  canvasName: "canvas",
  action: "updateThemeMode",
  args: ["light"]
}, "*");
```

### Visibility Control

```javascript
// Show rulers
iframe.contentWindow.postMessage({
  source: "markup-canvas",
  canvasName: "canvas",
  action: "showRulers"
}, "*");

// Show grid
iframe.contentWindow.postMessage({
  source: "markup-canvas",
  canvasName: "canvas",
  action: "showGrid"
}, "*");
```

## Message Format

### Request Format

```typescript
interface PostMessageRequest {
  source: "markup-canvas";           // Must be this value
  canvasName: string;                // Canvas instance name
  action: AllowedAction;             // Action to perform
  args?: unknown[];                  // Optional arguments for the action
}
```

### Error Response Format

```typescript
interface PostMessageErrorResponse {
  source: "markup-canvas-error";
  canvasName: string;
  action: string;
  error: string;
  timestamp: number;
}
```

## Sandpack Example

When using Sandpack with the MarkupCanvas, you can control it from your documentation or parent application:

```javascript
const sandpackRef = useRef();

const controlCanvas = (action, args) => {
  sandpackRef.current?.clientId?.postMessage({
    source: "markup-canvas",
    canvasName: "canvas",
    action,
    args
  });
};

// Usage
controlCanvas("zoomIn", [0.1]);
controlCanvas("toggleThemeMode");
controlCanvas("centerContent");
```

## Requirements

- `bindToWindow` must be `true`
- `enablePostMessageAPI` must be `true`
- The canvas `name` must match the `canvasName` in the postMessage call
- Both parent and iframe must be same-origin (or use proper CORS headers)

## Performance Notes

- Message listeners are registered when the canvas is created with `enablePostMessageAPI: true`
- Listeners are properly cleaned up on canvas destruction
- Filtering by source and canvasName is efficient (simple string comparisons)
- Multiple listeners can coexist without performance issues
