import type { CSSProperties } from "react";

interface ImageProps {
  src: string;
  width: number;
  height: number;
  alt?: string;
}

export function Image({ src, width, height, alt = "" }: ImageProps) {
  const style: CSSProperties = {
    width: `${width}px`,
    height: `${height}px`,
  };

  return <img src={src} alt={alt} style={style} />;
}
