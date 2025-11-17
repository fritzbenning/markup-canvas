export function isCanvasShortcut(event: KeyboardEvent): boolean {
  if (event.key === "0" && (event.ctrlKey || event.metaKey)) {
    return true; // Ctrl+0 or Cmd+0 for reset view
  }
  if ((event.key === "g" || event.key === "G") && event.shiftKey && !event.ctrlKey && !event.metaKey && !event.altKey) {
    return true; // Shift+G for toggle grid
  }
  if ((event.key === "r" || event.key === "R") && event.shiftKey && !event.ctrlKey && !event.metaKey && !event.altKey) {
    return true; // Shift+R for toggle rulers
  }
  return false;
}
