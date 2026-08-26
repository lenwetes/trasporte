"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

// Dropdown Context to share state between Trigger and Content
const DropdownMenuContext = React.createContext<{
  open: boolean;
  setOpen: (val: boolean | ((prev: boolean) => boolean)) => void;
} | null>(null);

interface DropdownMenuProps {
  children: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export const DropdownMenu = ({ children, open: controlledOpen, onOpenChange }: DropdownMenuProps) => {
  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(false);
  
  const open = controlledOpen !== undefined ? controlledOpen : uncontrolledOpen;
  
  const setOpen = React.useCallback((val: boolean | ((prev: boolean) => boolean)) => {
    if (onOpenChange) {
      const nextValue = typeof val === 'function' ? val(open) : val;
      onOpenChange(nextValue);
    } else {
      setUncontrolledOpen(val);
    }
  }, [onOpenChange, open]);

  return (
    <DropdownMenuContext.Provider value={{ open, setOpen }}>
      <div className="relative inline-block text-left">
        {children}
      </div>
    </DropdownMenuContext.Provider>
  );
};

export const DropdownMenuTrigger = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement> & { asChild?: boolean }>(
  ({ className, asChild, ...props }, ref) => {
    const context = React.useContext(DropdownMenuContext);

    const handleClick = (e: React.MouseEvent) => {
      e.stopPropagation();
      context?.setOpen((prev) => !prev);
    };

    return (
      <div 
        ref={ref} 
        onClick={handleClick}
        className={cn("inline-flex cursor-pointer transition-all", className)} 
        {...props} 
      />
    );
  }
);
DropdownMenuTrigger.displayName = "DropdownMenuTrigger";

export const DropdownMenuContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement> & { align?: "start" | "end" | "center"; sideOffset?: number; asChild?: boolean }>(
  ({ className, align = "start", sideOffset = 4, asChild, ...props }, ref) => {
    const context = React.useContext(DropdownMenuContext);
    
    // Hooks MUST be called before any conditional returns
    const isOpen = context?.open ?? false;

    // Use a reference to detect clicks outside
    const contentRef = React.useRef<HTMLDivElement>(null);

    React.useEffect(() => {
      if (!isOpen) return;

      const handleDown = (e: MouseEvent) => {
        if (contentRef.current && !contentRef.current.contains(e.target as Node)) {
          context?.setOpen(false);
        }
      };

      document.addEventListener("mousedown", handleDown);
      return () => document.removeEventListener("mousedown", handleDown);
    }, [isOpen, context]);

    if (!isOpen) return null;

    return (
      <div 
        ref={(node) => {
          // Combine refs: forwarded ref and internal contentRef
          if (typeof ref === "function") ref(node);
          else if (ref) ref.current = node;
          (contentRef as React.MutableRefObject<HTMLDivElement | null>).current = node;
        }}
        onClick={(e) => e.stopPropagation()}
        className={cn(
          "absolute mt-2 z-50 min-w-[8rem] bg-white border border-primary/10 shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-100",
          align === "end" ? "right-0" : align === "start" ? "left-0" : "left-1/2 -translate-x-1/2",
          className
        )}
        style={{ top: "100%" }}
        {...props} 
      />
    );
  }
);
DropdownMenuContent.displayName = "DropdownMenuContent";

export const DropdownMenuItem = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement> & { inset?: boolean; asChild?: boolean }>(
  ({ className, inset, asChild, ...props }, ref) => {
    const context = React.useContext(DropdownMenuContext);
    
    const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
        props.onClick?.(e);
        if (!e.defaultPrevented) {
            context?.setOpen(false);
        }
    };

    return (
      <div 
        ref={ref} 
        onClick={handleClick}
        className={cn(
          "relative flex cursor-pointer select-none items-center px-2 py-1.5 text-sm outline-none hover:bg-slate-50 transition-colors",
          inset && "pl-8",
          className
        )}
        {...props} 
      />
    );
  }
);
DropdownMenuItem.displayName = "DropdownMenuItem";

export const DropdownMenuLabel = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement> & { inset?: boolean }>(
  ({ className, inset, ...props }, ref) => (
    <div 
      ref={ref} 
      className={cn("px-2 py-1.5 text-sm font-semibold", inset && "pl-8", className)} 
      {...props} 
    />
  )
);
DropdownMenuLabel.displayName = "DropdownMenuLabel";

export const DropdownMenuSeparator = React.forwardRef<HTMLHRElement, React.HTMLAttributes<HTMLHRElement>>(
  ({ className, ...props }, ref) => (
    <hr ref={ref} className={cn("my-1 h-px bg-slate-200 border-none", className)} {...props} />
  )
);
DropdownMenuSeparator.displayName = "DropdownMenuSeparator";

// Minimal implementations for compatibility
export const DropdownMenuPortal = ({ children }: { children: React.ReactNode }) => <>{children}</>;
export const DropdownMenuSub = ({ children }: { children: React.ReactNode }) => <>{children}</>;
export const DropdownMenuSubTrigger = ({ children, ...props }: React.HTMLAttributes<HTMLDivElement>) => <div {...props}>{children}</div>;
export const DropdownMenuSubContent = ({ children, ...props }: React.HTMLAttributes<HTMLDivElement>) => <div {...props}>{children}</div>;
export const DropdownMenuCheckboxItem = ({ children, ...props }: React.HTMLAttributes<HTMLDivElement>) => <div {...props}>{children}</div>;
export const DropdownMenuRadioGroup = ({ children, ...props }: React.HTMLAttributes<HTMLDivElement>) => <div {...props}>{children}</div>;
export const DropdownMenuRadioItem = ({ children, ...props }: React.HTMLAttributes<HTMLDivElement>) => <div {...props}>{children}</div>;
export const DropdownMenuShortcut = ({ children, ...props }: React.HTMLAttributes<HTMLSpanElement>) => <span {...props}>{children}</span>;
export const DropdownMenuGroup = ({ children, ...props }: React.HTMLAttributes<HTMLDivElement>) => <div {...props}>{children}</div>;
