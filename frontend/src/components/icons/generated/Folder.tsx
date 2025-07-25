import * as React from "react";
import type { SVGProps } from "react";
const SvgFolder = (props: SVGProps<SVGSVGElement>) => (
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
      d="M42 12H24l-3.41-3.41c-.38-.38-.88-.59-1.41-.59H6c-1.1 0-2 .9-2 2v28c0 1.1.9 2 2 2h36c1.1 0 2-.9 2-2V14c0-1.1-.9-2-2-2m-.6 25.4H6.6V10.6h12.32l3.24 3.24.76.76H41.4z"
    />
  </svg>
);
export default SvgFolder;
