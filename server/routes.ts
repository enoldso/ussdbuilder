import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertProjectSchema, flowDataSchema } from "@shared/schema";
import { z } from "zod";
import { codeGenerator } from "./services/codeGenerator";
import archiver from "archiver";
import { TemplateEngine } from "./services/templateEngine";

export async function registerRoutes(app: Express): Promise<Server> {
  // Get all projects
  app.get("/api/projects", async (req, res) => {
    try {
      // For demo purposes, using a default user ID
      const userId = "default-user";
      const projects = await storage.getProjectsByUser(userId);
      res.json(projects);
    } catch (error) {
      console.error("Error fetching projects:", error);
      res.status(500).json({ error: "Failed to fetch projects" });
    }
  });

  // Get project by ID
  app.get("/api/projects/:id", async (req, res) => {
    try {
      const project = await storage.getProject(req.params.id);
      if (!project) {
        return res.status(404).json({ error: "Project not found" });
      }
      res.json(project);
    } catch (error) {
      console.error("Error fetching project:", error);
      res.status(500).json({ error: "Failed to fetch project" });
    }
  });

  // Create new project
  app.post("/api/projects", async (req, res) => {
    try {
      const validatedData = insertProjectSchema.parse({
        ...req.body,
        userId: "default-user", // For demo purposes
      });

      const project = await storage.createProject(validatedData);
      res.status(201).json(project);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Validation error", details: error.errors });
      }
      console.error("Error creating project:", error);
      res.status(500).json({ error: "Failed to create project" });
    }
  });

  // Update project
  app.put("/api/projects/:id", async (req, res) => {
    try {
      const updates = req.body;
      const project = await storage.updateProject(req.params.id, updates);
      
      if (!project) {
        return res.status(404).json({ error: "Project not found" });
      }

      res.json(project);
    } catch (error) {
      console.error("Error updating project:", error);
      res.status(500).json({ error: "Failed to update project" });
    }
  });

  // Delete project
  app.delete("/api/projects/:id", async (req, res) => {
    try {
      const deleted = await storage.deleteProject(req.params.id);
      
      if (!deleted) {
        return res.status(404).json({ error: "Project not found" });
      }

      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting project:", error);
      res.status(500).json({ error: "Failed to delete project" });
    }
  });

  // Generate code from flow
  app.post("/api/projects/:id/generate-code", async (req, res) => {
    try {
      const project = await storage.getProject(req.params.id);
      if (!project) {
        return res.status(404).json({ error: "Project not found" });
      }

      // Validate flow data
      const flowData = flowDataSchema.parse(project.flowData);
      
      // Generate code
      const generatedCode = codeGenerator.generateExpressApp(flowData, project.name);
      
      // Update project with generated code
      await storage.updateProject(req.params.id, { generatedCode });

      res.json(generatedCode);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid flow data", details: error.errors });
      }
      console.error("Error generating code:", error);
      res.status(500).json({ error: "Failed to generate code" });
    }
  });

  // Export project as ZIP
  app.get("/api/projects/:id/export", async (req, res) => {
    try {
      const project = await storage.getProject(req.params.id);
      if (!project) {
        return res.status(404).json({ error: "Project not found" });
      }

      // Generate fresh code if not exists
      let generatedCode = project.generatedCode;
      if (!generatedCode) {
        const flowData = flowDataSchema.parse(project.flowData);
        generatedCode = codeGenerator.generateExpressApp(flowData, project.name);
        await storage.updateProject(req.params.id, { generatedCode });
      }

      // Create ZIP archive
      const archive = archiver('zip', { zlib: { level: 9 } });
      
      res.attachment(`${project.name.replace(/\s+/g, '-').toLowerCase()}.zip`);
      res.setHeader('Content-Type', 'application/zip');
      
      archive.pipe(res);

      // Add generated files
      archive.append(TemplateEngine.generateMainAppFile(project.name), { name: 'index.js' });
      archive.append(JSON.stringify((generatedCode as any).package, null, 2), { name: 'package.json' });
      archive.append((generatedCode as any).routes, { name: 'routes/ussdRoutes.js' });
      archive.append((generatedCode as any).controllers, { name: 'controllers/ussdController.js' });
      archive.append((generatedCode as any).middleware, { name: 'middleware/ussdSession.js' });
      archive.append((generatedCode as any).readme, { name: 'README.md' });
      archive.append(TemplateEngine.generateEnvExample(), { name: '.env.example' });
      archive.append(TemplateEngine.generateDockerfile(), { name: 'Dockerfile' });
      archive.append(TemplateEngine.generateHealthCheck(), { name: 'healthcheck.js' });

      // Add flow data as JSON
      archive.append(JSON.stringify(project.flowData, null, 2), { name: 'flow-data.json' });

      await archive.finalize();
    } catch (error) {
      console.error("Error exporting project:", error);
      res.status(500).json({ error: "Failed to export project" });
    }
  });

  // Validate flow data
  app.post("/api/validate-flow", async (req, res) => {
    try {
      const flowData = flowDataSchema.parse(req.body);
      
      // Basic flow validation
      const errors = [];
      
      // Check for orphaned nodes
      const nodeIds = new Set(flowData.nodes.map(n => n.id));
      const connectedNodes = new Set();
      
      flowData.edges.forEach(edge => {
        connectedNodes.add(edge.source);
        connectedNodes.add(edge.target);
      });

      // Find nodes with no connections (except start and end nodes)
      flowData.nodes.forEach(node => {
        if (!connectedNodes.has(node.id) && node.type !== 'end-screen') {
          errors.push(`Node "${node.data.label}" is not connected to the flow`);
        }
      });

      // Check for missing start node
      const hasStartNode = flowData.nodes.some(node => 
        node.type === 'menu-screen' && flowData.edges.every(edge => edge.target !== node.id)
      );
      
      if (!hasStartNode) {
        errors.push("Flow must have a starting menu screen");
      }

      // Check for missing end node
      const hasEndNode = flowData.nodes.some(node => node.type === 'end-screen');
      if (!hasEndNode) {
        errors.push("Flow must have at least one end screen");
      }

      res.json({
        valid: errors.length === 0,
        errors,
        nodeCount: flowData.nodes.length,
        edgeCount: flowData.edges.length
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          valid: false, 
          errors: error.errors.map(e => `${e.path.join('.')}: ${e.message}`)
        });
      }
      res.status(500).json({ error: "Validation failed" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
