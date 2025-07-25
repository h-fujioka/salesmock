import * as React from "react";
import type { SVGProps } from "react";
const SvgMagnifyingGlass = (props: SVGProps<SVGSVGElement>) => (
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
      d="m41.92 40.08-7.73-7.73C36.56 29.56 38 25.95 38 22c0-8.84-7.16-16-16-16S6 13.16 6 22s7.16 16 16 16c3.95 0 7.56-1.44 10.35-3.81l7.73 7.73zM8.6 22c0-7.39 6.01-13.4 13.4-13.4S35.4 14.61 35.4 22 29.39 35.4 22 35.4 8.6 29.39 8.6 22"
    />
  </svg>
);
export default SvgMagnifyingGlass;
