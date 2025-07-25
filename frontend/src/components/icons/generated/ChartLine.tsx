import * as React from "react";
import type { SVGProps } from "react";
const SvgChartLine = (props: SVGProps<SVGSVGElement>) => (
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
      d="M42 39.4V42H8a2 2 0 0 1-2-2V6h2.6v33.3c0 .06.05.1.1.1zM21 24.84l5.25 5.25 13.67-13.67-1.84-1.84-11.83 11.83L21 21.16l-9.92 9.92 1.84 1.84z"
    />
  </svg>
);
export default SvgChartLine;
