import * as React from "react";
import type { SVGProps } from "react";
const SvgChart = (props: SVGProps<SVGSVGElement>) => (
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
      d="M40.78 39.4H40V19c0-1.1-.9-2-2-2h-5c-1.1 0-2 .9-2 2v20.4h-2.5V10c0-1.1-.9-2-2-2h-5c-1.1 0-2 .9-2 2v29.4H17V28c0-1.1-.9-2-2-2h-5c-1.1 0-2 .9-2 2v11.4H6V42h36v-2.6zM33.6 19.6h3.8v19.8h-3.8zm-11.5-9h3.8v28.8h-3.8zm-11.5 18h3.8v10.8h-3.8z"
    />
  </svg>
);
export default SvgChart;
