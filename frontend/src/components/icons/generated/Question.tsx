import * as React from "react";
import type { SVGProps } from "react";
const SvgQuestion = (props: SVGProps<SVGSVGElement>) => (
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
      d="M26 38c0 1.1-.9 2-2 2s-2-.9-2-2 .9-2 2-2 2 .9 2 2M24 8c-6.23 0-11.29 4.5-11.29 10.02h2.6c0-4.09 3.9-7.43 8.69-7.43s8.69 3.33 8.69 7.43c0 3.49-2.9 6.54-6.89 7.26-1.8.32-3.11 1.94-3.11 3.85V33h2.6v-3.87c0-.64.42-1.19.97-1.29 5.23-.95 9.02-5.08 9.02-9.82C35.28 12.49 30.21 8 23.99 8z"
    />
  </svg>
);
export default SvgQuestion;
