import { Scan, Settings as SettingsIcon, Undo2, X, ZoomIn, ZoomOut } from "lucide-react";
import { type ReactNode, useCallback, useEffect, useId, useState } from "react";
import { ToggleSwitch } from "../components/ToggleSwitch";

export interface FloatingToolbarProps {
  zoom: number;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onFitToScreen: () => void;
  onResetCanvas: () => void;
  onCenterContent: () => void;
  transitionEnabled: boolean;
  onTransitionChange: (enabled: boolean) => void;
  rulersVisible: boolean;
  onRulersChange: (visible: boolean) => void;
  gridVisible: boolean;
  onGridChange: (visible: boolean) => void;
  themeMode: "light" | "dark";
  onThemeModeChange: (mode: "light" | "dark") => void;
}

function ToolbarIconButton({ label, onClick, children }: { label: string; onClick: () => void; children: ReactNode }) {
  return (
    <button type="button" className="floating-toolbar__btn" title={label} aria-label={label} onClick={onClick}>
      {children}
    </button>
  );
}

export function FloatingToolbar({
  zoom,
  onZoomIn,
  onZoomOut,
  onFitToScreen,
  onResetCanvas,
  transitionEnabled,
  onTransitionChange,
  rulersVisible,
  onRulersChange,
  gridVisible,
  onGridChange,
  themeMode,
  onThemeModeChange,
}: FloatingToolbarProps) {
  const [open, setOpen] = useState(false);
  const dialogId = useId();
  const titleId = useId();

  const close = useCallback(() => setOpen(false), []);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, close]);

  return (
    <>
      <div
        className={["floating-toolbar", themeMode === "dark" ? "floating-toolbar--dark" : ""].filter(Boolean).join(" ")}
        role="toolbar"
        aria-label="Canvas controls"
      >
        <ToolbarIconButton label="Zoom out" onClick={onZoomOut}>
          <ZoomOut size={18} strokeWidth={2} />
        </ToolbarIconButton>
        <div className="floating-toolbar__zoom" aria-live="polite">
          <span id="zoom-value">{(zoom * 100).toFixed(0)}%</span>
        </div>
        <ToolbarIconButton label="Zoom in" onClick={onZoomIn}>
          <ZoomIn size={18} strokeWidth={2} />
        </ToolbarIconButton>
        <span className="floating-toolbar__divider" aria-hidden />
        <ToolbarIconButton label="Fit to screen" onClick={onFitToScreen}>
          <Scan size={18} strokeWidth={2} />
        </ToolbarIconButton>
        <ToolbarIconButton label="Reset canvas" onClick={onResetCanvas}>
          <Undo2 size={18} strokeWidth={2} />
        </ToolbarIconButton>
        {/* <ToolbarIconButton label="Center content" onClick={onCenterContent}>
          <Crosshair size={18} strokeWidth={2} />
        </ToolbarIconButton> */}
        <span className="floating-toolbar__divider" aria-hidden />
        <ToolbarIconButton label="Settings" onClick={() => setOpen(true)}>
          <SettingsIcon size={18} strokeWidth={2} />
        </ToolbarIconButton>
      </div>

      {open ? (
        <div className="settings-backdrop" role="presentation" onClick={close}>
          <div
            id={dialogId}
            className="settings-panel"
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="settings-panel-header">
              <h2 id={titleId} className="settings-panel-title">
                Settings
              </h2>
              <button type="button" className="settings-panel-close" onClick={close} aria-label="Close settings">
                <X size={20} />
              </button>
            </div>
            <div className="settings-modal-toggles">
              <ToggleSwitch
                id={`${dialogId}-transition`}
                label="Transition animations"
                checked={transitionEnabled}
                onChange={onTransitionChange}
              />
              <ToggleSwitch id={`${dialogId}-rulers`} label="Rulers" checked={rulersVisible} onChange={onRulersChange} />
              <ToggleSwitch id={`${dialogId}-grid`} label="Grid" checked={gridVisible} onChange={onGridChange} />
              <ToggleSwitch
                id={`${dialogId}-theme`}
                label="Dark mode"
                checked={themeMode === "dark"}
                onChange={(on) => onThemeModeChange(on ? "dark" : "light")}
              />
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
