interface ImageProps {
  src: string;
  width: number;
  height: number;
  left?: number;
  top?: number;
  alt?: string;
}

export function Image({ src, width, height, left, top, alt = "" }: ImageProps) {
  const style: React.CSSProperties = {
    width: `${width}px`,
    height: `${height}px`,
    position: "absolute",
    ...(left !== undefined && { left: `${left}px` }),
    ...(top !== undefined && { top: `${top}px` }),
  };

  return <img src={src} alt={alt} style={style} />;
}
