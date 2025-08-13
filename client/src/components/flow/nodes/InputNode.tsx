import React from 'react';
import { Handle, Position } from 'reactflow';
import { BaseNode } from './BaseNode';
import { Type } from 'lucide-react';

type InputNodeProps = {
  data: {
    label: string;
    properties: {
      prompt: string;
      variable: string;
      inputType: 'text' | 'number' | 'phone' | 'email';
      validation?: string;
      errorMessage?: string;
      nextStep: string;
    };
  };
  selected: boolean;
};

const inputTypeLabels = {
  text: 'Text',
  number: 'Number',
  phone: 'Phone',
  email: 'Email',
};

export const InputNode: React.FC<InputNodeProps> = ({ data, selected, id }) => {
  const { properties } = data;
  
  return (
    <BaseNode
      id={id}
      data={data}
      selected={selected}
      title="Input"
      icon={<Type className="w-4 h-4" />}
      color="emerald"
    >
      <div className="space-y-2">
        <div>
          <p className="text-xs font-medium text-slate-500">Prompt</p>
          <p className="text-sm text-slate-900 line-clamp-2">
            {properties?.prompt || 'Enter your input'}
          </p>
        </div>
        
        <div className="grid grid-cols-2 gap-2">
          <div>
            <p className="text-xs font-medium text-slate-500">Type</p>
            <div className="text-xs px-2 py-1 bg-emerald-50 text-emerald-700 rounded inline-block">
              {inputTypeLabels[properties?.inputType || 'text']}
            </div>
          </div>
          
          <div>
            <p className="text-xs font-medium text-slate-500">Saves to</p>
            <div className="text-xs px-2 py-1 bg-blue-50 text-blue-700 rounded font-mono">
              {properties?.variable || 'var'}
            </div>
          </div>
        </div>
        
        {properties?.validation && (
          <div>
            <p className="text-xs font-medium text-slate-500">Validation</p>
            <p className="text-xs text-slate-600 truncate">
              {properties.validation}
            </p>
          </div>
        )}
      </div>
    </BaseNode>
  );
};

export default InputNode;
