import * as React from "react";
import type { SVGProps } from "react";
const SvgPlusSmall = (props: SVGProps<SVGSVGElement>) => (
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
      d="M34 25.3h-8.7V34h-2.6v-8.7H14v-2.6h8.7V14h2.6v8.7H34z"
    />
  </svg>
);
export default SvgPlusSmall;
