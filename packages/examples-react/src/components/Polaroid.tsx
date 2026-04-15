import { cva } from "class-variance-authority";
import type { ReactNode } from "react";

const shellVariants = cva("-rotate-[2.5deg] origin-top-left shadow-large");

const matVariants = cva("border border-black/10 bg-white pt-7 pr-7 pb-20 pl-7 [&_img]:block [&_img]:object-cover [&_img]:shadow-large");

interface PolaroidProps {
  children: ReactNode;
}

/** Classic instant-film look: white mat, wide bottom border, soft shadow, light tilt */
export function Polaroid({ children }: PolaroidProps) {
  return (
    <div className={shellVariants()}>
      <div className={matVariants()}>{children}</div>
    </div>
  );
}
