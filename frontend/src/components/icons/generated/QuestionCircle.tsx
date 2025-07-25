import * as React from "react";
import type { SVGProps } from "react";
const SvgQuestionCircle = (props: SVGProps<SVGSVGElement>) => (
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
      d="M24.07 6.6c9.59 0 17.4 7.81 17.4 17.4s-7.81 17.4-17.4 17.4S6.67 33.59 6.67 24s7.81-17.4 17.4-17.4m0-2.6c-11.05 0-20 8.95-20 20s8.95 20 20 20 20-8.95 20-20-8.96-20-20-20m9.15 14.92c0 3.89-3.1 7.27-7.37 8.05-.31.05-.55.38-.55.75V30h-2.6v-2.28c0-1.64 1.13-3.03 2.68-3.31 3.04-.55 5.24-2.86 5.24-5.49 0-3.1-2.97-5.62-6.62-5.62s-6.62 2.52-6.62 5.62h-2.6c0-4.53 4.14-8.22 9.22-8.22s9.22 3.69 9.22 8.22M26 35c0 1.1-.9 2-2 2s-2-.9-2-2 .9-2 2-2 2 .9 2 2"
    />
  </svg>
);
export default SvgQuestionCircle;
