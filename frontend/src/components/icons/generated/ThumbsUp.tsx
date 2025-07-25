import * as React from "react";
import type { SVGProps } from "react";
const SvgThumbsUp = (props: SVGProps<SVGSVGElement>) => (
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
      d="M38 19h-8l1.65-8.39C32.02 8.19 30.15 6 27.7 6h-3.72c-.75 0-1.43.42-1.78 1.08L14.5 22H8c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h25.16c2.26 0 4.25-1.52 4.83-3.71l3.99-14.94C42.18 21.01 40.34 19 38 19M14.4 39.4H8.6V24.6h5.8zm21.08-1.78a2.4 2.4 0 0 1-2.32 1.78H17.1V22.63L24.35 8.6h3.35c.56 0 .91.31 1.06.49s.39.55.33 1.08l-1.64 8.33-.61 3.1H38c.54 0 .88.28 1.03.45.14.15.35.46.37.9z"
    />
  </svg>
);
export default SvgThumbsUp;
