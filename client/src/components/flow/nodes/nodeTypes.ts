import { 
  Menu, 
  Type, 
  StopCircle, 
  GitBranch, 
  ListTodo, 
  ListChecks, 
  Database, 
  Globe, 
  Zap, 
  CreditCard, 
  Code2, 
  Terminal 
} from 'lucide-react';

export const NODE_ICONS = {
  // Basic Components
  'menu-screen': Menu,
  'input-field': Type,
  'end-screen': StopCircle,
  
  // Logic & Control
  'conditional-branch': GitBranch,
  'switch': ListTodo,
  'validation': ListChecks,
  
  // Data Operations
  'database-query': Database,
  'api-call': Globe,
  'api-integration': Zap,
  
  // Payment & Transactions
  'payment-option': CreditCard,
  
  // System
  'function': Code2,
  'terminal': Terminal,
} as const;

export const NODE_COLORS = {
  // Basic Components
  'menu-screen': 'blue',
  'input-field': 'emerald',
  'end-screen': 'red',
  
  // Logic & Control
  'conditional-branch': 'purple',
  'switch': 'indigo',
  'validation': 'amber',
  
  // Data Operations
  'database-query': 'violet',
  'api-call': 'sky',
  'api-integration': 'cyan',
  
  // Payment & Transactions
  'payment-option': 'green',
  
  // System
  'function': 'pink',
  'terminal': 'slate',
} as const;

export const NODE_TITLES = {
  // Basic Components
  'menu-screen': 'Menu',
  'input-field': 'Input',
  'end-screen': 'End',
  
  // Logic & Control
  'conditional-branch': 'If/Else',
  'switch': 'Switch',
  'validation': 'Validation',
  
  // Data Operations
  'database-query': 'DB Query',
  'api-call': 'API Call',
  'api-integration': 'API Integration',
  
  // Payment & Transactions
  'payment-option': 'Payment',
  
  // System
  'function': 'Function',
  'terminal': 'Terminal',
} as const;

export type NodeType = keyof typeof NODE_ICONS;
