import * as React from "react";
import type { SVGProps } from "react";
const SvgArrowDown = (props: SVGProps<SVGSVGElement>) => (
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
      d="M36.23 29.77 24 42 11.77 29.77l1.84-1.84 9.09 9.09V6h2.6v31.02l9.09-9.09z"
    />
  </svg>
);
export default SvgArrowDown;
