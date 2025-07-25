import * as React from "react";
import type { SVGProps } from "react";
const SvgComment = (props: SVGProps<SVGSVGElement>) => (
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
      d="M39.4 8.6v23.8H18.66c-.81 0-1.6.21-2.3.62L8.6 37.5V8.6zM40 6H8c-1.1 0-2 .9-2 2v34l11.66-6.73c.3-.18.65-.27 1-.27H40c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2"
    />
  </svg>
);
export default SvgComment;
