import { COMPONENT_DEFINITIONS } from "@/lib/flowTypes";
import { Button } from "@/components/ui/button";
import { 
  Menu, 
  Edit, 
  CreditCard, 
  GitBranch, 
  Zap, 
  StopCircle,
  DollarSign,
  BarChart3,
  Layout
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
      case 'menu-screen': return <Menu className="w-4 h-4" />;
      case 'input-field': return <Edit className="w-4 h-4" />;
      case 'payment-option': return <CreditCard className="w-4 h-4" />;
      case 'conditional-branch': return <GitBranch className="w-4 h-4" />;
      case 'api-integration': return <Zap className="w-4 h-4" />;
      case 'end-screen': return <StopCircle className="w-4 h-4" />;
      default: return <div className="w-4 h-4 bg-blue-600 rounded"></div>;
    }
  };

  return (
    <div className="w-80 bg-white border-r border-slate-200 p-6 overflow-y-auto" data-testid="component-toolbox">
      <h2 className="text-lg font-semibold text-slate-900 mb-6">Component Toolbox</h2>
      
      <div className="space-y-4">
        <div className="space-y-3">
          <h3 className="text-sm font-medium text-slate-600 uppercase tracking-wide">
            Basic Components
          </h3>
          
          {COMPONENT_DEFINITIONS.slice(0, 4).map((component) => (
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

        <div className="space-y-3">
          <h3 className="text-sm font-medium text-slate-600 uppercase tracking-wide">
            Advanced Components
          </h3>
          
          {COMPONENT_DEFINITIONS.slice(4).map((component) => (
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