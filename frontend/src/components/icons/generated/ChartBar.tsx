import * as React from "react";
import type { SVGProps } from "react";
const SvgChartBar = (props: SVGProps<SVGSVGElement>) => (
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
      d="M34 16.3H12v-2.6h22zm-6 5.4H12v2.6h16zm12 8H12v2.6h28zM8.7 39.4a.1.1 0 0 1-.1-.1V6H6v34a2 2 0 0 0 2 2h34v-2.6z"
    />
  </svg>
);
export default SvgChartBar;
