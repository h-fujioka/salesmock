import React from 'react';

interface CheckIconProps {
  width?: number;
  height?: number;
  className?: string;
  onClick?: () => void;
  style?: React.CSSProperties;
}

export const CheckIcon: React.FC<CheckIconProps> = ({
  width = 24,
  height = 24,
  className = '',
  onClick,
  style
}) => {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      onClick={onClick}
      style={style}
    >
      <path
        d="M20.5 32.5L12 24L14.5 21.5L20.5 27.5L33.5 14.5L36 17L20.5 32.5Z"
        fill="currentColor"
      />
    </svg>
  );
};

export default CheckIcon; 