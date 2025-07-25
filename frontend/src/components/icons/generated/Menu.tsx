import * as React from "react";
import type { SVGProps } from "react";
const SvgMenu = (props: SVGProps<SVGSVGElement>) => (
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
      d="M8 22.7h32v2.6H8zm0-10v2.6h32v-2.6zm0 22.6h32v-2.6H8z"
    />
  </svg>
);
export default SvgMenu;
