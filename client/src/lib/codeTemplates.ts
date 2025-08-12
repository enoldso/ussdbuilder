export const CODE_TEMPLATES = {
  expressApp: `import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import ussdRoutes from './routes/ussdRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api', ussdRoutes);

app.listen(PORT, () => {
  console.log(\`USSD service running on port \${PORT}\`);
});`,

  ussdController: `export async function handleMenuScreen(req, res, nodeData) {
  const { text } = req.body;
  const session = req.session;
  
  // Menu logic implementation
  const options = nodeData.properties.options || [];
  const selectedOption = parseInt(text.split('*').pop());
  
  if (selectedOption && selectedOption <= options.length) {
    session.currentStep = options[selectedOption - 1].nextStep;
    return {
      response: 'Processing your selection...',
      continueSession: true
    };
  }
  
  let response = nodeData.label + '\\n';
  options.forEach((option, index) => {
    response += \`\${index + 1}. \${option.text}\\n\`;
  });
  
  return {
    response: response.trim(),
    continueSession: true
  };
}`,

  packageJson: `{
  "name": "ussd-application",
  "version": "1.0.0",
  "type": "module",
  "main": "index.js",
  "scripts": {
    "start": "node index.js",
    "dev": "nodemon index.js"
  },
  "dependencies": {
    "express": "^4.18.2",
    "express-session": "^1.17.3",
    "cors": "^2.8.5",
    "helmet": "^7.0.0",
    "dotenv": "^16.3.1"
  }
}`,

  dockerfile: `FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .

EXPOSE 3000

CMD ["npm", "start"]`,

  readme: `# USSD Application

Auto-generated USSD application.

## Setup

1. Install dependencies: \`npm install\`
2. Configure environment variables
3. Start the server: \`npm start\`

## API Endpoints

- \`POST /api/ussd\` - Main USSD endpoint
`
};

export function generateCodePreview(flowData: any, projectName: string): { [filename: string]: string } {
  return {
    'index.js': CODE_TEMPLATES.expressApp,
    'controllers/ussdController.js': CODE_TEMPLATES.ussdController,
    'package.json': CODE_TEMPLATES.packageJson.replace('ussd-application', projectName.toLowerCase().replace(/\s+/g, '-')),
    'Dockerfile': CODE_TEMPLATES.dockerfile,
    'README.md': CODE_TEMPLATES.readme,
  };
}
