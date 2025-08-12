import { useState, useCallback, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import {
  ReactFlow,
  ReactFlowProvider,
  addEdge,
  useNodesState,
  useEdgesState,
  Controls,
  Background,
  BackgroundVariant,
  Connection,
  Edge,
  Node,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";

import { ComponentToolbox } from "@/components/flow/ComponentToolbox";
import { PropertiesPanel } from "@/components/flow/PropertiesPanel";
import { MobilePreview } from "@/components/flow/MobilePreview";
import { CodeEditor } from "@/components/flow/CodeEditor";
import { ExportDialog } from "@/components/flow/ExportDialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { FlowData, FlowNode, FlowEdge } from "@shared/schema";
import { COMPONENT_DEFINITIONS, CustomNode } from "@/lib/flowTypes";
import { Play, Save, Download, Code, Smartphone, Settings, Plus } from "lucide-react";

export default function Dashboard() {
  const { toast } = useToast();
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [selectedNode, setSelectedNode] = useState<CustomNode | null>(null);
  const [showCodeEditor, setShowCodeEditor] = useState(false);
  const [showExportDialog, setShowExportDialog] = useState(false);
  const [showNewProjectDialog, setShowNewProjectDialog] = useState(false);
  const [currentProject, setCurrentProject] = useState<any>(null);
  const [projectName, setProjectName] = useState("New USSD Project");
  const [projectDescription, setProjectDescription] = useState("");

  // Fetch projects
  const { data: projects } = useQuery({
    queryKey: ["/api/projects"],
    enabled: true,
  });

  // Create project mutation
  const createProjectMutation = useMutation({
    mutationFn: async (data: { name: string; description: string; flowData: FlowData }) => {
      const response = await apiRequest("POST", "/api/projects", data);
      return response.json();
    },
    onSuccess: (project) => {
      setCurrentProject(project);
      setProjectName(project.name);
      setProjectDescription(project.description);
      queryClient.invalidateQueries({ queryKey: ["/api/projects"] });
      toast({ title: "Project created successfully" });
    },
    onError: () => {
      toast({ title: "Failed to create project", variant: "destructive" });
    },
  });

  // Update project mutation
  const updateProjectMutation = useMutation({
    mutationFn: async (data: { id: string; flowData: FlowData }) => {
      const response = await apiRequest("PUT", `/api/projects/${data.id}`, {
        flowData: data.flowData,
      });
      return response.json();
    },
    onSuccess: () => {
      toast({ title: "Project saved successfully" });
    },
    onError: () => {
      toast({ title: "Failed to save project", variant: "destructive" });
    },
  });

  // Generate code mutation
  const generateCodeMutation = useMutation({
    mutationFn: async (projectId: string) => {
      const response = await apiRequest("POST", `/api/projects/${projectId}/generate-code`, {});
      return response.json();
    },
    onSuccess: () => {
      toast({ title: "Code generated successfully" });
    },
    onError: () => {
      toast({ title: "Failed to generate code", variant: "destructive" });
    },
  });

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds: Edge[]) => addEdge(params, eds)),
    [setEdges]
  );

  const onNodeClick = useCallback((_: any, node: Node) => {
    setSelectedNode(node as CustomNode);
  }, []);

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();

      const type = event.dataTransfer.getData("application/reactflow");
      if (!type) return;

      const position = {
        x: event.clientX - 250,
        y: event.clientY - 40,
      };

      const componentDef = COMPONENT_DEFINITIONS.find(def => def.type === type);
      if (!componentDef) return;

      const newNode: CustomNode = {
        id: `${type}-${Date.now()}`,
        type: type as FlowNode['type'],
        position,
        data: {
          ...componentDef.defaultData,
          selected: false,
        },
      };

      setNodes((nds: Node[]) => nds.concat(newNode));
    },
    [setNodes]
  );

  const handleSaveProject = useCallback(async () => {
    const flowData: FlowData = {
      nodes: nodes.map((node: Node) => ({
        id: node.id,
        type: (node.data as NodeData).label.toLowerCase().includes('menu') ? 'menu-screen' : 
              (node.data as NodeData).label.toLowerCase().includes('input') ? 'input-field' :
              (node.data as NodeData).label.toLowerCase().includes('payment') ? 'payment-option' :
              (node.data as NodeData).label.toLowerCase().includes('condition') ? 'conditional-branch' :
              (node.data as NodeData).label.toLowerCase().includes('api') ? 'api-integration' : 'end-screen',
        position: node.position,
        data: {
          label: (node.data as NodeData).label,
          description: (node.data as NodeData).description,
          properties: (node.data as NodeData).properties,
        },
      })),
      edges: edges.map((edge: Edge) => ({
        id: edge.id,
        source: edge.source,
        target: edge.target,
        sourceHandle: edge.sourceHandle,
        targetHandle: edge.targetHandle,
      })),
    };

    if (currentProject) {
      updateProjectMutation.mutate({ id: currentProject.id, flowData });
    } else {
      createProjectMutation.mutate({
        name: projectName,
        description: projectDescription,
        flowData,
      });
    }
  }, [nodes, edges, currentProject, projectName, projectDescription, updateProjectMutation, createProjectMutation]);

  const handleGenerateCode = useCallback(async () => {
    if (!currentProject) {
      await handleSaveProject();
      return;
    }
    generateCodeMutation.mutate(currentProject.id);
    setShowCodeEditor(true);
  }, [currentProject, handleSaveProject, generateCodeMutation]);

  const handlePreviewFlow = useCallback(() => {
    if (nodes.length === 0) {
      toast({ title: "Add components to preview the flow", variant: "destructive" });
      return;
    }
    // Preview logic would be implemented here
    toast({ title: "Preview functionality coming soon" });
  }, [nodes, toast]);

  const handleNewProject = useCallback(() => {
    setShowNewProjectDialog(true);
  }, []);

  const createNewProject = useCallback(() => {
    setProjectName("New USSD Project");
    setProjectDescription("");
    setCurrentProject(null);
    setNodes([]);
    setEdges([]);
    setSelectedNode(null);
    setShowNewProjectDialog(false);
    toast({ title: "New project created" });
  }, [setNodes, setEdges, toast]);

  return (
    <div className="h-screen bg-slate-50 flex flex-col" data-testid="dashboard">
      {/* Top Navigation */}
      <nav className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between shadow-sm">
        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
              <Smartphone className="text-white" size={16} />
            </div>
            <h1 className="text-xl font-bold text-slate-900">USSD Builder</h1>
          </div>
          <div className="flex items-center space-x-3">
            <Button onClick={handleNewProject} data-testid="button-new-project">
              <Plus className="mr-2" size={16} />
              New Project
            </Button>
            <Button variant="outline" onClick={handleSaveProject} disabled={updateProjectMutation.isPending || createProjectMutation.isPending} data-testid="button-save">
              <Save className="mr-2" size={16} />
              Save
            </Button>
            <Button variant="outline" onClick={handlePreviewFlow} data-testid="button-preview">
              <Play className="mr-2" size={16} />
              Preview Flow
            </Button>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline" onClick={() => setShowCodeEditor(true)} data-testid="button-code">
            <Code className="mr-2" size={16} />
            View Code
          </Button>
          <Button onClick={() => setShowExportDialog(true)} className="bg-emerald-600 hover:bg-emerald-700" data-testid="button-export">
            <Download className="mr-2" size={16} />
            Export
          </Button>
          <div className="text-sm text-slate-600">
            <span data-testid="text-project-name">{projectName}</span>
          </div>
        </div>
      </nav>

      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar - Component Toolbox */}
        <ComponentToolbox />

        {/* Main Canvas Area */}
        <div className="flex-1 bg-slate-100 relative">
          <ReactFlowProvider>
            <div className="h-full">
              <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                onNodeClick={onNodeClick}
                onDrop={onDrop}
                onDragOver={onDragOver}
                fitView
                data-testid="flow-canvas"
              >
                <Controls />
                <Background variant={BackgroundVariant.Dots} gap={20} size={1} />
              </ReactFlow>
            </div>
          </ReactFlowProvider>
        </div>

        {/* Right Sidebar - Properties Panel */}
        <div className="w-96 bg-white border-l border-slate-200 flex flex-col">
          <PropertiesPanel 
            selectedNode={selectedNode}
            onUpdateNode={(nodeId, updates) => {
              setNodes((nds: Node[]) => nds.map((node: Node) => 
                node.id === nodeId 
                  ? { ...node, data: { ...node.data, ...updates } }
                  : node
              ));
            }}
          />
          <MobilePreview selectedNode={selectedNode} />
        </div>
      </div>

      {/* Dialogs */}
      <Dialog open={showNewProjectDialog} onOpenChange={setShowNewProjectDialog}>
        <DialogContent data-testid="dialog-new-project">
          <DialogHeader>
            <DialogTitle>Create New Project</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Project Name</label>
              <Input
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                placeholder="Enter project name"
                data-testid="input-project-name"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Description</label>
              <Input
                value={projectDescription}
                onChange={(e) => setProjectDescription(e.target.value)}
                placeholder="Enter project description"
                data-testid="input-project-description"
              />
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setShowNewProjectDialog(false)} data-testid="button-cancel">
                Cancel
              </Button>
              <Button onClick={createNewProject} data-testid="button-create">
                Create Project
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <CodeEditor
        open={showCodeEditor}
        onOpenChange={setShowCodeEditor}
        projectId={currentProject?.id}
      />

      <ExportDialog
        open={showExportDialog}
        onOpenChange={setShowExportDialog}
        projectId={currentProject?.id}
        projectName={projectName}
      />
    </div>
  );
}
