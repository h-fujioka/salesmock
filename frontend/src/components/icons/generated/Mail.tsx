import * as React from "react";
import type { SVGProps } from "react";
const SvgMail = (props: SVGProps<SVGSVGElement>) => (
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
      d="M42 8H6c-1.1 0-2 .9-2 2v28c0 1.1.9 2 2 2h36c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2m-.6 2.6v1.87l-.06-.09L24 22.5 6.66 12.38l-.06.09V10.6zM6.6 37.4V15.36L24 25.51l17.4-10.15V37.4z"
    />
  </svg>
);
export default SvgMail;
