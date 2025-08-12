import { FlowNode, FlowEdge } from "@shared/schema";

export interface ComponentDefinition {
  type: string;
  label: string;
  description: string;
  icon: string;
  color: string;
  defaultData: {
    label: string;
    description?: string;
    properties: Record<string, any>;
  };
}

export const COMPONENT_DEFINITIONS: ComponentDefinition[] = [
  {
    type: 'menu-screen',
    label: 'Menu Screen',
    description: 'Interactive menu options',
    icon: 'fas fa-list',
    color: 'bg-primary-500',
    defaultData: {
      label: 'Main Menu',
      description: 'Choose an option',
      properties: {
        options: [
          { text: 'Option 1', nextStep: '' },
          { text: 'Option 2', nextStep: '' },
        ],
        title: 'Welcome',
        timeout: 30,
      },
    },
  },
  {
    type: 'input-field',
    label: 'Input Field',
    description: 'Text/numeric input',
    icon: 'fas fa-keyboard',
    color: 'bg-blue-500',
    defaultData: {
      label: 'Enter Value',
      description: 'User input field',
      properties: {
        placeholder: 'Enter value...',
        validation: {
          required: true,
          type: 'text',
          min: 1,
          max: 100,
        },
        successMessage: 'Input received',
        nextStep: '',
      },
    },
  },
  {
    type: 'payment-option',
    label: 'Payment Option',
    description: 'M-PESA, Airtel Money',
    icon: 'fas fa-credit-card',
    color: 'bg-emerald-500',
    defaultData: {
      label: 'Payment',
      description: 'Process payment',
      properties: {
        provider: 'mpesa',
        businessShortCode: '174379',
        passkey: '',
        callbackUrl: '',
        amount: 0,
        successMessage: 'Payment initiated',
        nextStep: '',
      },
    },
  },
  {
    type: 'conditional-branch',
    label: 'Conditional Branch',
    description: 'Logic decision point',
    icon: 'fas fa-code-branch',
    color: 'bg-amber-500',
    defaultData: {
      label: 'Condition Check',
      description: 'Decision logic',
      properties: {
        conditions: [
          {
            field: 'amount',
            operator: 'greater',
            value: 100,
            nextStep: '',
            message: 'High amount path',
          },
        ],
        defaultNextStep: '',
        defaultMessage: 'Default path',
      },
    },
  },
  {
    type: 'api-integration',
    label: 'API Integration',
    description: 'External API call',
    icon: 'fas fa-plug',
    color: 'bg-purple-500',
    defaultData: {
      label: 'API Call',
      description: 'External service integration',
      properties: {
        apiConfig: {
          url: 'https://api.example.com/endpoint',
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          defaultData: {},
        },
        successMessage: 'API call successful',
        errorMessage: 'Service unavailable',
        nextStep: '',
        errorNextStep: '',
      },
    },
  },
  {
    type: 'end-screen',
    label: 'End Screen',
    description: 'Final confirmation',
    icon: 'fas fa-stop',
    color: 'bg-red-500',
    defaultData: {
      label: 'Thank You',
      description: 'Session complete',
      properties: {
        showSummary: false,
        autoClose: true,
        closeDelay: 5,
        message: 'Transaction completed successfully',
      },
    },
  },
];

export interface NodeData {
  label: string;
  description?: string;
  properties: Record<string, any>;
  selected?: boolean;
}

export interface CustomNode {
  id: string;
  type: FlowNode['type'];
  position: FlowNode['position'];
  data: NodeData;
}

export interface FlowState {
  nodes: CustomNode[];
  edges: FlowEdge[];
  selectedNode: CustomNode | null;
  isDragging: boolean;
  viewport: {
    x: number;
    y: number;
    zoom: number;
  };
}
