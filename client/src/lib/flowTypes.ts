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
  // Existing Menu Screen
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
  // Enhanced Input Field with Validation
  {
    type: 'input-field',
    label: 'Input Field',
    description: 'Text/numeric input with validation',
    icon: 'fas fa-keyboard',
    color: 'bg-blue-500',
    defaultData: {
      label: 'Enter Value',
      description: 'User input field',
      properties: {
        placeholder: 'Enter value...',
        inputType: 'text', // text, number, phone, email, etc.
        validation: {
          required: true,
          type: 'text',
          min: 1,
          max: 160,
          pattern: '',
          errorMessage: 'Invalid input',
        },
        successMessage: 'Input received',
        nextStep: '',
        variableName: 'userInput',
      },
    },
  },
  // Payment Option
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
        phoneNumber: '', // Can be variable like {{user.phone}}
        accountReference: '',
        successMessage: 'Payment initiated',
        errorMessage: 'Payment failed',
        nextStep: '',
      },
    },
  },
  // Database Query Node
  {
    type: 'database-query',
    label: 'Database Query',
    description: 'Execute database operations',
    icon: 'fas fa-database',
    color: 'bg-purple-500',
    defaultData: {
      label: 'Database Query',
      description: 'Run database operations',
      properties: {
        connectionId: '',
        operation: 'select', // select, insert, update, delete
        table: '',
        query: '',
        parameters: [],
        resultVariable: 'dbResult',
        successMessage: 'Operation successful',
        errorMessage: 'Database error',
        nextStep: '',
      },
    },
  },
  // API Call Node
  {
    type: 'api-call',
    label: 'API Call',
    description: 'Call external API',
    icon: 'fas fa-globe',
    color: 'bg-indigo-500',
    defaultData: {
      label: 'API Call',
      description: 'Call external service',
      properties: {
        method: 'GET', // GET, POST, PUT, DELETE
        url: '',
        headers: [
          { key: 'Content-Type', value: 'application/json' },
        ],
        body: '{}',
        queryParams: [],
        resultVariable: 'apiResponse',
        successMessage: 'API call successful',
        errorMessage: 'API call failed',
        nextStep: '',
      },
    },
  },
  // Conditional Branch (If/Else)
  {
    type: 'conditional-branch',
    label: 'If/Else Condition',
    description: 'Simple if/else condition',
    icon: 'fas fa-code-branch',
    color: 'bg-amber-500',
    defaultData: {
      label: 'Condition',
      description: 'If/else condition',
      properties: {
        condition: {
          leftOperand: '',
          operator: 'equals', // equals, notEquals, contains, greaterThan, etc.
          rightOperand: '',
        },
        trueStep: '',
        falseStep: '',
      },
    },
  },
  // Switch Node (Multiple Conditions)
  {
    type: 'switch',
    label: 'Switch',
    description: 'Multiple condition checks',
    icon: 'fas fa-random',
    color: 'bg-pink-500',
    defaultData: {
      label: 'Switch',
      description: 'Multiple conditions',
      properties: {
        valueToCheck: '',
        cases: [
          { value: '1', nextStep: '', label: 'Case 1' },
          { value: '2', nextStep: '', label: 'Case 2' },
        ],
        defaultStep: '',
      },
    },
  },
  // Validation Node
  {
    type: 'validation',
    label: 'Validation',
    description: 'Validate user input',
    icon: 'fas fa-check-circle',
    color: 'bg-green-500',
    defaultData: {
      label: 'Validate Input',
      description: 'Validate user input',
      properties: {
        validations: [
          {
            type: 'required',
            field: 'inputField',
            message: 'This field is required',
          },
          {
            type: 'pattern',
            field: 'phoneNumber',
            pattern: '^[0-9]{10,15}$',
            message: 'Invalid phone number',
          },
        ],
        successStep: '',
        errorStep: '',
      },
    },
  },
  // API Integration Node (simplified)
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
        url: 'https://api.example.com/endpoint',
        method: 'POST',
        headers: [
          { key: 'Content-Type', value: 'application/json' }
        ],
        body: '{}',
        successMessage: 'API call successful',
        errorMessage: 'Service unavailable',
        nextStep: ''
      }
    }
  },
  // End Screen Node
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
        nextStep: ''
      }
    }
  }
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
