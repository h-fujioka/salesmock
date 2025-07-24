import * as React from "react";
import type { SVGProps } from "react";
const SvgComments = (props: SVGProps<SVGSVGElement>) => (
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
      d="M40 18h-4V8c0-1.1-.9-2-2-2H8c-1.1 0-2 .9-2 2v26l8.2-4.73c.3-.18.65-.27 1-.27H20v6c0 1.1.9 2 2 2h10.8c.35 0 .7.09 1 .27L42 42V20c0-1.1-.9-2-2-2m-24.8 8.4c-.81 0-1.6.21-2.3.62L8.6 29.5V8.6h24.8v17.8zm24.2 11.1-4.3-2.48c-.69-.41-1.49-.62-2.3-.62H22.6V29H34c1.1 0 2-.9 2-2v-6.4h3.4z"
    />
  </svg>
);
export default SvgComments;
