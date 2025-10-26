export function sendPostMessageError(canvasName: string, action: string, error: string): void {
  window.postMessage(
    {
      source: "markup-canvas-error",
      canvasName,
      action,
      error,
      timestamp: Date.now(),
    },
    "*"
  );
}
