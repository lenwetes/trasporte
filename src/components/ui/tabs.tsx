"use client";
import * as React from "react";
import { cn } from "@/lib/utils";

const TabsContext = React.createContext<{
  value?: string;
  onValueChange?: (value: string) => void;
}>({});

export const Tabs = ({ 
  children, 
  defaultValue, 
  value: controlledValue,
  onValueChange,
  className, 
  ...props 
}: React.HTMLAttributes<HTMLDivElement> & { 
  defaultValue?: string;
  value?: string;
  onValueChange?: (value: string) => void;
}) => {
  const [value, setValue] = React.useState(controlledValue || defaultValue);

  React.useEffect(() => {
    if (controlledValue !== undefined) {
      setValue(controlledValue);
    }
  }, [controlledValue]);

  const handleValueChange = React.useCallback((val: string) => {
    if (controlledValue === undefined) {
      setValue(val);
    }
    onValueChange?.(val);
  }, [controlledValue, onValueChange]);

  return (
    <TabsContext.Provider value={{ value, onValueChange: handleValueChange }}>
      <div className={cn("w-full", className)} {...props}>
        {children}
      </div>
    </TabsContext.Provider>
  );
};

export const TabsList = ({ 
  children, 
  className, 
  ...props 
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div 
    className={cn(
      "inline-flex h-10 items-center justify-center rounded-none bg-muted p-1 text-muted-foreground",
      className
    )} 
  >
    {children}
  </div>
);

export const TabsTrigger = ({ 
  children, 
  value, 
  className, 
  ...props 
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { value: string }) => {
  const { value: activeValue, onValueChange } = React.useContext(TabsContext);
  const isActive = activeValue === value;

  return (
    <button
      type="button"
      role="tab"
      aria-selected={isActive}
      data-state={isActive ? "active" : "inactive"}
      onClick={() => onValueChange?.(value)}
      className={cn(
        "inline-flex items-center justify-center whitespace-nowrap rounded-none px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
};

export const TabsContent = ({ 
  children, 
  value, 
  className, 
  ...props 
}: React.HTMLAttributes<HTMLDivElement> & { value: string }) => {
  const { value: activeValue } = React.useContext(TabsContext);
  
  if (activeValue !== value) return null;

  return (
    <div 
      role="tabpanel"
      data-state="active"
      className={cn(
        "mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        className
      )} 
      {...props}
    >
      {children}
    </div>
  );
};
