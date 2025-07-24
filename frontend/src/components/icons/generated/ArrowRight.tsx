import * as React from "react";
import type { SVGProps } from "react";
const SvgArrowRight = (props: SVGProps<SVGSVGElement>) => (
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
      d="M42 24 29.77 36.23l-1.84-1.84 9.09-9.09H6v-2.6h31.02l-9.09-9.09 1.84-1.84z"
    />
  </svg>
);
export default SvgArrowRight;
