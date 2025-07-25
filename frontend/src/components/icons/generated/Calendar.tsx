import * as React from "react";
import type { SVGProps } from "react";
const SvgCalendar = (props: SVGProps<SVGSVGElement>) => (
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
      d="M42 9h-8.4V6H31v3H17V6h-2.6v3H6c-1.1 0-2 .9-2 2v29c0 1.1.9 2 2 2h36c1.1 0 2-.9 2-2V11c0-1.1-.9-2-2-2m-.6 30.4H6.6V20.8h34.8zm0-21.2H6.6v-6.6h7.8V15H17v-3.4h14V15h2.6v-3.4h7.8z"
    />
  </svg>
);
export default SvgCalendar;
