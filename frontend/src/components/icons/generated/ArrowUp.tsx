import * as React from "react";
import type { SVGProps } from "react";
const SvgArrowUp = (props: SVGProps<SVGSVGElement>) => (
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
      d="m34.39 20.07-9.09-9.09V42h-2.6V10.98l-9.09 9.09-1.84-1.84L24 6l12.23 12.23z"
    />
  </svg>
);
export default SvgArrowUp;
