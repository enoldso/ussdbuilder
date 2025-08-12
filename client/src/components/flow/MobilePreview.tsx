import { CustomNode } from "@/lib/flowTypes";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Play, CheckCircle } from "lucide-react";

interface MobilePreviewProps {
  selectedNode: CustomNode | null;
}

export function MobilePreview({ selectedNode }: MobilePreviewProps) {
  const renderUssdScreen = () => {
    if (!selectedNode) {
      return (
        <div className="p-4 text-xs text-green-400">
          <div className="mb-2">USSD Service</div>
          <div className="mb-4">Welcome to USSD Builder</div>
          <div className="mb-2">Select a component to preview</div>
          <div className="mt-8">
            <div>0. Back</div>
            <div>00. Home</div>
          </div>
        </div>
      );
    }

    const nodeType = selectedNode.data.label.toLowerCase().includes('menu') ? 'menu-screen' : 
                    selectedNode.data.label.toLowerCase().includes('input') ? 'input-field' :
                    selectedNode.data.label.toLowerCase().includes('payment') ? 'payment-option' :
                    selectedNode.data.label.toLowerCase().includes('condition') ? 'conditional-branch' :
                    selectedNode.data.label.toLowerCase().includes('api') ? 'api-integration' : 'end-screen';

    switch (nodeType) {
      case 'menu-screen':
        return (
          <div className="p-4 text-xs text-green-400">
            <div className="mb-2">USSD Service</div>
            <div className="mb-4">{selectedNode.data.properties?.title || selectedNode.data.label}</div>
            {(selectedNode.data.properties?.options || []).map((option: any, index: number) => (
              <div key={index}>{index + 1}. {option.text || `Option ${index + 1}`}</div>
            ))}
            <div className="mt-4">
              <div>0. Back</div>
              <div>00. Home</div>
            </div>
          </div>
        );

      case 'input-field':
        return (
          <div className="p-4 text-xs text-green-400">
            <div className="mb-2">USSD Service</div>
            <div className="mb-4">{selectedNode.data.label}</div>
            <div className="mb-2">
              {selectedNode.data.properties?.placeholder || 'Enter value'}:
            </div>
            <div className="mb-2">
              <span className="bg-green-600 text-black px-1">|</span>
            </div>
            <div className="mt-8">
              <div>1. Continue</div>
              <div>0. Back</div>
              <div>00. Home</div>
            </div>
          </div>
        );

      case 'payment-option':
        return (
          <div className="p-4 text-xs text-green-400">
            <div className="mb-2">USSD Service</div>
            <div className="mb-4">{selectedNode.data.label}</div>
            <div className="mb-2">
              Provider: {selectedNode.data.properties?.provider?.toUpperCase() || 'M-PESA'}
            </div>
            <div className="mb-2">
              Amount: KES {selectedNode.data.properties?.amount || '0.00'}
            </div>
            <div className="mt-4">
              <div>1. Confirm</div>
              <div>0. Back</div>
              <div>00. Home</div>
            </div>
          </div>
        );

      case 'end-screen':
        return (
          <div className="p-4 text-xs text-green-400">
            <div className="mb-2">USSD Service</div>
            <div className="mb-4">{selectedNode.data.properties?.message || selectedNode.data.label}</div>
            {selectedNode.data.properties?.showSummary && (
              <div className="mb-4">
                <div>Summary:</div>
                <div>Transaction: Complete</div>
              </div>
            )}
            <div className="mt-4 text-center">
              Session ended
            </div>
          </div>
        );

      default:
        return (
          <div className="p-4 text-xs text-green-400">
            <div className="mb-2">USSD Service</div>
            <div className="mb-4">{selectedNode.data.label}</div>
            <div className="mb-2">Processing...</div>
            <div className="mt-8">
              <div>Please wait...</div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="border-t border-slate-200 p-6" data-testid="mobile-preview">
      <h3 className="font-medium text-slate-900 mb-4">Mobile Preview</h3>
      
      {/* Mobile Phone Mockup */}
      <div className="mx-auto w-48 h-80 bg-gradient-to-b from-slate-100 to-slate-200 rounded-3xl p-3 shadow-xl">
        <div className="w-full h-full bg-black rounded-2xl overflow-hidden">
          {/* Phone Status Bar */}
          <div className="bg-black text-white text-xs px-3 py-1 flex justify-between items-center">
            <span>Safaricom</span>
            <div className="flex items-center space-x-1">
              <i className="fas fa-signal text-xs"></i>
              <i className="fas fa-wifi text-xs"></i>
              <i className="fas fa-battery-three-quarters text-xs"></i>
            </div>
          </div>
          
          {/* USSD Screen */}
          <div className="bg-black text-green-400 font-mono h-full overflow-auto" data-testid="ussd-screen">
            {renderUssdScreen()}
          </div>
        </div>
      </div>

      <div className="mt-4 space-y-2">
        <Button variant="outline" className="w-full text-sm" data-testid="button-test-component">
          <Play className="mr-2" size={16} />
          Test Component
        </Button>
        <Button variant="outline" className="w-full text-sm" data-testid="button-validate-preview">
          <CheckCircle className="mr-2" size={16} />
          Validate Preview
        </Button>
      </div>
    </div>
  );
}
