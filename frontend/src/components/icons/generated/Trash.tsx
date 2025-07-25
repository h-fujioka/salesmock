import * as React from "react";
import type { SVGProps } from "react";
const SvgTrash = (props: SVGProps<SVGSVGElement>) => (
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
      d="M42 10H6v2.6h3.8V42c0 1.1.9 2 2 2H36c1.1 0 2-.9 2-2V12.6h4zm-6.6 31.4h-23V12.6h23zM32 6.6H16V4h16zM21 36h-2.6V18H21zm8.6 0H27V18h2.6z"
    />
  </svg>
);
export default SvgTrash;
