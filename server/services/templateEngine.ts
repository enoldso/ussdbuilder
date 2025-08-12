export class TemplateEngine {
  static generateMainAppFile(projectName: string): string {
    return `import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import ussdRoutes from './routes/ussdRoutes.js';
import { logUssdRequest, validateUssdRequest } from './middleware/ussdSession.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Security middleware
app.use(helmet());
app.use(cors());

// Body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging
app.use(logUssdRequest);

// Validation middleware for USSD requests
app.use('/ussd', validateUssdRequest);

// Routes
app.use('/api', ussdRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    timestamp: new Date().toISOString(),
    service: '${projectName}'
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  
  if (req.path.includes('/ussd')) {
    // Return USSD-formatted error response
    res.send('END Service error. Please try again later.');
  } else {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// 404 handler
app.use('*', (req, res) => {
  if (req.path.includes('/ussd')) {
    res.send('END Service not found.');
  } else {
    res.status(404).json({ error: 'Endpoint not found' });
  }
});

app.listen(PORT, () => {
  console.log(\`🚀 \${projectName} USSD service running on port \${PORT}\`);
  console.log(\`📱 USSD endpoint: http://localhost:\${PORT}/api/ussd\`);
  console.log(\`❤️  Health check: http://localhost:\${PORT}/health\`);
});
`;
  }

  static generateDockerfile(): string {
    return `FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy application code
COPY . .

# Create non-root user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S ussdapp -u 1001

# Change ownership
RUN chown -R ussdapp:nodejs /app
USER ussdapp

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \\
  CMD node healthcheck.js

# Start application
CMD ["npm", "start"]
`;
  }

  static generateEnvExample(): string {
    return `# Server Configuration
PORT=3000
NODE_ENV=production

# Session Configuration
SESSION_SECRET=your-super-secret-session-key

# M-PESA Configuration (if using M-PESA)
MPESA_CONSUMER_KEY=your-mpesa-consumer-key
MPESA_CONSUMER_SECRET=your-mpesa-consumer-secret
MPESA_BUSINESS_SHORT_CODE=174379
MPESA_PASSKEY=your-mpesa-passkey
MPESA_CALLBACK_URL=https://your-domain.com/api/mpesa/callback

# Airtel Money Configuration (if using Airtel Money)
AIRTEL_CLIENT_ID=your-airtel-client-id
AIRTEL_CLIENT_SECRET=your-airtel-client-secret
AIRTEL_MERCHANT_ID=your-merchant-id

# Database Configuration (if needed)
DATABASE_URL=postgresql://username:password@localhost:5432/ussd_db

# External API Configuration
EXTERNAL_API_URL=https://api.example.com
EXTERNAL_API_KEY=your-api-key
`;
  }

  static generateHealthCheck(): string {
    return `import http from 'http';

const options = {
  host: 'localhost',
  port: process.env.PORT || 3000,
  path: '/health',
  timeout: 2000
};

const request = http.request(options, (res) => {
  console.log(\`Health check status: \${res.statusCode}\`);
  if (res.statusCode === 200) {
    process.exit(0);
  } else {
    process.exit(1);
  }
});

request.on('error', (err) => {
  console.log('Health check failed:', err);
  process.exit(1);
});

request.end();
`;
  }
}
