import { cva } from "class-variance-authority";
import { Scan, Settings as SettingsIcon, Undo2, X, ZoomIn, ZoomOut } from "lucide-react";
import { type ReactNode, useCallback, useEffect, useId, useState } from "react";
import { ToggleSwitch } from "../components/ToggleSwitch";
import type { ThemeMode } from "./useTheme";

const floatingToolbarVariants = cva(
  "-translate-x-1/2 fixed bottom-4 left-1/2 z-100 flex items-center gap-0.5 rounded-[10px] bg-white/92 p-1 font-sans shadow-[0_4px_20px_rgba(0,0,0,0.1),0_0_0_1px_rgba(0,0,0,0.04)] backdrop-blur-[14px] dark:bg-[rgba(20,20,20,0.94)] dark:shadow-[0_4px_24px_rgba(0,0,0,0.45),0_0_0_1px_rgba(255,255,255,0.06)]"
);

const toolbarIconButtonVariants = cva(
  "flex size-8 cursor-pointer items-center justify-center rounded-md border-0 bg-transparent text-[#2a2a2a] transition-colors hover:bg-black/6 focus-visible:outline-2 focus-visible:outline-[#808dfd] focus-visible:outline-offset-1 dark:text-[#e8e8ea] dark:hover:bg-white/8"
);

const zoomReadoutVariants = cva(
  "min-w-10 select-none px-1.5 text-center font-mono font-semibold text-[#444] text-[0.7rem] tracking-wider dark:text-[#b4b4b8]"
);

const toolbarDividerVariants = cva("mx-1 h-5 w-px shrink-0 bg-black/10 dark:bg-white/12");

/** Main toolbar: zoom, fit, reset (and settings trigger lives in layout here). */
export interface FloatingToolbarTools {
  zoom: number;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onFitToScreen: () => void;
  onResetCanvas: () => void;
}

/** Settings dialog: canvas options driven by the same hook that powers the toolbar theme. */
export interface FloatingToolbarSettings {
  themeMode: ThemeMode;
  onThemeModeChange: (mode: ThemeMode) => void;
  transitionEnabled: boolean;
  onTransitionChange: (enabled: boolean) => void;
  rulersVisible: boolean;
  onRulersChange: (visible: boolean) => void;
  gridVisible: boolean;
  onGridChange: (visible: boolean) => void;
  requireSpaceForMouseDrag: boolean;
  onRequireSpaceForMouseDragChange: (enabled: boolean) => void;
  enableClickToZoom: boolean;
  onEnableClickToZoomChange: (enabled: boolean) => void;
  requireOptionForClickZoom: boolean;
  onRequireOptionForClickZoomChange: (enabled: boolean) => void;
}

export interface FloatingToolbarProps {
  tools: FloatingToolbarTools;
  settings: FloatingToolbarSettings;
}

function ToolbarIconButton({ label, onClick, children }: { label: string; onClick: () => void; children: ReactNode }) {
  return (
    <button type="button" className={toolbarIconButtonVariants()} title={label} aria-label={label} onClick={onClick}>
      {children}
    </button>
  );
}

export function FloatingToolbar({ tools, settings }: FloatingToolbarProps) {
  const { zoom, onZoomIn, onZoomOut, onFitToScreen, onResetCanvas } = tools;
  const {
    themeMode,
    onThemeModeChange,
    transitionEnabled,
    onTransitionChange,
    rulersVisible,
    onRulersChange,
    gridVisible,
    onGridChange,
    requireSpaceForMouseDrag,
    onRequireSpaceForMouseDragChange,
    enableClickToZoom,
    onEnableClickToZoomChange,
    requireOptionForClickZoom,
    onRequireOptionForClickZoomChange,
  } = settings;

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
      <div className={themeMode === "dark" ? "dark" : undefined}>
        <div role="toolbar" aria-label="Canvas controls" className={floatingToolbarVariants()}>
          <ToolbarIconButton label="Zoom out" onClick={onZoomOut}>
            <ZoomOut size={18} strokeWidth={2} />
          </ToolbarIconButton>
          <div className={zoomReadoutVariants()} aria-live="polite">
            <span id="zoom-value">{(zoom * 100).toFixed(0)}%</span>
          </div>
          <ToolbarIconButton label="Zoom in" onClick={onZoomIn}>
            <ZoomIn size={18} strokeWidth={2} />
          </ToolbarIconButton>
          <span className={toolbarDividerVariants()} aria-hidden />
          <ToolbarIconButton label="Fit to screen" onClick={onFitToScreen}>
            <Scan size={18} strokeWidth={2} />
          </ToolbarIconButton>
          <ToolbarIconButton label="Reset canvas" onClick={onResetCanvas}>
            <Undo2 size={18} strokeWidth={2} />
          </ToolbarIconButton>
          <span className={toolbarDividerVariants()} aria-hidden />
          <ToolbarIconButton label="Settings" onClick={() => setOpen(true)}>
            <SettingsIcon size={18} strokeWidth={2} />
          </ToolbarIconButton>
        </div>
      </div>

      {open ? (
        <div
          className="fixed inset-0 z-200 flex items-center justify-center bg-black/45 p-5 backdrop-blur-sm"
          role="presentation"
          onClick={close}
        >
          <div
            id={dialogId}
            className="relative max-h-[min(90vh,640px)] w-full max-w-[440px] overflow-auto rounded-2xl bg-white font-sans shadow-[0_24px_48px_rgba(0,0,0,0.2)]"
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 z-1 flex items-center justify-between gap-3 rounded-t-2xl border-[#eee] border-b bg-white px-[18px] py-4">
              <h2 id={titleId} className="font-semibold text-lg">
                Settings
              </h2>
              <button
                type="button"
                className="flex cursor-pointer items-center justify-center rounded-lg border-0 bg-transparent p-1.5 text-[#444] transition-colors hover:bg-neutral-100"
                onClick={close}
                aria-label="Close settings"
              >
                <X size={20} />
              </button>
            </div>
            <div className="flex flex-col px-[18px] py-2 pb-5">
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
              <ToggleSwitch
                id={`${dialogId}-space-pan`}
                label="Hold Space to pan with the mouse"
                checked={requireSpaceForMouseDrag}
                onChange={onRequireSpaceForMouseDragChange}
              />
              <ToggleSwitch
                id={`${dialogId}-click-zoom`}
                label="Click to zoom"
                checked={enableClickToZoom}
                onChange={onEnableClickToZoomChange}
              />
              {enableClickToZoom ? (
                <ToggleSwitch
                  id={`${dialogId}-option-click-zoom`}
                  label="Require Alt/Option for click-to-zoom"
                  checked={requireOptionForClickZoom}
                  onChange={onRequireOptionForClickZoomChange}
                />
              ) : null}
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
