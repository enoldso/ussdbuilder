import React from 'react';
import { Handle, Position } from 'reactflow';
import { BaseNode } from './BaseNode';
import { Globe } from 'lucide-react';

type ApiCallNodeProps = {
  data: {
    label: string;
    properties: {
      method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
      url: string;
      headers: Array<{ key: string; value: string }>;
      body?: string;
      queryParams?: Array<{ key: string; value: string }>;
      resultVariable: string;
      successMessage?: string;
      errorMessage?: string;
      nextStep: string;
    };
  };
  selected: boolean;
};

const methodColors = {
  GET: 'bg-green-100 text-green-800',
  POST: 'bg-blue-100 text-blue-800',
  PUT: 'bg-yellow-100 text-yellow-800',
  PATCH: 'bg-purple-100 text-purple-800',
  DELETE: 'bg-red-100 text-red-800',
};

export const ApiCallNode: React.FC<ApiCallNodeProps> = ({ data, selected, id }) => {
  const { properties } = data;
  const method = properties?.method || 'GET';
  
  return (
    <BaseNode
      id={id}
      data={data}
      selected={selected}
      title="API Call"
      icon={<Globe className="w-4 h-4" />}
      color="sky"
    >
      <div className="space-y-3">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs font-medium text-slate-500">Method</p>
            <div className={`text-xs px-2 py-1 rounded font-mono ${methodColors[method]}`}>
              {method}
            </div>
          </div>
          
          <div className="flex-1 ml-4 min-w-0">
            <p className="text-xs font-medium text-slate-500">URL</p>
            <div className="p-1.5 bg-slate-50 rounded text-xs font-mono text-slate-700 truncate">
              {properties?.url || 'https://api.example.com/endpoint'}
            </div>
          </div>
        </div>
        
        {(properties?.headers?.length > 0 || properties?.queryParams?.length > 0) && (
          <div className="space-y-2">
            {properties?.queryParams?.length > 0 && (
              <div>
                <p className="text-xs font-medium text-slate-500 mb-1">Query Params</p>
                <div className="space-y-1">
                  {properties.queryParams.map((param, i) => (
                    <div key={`param-${i}`} className="flex text-xs bg-blue-50 p-1 rounded">
                      <span className="font-mono text-blue-700">{param.key}</span>
                      <span className="mx-1 text-slate-400">=</span>
                      <span className="text-slate-600 truncate">{param.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {properties?.headers?.length > 0 && (
              <div>
                <p className="text-xs font-medium text-slate-500 mb-1">Headers</p>
                <div className="space-y-1">
                  {properties.headers.map((header, i) => (
                    <div key={`header-${i}`} className="flex text-xs bg-slate-50 p-1 rounded">
                      <span className="font-mono text-slate-700">{header.key}:</span>
                      <span className="ml-1 text-slate-600 truncate">{header.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
        
        {properties?.body && (
          <div>
            <p className="text-xs font-medium text-slate-500 mb-1">Body</p>
            <div className="p-1.5 bg-slate-50 rounded text-xs font-mono text-slate-700 max-h-20 overflow-auto">
              {properties.body}
            </div>
          </div>
        )}
        
        <div>
          <p className="text-xs font-medium text-slate-500">Saves to</p>
          <div className="text-xs px-2 py-1 bg-blue-50 text-blue-700 rounded font-mono">
            {properties?.resultVariable || 'response'}
          </div>
        </div>
      </div>
    </BaseNode>
  );
};

export default ApiCallNode;
