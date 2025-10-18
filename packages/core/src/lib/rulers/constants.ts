// Rulers
export const RULER_Z_INDEX = {
  GRID: 100,
  RULERS: 1000,
  CORNER: 1001,
} as const;

export const TICK_SETTINGS = {
  TICK_HEIGHT: 4,
  TICK_WIDTH: 4,
  TICK_LABEL_INTERVAL: 100,
} as const;

export const GRID_SETTINGS = {
  BASE_SIZE: 100,
  MIN_SIZE: 20,
  MAX_SIZE: 200,
} as const;
