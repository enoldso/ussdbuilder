import React from 'react';
import { Handle, Position } from 'reactflow';
import { BaseNode } from './BaseNode';
import { GitBranch } from 'lucide-react';

type ConditionalNodeProps = {
  data: {
    label: string;
    properties: {
      condition: string;
      trueStep: string;
      falseStep: string;
      description?: string;
    };
  };
  selected: boolean;
};

export const ConditionalNode: React.FC<ConditionalNodeProps> = ({ data, selected, id }) => {
  const { properties } = data;
  
  return (
    <BaseNode
      id={id}
      data={data}
      selected={selected}
      title="Conditional"
      icon={<GitBranch className="w-4 h-4" />}
      color="purple"
    >
      <div className="space-y-3">
        <div>
          <p className="text-xs font-medium text-slate-500">Condition</p>
          <div className="p-2 bg-purple-50 rounded text-sm font-mono text-purple-800">
            {properties?.condition || 'true'}
          </div>
        </div>
        
        {properties?.description && (
          <div className="text-xs text-slate-600 italic">
            {properties.description}
          </div>
        )}
        
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <div className="flex items-center">
              <div className="w-2 h-2 rounded-full bg-green-500 mr-1.5"></div>
              <span className="text-xs font-medium text-slate-700">True</span>
            </div>
            <div className="text-xs text-slate-500 truncate pl-3.5">
              {properties?.trueStep || 'Next step'}
            </div>
          </div>
          
          <div className="space-y-1">
            <div className="flex items-center">
              <div className="w-2 h-2 rounded-full bg-red-500 mr-1.5"></div>
              <span className="text-xs font-medium text-slate-700">False</span>
            </div>
            <div className="text-xs text-slate-500 truncate pl-3.5">
              {properties?.falseStep || 'Next step'}
            </div>
          </div>
        </div>
      </div>
      
      {/* Custom handles for true/false paths */}
      <Handle
        type="source"
        position={Position.Bottom}
        id="true"
        style={{ left: '30%', background: '#10B981' }}
        className="w-3 h-3 -bottom-1.5"
      />
      <Handle
        type="source"
        position={Position.Bottom}
        id="false"
        style={{ left: '70%', background: '#EF4444' }}
        className="w-3 h-3 -bottom-1.5"
      />
    </BaseNode>
  );
};

export default ConditionalNode;
