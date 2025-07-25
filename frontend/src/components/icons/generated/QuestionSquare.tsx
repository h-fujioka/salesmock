import * as React from "react";
import type { SVGProps } from "react";
const SvgQuestionSquare = (props: SVGProps<SVGSVGElement>) => (
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
      d="M39.4 8.6v30.8H8.6V8.6zM40 6H8c-1.1 0-2 .9-2 2v32c0 1.1.9 2 2 2h32c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2M25.3 27.91c0-.29.18-.54.41-.59 3.97-.72 6.85-3.87 6.85-7.49 0-4.21-3.84-7.64-8.56-7.64s-8.56 3.43-8.56 7.64h2.6c0-2.78 2.67-5.04 5.96-5.04s5.96 2.26 5.96 5.04c0 2.36-1.98 4.43-4.71 4.93-1.48.27-2.55 1.59-2.55 3.15V30h2.6zM24 33c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2"
    />
  </svg>
);
export default SvgQuestionSquare;
