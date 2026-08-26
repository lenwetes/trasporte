import * as React from "react";
import { cn } from "@/lib/utils";

interface EmptyStateProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  title?: React.ReactNode;
  description?: React.ReactNode;
  icon?: React.ReactNode;
}

const EmptyState = ({ title, description, icon, className, ...props }: EmptyStateProps) => (
  <div 
    className={cn(
      "flex flex-col items-center justify-center p-12 text-center border border-dashed border-primary/20 bg-primary/[0.02] rounded-none",
      className
    )}
    {...props} 
  >
    {icon && (
      <div className="mb-4 text-primary">
        {icon}
      </div>
    )}
    {title && (
      <h3 className="text-lg font-bold text-primary mb-1">
        {title}
      </h3>
    )}
    {description && (
      <p className="text-sm text-muted-foreground max-w-sm mx-auto">
        {description}
      </p>
    )}
  </div>
);

export { EmptyState };
