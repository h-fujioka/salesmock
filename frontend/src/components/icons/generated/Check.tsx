import * as React from "react";
import type { SVGProps } from "react";
const SvgCheck = (props: SVGProps<SVGSVGElement>) => (
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
      d="m20.5 33.34-8.92-8.92 1.84-1.84 7.08 7.08 14.08-14.08 1.84 1.84z"
    />
  </svg>
);
export default SvgCheck;
