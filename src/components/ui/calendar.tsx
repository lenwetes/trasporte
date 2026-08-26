"use client";
import * as React from "react";

export interface CalendarProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onSelect'> {
  selected?: Date | undefined;
  onSelect?: (date: Date | undefined) => void;
  onMonthChange?: (date: Date) => void;
  mode?: "single" | "multiple" | "range" | string;
  locale?: unknown;
  classNames?: Record<string, string>;
  showOutsideDays?: boolean;
  initialFocus?: boolean;
  disabled?: boolean | ((date: Date) => boolean) | any;
  modifiers?: Record<string, any>;
  modifiersClassNames?: Record<string, string>;
  components?: Record<string, any>;
}

export const Calendar = React.forwardRef<HTMLDivElement, CalendarProps>(
  ({ className, selected, onSelect, onMonthChange, mode, locale, classNames, showOutsideDays, initialFocus, disabled, ...props }, ref) => (
    <div 
      ref={ref} 
      className={className} 
      style={{
        padding: "12px",
        borderRadius: "8px",
        border: "1px solid #e2e8f0",
        backgroundColor: "#fff",
        display: "inline-block",
        ...props.style
      }}
      {...props}
    >
      <input 
        type="date" 
        style={{
          border: "1px solid #e2e8f0",
          borderRadius: "6px",
          padding: "8px",
          fontSize: "14px",
          outline: "none"
        }}
        value={selected ? (selected instanceof Date ? selected.toISOString().split('T')[0] : '') : ''} 
        onChange={(e) => {
          const date = e.target.value ? new Date(e.target.value) : undefined;
          if (onSelect) onSelect(date);
          if (date && onMonthChange) onMonthChange(date);
        }}
      />
    </div>
  )
);
Calendar.displayName = "Calendar";
