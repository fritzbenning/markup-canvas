/**
 * Discrete zoom stops as scale multipliers (`1` = 100%).
 *
 * Percent readouts: 5%, 12.5%, 25%, 50%, 75%, 100%, 150%, 300%, 500%, 1000%,
 * 2000%, 4000%, 8000%.
 *
 * Matches default {@link MarkupCanvasConfig.minZoom} / `maxZoom` (0.05 … 80).
 */
export const ZOOM_SCALE_STEPS = [0.05, 0.125, 0.25, 0.5, 0.75, 1, 1.5, 3, 5, 10, 20, 40, 80] as const;

export type ZoomScaleStep = (typeof ZOOM_SCALE_STEPS)[number];
