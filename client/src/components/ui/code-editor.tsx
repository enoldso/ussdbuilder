import * as React from "react";
import { cn } from "@/lib/utils";

interface CodeEditorProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  language?: string;
}

const CodeEditor = React.forwardRef<HTMLTextAreaElement, CodeEditorProps>(
  ({ className, language = "javascript", ...props }, ref) => {
    return (
      <div className="relative">
        <textarea
          ref={ref}
          className={cn(
            "flex min-h-[200px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 font-mono",
            className
          )}
          spellCheck="false"
          {...props}
        />
        <div className="absolute top-2 right-2 text-xs text-muted-foreground bg-background px-2 py-1 rounded border">
          {language}
        </div>
      </div>
    );
  }
);
CodeEditor.displayName = "CodeEditor";

export { CodeEditor };
