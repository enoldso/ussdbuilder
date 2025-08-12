# USSD Builder Application

## Overview

This is a visual USSD (Unstructured Supplementary Service Data) flow builder application that allows users to design, preview, and generate code for USSD services. The application provides a drag-and-drop interface for creating USSD flows with various components like menu screens, input fields, payment options, and conditional branches. Users can visually design their USSD service flow and export it as a complete Express.js application.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
The frontend is built using React with TypeScript and follows a component-based architecture:

- **React Flow Integration**: Uses ReactFlow library for the visual flow builder interface, enabling drag-and-drop functionality for creating USSD flows
- **Component Library**: Implements shadcn/ui components built on Radix UI primitives for consistent UI patterns
- **State Management**: Uses TanStack Query for server state management and React hooks for local component state
- **Styling**: Tailwind CSS with custom design tokens and CSS variables for theming
- **Routing**: Wouter for lightweight client-side routing

### Backend Architecture
The backend follows a RESTful API pattern with Express.js:

- **Express Server**: Handles API routes for project CRUD operations and code generation
- **Storage Layer**: Abstracted storage interface with in-memory implementation for development
- **Code Generation Service**: Generates Express.js applications from USSD flow definitions
- **Template Engine**: Creates boilerplate code files for USSD applications

### Key Design Patterns
- **Component-Based UI**: Modular React components for reusable UI elements
- **Repository Pattern**: Storage abstraction allows switching between different persistence layers
- **Service Layer**: Separation of business logic into dedicated service classes
- **Template Pattern**: Code generation uses templates for consistent output structure

### Data Storage
- **Development Mode**: In-memory storage for rapid prototyping
- **Schema Definition**: Drizzle ORM with PostgreSQL schema definitions for production readiness
- **Project Structure**: Projects contain flow data (nodes and edges) and generated code artifacts

### Flow Component System
The application defines six core USSD component types:
- **Menu Screen**: Interactive option selection interfaces
- **Input Field**: Text/numeric data collection components
- **Payment Option**: Integration points for payment processing
- **Conditional Branch**: Logic flow control based on user input
- **API Integration**: External service connection points
- **End Screen**: Flow termination with final messages

## External Dependencies

### Core Framework Dependencies
- **React 18**: Frontend framework with modern hooks and concurrent features
- **Express.js**: Backend web application framework
- **TypeScript**: Type-safe development across frontend and backend

### UI and Visualization
- **ReactFlow**: Visual flow diagram library for drag-and-drop interface
- **Radix UI**: Accessible component primitives for consistent UI behavior
- **Tailwind CSS**: Utility-first CSS framework for rapid styling
- **Lucide React**: Icon library for consistent iconography

### Database and ORM
- **Drizzle ORM**: Type-safe SQL toolkit for database operations
- **Neon Database**: PostgreSQL-compatible serverless database (configured)
- **PostgreSQL**: Primary database dialect for production deployments

### Development and Build Tools
- **Vite**: Fast build tool and development server with HMR
- **esbuild**: JavaScript bundler for production builds
- **Replit Integration**: Development environment integration with error handling

### State Management and Data Fetching
- **TanStack Query**: Server state management with caching and synchronization
- **React Hook Form**: Form state management with validation
- **Zod**: Runtime type validation for API requests and responses

### Utility Libraries
- **date-fns**: Date manipulation and formatting utilities
- **clsx & class-variance-authority**: Conditional CSS class management
- **archiver**: ZIP file generation for project exports
- **nanoid**: Unique identifier generation