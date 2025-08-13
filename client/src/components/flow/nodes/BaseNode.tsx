import React from 'react';
import { Handle, Position } from '@xyflow/react';
import { cn } from '@/lib/utils';
import { CustomNodeProps } from '../nodeTypes';

interface BaseNodeProps extends CustomNodeProps {
  title: string;
  icon: React.ReactNode;
  color: string;
  children?: React.ReactNode;
}

export const BaseNode: React.FC<BaseNodeProps> = ({
  id,
  data,
  selected,
  title,
  icon,
  color,
  children,
}) => {
  return (
    <div
      className={cn(
        'rounded-lg border-2 bg-white shadow-sm transition-all',
        selected ? 'border-blue-500' : 'border-slate-200',
        'min-w-[200px] max-w-[300px]',
      )}
    >
      {/* Node Header */}
      <div
        className={cn(
          'flex items-center justify-between rounded-t-md px-4 py-2',
          `bg-${color}-50 border-b border-${color}-100`,
        )}
      >
        <div className="flex items-center space-x-2">
          <div className={cn('rounded-md p-1.5', `bg-${color}-100`)}>
            {React.cloneElement(icon as React.ReactElement, {
              className: `w-4 h-4 text-${color}-600`,
            })}
          </div>
          <h3 className="text-sm font-medium text-slate-900">{title}</h3>
        </div>
        <div className="text-xs font-mono text-slate-500">
          {data.label || 'Unnamed'}
        </div>
      </div>

      {/* Node Content */}
      <div className="p-3 space-y-2">
        {children}
      </div>

      {/* Handles */}
      <Handle
        type="target"
        position={Position.Top}
        className="w-3 h-3 bg-slate-400 -top-1.5"
      />
      <Handle
        type="source"
        position={Position.Bottom}
        className="w-3 h-3 bg-slate-400 -bottom-1.5"
      />
    </div>
  );
};

export default BaseNode;
