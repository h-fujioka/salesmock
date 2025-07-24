import * as React from "react";
import type { SVGProps } from "react";
const SvgUpload = (props: SVGProps<SVGSVGElement>) => (
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
      d="M42 28v12.46c0 .77-.64 1.54-1.85 1.54H7.85C6.63 42 6 41.22 6 40.46V28h2.6v11.4h30.8V28zM22.7 10.97V34h2.59V10.98l7.53 7.52 1.84-1.84L23.99 5.99 13.33 16.65l1.84 1.84 7.53-7.53z"
    />
  </svg>
);
export default SvgUpload;
