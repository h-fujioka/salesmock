import * as GeneratedIcons from './generated';
export { default as Icon } from './Icon';
export type { IconProps } from './Icon';

// ICON_NAMESを自動生成
export const ICON_NAMES = Object.keys(GeneratedIcons).reduce((acc, key) => {
  // PascalCase → kebab-case
  const kebab = key.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
  acc[kebab.toUpperCase().replace(/-/g, '_')] = kebab;
  return acc;
}, {} as Record<string, string>);

export type IconName = typeof ICON_NAMES[keyof typeof ICON_NAMES]; 