interface ZoomDisplayProps {
  zoom: number;
}

export function ZoomDisplay({ zoom }: ZoomDisplayProps) {
  return (
    <div className="fixed right-5 bottom-5 z-[1000] rounded-[10px] border border-white/10 bg-black/60 px-2.5 py-2 font-medium font-mono text-white text-xs tracking-wide shadow-[0_4px_12px_rgba(0,0,0,0.2)] backdrop-blur transition-opacity hover:bg-black/90">
      <span id="zoom-value">Zoom: {(zoom * 100).toFixed(0)}%</span>
    </div>
  );
}
