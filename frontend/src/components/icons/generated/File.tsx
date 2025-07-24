import * as React from "react";
import type { SVGProps } from "react";
const SvgFile = (props: SVGProps<SVGSVGElement>) => (
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
      d="M40 6c0-1.1-.9-2-2-2H18L8 14v28c0 1.1.9 2 2 2h28c1.1 0 2-.9 2-2zM18 7.68V14h-6.32zM10.6 41.4V16.6h8c1.1 0 2-.9 2-2v-8h16.8v34.8z"
    />
  </svg>
);
export default SvgFile;
