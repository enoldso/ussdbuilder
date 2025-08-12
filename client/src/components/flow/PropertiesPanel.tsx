import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { CustomNode } from "@/lib/flowTypes";
import { X, Settings, CheckCircle } from "lucide-react";

interface PropertiesPanelProps {
  selectedNode: CustomNode | null;
  onUpdateNode: (nodeId: string, updates: any) => void;
}

export function PropertiesPanel({ selectedNode, onUpdateNode }: PropertiesPanelProps) {
  const [localData, setLocalData] = useState<any>({});

  useEffect(() => {
    if (selectedNode) {
      setLocalData(selectedNode.data);
    }
  }, [selectedNode]);

  const updateProperty = (path: string[], value: any) => {
    const newData = { ...localData };
    let current = newData;
    
    for (let i = 0; i < path.length - 1; i++) {
      if (!current[path[i]]) current[path[i]] = {};
      current = current[path[i]];
    }
    
    current[path[path.length - 1]] = value;
    setLocalData(newData);
    
    if (selectedNode) {
      onUpdateNode(selectedNode.id, newData);
    }
  };

  const renderMenuScreenProperties = () => (
    <div className="space-y-4">
      <div>
        <Label>Menu Title</Label>
        <Input
          value={localData.properties?.title || ""}
          onChange={(e) => updateProperty(["properties", "title"], e.target.value)}
          placeholder="Enter menu title"
          data-testid="input-menu-title"
        />
      </div>
      
      <div>
        <Label>Menu Options</Label>
        <div className="space-y-2">
          {(localData.properties?.options || []).map((option: any, index: number) => (
            <div key={index} className="flex space-x-2">
              <Input
                value={option.text || ""}
                onChange={(e) => {
                  const newOptions = [...(localData.properties?.options || [])];
                  newOptions[index] = { ...newOptions[index], text: e.target.value };
                  updateProperty(["properties", "options"], newOptions);
                }}
                placeholder={`Option ${index + 1}`}
                data-testid={`input-option-${index}`}
              />
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  const newOptions = (localData.properties?.options || []).filter((_: any, i: number) => i !== index);
                  updateProperty(["properties", "options"], newOptions);
                }}
                data-testid={`button-remove-option-${index}`}
              >
                <X size={16} />
              </Button>
            </div>
          ))}
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              const newOptions = [...(localData.properties?.options || []), { text: "", nextStep: "" }];
              updateProperty(["properties", "options"], newOptions);
            }}
            data-testid="button-add-option"
          >
            Add Option
          </Button>
        </div>
      </div>

      <div>
        <Label>Timeout (seconds)</Label>
        <Input
          type="number"
          value={localData.properties?.timeout || 30}
          onChange={(e) => updateProperty(["properties", "timeout"], parseInt(e.target.value))}
          data-testid="input-timeout"
        />
      </div>
    </div>
  );

  const renderInputFieldProperties = () => (
    <div className="space-y-4">
      <div>
        <Label>Input Placeholder</Label>
        <Input
          value={localData.properties?.placeholder || ""}
          onChange={(e) => updateProperty(["properties", "placeholder"], e.target.value)}
          placeholder="Enter placeholder text"
          data-testid="input-placeholder"
        />
      </div>

      <div>
        <Label>Input Type</Label>
        <Select
          value={localData.properties?.validation?.type || "text"}
          onValueChange={(value) => updateProperty(["properties", "validation", "type"], value)}
        >
          <SelectTrigger data-testid="select-input-type">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="text">Text</SelectItem>
            <SelectItem value="numeric">Numeric</SelectItem>
            <SelectItem value="phone">Phone Number</SelectItem>
            <SelectItem value="email">Email</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center space-x-2">
        <Checkbox
          id="required"
          checked={localData.properties?.validation?.required || false}
          onCheckedChange={(checked) => updateProperty(["properties", "validation", "required"], checked)}
          data-testid="checkbox-required"
        />
        <Label htmlFor="required">Required field</Label>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div>
          <Label>Min Value</Label>
          <Input
            type="number"
            value={localData.properties?.validation?.min || ""}
            onChange={(e) => updateProperty(["properties", "validation", "min"], parseInt(e.target.value))}
            data-testid="input-min"
          />
        </div>
        <div>
          <Label>Max Value</Label>
          <Input
            type="number"
            value={localData.properties?.validation?.max || ""}
            onChange={(e) => updateProperty(["properties", "validation", "max"], parseInt(e.target.value))}
            data-testid="input-max"
          />
        </div>
      </div>

      <div>
        <Label>Success Message</Label>
        <Input
          value={localData.properties?.successMessage || ""}
          onChange={(e) => updateProperty(["properties", "successMessage"], e.target.value)}
          placeholder="Message after successful input"
          data-testid="input-success-message"
        />
      </div>
    </div>
  );

  const renderPaymentProperties = () => (
    <div className="space-y-4">
      <div>
        <Label>Payment Provider</Label>
        <Select
          value={localData.properties?.provider || "mpesa"}
          onValueChange={(value) => updateProperty(["properties", "provider"], value)}
        >
          <SelectTrigger data-testid="select-payment-provider">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="mpesa">M-PESA (Safaricom)</SelectItem>
            <SelectItem value="airtel">Airtel Money</SelectItem>
            <SelectItem value="tkash">T-Kash (Telkom)</SelectItem>
            <SelectItem value="equitel">Equitel</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label>Business Short Code</Label>
        <Input
          value={localData.properties?.businessShortCode || ""}
          onChange={(e) => updateProperty(["properties", "businessShortCode"], e.target.value)}
          placeholder="e.g., 174379"
          data-testid="input-business-code"
        />
      </div>

      <div>
        <Label>Passkey</Label>
        <Input
          type="password"
          value={localData.properties?.passkey || ""}
          onChange={(e) => updateProperty(["properties", "passkey"], e.target.value)}
          placeholder="Enter passkey"
          data-testid="input-passkey"
        />
      </div>

      <div>
        <Label>Callback URL</Label>
        <Input
          type="url"
          value={localData.properties?.callbackUrl || ""}
          onChange={(e) => updateProperty(["properties", "callbackUrl"], e.target.value)}
          placeholder="https://api.example.com/callback"
          data-testid="input-callback-url"
        />
      </div>

      <div>
        <Label>Amount</Label>
        <Input
          type="number"
          value={localData.properties?.amount || ""}
          onChange={(e) => updateProperty(["properties", "amount"], parseFloat(e.target.value))}
          placeholder="Amount in KES"
          data-testid="input-amount"
        />
      </div>
    </div>
  );

  const renderConditionalBranchProperties = () => (
    <div className="space-y-4">
      <div>
        <Label>Conditions</Label>
        <div className="space-y-2">
          {(localData.properties?.conditions || []).map((condition: any, index: number) => (
            <Card key={index} className="p-3">
              <div className="space-y-2">
                <div className="flex space-x-2">
                  <Input
                    placeholder="Field name"
                    value={condition.field || ""}
                    onChange={(e) => {
                      const newConditions = [...(localData.properties?.conditions || [])];
                      newConditions[index] = { ...newConditions[index], field: e.target.value };
                      updateProperty(["properties", "conditions"], newConditions);
                    }}
                    data-testid={`input-condition-field-${index}`}
                  />
                  <Select
                    value={condition.operator || "equals"}
                    onValueChange={(value) => {
                      const newConditions = [...(localData.properties?.conditions || [])];
                      newConditions[index] = { ...newConditions[index], operator: value };
                      updateProperty(["properties", "conditions"], newConditions);
                    }}
                  >
                    <SelectTrigger className="w-32" data-testid={`select-condition-operator-${index}`}>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="equals">Equals</SelectItem>
                      <SelectItem value="greater">Greater</SelectItem>
                      <SelectItem value="less">Less</SelectItem>
                      <SelectItem value="contains">Contains</SelectItem>
                    </SelectContent>
                  </Select>
                  <Input
                    placeholder="Value"
                    value={condition.value || ""}
                    onChange={(e) => {
                      const newConditions = [...(localData.properties?.conditions || [])];
                      newConditions[index] = { ...newConditions[index], value: e.target.value };
                      updateProperty(["properties", "conditions"], newConditions);
                    }}
                    data-testid={`input-condition-value-${index}`}
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const newConditions = (localData.properties?.conditions || []).filter((_: any, i: number) => i !== index);
                      updateProperty(["properties", "conditions"], newConditions);
                    }}
                    data-testid={`button-remove-condition-${index}`}
                  >
                    <X size={16} />
                  </Button>
                </div>
                <Input
                  placeholder="Message if condition is true"
                  value={condition.message || ""}
                  onChange={(e) => {
                    const newConditions = [...(localData.properties?.conditions || [])];
                    newConditions[index] = { ...newConditions[index], message: e.target.value };
                    updateProperty(["properties", "conditions"], newConditions);
                  }}
                  data-testid={`input-condition-message-${index}`}
                />
              </div>
            </Card>
          ))}
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              const newConditions = [...(localData.properties?.conditions || []), { field: "", operator: "equals", value: "", message: "", nextStep: "" }];
              updateProperty(["properties", "conditions"], newConditions);
            }}
            data-testid="button-add-condition"
          >
            Add Condition
          </Button>
        </div>
      </div>

      <div>
        <Label>Default Message</Label>
        <Input
          value={localData.properties?.defaultMessage || ""}
          onChange={(e) => updateProperty(["properties", "defaultMessage"], e.target.value)}
          placeholder="Message when no conditions match"
          data-testid="input-default-message"
        />
      </div>
    </div>
  );

  const renderApiIntegrationProperties = () => (
    <div className="space-y-4">
      <div>
        <Label>API URL</Label>
        <Input
          type="url"
          value={localData.properties?.apiConfig?.url || ""}
          onChange={(e) => updateProperty(["properties", "apiConfig", "url"], e.target.value)}
          placeholder="https://api.example.com/endpoint"
          data-testid="input-api-url"
        />
      </div>

      <div>
        <Label>HTTP Method</Label>
        <Select
          value={localData.properties?.apiConfig?.method || "POST"}
          onValueChange={(value) => updateProperty(["properties", "apiConfig", "method"], value)}
        >
          <SelectTrigger data-testid="select-http-method">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="GET">GET</SelectItem>
            <SelectItem value="POST">POST</SelectItem>
            <SelectItem value="PUT">PUT</SelectItem>
            <SelectItem value="PATCH">PATCH</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label>Success Message</Label>
        <Input
          value={localData.properties?.successMessage || ""}
          onChange={(e) => updateProperty(["properties", "successMessage"], e.target.value)}
          placeholder="Message on successful API call"
          data-testid="input-api-success-message"
        />
      </div>

      <div>
        <Label>Error Message</Label>
        <Input
          value={localData.properties?.errorMessage || ""}
          onChange={(e) => updateProperty(["properties", "errorMessage"], e.target.value)}
          placeholder="Message on API error"
          data-testid="input-api-error-message"
        />
      </div>
    </div>
  );

  const renderEndScreenProperties = () => (
    <div className="space-y-4">
      <div>
        <Label>Final Message</Label>
        <Textarea
          value={localData.properties?.message || ""}
          onChange={(e) => updateProperty(["properties", "message"], e.target.value)}
          placeholder="Thank you message"
          data-testid="textarea-final-message"
        />
      </div>

      <div className="flex items-center space-x-2">
        <Checkbox
          id="showSummary"
          checked={localData.properties?.showSummary || false}
          onCheckedChange={(checked) => updateProperty(["properties", "showSummary"], checked)}
          data-testid="checkbox-show-summary"
        />
        <Label htmlFor="showSummary">Show transaction summary</Label>
      </div>

      <div className="flex items-center space-x-2">
        <Checkbox
          id="autoClose"
          checked={localData.properties?.autoClose || false}
          onCheckedChange={(checked) => updateProperty(["properties", "autoClose"], checked)}
          data-testid="checkbox-auto-close"
        />
        <Label htmlFor="autoClose">Auto-close session</Label>
      </div>

      {localData.properties?.autoClose && (
        <div>
          <Label>Close Delay (seconds)</Label>
          <Input
            type="number"
            value={localData.properties?.closeDelay || 5}
            onChange={(e) => updateProperty(["properties", "closeDelay"], parseInt(e.target.value))}
            data-testid="input-close-delay"
          />
        </div>
      )}
    </div>
  );

  if (!selectedNode) {
    return (
      <div className="p-6" data-testid="properties-panel-empty">
        <div className="text-center text-slate-500">
          <Settings className="mx-auto mb-4" size={48} />
          <h3 className="font-medium mb-2">No Component Selected</h3>
          <p className="text-sm">Select a component from the canvas to configure its properties</p>
        </div>
      </div>
    );
  }

  const getComponentIcon = (nodeType: string) => {
    const iconMap: { [key: string]: string } = {
      'menu-screen': 'fas fa-list',
      'input-field': 'fas fa-keyboard',
      'payment-option': 'fas fa-credit-card',
      'conditional-branch': 'fas fa-code-branch',
      'api-integration': 'fas fa-plug',
      'end-screen': 'fas fa-stop',
    };
    return iconMap[nodeType] || 'fas fa-cog';
  };

  const renderPropertiesForType = () => {
    const nodeType = selectedNode.data.label.toLowerCase().includes('menu') ? 'menu-screen' : 
                    selectedNode.data.label.toLowerCase().includes('input') ? 'input-field' :
                    selectedNode.data.label.toLowerCase().includes('payment') ? 'payment-option' :
                    selectedNode.data.label.toLowerCase().includes('condition') ? 'conditional-branch' :
                    selectedNode.data.label.toLowerCase().includes('api') ? 'api-integration' : 'end-screen';

    switch (nodeType) {
      case 'menu-screen':
        return renderMenuScreenProperties();
      case 'input-field':
        return renderInputFieldProperties();
      case 'payment-option':
        return renderPaymentProperties();
      case 'conditional-branch':
        return renderConditionalBranchProperties();
      case 'api-integration':
        return renderApiIntegrationProperties();
      case 'end-screen':
        return renderEndScreenProperties();
      default:
        return <div>Properties not available for this component type</div>;
    }
  };

  return (
    <div className="flex flex-col h-full" data-testid="properties-panel">
      {/* Header */}
      <div className="p-6 border-b border-slate-200">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-900">Properties</h2>
          <Button variant="ghost" size="sm" onClick={() => {}}>
            <X size={16} />
          </Button>
        </div>
        <p className="text-sm text-slate-600 mt-1">Configure selected component</p>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-6">
          {/* Component Info */}
          <Card className="mb-6 bg-primary-50 border-primary-200">
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-primary-600 rounded-lg flex items-center justify-center">
                  <i className={`${getComponentIcon(selectedNode.data.label)} text-white`}></i>
                </div>
                <div>
                  <h3 className="font-medium text-slate-900" data-testid="text-component-name">
                    {selectedNode.data.label}
                  </h3>
                  <p className="text-sm text-slate-600" data-testid="text-component-type">
                    {selectedNode.data.description || 'USSD component'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Basic Settings */}
          <div className="space-y-6">
            <div>
              <Label>Component Name</Label>
              <Input
                value={localData.label || ""}
                onChange={(e) => updateProperty(["label"], e.target.value)}
                data-testid="input-component-name"
              />
            </div>

            <div>
              <Label>Description</Label>
              <Textarea
                value={localData.description || ""}
                onChange={(e) => updateProperty(["description"], e.target.value)}
                placeholder="Enter component description..."
                data-testid="textarea-component-description"
              />
            </div>

            <Separator />

            {/* Component-specific Properties */}
            <div>
              <h4 className="font-medium text-slate-900 mb-4">Component Settings</h4>
              {renderPropertiesForType()}
            </div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="border-t border-slate-200 p-6">
        <div className="space-y-2">
          <Button className="w-full" data-testid="button-validate-component">
            <CheckCircle className="mr-2" size={16} />
            Validate Settings
          </Button>
        </div>
      </div>
    </div>
  );
}
