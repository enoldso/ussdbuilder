import React from 'react';
import { Handle, Position } from 'reactflow';
import { BaseNode } from './BaseNode';
import { Menu } from 'lucide-react';

type MenuNodeProps = {
  data: {
    label: string;
    properties: {
      title: string;
      description: string;
      options: Array<{ text: string; nextStep: string }>;
    };
  };
  selected: boolean;
};

export const MenuNode: React.FC<MenuNodeProps> = ({ data, selected, id }) => {
  return (
    <BaseNode
      id={id}
      data={data}
      selected={selected}
      title="Menu"
      icon={<Menu className="w-4 h-4" />}
      color="blue"
    >
      <div className="space-y-2">
        <div>
          <p className="text-xs font-medium text-slate-500">Title</p>
          <p className="text-sm font-medium text-slate-900 truncate">
            {data.properties?.title || 'Untitled Menu'}
          </p>
        </div>
        
        <div>
          <p className="text-xs font-medium text-slate-500">Description</p>
          <p className="text-sm text-slate-600 line-clamp-2">
            {data.properties?.description || 'No description'}
          </p>
        </div>
        
        <div>
          <p className="text-xs font-medium text-slate-500 mb-1">Options</p>
          <div className="space-y-1">
            {data.properties?.options?.map((option, index) => (
              <div key={index} className="flex items-center justify-between p-1.5 bg-slate-50 rounded text-xs">
                <span className="truncate">{option.text || `Option ${index + 1}`}</span>
                <span className="ml-2 px-1.5 py-0.5 bg-blue-100 text-blue-800 text-xs rounded">
                  {option.nextStep ? '→' : '×'}
                </span>
              </div>
            )) || (
              <p className="text-xs text-slate-400 italic">No options defined</p>
            )}
          </div>
        </div>
      </div>
    </BaseNode>
  );
};

export default MenuNode;
