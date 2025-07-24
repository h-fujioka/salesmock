import * as React from "react";
import type { SVGProps } from "react";
const SvgPlusCircle = (props: SVGProps<SVGSVGElement>) => (
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
      d="M24 6.6c9.59 0 17.4 7.81 17.4 17.4S33.59 41.4 24 41.4 6.6 33.59 6.6 24 14.41 6.6 24 6.6M24 4C12.95 4 4 12.95 4 24s8.95 20 20 20 20-8.95 20-20S35.05 4 24 4m10 18.7h-8.7V14h-2.6v8.7H14v2.6h8.7V34h2.6v-8.7H34z"
    />
  </svg>
);
export default SvgPlusCircle;
