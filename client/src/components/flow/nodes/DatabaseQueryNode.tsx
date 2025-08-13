import React from 'react';
import { Handle, Position } from 'reactflow';
import { BaseNode } from './BaseNode';
import { Database } from 'lucide-react';

type DatabaseQueryNodeProps = {
  data: {
    label: string;
    properties: {
      connectionId: string;
      operation: 'select' | 'insert' | 'update' | 'delete';
      table: string;
      query: string;
      parameters: Array<{ name: string; value: string }>;
      resultVariable: string;
      successMessage?: string;
      errorMessage?: string;
      nextStep: string;
    };
  };
  selected: boolean;
};

const operationLabels = {
  select: 'SELECT',
  insert: 'INSERT',
  update: 'UPDATE',
  delete: 'DELETE',
};

export const DatabaseQueryNode: React.FC<DatabaseQueryNodeProps> = ({ data, selected, id }) => {
  const { properties } = data;
  
  return (
    <BaseNode
      id={id}
      data={data}
      selected={selected}
      title="Database Query"
      icon={<Database className="w-4 h-4" />}
      color="violet"
    >
      <div className="space-y-2">
        <div className="grid grid-cols-2 gap-2">
          <div>
            <p className="text-xs font-medium text-slate-500">Operation</p>
            <div className="text-xs px-2 py-1 bg-violet-50 text-violet-700 rounded inline-block">
              {operationLabels[properties?.operation || 'select']}
            </div>
          </div>
          
          <div>
            <p className="text-xs font-medium text-slate-500">Table</p>
            <div className="text-xs px-2 py-1 bg-slate-50 text-slate-700 rounded font-mono truncate">
              {properties?.table || 'table_name'}
            </div>
          </div>
        </div>
        
        {properties?.query && (
          <div>
            <p className="text-xs font-medium text-slate-500">Query</p>
            <div className="p-2 bg-slate-50 rounded text-xs font-mono text-slate-700 overflow-x-auto">
              {properties.query || '-- No query --'}
            </div>
          </div>
        )}
        
        {properties?.parameters?.length > 0 && (
          <div>
            <p className="text-xs font-medium text-slate-500">Parameters</p>
            <div className="space-y-1">
              {properties.parameters.map((param, i) => (
                <div key={i} className="flex justify-between text-xs bg-slate-50 p-1 rounded">
                  <span className="font-mono text-slate-700">:{param.name}</span>
                  <span className="text-slate-500 truncate ml-2">{param.value}</span>
                </div>
              ))}
            </div>
          </div>
        )}
        
        <div>
          <p className="text-xs font-medium text-slate-500">Saves to</p>
          <div className="text-xs px-2 py-1 bg-blue-50 text-blue-700 rounded font-mono">
            {properties?.resultVariable || 'result'}
          </div>
        </div>
      </div>
    </BaseNode>
  );
};

export default DatabaseQueryNode;
