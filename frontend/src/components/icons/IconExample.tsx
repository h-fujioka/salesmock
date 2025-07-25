'use client';

import React from 'react';
import { Icon, ICON_NAMES } from './index';

export const IconExample: React.FC = () => {
  return (
    <div className="p-6 space-y-6">
              <h2 className="text-[22px] font-bold mb-4">全アイコン一覧</h2>
      <div className="grid grid-cols-6 gap-6">
        {Object.entries(ICON_NAMES).map(([key, name]) => (
          <div key={name} className="flex flex-col items-center space-y-2 p-4 border rounded-lg">
            <Icon name={name} size="lg" />
            <span className="text-xs text-gray-500">{name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default IconExample; 