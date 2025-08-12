import { useCallback } from 'react';
import {
  ReactFlow,
  Node,
  Edge,
  addEdge,
  Connection,
  useNodesState,
  useEdgesState,
  Controls,
  Background,
  BackgroundVariant,
  MiniMap,
  NodeChange,
  EdgeChange,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

interface FlowCanvasProps {
  nodes: Node[];
  edges: Edge[];
  onNodesChange: (changes: NodeChange[]) => void;
  onEdgesChange: (changes: EdgeChange[]) => void;
  onConnect: (connection: Connection) => void;
  onNodeClick?: (event: React.MouseEvent, node: Node) => void;
  onNodeDragStop?: (event: React.MouseEvent, node: Node) => void;
  onPaneClick?: (event: React.MouseEvent) => void;
  onDrop?: (event: React.DragEvent) => void;
  onDragOver?: (event: React.DragEvent) => void;
  className?: string;
}

const nodeColor = (node: Node) => {
  switch (node.type) {
    case 'menu-screen':
      return '#3B82F6';
    case 'input-field':
      return '#2563EB';
    case 'payment-option':
      return '#10B981';
    case 'conditional-branch':
      return '#F59E0B';
    case 'api-integration':
      return '#8B5CF6';
    case 'end-screen':
      return '#EF4444';
    default:
      return '#6B7280';
  }
};

export function FlowCanvas({
  nodes,
  edges,
  onNodesChange,
  onEdgesChange,
  onConnect,
  onNodeClick,
  onNodeDragStop,
  onPaneClick,
  onDrop,
  onDragOver,
  className = '',
}: FlowCanvasProps) {
  const handleConnect = useCallback(
    (params: Connection) => onConnect(params),
    [onConnect]
  );

  const handleNodeClick = useCallback(
    (event: React.MouseEvent, node: Node) => {
      onNodeClick?.(event, node);
    },
    [onNodeClick]
  );

  const handleNodeDragStop = useCallback(
    (event: React.MouseEvent, node: Node) => {
      onNodeDragStop?.(event, node);
    },
    [onNodeDragStop]
  );

  const handlePaneClick = useCallback(
    (event: React.MouseEvent) => {
      onPaneClick?.(event);
    },
    [onPaneClick]
  );

  const handleDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();
      onDrop?.(event);
    },
    [onDrop]
  );

  const handleDragOver = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();
      event.dataTransfer.dropEffect = 'move';
      onDragOver?.(event);
    },
    [onDragOver]
  );

  return (
    <div className={`h-full w-full ${className}`} data-testid="flow-canvas">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={handleConnect}
        onNodeClick={handleNodeClick}
        onNodeDragStop={handleNodeDragStop}
        onPaneClick={handlePaneClick}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        connectionLineStyle={{
          stroke: '#2563EB',
          strokeWidth: 2,
        }}
        defaultEdgeOptions={{
          style: {
            stroke: '#2563EB',
            strokeWidth: 2,
          },
          markerEnd: {
            type: 'arrowclosed',
            color: '#2563EB',
          },
        }}
        fitView
        fitViewOptions={{
          padding: 0.2,
        }}


      >
        <Background 
          variant={BackgroundVariant.Dots} 
          gap={20} 
          size={1} 
          color="#E2E8F0"
        />
        <Controls 
          className="bg-white border border-slate-200 shadow-sm rounded-lg"
          style={{
            background: 'white',
            border: '1px solid #E2E8F0',
            borderRadius: '0.5rem',
            boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
          }}
        />
        <MiniMap 
          nodeColor={nodeColor}
          className="bg-white border border-slate-200 shadow-sm rounded-lg"
          style={{
            background: 'white',
            border: '1px solid #E2E8F0',
            borderRadius: '0.5rem',
            boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
          }}
        />
      </ReactFlow>
    </div>
  );
}
