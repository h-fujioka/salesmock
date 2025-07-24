import React from 'react';
import * as GeneratedIcons from './generated';

export interface IconProps {
  name: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl';
  className?: string;
  onClick?: () => void;
  color?: string;
}

const sizeMap = {
  xs: 12,
  sm: 16,
  md: 20,
  lg: 24,
  xl: 32,
  xxl: 48,
};

function toPascalCase(str: string) {
  return str
    .replace(/[-_](.)/g, (_, group1) => group1.toUpperCase())
    .replace(/^(.)/, (_, group1) => group1.toUpperCase());
}

export const Icon: React.FC<IconProps> = ({ 
  name, 
  size = 'md', 
  className = '', 
  onClick,
  color = 'currentColor'
}) => {
  const iconSize = sizeMap[size];
  const pascalName = toPascalCase(name);
  const IconComponent = (GeneratedIcons as any)[pascalName];

  if (IconComponent) {
    return (
      <IconComponent
        width={iconSize}
        height={iconSize}
        className={className}
        onClick={onClick}
        style={{ color }}
      />
    );
  }

  // アイコンが見つからない場合のフォールバック
  console.warn(`Icon "${name}" not found`);
  return (
    <div 
      style={{ 
        width: iconSize, 
        height: iconSize, 
        backgroundColor: '#f0f0f0',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: iconSize * 0.6,
        color: '#999'
      }}
      className={className}
      onClick={onClick}
    >
      ?
    </div>
  );
};

export default Icon; 