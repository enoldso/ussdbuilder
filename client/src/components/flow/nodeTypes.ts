import { Node, NodeProps, NodeTypes, XYPosition } from '@xyflow/react';
import {
  MenuNode,
  InputNode,
  DatabaseQueryNode,
  ConditionalNode,
  ApiCallNode,
} from './nodes';

// Define a custom node data type
export type CustomNodeData = {
  label?: string;
  properties: Record<string, any>;
  [key: string]: any;
};

// Define a custom node type that extends the base Node type
export type CustomNode = Node<CustomNodeData> & {
  id: string;
  type: string;
  position: XYPosition;
  data: CustomNodeData;
};

// Define the props for our custom nodes
export type CustomNodeProps = NodeProps<CustomNodeData> & {
  id: string;
  type: string;
  data: CustomNodeData;
  selected?: boolean;
  dragging?: boolean;
  zIndex: number;
  isConnectable: boolean;
  xPos: number;
  yPos: number;
  title: string;
  icon: React.ReactNode;
  color: string;
};

// Define the node types with proper typing
export const nodeTypes: NodeTypes = {
  'menu-screen': MenuNode as React.ComponentType<CustomNodeProps>,
  'input-field': InputNode as React.ComponentType<CustomNodeProps>,
  'database-query': DatabaseQueryNode as React.ComponentType<CustomNodeProps>,
  'api-call': ApiCallNode as React.ComponentType<CustomNodeProps>,
  'api-integration': ApiCallNode as React.ComponentType<CustomNodeProps>,
  'conditional-branch': ConditionalNode as React.ComponentType<CustomNodeProps>,
  'validation': InputNode as React.ComponentType<CustomNodeProps>,
  'switch': ConditionalNode as React.ComponentType<CustomNodeProps>,
  'end-screen': MenuNode as React.ComponentType<CustomNodeProps>,
  'payment-option': MenuNode as React.ComponentType<CustomNodeProps>,
};
