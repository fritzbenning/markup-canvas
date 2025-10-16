export function calculateTickSpacing(contentSize: number, canvasSize: number): number {
  const targetTicks = Math.max(5, Math.min(20, canvasSize / 50));
  const rawSpacing = contentSize / targetTicks;

  const magnitude = 10 ** Math.floor(Math.log10(rawSpacing));
  const normalized = rawSpacing / magnitude;

  let niceSpacing: number;
  if (normalized <= 1) niceSpacing = 1;
  else if (normalized <= 2) niceSpacing = 2;
  else if (normalized <= 5) niceSpacing = 5;
  else niceSpacing = 10;

  return niceSpacing * magnitude;
}
