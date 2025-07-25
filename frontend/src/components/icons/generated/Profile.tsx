import * as React from "react";
import type { SVGProps } from "react";
const SvgProfile = (props: SVGProps<SVGSVGElement>) => (
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
      d="M42 8.5H6c-1.1 0-2 .9-2 2V38c0 1.1.9 2 2 2h36c1.1 0 2-.9 2-2V10.5c0-1.1-.9-2-2-2m-.6 28.9H6.6V11.1h34.8zM17.5 24c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5m0-7.4c1.32 0 2.4 1.08 2.4 2.4s-1.08 2.4-2.4 2.4-2.4-1.08-2.4-2.4 1.08-2.4 2.4-2.4m-5.2 17.9H9.7v-4c0-2.92 2.38-5.3 5.3-5.3h5c2.92 0 5.3 2.38 5.3 5.3v4h-2.6v-4c0-1.49-1.21-2.7-2.7-2.7h-5c-1.49 0-2.7 1.21-2.7 2.7zm26.2-9.2H28v-2.6h10.5zm0-6.7H28V16h10.5zm0 13.4H28v-2.6h10.5z"
    />
  </svg>
);
export default SvgProfile;
