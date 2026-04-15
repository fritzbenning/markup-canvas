import { cva } from "class-variance-authority";
import type { CSSProperties, ReactNode } from "react";

const positionVariants = cva("absolute", {
  variants: {
    hasLeft: {
      true: "left-[var(--position-left)]",
      false: "",
    },
    hasTop: {
      true: "top-[var(--position-top)]",
      false: "",
    },
  },
  defaultVariants: {
    hasLeft: false,
    hasTop: false,
  },
});

export interface PositionProps {
  children: ReactNode;
  left?: number;
  top?: number;
}

/** Places children in canvas space with `position: absolute` and optional pixel insets via CSS variables. */
export function Position({ children, left, top }: PositionProps) {
  const style: CSSProperties = {
    ...(left !== undefined && { "--position-left": `${left}px` }),
    ...(top !== undefined && { "--position-top": `${top}px` }),
  };

  return (
    <div className={positionVariants({ hasLeft: left !== undefined, hasTop: top !== undefined })} style={style}>
      {children}
    </div>
  );
}
