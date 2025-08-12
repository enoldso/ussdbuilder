import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CodeEditor as CodeEditorComponent } from "@/components/ui/code-editor";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { generateCodePreview } from "@/lib/codeTemplates";
import { Copy, Download, RefreshCw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface CodeEditorProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  projectId?: string;
}

export function CodeEditor({ open, onOpenChange, projectId }: CodeEditorProps) {
  const { toast } = useToast();
  const [activeFile, setActiveFile] = useState("index.js");

  // Fetch generated code
  const { data: generatedCode, isLoading, refetch } = useQuery({
    queryKey: ["/api/projects", projectId, "code"],
    queryFn: async () => {
      if (!projectId) return null;
      const response = await fetch(`/api/projects/${projectId}/generate-code`, {
        method: 'POST',
      });
      if (!response.ok) throw new Error('Failed to generate code');
      return response.json();
    },
    enabled: open && !!projectId,
  });

  const codeFiles: { [filename: string]: string } = generatedCode ? {
    'index.js': generatedCode.routes,
    'controllers/ussdController.js': generatedCode.controllers,
    'middleware/ussdSession.js': generatedCode.middleware,
    'package.json': JSON.stringify(generatedCode.package, null, 2),
    'README.md': generatedCode.readme,
  } : generateCodePreview({}, "Sample Project");

  const copyToClipboard = async (content: string) => {
    try {
      await navigator.clipboard.writeText(content);
      toast({ title: "Code copied to clipboard" });
    } catch (error) {
      toast({ title: "Failed to copy code", variant: "destructive" });
    }
  };

  const downloadFile = (filename: string, content: string) => {
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl h-[80vh]" data-testid="code-editor-dialog">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <span>Generated Code</span>
            {projectId && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => refetch()}
                disabled={isLoading}
                data-testid="button-refresh-code"
              >
                <RefreshCw className={`mr-2 ${isLoading ? 'animate-spin' : ''}`} size={16} />
                Refresh
              </Button>
            )}
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-1 space-x-4 overflow-hidden">
          {/* File Explorer */}
          <div className="w-64 border-r">
            <div className="p-4 border-b">
              <h3 className="font-semibold text-sm">Project Files</h3>
            </div>
            <ScrollArea className="h-full">
              <div className="p-2 space-y-1">
                {Object.keys(codeFiles).map((filename) => (
                  <Button
                    key={filename}
                    variant={activeFile === filename ? "secondary" : "ghost"}
                    className="w-full justify-start text-sm h-8"
                    onClick={() => setActiveFile(filename)}
                    data-testid={`file-${filename.replace(/[\/\.]/g, '-')}`}
                  >
                    <div className="flex items-center space-x-2">
                      <i className={`text-xs ${
                        filename.endsWith('.js') ? 'fas fa-file-code text-yellow-600' :
                        filename.endsWith('.json') ? 'fas fa-file-code text-blue-600' :
                        filename.endsWith('.md') ? 'fas fa-file-alt text-gray-600' :
                        'fas fa-file text-gray-400'
                      }`}></i>
                      <span className="truncate">{filename}</span>
                    </div>
                  </Button>
                ))}
              </div>
            </ScrollArea>
          </div>

          {/* Code Editor */}
          <div className="flex-1 flex flex-col">
            <div className="flex items-center justify-between p-4 border-b">
              <div className="flex items-center space-x-2">
                <h3 className="font-semibold">{activeFile}</h3>
                <Badge variant="secondary">
                  {activeFile.endsWith('.js') ? 'JavaScript' :
                   activeFile.endsWith('.json') ? 'JSON' :
                   activeFile.endsWith('.md') ? 'Markdown' : 'Text'}
                </Badge>
              </div>
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => copyToClipboard(codeFiles[activeFile])}
                  data-testid="button-copy-code"
                >
                  <Copy size={16} />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => downloadFile(activeFile, codeFiles[activeFile])}
                  data-testid="button-download-file"
                >
                  <Download size={16} />
                </Button>
              </div>
            </div>

            <div className="flex-1 p-4">
              <CodeEditorComponent
                value={codeFiles[activeFile] || "// No content available"}
                readOnly
                language={
                  activeFile.endsWith('.js') ? 'javascript' :
                  activeFile.endsWith('.json') ? 'json' :
                  activeFile.endsWith('.md') ? 'markdown' : 'text'
                }
                className="h-full resize-none"
                data-testid="code-content"
              />
            </div>
          </div>
        </div>

        {/* Code Statistics */}
        <div className="border-t p-4">
          <div className="grid grid-cols-4 gap-4 text-sm">
            <Card>
              <CardContent className="p-3">
                <div className="text-center">
                  <div className="font-semibold text-lg">{Object.keys(codeFiles).length}</div>
                  <div className="text-muted-foreground">Files</div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-3">
                <div className="text-center">
                  <div className="font-semibold text-lg">
                    {Object.values(codeFiles).reduce((acc, content) => acc + content.split('\n').length, 0)}
                  </div>
                  <div className="text-muted-foreground">Lines</div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-3">
                <div className="text-center">
                  <div className="font-semibold text-lg">
                    {Math.round(Object.values(codeFiles).reduce((acc, content) => acc + content.length, 0) / 1024)}KB
                  </div>
                  <div className="text-muted-foreground">Size</div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-3">
                <div className="text-center">
                  <div className="font-semibold text-lg text-green-600">Ready</div>
                  <div className="text-muted-foreground">Status</div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
