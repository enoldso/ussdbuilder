import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { Download, Package, FileCode, Globe, Database, Settings } from "lucide-react";

interface ExportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  projectId?: string;
  projectName?: string;
}

export function ExportDialog({ open, onOpenChange, projectId, projectName }: ExportDialogProps) {
  const { toast } = useToast();
  const [exportProgress, setExportProgress] = useState(0);

  // Export project mutation
  const exportProjectMutation = useMutation({
    mutationFn: async () => {
      if (!projectId) throw new Error("No project selected");
      
      setExportProgress(0);
      
      // Simulate progress
      const progressInterval = setInterval(() => {
        setExportProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);

      const response = await fetch(`/api/projects/${projectId}/export`);
      
      clearInterval(progressInterval);
      setExportProgress(100);
      
      if (!response.ok) throw new Error('Failed to export project');
      
      // Download the ZIP file
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${projectName?.replace(/\s+/g, '-').toLowerCase() || 'ussd-project'}.zip`;
      a.click();
      URL.revokeObjectURL(url);
      
      return blob;
    },
    onSuccess: () => {
      toast({ title: "Project exported successfully" });
      setTimeout(() => {
        setExportProgress(0);
        onOpenChange(false);
      }, 1000);
    },
    onError: (error) => {
      setExportProgress(0);
      toast({ 
        title: "Export failed", 
        description: error instanceof Error ? error.message : "Unknown error",
        variant: "destructive" 
      });
    },
  });

  const exportOptions = [
    {
      id: 'full-project',
      title: 'Complete Project',
      description: 'Full Express.js application with all files',
      icon: Package,
      includes: [
        'Express.js server code',
        'USSD route handlers',
        'Session middleware',
        'Package.json with dependencies',
        'Dockerfile for deployment',
        'README with setup instructions',
        'Environment configuration',
        'Health check endpoint'
      ],
      recommended: true,
    },
    {
      id: 'source-only',
      title: 'Source Code Only',
      description: 'JavaScript files without configuration',
      icon: FileCode,
      includes: [
        'Route handlers',
        'Controller logic',
        'Middleware functions',
        'Core application files'
      ],
      recommended: false,
    },
    {
      id: 'docker-ready',
      title: 'Docker Ready',
      description: 'Containerized application bundle',
      icon: Globe,
      includes: [
        'Complete project files',
        'Optimized Dockerfile',
        'Docker Compose configuration',
        'Production configurations',
        'Health checks'
      ],
      recommended: false,
    }
  ];

  const handleExport = (optionId: string) => {
    if (!projectId) {
      toast({ title: "No project selected", variant: "destructive" });
      return;
    }
    exportProjectMutation.mutate();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl" data-testid="export-dialog">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Download size={20} />
            <span>Export Project</span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Project Info */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center space-x-2">
                <Settings size={18} />
                <span>Project Details</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm font-medium text-muted-foreground">Name</div>
                  <div className="font-semibold" data-testid="text-export-project-name">
                    {projectName || 'Untitled Project'}
                  </div>
                </div>
                <div>
                  <div className="text-sm font-medium text-muted-foreground">Type</div>
                  <div className="font-semibold">USSD Application</div>
                </div>
                <div>
                  <div className="text-sm font-medium text-muted-foreground">Framework</div>
                  <div className="font-semibold">Express.js + Node.js</div>
                </div>
                <div>
                  <div className="text-sm font-medium text-muted-foreground">Status</div>
                  <Badge variant="secondary">Ready for Export</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Export Options */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Export Options</h3>
            <div className="grid gap-4">
              {exportOptions.map((option) => (
                <Card 
                  key={option.id} 
                  className={`cursor-pointer transition-colors hover:bg-accent ${
                    option.recommended ? 'border-primary bg-primary/5' : ''
                  }`}
                  onClick={() => handleExport(option.id)}
                  data-testid={`export-option-${option.id}`}
                >
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <div className={`p-3 rounded-lg ${
                        option.recommended ? 'bg-primary text-primary-foreground' : 'bg-muted'
                      }`}>
                        <option.icon size={24} />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h4 className="font-semibold">{option.title}</h4>
                          {option.recommended && (
                            <Badge variant="default">Recommended</Badge>
                          )}
                        </div>
                        <p className="text-muted-foreground text-sm mb-3">
                          {option.description}
                        </p>
                        <div>
                          <div className="text-sm font-medium mb-2">Includes:</div>
                          <div className="grid grid-cols-2 gap-1">
                            {option.includes.map((item, index) => (
                              <div key={index} className="flex items-center space-x-2 text-sm text-muted-foreground">
                                <div className="w-1 h-1 bg-current rounded-full"></div>
                                <span>{item}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                      <Button 
                        variant={option.recommended ? "default" : "outline"}
                        disabled={exportProjectMutation.isPending}
                        data-testid={`button-export-${option.id}`}
                      >
                        <Download className="mr-2" size={16} />
                        Export
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Export Progress */}
          {exportProjectMutation.isPending && (
            <Card>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold">Preparing Export...</h4>
                    <span className="text-sm text-muted-foreground">{exportProgress}%</span>
                  </div>
                  <Progress value={exportProgress} className="w-full" data-testid="export-progress" />
                  <div className="text-sm text-muted-foreground">
                    {exportProgress < 30 ? 'Generating code...' :
                     exportProgress < 60 ? 'Preparing files...' :
                     exportProgress < 90 ? 'Creating archive...' :
                     'Download starting...'}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Setup Instructions */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Setup Instructions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-sm">
                <div>
                  <div className="font-medium">1. Extract the ZIP file</div>
                  <div className="text-muted-foreground">Unzip the downloaded file to your desired location</div>
                </div>
                <div>
                  <div className="font-medium">2. Install dependencies</div>
                  <div className="text-muted-foreground">Run <code className="bg-muted px-1 rounded">npm install</code> in the project directory</div>
                </div>
                <div>
                  <div className="font-medium">3. Configure environment</div>
                  <div className="text-muted-foreground">Copy <code className="bg-muted px-1 rounded">.env.example</code> to <code className="bg-muted px-1 rounded">.env</code> and update values</div>
                </div>
                <div>
                  <div className="font-medium">4. Start the application</div>
                  <div className="text-muted-foreground">Run <code className="bg-muted px-1 rounded">npm start</code> to launch your USSD service</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
}
