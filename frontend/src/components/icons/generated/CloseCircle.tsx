import * as React from "react";
import type { SVGProps } from "react";
const SvgCloseCircle = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="1em"
    height="1em"
    fill="none"
    viewBox="0 0 48 48"
    {...props}
  >
    <path
      fill="#000"
      d="m25.84 24 7.11 7.11-1.84 1.84L24 25.84l-7.11 7.11-1.84-1.84L22.16 24l-7.11-7.11 1.84-1.84L24 22.16l7.11-7.11 1.84 1.84zM24 6.6C14.41 6.6 6.6 14.41 6.6 24S14.41 41.4 24 41.4 41.4 33.59 41.4 24 33.59 6.6 24 6.6M24 4c11.05 0 20 8.95 20 20s-8.95 20-20 20S4 35.05 4 24 12.95 4 24 4"
    />
  </svg>
);
export default SvgCloseCircle;
