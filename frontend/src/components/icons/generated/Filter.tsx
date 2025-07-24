import * as React from "react";
import type { SVGProps } from "react";
const SvgFilter = (props: SVGProps<SVGSVGElement>) => (
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
      d="M42 12.7v2.6H6v-2.6zM12 25.3h24v-2.6H12zm5 10h14v-2.6H17z"
    />
  </svg>
);
export default SvgFilter;
