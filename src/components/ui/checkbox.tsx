"use client";
import * as React from "react";

interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  onCheckedChange?: (checked: boolean) => void;
}

export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, onCheckedChange, checked, ...props }, ref) => (
    <input 
      type="checkbox" 
      ref={ref} 
      className={className}
      checked={checked} 
      onChange={onCheckedChange ? (e) => onCheckedChange(e.target.checked) : props.onChange}
      style={{
        width: "16px",
        height: "16px",
        borderRadius: "4px",
        border: "1px solid #e2e8f0",
        cursor: "pointer",
        ...props.style
      }}
      {...props} 
    />
  )
);
Checkbox.displayName = "Checkbox";
