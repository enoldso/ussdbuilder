import { FlowData, FlowNode } from "@shared/schema";

export interface GeneratedCode {
  routes: string;
  controllers: string;
  middleware: string;
  package: object;
  readme: string;
}

export class CodeGenerator {
  generateExpressApp(flowData: FlowData, projectName: string): GeneratedCode {
    const nodes = flowData.nodes;
    const edges = flowData.edges;

    // Generate routes based on flow
    const routes = this.generateRoutes(nodes, edges);
    
    // Generate controllers for each node type
    const controllers = this.generateControllers(nodes);
    
    // Generate middleware for USSD session handling
    const middleware = this.generateMiddleware();
    
    // Generate package.json
    const packageJson = this.generatePackageJson(projectName);
    
    // Generate README
    const readme = this.generateReadme(projectName, nodes);

    return {
      routes,
      controllers,
      middleware,
      package: packageJson,
      readme,
    };
  }

  private generateRoutes(nodes: FlowNode[], edges: any[]): string {
    const menuScreens = nodes.filter(n => n.type === 'menu-screen');
    const inputFields = nodes.filter(n => n.type === 'input-field');
    const paymentNodes = nodes.filter(n => n.type === 'payment-option');

    return `import express from 'express';
import { ussdSessionMiddleware } from './middleware/ussdSession.js';
import { 
  handleMenuScreen,
  handleInputField,
  handlePaymentOption,
  handleConditionalBranch,
  handleApiIntegration,
  handleEndScreen
} from './controllers/ussdController.js';

const router = express.Router();

// Apply USSD session middleware
router.use('/ussd', ussdSessionMiddleware);

// Main USSD endpoint
router.post('/ussd', async (req, res) => {
  const { sessionId, phoneNumber, text } = req.body;
  
  try {
    let response = '';
    let continueSession = true;
    
    // Determine current step based on session state
    const session = req.session;
    const currentStep = session.currentStep || 'start';
    
    switch (currentStep) {
${menuScreens.map(node => `
      case '${node.id}':
        ({ response, continueSession } = await handleMenuScreen(req, res, ${JSON.stringify(node.data)}));
        break;`).join('')}
${inputFields.map(node => `
      case '${node.id}':
        ({ response, continueSession } = await handleInputField(req, res, ${JSON.stringify(node.data)}));
        break;`).join('')}
${paymentNodes.map(node => `
      case '${node.id}':
        ({ response, continueSession } = await handlePaymentOption(req, res, ${JSON.stringify(node.data)}));
        break;`).join('')}
      default:
        response = "Welcome to " + projectName + "\\n1. Start";
        session.currentStep = '${nodes.find(n => n.type === 'menu-screen')?.id || 'menu-1'}';
    }
    
    // Format response for USSD
    const ussdResponse = continueSession ? \`CON \${response}\` : \`END \${response}\`;
    
    res.send(ussdResponse);
  } catch (error) {
    console.error('USSD Error:', error);
    res.send('END Service temporarily unavailable. Please try again later.');
  }
});

export default router;`;
  }

  private generateControllers(nodes: FlowNode[]): string {
    return `export async function handleMenuScreen(req, res, nodeData) {
  const { text } = req.body;
  const session = req.session;
  
  const menuOptions = nodeData.properties.options || [];
  const selectedOption = parseInt(text.split('*').pop());
  
  if (selectedOption && selectedOption <= menuOptions.length) {
    const option = menuOptions[selectedOption - 1];
    session.currentStep = option.nextStep;
    session.selectedMenuOption = selectedOption;
    
    return {
      response: option.message || 'Please wait...',
      continueSession: true
    };
  }
  
  // Show menu
  let response = nodeData.label + '\\n';
  menuOptions.forEach((option, index) => {
    response += \`\${index + 1}. \${option.text}\\n\`;
  });
  
  return {
    response: response.trim(),
    continueSession: true
  };
}

export async function handleInputField(req, res, nodeData) {
  const { text } = req.body;
  const session = req.session;
  
  const inputValue = text.split('*').pop();
  const validation = nodeData.properties.validation || {};
  
  // Validate input
  if (validation.required && !inputValue) {
    return {
      response: 'Input is required. Please try again.',
      continueSession: true
    };
  }
  
  if (validation.type === 'numeric' && isNaN(Number(inputValue))) {
    return {
      response: 'Please enter a valid number.',
      continueSession: true
    };
  }
  
  if (validation.min && Number(inputValue) < validation.min) {
    return {
      response: \`Minimum value is \${validation.min}. Please try again.\`,
      continueSession: true
    };
  }
  
  if (validation.max && Number(inputValue) > validation.max) {
    return {
      response: \`Maximum value is \${validation.max}. Please try again.\`,
      continueSession: true
    };
  }
  
  // Store input value
  session.inputValues = session.inputValues || {};
  session.inputValues[nodeData.id] = inputValue;
  
  // Move to next step
  session.currentStep = nodeData.properties.nextStep;
  
  return {
    response: nodeData.properties.successMessage || 'Input received. Processing...',
    continueSession: true
  };
}

export async function handlePaymentOption(req, res, nodeData) {
  const { phoneNumber } = req.body;
  const session = req.session;
  
  const amount = session.inputValues?.amount || nodeData.properties.amount;
  const provider = nodeData.properties.provider || 'mpesa';
  
  try {
    // Initialize payment based on provider
    let paymentResponse;
    
    switch (provider) {
      case 'mpesa':
        paymentResponse = await initiateMpesaPayment({
          phoneNumber,
          amount,
          businessShortCode: nodeData.properties.businessShortCode,
          passkey: nodeData.properties.passkey,
          callbackUrl: nodeData.properties.callbackUrl
        });
        break;
      
      case 'airtel':
        paymentResponse = await initiateAirtelPayment({
          phoneNumber,
          amount,
          merchantId: nodeData.properties.merchantId
        });
        break;
      
      default:
        throw new Error('Unsupported payment provider');
    }
    
    session.paymentReference = paymentResponse.reference;
    session.currentStep = nodeData.properties.nextStep;
    
    return {
      response: \`Payment initiated. Reference: \${paymentResponse.reference}\\nYou will receive a prompt shortly.\`,
      continueSession: false
    };
    
  } catch (error) {
    console.error('Payment Error:', error);
    return {
      response: 'Payment failed. Please try again later.',
      continueSession: false
    };
  }
}

export async function handleConditionalBranch(req, res, nodeData) {
  const session = req.session;
  const conditions = nodeData.properties.conditions || [];
  
  for (const condition of conditions) {
    const value = session.inputValues?.[condition.field];
    
    if (evaluateCondition(value, condition.operator, condition.value)) {
      session.currentStep = condition.nextStep;
      return {
        response: condition.message || 'Condition met. Proceeding...',
        continueSession: true
      };
    }
  }
  
  // Default case
  session.currentStep = nodeData.properties.defaultNextStep;
  return {
    response: nodeData.properties.defaultMessage || 'Proceeding...',
    continueSession: true
  };
}

export async function handleApiIntegration(req, res, nodeData) {
  const session = req.session;
  
  try {
    const apiConfig = nodeData.properties.apiConfig || {};
    const requestData = {
      ...apiConfig.defaultData,
      ...session.inputValues
    };
    
    const response = await fetch(apiConfig.url, {
      method: apiConfig.method || 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...apiConfig.headers
      },
      body: JSON.stringify(requestData)
    });
    
    const result = await response.json();
    
    // Store API response
    session.apiResponses = session.apiResponses || {};
    session.apiResponses[nodeData.id] = result;
    
    session.currentStep = nodeData.properties.nextStep;
    
    return {
      response: nodeData.properties.successMessage || 'API call successful. Proceeding...',
      continueSession: true
    };
    
  } catch (error) {
    console.error('API Error:', error);
    session.currentStep = nodeData.properties.errorNextStep;
    
    return {
      response: nodeData.properties.errorMessage || 'Service error. Please try again.',
      continueSession: true
    };
  }
}

export async function handleEndScreen(req, res, nodeData) {
  const session = req.session;
  
  let response = nodeData.label;
  
  // Include summary if configured
  if (nodeData.properties.showSummary) {
    response += '\\n\\nSummary:';
    if (session.inputValues) {
      Object.entries(session.inputValues).forEach(([key, value]) => {
        response += \`\\n\${key}: \${value}\`;
      });
    }
  }
  
  // Clear session
  req.session.destroy();
  
  return {
    response,
    continueSession: false
  };
}

// Helper functions
function evaluateCondition(value, operator, expected) {
  switch (operator) {
    case 'equals':
      return value == expected;
    case 'greater':
      return Number(value) > Number(expected);
    case 'less':
      return Number(value) < Number(expected);
    case 'contains':
      return String(value).includes(String(expected));
    default:
      return false;
  }
}

async function initiateMpesaPayment({ phoneNumber, amount, businessShortCode, passkey, callbackUrl }) {
  // M-PESA STK Push implementation
  // This would integrate with actual M-PESA API
  return {
    reference: \`MP\${Date.now()}\`,
    status: 'pending'
  };
}

async function initiateAirtelPayment({ phoneNumber, amount, merchantId }) {
  // Airtel Money implementation
  // This would integrate with actual Airtel Money API
  return {
    reference: \`AM\${Date.now()}\`,
    status: 'pending'
  };
}`;
  }

  private generateMiddleware(): string {
    return `import session from 'express-session';
import MemoryStore from 'memorystore';

const MemoryStoreSession = MemoryStore(session);

export const ussdSessionMiddleware = session({
  store: new MemoryStoreSession({
    checkPeriod: 86400000 // prune expired entries every 24h
  }),
  secret: process.env.SESSION_SECRET || 'ussd-session-secret',
  resave: false,
  saveUninitialized: true,
  cookie: {
    maxAge: 300000 // 5 minutes
  },
  genid: (req) => {
    // Use phone number and sessionId for consistent session identification
    return \`\${req.body.phoneNumber}-\${req.body.sessionId || Date.now()}\`;
  }
});

export function validateUssdRequest(req, res, next) {
  const { sessionId, phoneNumber, serviceCode, text } = req.body;
  
  if (!sessionId || !phoneNumber || !serviceCode) {
    return res.status(400).json({ error: 'Missing required USSD parameters' });
  }
  
  // Validate phone number format
  const phoneRegex = /^\\+?[1-9]\\d{1,14}$/;
  if (!phoneRegex.test(phoneNumber)) {
    return res.status(400).json({ error: 'Invalid phone number format' });
  }
  
  next();
}

export function logUssdRequest(req, res, next) {
  console.log('USSD Request:', {
    sessionId: req.body.sessionId,
    phoneNumber: req.body.phoneNumber,
    serviceCode: req.body.serviceCode,
    text: req.body.text,
    timestamp: new Date().toISOString()
  });
  
  next();
}`;
  }

  private generatePackageJson(projectName: string): object {
    return {
      name: projectName.toLowerCase().replace(/\s+/g, '-'),
      version: "1.0.0",
      description: `USSD application - ${projectName}`,
      type: "module",
      main: "index.js",
      scripts: {
        start: "node index.js",
        dev: "nodemon index.js",
        test: "jest"
      },
      dependencies: {
        express: "^4.18.2",
        "express-session": "^1.17.3",
        cors: "^2.8.5",
        helmet: "^7.0.0",
        dotenv: "^16.3.1",
        memorystore: "^1.6.7"
      },
      devDependencies: {
        nodemon: "^3.0.1",
        jest: "^29.6.1"
      }
    };
  }

  private generateReadme(projectName: string, nodes: FlowNode[]): string {
    return `# ${projectName}

This is an auto-generated USSD application created with the USSD Application Builder.

## Features

${nodes.map(node => `- ${node.data.label}: ${node.data.description || 'USSD component'}`).join('\n')}

## Setup

1. Install dependencies:
   \`\`\`bash
   npm install
   \`\`\`

2. Set environment variables in \`.env\`:
   \`\`\`
   PORT=3000
   SESSION_SECRET=your-secret-key
   \`\`\`

3. Start the application:
   \`\`\`bash
   npm start
   \`\`\`

## API Endpoints

- \`POST /ussd\` - Main USSD endpoint

### USSD Request Format

\`\`\`json
{
  "sessionId": "unique-session-id",
  "phoneNumber": "+254700000000",
  "serviceCode": "*123#",
  "text": "user-input"
}
\`\`\`

### USSD Response Format

- \`CON <message>\` - Continue session with message
- \`END <message>\` - End session with final message

## Flow Structure

This application implements the following flow:

${nodes.map((node, index) => `${index + 1}. **${node.data.label}** (${node.type}): ${node.data.description || 'No description'}`).join('\n')}

## Configuration

Component configurations are embedded in the generated code. To modify the flow:

1. Use the USSD Application Builder to edit the visual flow
2. Regenerate and export the updated code
3. Replace the generated files

## Support

For questions about this generated application, refer to the USSD Application Builder documentation.
`;
  }
}

export const codeGenerator = new CodeGenerator();
