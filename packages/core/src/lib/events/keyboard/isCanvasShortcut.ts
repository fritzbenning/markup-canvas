export function isCanvasShortcut(event: KeyboardEvent): boolean {
  if (event.key === "0" && (event.ctrlKey || event.metaKey)) {
    return true; // Ctrl+0 or Cmd+0 for reset view
  }
  if (event.key === "+" && (event.ctrlKey || event.metaKey)) {
    return true;
  }
  if (event.key === "-" && (event.ctrlKey || event.metaKey)) {
    return true;
  }

  return false;
}
