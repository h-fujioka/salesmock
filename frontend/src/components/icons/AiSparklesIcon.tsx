import React from 'react';

interface AiSparklesIconProps {
  width?: number;
  height?: number;
  className?: string;
  onClick?: () => void;
  style?: React.CSSProperties;
}

export const AiSparklesIcon: React.FC<AiSparklesIconProps> = ({
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
        d="M24 4L28.5 19.5H44L30.5 30L35 45.5L24 35L13 45.5L17.5 30L4 19.5H19.5L24 4Z"
        fill="currentColor"
      />
    </svg>
  );
};

export default AiSparklesIcon; 