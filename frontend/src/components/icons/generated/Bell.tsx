import * as React from "react";
import type { SVGProps } from "react";
const SvgBell = (props: SVGProps<SVGSVGElement>) => (
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
      d="M40 36.1h-2V20c0-7.22-5.48-13.17-12.5-13.92V5.5c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.58C15.48 6.83 10 12.77 10 20v16.1H8v2.6h10.23A5.8 5.8 0 0 0 24 44a5.8 5.8 0 0 0 5.77-5.3H40zM12.6 20c0-6.29 5.11-11.4 11.4-11.4S35.4 13.71 35.4 20v16.1H12.6zM24 41.4c-1.59 0-2.91-1.17-3.15-2.7h6.3A3.195 3.195 0 0 1 24 41.4"
    />
  </svg>
);
export default SvgBell;
