import * as React from "react";
import type { SVGProps } from "react";
const SvgCheckCircle = (props: SVGProps<SVGSVGElement>) => (
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
      d="m33.47 16.91 1.84 1.84-14.78 14.78-7.86-7.86 1.84-1.84 6.02 6.02zM44 24c0 11.05-8.95 20-20 20S4 35.05 4 24 12.95 4 24 4s20 8.95 20 20m-2.6 0c0-9.59-7.81-17.4-17.4-17.4S6.6 14.41 6.6 24 14.41 41.4 24 41.4 41.4 33.59 41.4 24"
    />
  </svg>
);
export default SvgCheckCircle;
