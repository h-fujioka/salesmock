import React from 'react';

interface ThumbsUpIconProps {
  width?: number;
  height?: number;
  className?: string;
  onClick?: () => void;
  style?: React.CSSProperties;
}

export const ThumbsUpIcon: React.FC<ThumbsUpIconProps> = ({
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
        d="M12 42V18H6V42H12ZM42 42H30C28.9 42 28 41.1 28 40V20C28 18.9 28.9 18 30 18H42V42ZM38 22V38H30V22H38Z"
        fill="currentColor"
      />
    </svg>
  );
};

export default ThumbsUpIcon; 