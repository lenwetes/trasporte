"use client";
import * as React from "react";

export const Command = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement> & { shouldFilter?: boolean; loop?: boolean }>(
  ({ className, shouldFilter, loop, ...props }, ref) => (
    <div 
      ref={ref} 
      style={{
        display: "flex",
        height: "100%",
        width: "100%",
        flexDirection: "column",
        overflow: "hidden",
        borderRadius: "8px",
        backgroundColor: "#fff",
        color: "#0f172a",
        ...props.style
      }}
      {...props} 
    />
  )
);
Command.displayName = "Command";

interface CommandInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  onValueChange?: (value: string) => void;
}

export const CommandInput = React.forwardRef<HTMLInputElement, CommandInputProps>(
  ({ className, onValueChange, style, ...props }, ref) => (
    <div style={{ display: "flex", alignItems: "center", borderBottom: "1px solid #e2e8f0", padding: "0 12px" }}>
      <input 
        ref={ref} 
        style={{
          display: "flex",
          height: "44px",
          width: "100%",
          borderRadius: "6px",
          backgroundColor: "transparent",
          padding: "12px 0",
          fontSize: "14px",
          outline: "none",
          border: "none",
          ...style
        }}
        onChange={onValueChange ? (e) => onValueChange(e.target.value) : props.onChange} 
        {...props} 
      />
    </div>
  )
);
CommandInput.displayName = "CommandInput";

export const CommandList = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div 
      ref={ref} 
      style={{
        maxHeight: "300px",
        overflowY: "auto",
        overflowX: "hidden",
        ...props.style
      }}
      {...props} 
    />
  )
);
CommandList.displayName = "CommandList";

export const CommandEmpty = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div 
      ref={ref} 
      style={{
        padding: "24px",
        textAlign: "center",
        fontSize: "14px",
        ...props.style
      }}
      {...props} 
    />
  )
);
CommandEmpty.displayName = "CommandEmpty";

export const CommandGroup = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement> & { heading?: React.ReactNode }>(
  ({ className, heading, children, ...props }, ref) => (
    <div 
      ref={ref} 
      style={{
        overflow: "hidden",
        padding: "4px",
        color: "#0f172a",
        ...props.style
      }}
      {...props}
    >
      {heading && (
        <div style={{ padding: "8px 12px", fontSize: "12px", fontWeight: 500, color: "#64748b" }}>
          {heading}
        </div>
      )}
      {children}
    </div>
  )
);
CommandGroup.displayName = "CommandGroup";

interface CommandItemProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onSelect'> {
  value?: string;
  onSelect?: (value: string) => void;
  disabled?: boolean;
}

export const CommandItem = React.forwardRef<HTMLDivElement, CommandItemProps>(
  ({ className, value, onSelect, disabled, ...props }, ref) => (
    <div 
      ref={ref} 
      style={{
        position: "relative",
        display: "flex",
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.5 : 1,
        alignItems: "center",
        borderRadius: "4px",
        padding: "8px 12px",
        fontSize: "14px",
        outline: "none",
        ...props.style
      }}
      onClick={!disabled && onSelect ? () => onSelect(value ?? '') : undefined} 
      {...props} 
    />
  )
);
CommandItem.displayName = "CommandItem";

export const CommandSeparator = React.forwardRef<HTMLHRElement, React.HTMLAttributes<HTMLHRElement>>(
  ({ className, ...props }, ref) => <hr ref={ref} style={{ margin: "4px -4px", height: "1px", backgroundColor: "#e2e8f0", border: "none" }} {...props} />
);
CommandSeparator.displayName = "CommandSeparator";
