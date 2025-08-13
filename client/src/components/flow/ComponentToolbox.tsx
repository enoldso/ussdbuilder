import { COMPONENT_DEFINITIONS } from "@/lib/flowTypes";
import { Button } from "@/components/ui/button";
import { 
  Menu, 
  Edit, 
  CreditCard, 
  GitBranch, 
  Zap, 
  StopCircle,
  Database,
  Globe,
  Code2,
  ListChecks,
  Terminal,
  Network,
  Type,
  ListTodo,
  FileText,
  Smartphone,
  Settings,
  Server
} from "lucide-react";

export function ComponentToolbox() {
  const onDragStart = (event: React.DragEvent, nodeType: string) => {
    event.dataTransfer.setData("application/reactflow", nodeType);
    event.dataTransfer.effectAllowed = "move";
  };

  const loadTemplate = (templateType: string) => {
    // Template loading logic would be implemented here
    console.log("Loading template:", templateType);
  };

  const getComponentIcon = (type: string) => {
    switch (type) {
      // Basic Components
      case 'menu-screen': return <Menu className="w-4 h-4" />;
      case 'input-field': return <Type className="w-4 h-4" />;
      case 'end-screen': return <StopCircle className="w-4 h-4" />;
      
      // Logic & Control
      case 'conditional-branch': return <GitBranch className="w-4 h-4" />;
      case 'switch': return <ListTodo className="w-4 h-4" />;
      case 'validation': return <ListChecks className="w-4 h-4" />;
      
      // Data Operations
      case 'database-query': return <Database className="w-4 h-4" />;
      case 'api-call': return <Globe className="w-4 h-4" />;
      case 'api-integration': return <Zap className="w-4 h-4" />;
      
      // Payment & Transactions
      case 'payment-option': return <CreditCard className="w-4 h-4" />;
      
      // System
      case 'function': return <Code2 className="w-4 h-4" />;
      case 'terminal': return <Terminal className="w-4 h-4" />;
      
      default: return <div className="w-4 h-4 bg-blue-600 rounded"></div>;
    }
  };

  return (
    <div className="w-80 bg-white border-r border-slate-200 p-6 overflow-y-auto" data-testid="component-toolbox">
      <h2 className="text-lg font-semibold text-slate-900 mb-6">Component Toolbox</h2>
      
      <div className="space-y-6">
        {/* Basic Components */}
        <div className="space-y-3">
          <h3 className="text-sm font-medium text-slate-600 uppercase tracking-wide">
            Basic Components
          </h3>
          
          {COMPONENT_DEFINITIONS
            .filter(c => ['menu-screen', 'input-field', 'end-screen'].includes(c.type))
            .map((component) => (
            <div
              key={component.type}
              className="bg-slate-50 border border-slate-200 rounded-lg p-4 hover:bg-primary-50 hover:border-primary-300 transition-colors cursor-grab active:cursor-grabbing"
              draggable
              onDragStart={(e) => onDragStart(e, component.type)}
              data-testid={`component-${component.type}`}
            >
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600">
                  {getComponentIcon(component.type)}
                </div>
                <div>
                  <h4 className="font-medium text-slate-900">{component.label}</h4>
                  <p className="text-xs text-slate-500">{component.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Logic & Control */}
        <div className="space-y-3">
          <h3 className="text-sm font-medium text-slate-600 uppercase tracking-wide">
            Logic & Control
          </h3>
          
          {COMPONENT_DEFINITIONS
            .filter(c => ['conditional-branch', 'switch', 'validation'].includes(c.type))
            .map((component) => (
            <div
              key={component.type}
              className="bg-slate-50 border border-slate-200 rounded-lg p-4 hover:bg-primary-50 hover:border-primary-300 transition-colors cursor-grab active:cursor-grabbing"
              draggable
              onDragStart={(e) => onDragStart(e, component.type)}
              data-testid={`component-${component.type}`}
            >
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600">
                  {getComponentIcon(component.type)}
                </div>
                <div>
                  <h4 className="font-medium text-slate-900">{component.label}</h4>
                  <p className="text-xs text-slate-500">{component.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Data Operations */}
        <div className="space-y-3">
          <h3 className="text-sm font-medium text-slate-600 uppercase tracking-wide">
            Data Operations
          </h3>
          
          {COMPONENT_DEFINITIONS
            .filter(c => ['database-query', 'api-call', 'api-integration'].includes(c.type))
            .map((component) => (
              <div
                key={component.type}
                className="flex items-center p-2 border border-slate-200 rounded-md bg-white hover:bg-slate-50 cursor-move"
                draggable
                onDragStart={(event) => onDragStart(event, component.type)}
              >
                <div className={`p-2 mr-3 rounded-md ${component.color} bg-opacity-10`}>
                  {getComponentIcon(component.type)}
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-900">{component.label}</p>
                  <p className="text-xs text-slate-500">{component.description}</p>
                </div>
              </div>
            ))}
        </div>

        {/* Payment & Transactions */}
        <div className="space-y-3">
          <h3 className="text-sm font-medium text-slate-600 uppercase tracking-wide">
            Payment & Transactions
          </h3>
          
          {COMPONENT_DEFINITIONS
            .filter(c => c.type === 'payment-option')
            .map((component) => (
              <div
                key={component.type}
                className="flex items-center p-2 border border-slate-200 rounded-md bg-white hover:bg-slate-50 cursor-move"
                draggable
                onDragStart={(event) => onDragStart(event, component.type)}
              >
                <div className={`p-2 mr-3 rounded-md ${component.color} bg-opacity-10`}>
                  {getComponentIcon(component.type)}
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-900">{component.label}</p>
                  <p className="text-xs text-slate-500">{component.description}</p>
                </div>
              </div>
            ))}
        </div>

        {/* System */}
        <div className="space-y-3">
          <h3 className="text-sm font-medium text-slate-600 uppercase tracking-wide">
            System
          </h3>
          
          {COMPONENT_DEFINITIONS
            .filter(c => ['function', 'terminal'].includes(c.type))
            .map((component) => (
              <div
                key={component.type}
                className="flex items-center p-2 border border-slate-200 rounded-md bg-white hover:bg-slate-50 cursor-move"
                draggable
                onDragStart={(event) => onDragStart(event, component.type)}
              >
                <div className={`p-2 mr-3 rounded-md ${component.color} bg-opacity-10`}>
                  {getComponentIcon(component.type)}
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-900">{component.label}</p>
                  <p className="text-xs text-slate-500">{component.description}</p>
                </div>
              </div>
            ))}
        </div>
      </div>

      <div className="mt-8 pt-6 border-t border-slate-200">
        <h3 className="text-sm font-medium text-slate-600 mb-4">Project Templates</h3>
        <div className="space-y-2">
          <Button
            variant="ghost"
            className="w-full justify-start text-sm"
            onClick={() => loadTemplate("payment")}
            data-testid="template-payment"
          >
            <DollarSign className="w-4 h-4 mr-2 text-emerald-600" />
            Payment App Template
          </Button>
          <Button
            variant="ghost"
            className="w-full justify-start text-sm"
            onClick={() => loadTemplate("survey")}
            data-testid="template-survey"
          >
            <BarChart3 className="w-4 h-4 mr-2 text-blue-600" />
            Survey Template
          </Button>
          <Button
            variant="ghost"
            className="w-full justify-start text-sm"
            onClick={() => loadTemplate("menu")}
            data-testid="template-menu"
          >
            <Layout className="w-4 h-4 mr-2 text-purple-600" />
            Menu System Template
          </Button>
        </div>
      </div>
    </div>
  );
}