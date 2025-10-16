interface ZoomDisplayProps {
  zoom: number;
}

export function ZoomDisplay({ zoom }: ZoomDisplayProps) {
  return (
    <div className="zoom-indicator">
      <span id="zoom-value">Zoom: {(zoom * 100).toFixed(0)}%</span>
    </div>
  );
}
