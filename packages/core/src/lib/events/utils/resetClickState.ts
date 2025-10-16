export function resetClickState(setters: { setMouseDownTime: (value: number) => void; setHasDragged: (value: boolean) => void }): void {
  setters.setMouseDownTime(0);
  setters.setHasDragged(false);
}
