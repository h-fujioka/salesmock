import * as React from "react";
import type { SVGProps } from "react";
const SvgArrowLeft = (props: SVGProps<SVGSVGElement>) => (
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
      d="M42 25.3H10.98l9.09 9.09-1.84 1.84L6 24l12.23-12.23 1.84 1.84-9.09 9.09H42z"
    />
  </svg>
);
export default SvgArrowLeft;
