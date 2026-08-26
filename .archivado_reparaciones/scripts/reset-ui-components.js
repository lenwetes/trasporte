/**
 * reset-ui-components.js
 * Reescribe todos los componentes UI al mínimo absoluto:
 * - Solo HTML nativo
 * - Sin Tailwind
 * - Sin variantes
 * - Sin lógica visual
 * - Solo pasar props al elemento nativo
 */
const fs = require('fs');
const path = require('path');

const CUSTOM_PROPS_INTERFACE = `interface CP { 
  variant?: string; size?: string; asChild?: boolean; value?: string; 
  onValueChange?: (v: any) => void; open?: boolean; isOpen?: boolean; 
  onOpenChange?: (v: any) => void; label?: string; icon?: React.ReactNode; 
  description?: string; header?: React.ReactNode; data?: any; fileName?: string; 
  align?: string; control?: any; render?: (props: any) => React.ReactNode; 
  name?: string; disabled?: boolean; colSpan?: number; currentPage?: number; 
  totalPages?: number; archivo?: any; placeholder?: string; options?: any[]; 
  shouldFilter?: boolean; mode?: string; error?: string; items?: any[]; 
  htmlFor?: string; rows?: number; loop?: boolean; sideOffset?: number;
  onCheckedChange?: (v: any) => void; checked?: boolean; defaultValue?: string;
  onSelect?: (v: any) => void; onClose?: () => void; onConfirm?: () => void;
  loading?: boolean; title?: string; errors?: any; onSubmit?: (e: any) => void;
  isLoading?: boolean; submitLabel?: string; className?: string;
}`;

const COMPONENTS = {
  'button.tsx': `"use client";
import * as React from "react";
${CUSTOM_PROPS_INTERFACE}

export const Button = React.forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement> & CP>(
  ({ asChild, variant, size, className, ...props }, ref) => <button ref={ref} {...props} />
);
Button.displayName = "Button";
export const buttonVariants = {} as any;
`,
  'input.tsx': `"use client";
import * as React from "react";
${CUSTOM_PROPS_INTERFACE}

export const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement> & CP>(
  ({ asChild, className, ...props }, ref) => <input ref={ref} {...props} />
);
Input.displayName = "Input";
`,
  'textarea.tsx': `"use client";
import * as React from "react";
${CUSTOM_PROPS_INTERFACE}

export const Textarea = React.forwardRef<HTMLTextAreaElement, React.TextareaHTMLAttributes<HTMLTextAreaElement> & CP>(
  ({ asChild, className, ...props }, ref) => <textarea ref={ref} {...props} />
);
Textarea.displayName = "Textarea";
`,
  'label.tsx': `"use client";
import * as React from "react";
${CUSTOM_PROPS_INTERFACE}

export const Label = React.forwardRef<HTMLLabelElement, React.LabelHTMLAttributes<HTMLLabelElement> & CP>(
  ({ asChild, className, ...props }, ref) => <label ref={ref} {...props} />
);
Label.displayName = "Label";
`,
  'select.tsx': `"use client";
import * as React from "react";
${CUSTOM_PROPS_INTERFACE}

export const Select = React.forwardRef<HTMLSelectElement, React.SelectHTMLAttributes<HTMLSelectElement> & CP>(
  ({ asChild, onValueChange, className, ...props }, ref) => (
    <select ref={ref} onChange={onValueChange ? (e) => onValueChange(e.target.value) : props.onChange} {...props} />
  )
);
Select.displayName = "Select";

export const SelectTrigger = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement> & CP>(
  ({ className, asChild, ...props }, ref) => <div ref={ref} {...props} />
);
SelectTrigger.displayName = "SelectTrigger";

export const SelectContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement> & CP>(
  ({ className, asChild, ...props }, ref) => <div ref={ref} {...props} />
);
SelectContent.displayName = "SelectContent";

export const SelectItem = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement> & CP>(
  ({ className, asChild, ...props }, ref) => <div ref={ref} {...props} />
);
SelectItem.displayName = "SelectItem";

export const SelectValue = React.forwardRef<HTMLSpanElement, React.HTMLAttributes<HTMLSpanElement> & CP>(
  ({ className, asChild, ...props }, ref) => <span ref={ref} {...props} />
);
SelectValue.displayName = "SelectValue";

export const SelectGroup = React.forwardRef<HTMLOptGroupElement, React.OptgroupHTMLAttributes<HTMLOptGroupElement> & CP>(
  ({ className, asChild, ...props }, ref) => <optgroup ref={ref} {...props} />
);
SelectGroup.displayName = "SelectGroup";

export const SelectLabel = React.forwardRef<HTMLLabelElement, React.LabelHTMLAttributes<HTMLLabelElement> & CP>(
  ({ className, asChild, ...props }, ref) => <label ref={ref} {...props} />
);
SelectLabel.displayName = "SelectLabel";

export const SelectSeparator = React.forwardRef<HTMLHRElement, React.HTMLAttributes<HTMLHRElement> & CP>(
  ({ className, asChild, ...props }, ref) => <hr ref={ref} {...props} />
);
SelectSeparator.displayName = "SelectSeparator";
`,
  'checkbox.tsx': `"use client";
import * as React from "react";
${CUSTOM_PROPS_INTERFACE}

export const Checkbox = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement> & CP>(
  ({ asChild, className, onCheckedChange, checked, ...props }, ref) => (
    <input 
      type="checkbox" 
      ref={ref} 
      checked={checked} 
      onChange={onCheckedChange ? (e) => onCheckedChange(e.target.checked) : props.onChange}
      {...props} 
    />
  )
);
Checkbox.displayName = "Checkbox";
`,
  'switch.tsx': `"use client";
import * as React from "react";
${CUSTOM_PROPS_INTERFACE}

export const Switch = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement> & CP>(
  ({ asChild, className, onCheckedChange, checked, ...props }, ref) => (
    <input 
      type="checkbox" 
      role="switch"
      ref={ref} 
      checked={checked}
      onChange={onCheckedChange ? (e) => onCheckedChange(e.target.checked) : props.onChange}
      {...props} 
    />
  )
);
Switch.displayName = "Switch";
`,
  'badge.tsx': `"use client";
import * as React from "react";
${CUSTOM_PROPS_INTERFACE}

export const Badge = React.forwardRef<HTMLSpanElement, React.HTMLAttributes<HTMLSpanElement> & CP>(
  ({ asChild, variant, className, ...props }, ref) => <span ref={ref} {...props} />
);
Badge.displayName = "Badge";
`,
  'card.tsx': `"use client";
import * as React from "react";
${CUSTOM_PROPS_INTERFACE}

export const Card = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement> & CP>(
  ({ asChild, className, ...props }, ref) => <div ref={ref} {...props} />
);
Card.displayName = "Card";

export const CardHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement> & CP>(
  ({ className, ...props }, ref) => <div ref={ref} {...props} />
);
CardHeader.displayName = "CardHeader";

export const CardTitle = React.forwardRef<HTMLHeadingElement, React.HTMLAttributes<HTMLHeadingElement> & CP>(
  ({ className, ...props }, ref) => <h3 ref={ref} {...props} />
);
CardTitle.displayName = "CardTitle";

export const CardDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement> & CP>(
  ({ className, ...props }, ref) => <p ref={ref} {...props} />
);
CardDescription.displayName = "CardDescription";

export const CardContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement> & CP>(
  ({ className, ...props }, ref) => <div ref={ref} {...props} />
);
CardContent.displayName = "CardContent";

export const CardFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement> & CP>(
  ({ className, ...props }, ref) => <div ref={ref} {...props} />
);
CardFooter.displayName = "CardFooter";
`,
  'separator.tsx': `"use client";
import * as React from "react";
${CUSTOM_PROPS_INTERFACE}

export const Separator = React.forwardRef<HTMLHRElement, React.HTMLAttributes<HTMLHRElement> & CP>(
  ({ asChild, className, orientation, decorative, ...props }, ref) => <hr ref={ref} {...props} />
);
Separator.displayName = "Separator";
`,
  'skeleton.tsx': `"use client";
import * as React from "react";
${CUSTOM_PROPS_INTERFACE}

export const Skeleton = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement> & CP>(
  ({ className, ...props }, ref) => <div ref={ref} {...props} />
);
Skeleton.displayName = "Skeleton";
`,
  'table.tsx': `"use client";
import * as React from "react";
${CUSTOM_PROPS_INTERFACE}

export const Table = React.forwardRef<HTMLTableElement, React.HTMLAttributes<HTMLTableElement> & CP>(
  ({ className, asChild, ...props }, ref) => <table ref={ref} {...props} />
);
Table.displayName = "Table";

export const TableHeader = React.forwardRef<HTMLTableSectionElement, React.HTMLAttributes<HTMLTableSectionElement> & CP>(
  ({ className, ...props }, ref) => <thead ref={ref} {...props} />
);
TableHeader.displayName = "TableHeader";

export const TableBody = React.forwardRef<HTMLTableSectionElement, React.HTMLAttributes<HTMLTableSectionElement> & CP>(
  ({ className, ...props }, ref) => <tbody ref={ref} {...props} />
);
TableBody.displayName = "TableBody";

export const TableFooter = React.forwardRef<HTMLTableSectionElement, React.HTMLAttributes<HTMLTableSectionElement> & CP>(
  ({ className, ...props }, ref) => <tfoot ref={ref} {...props} />
);
TableFooter.displayName = "TableFooter";

export const TableRow = React.forwardRef<HTMLTableRowElement, React.HTMLAttributes<HTMLTableRowElement> & CP>(
  ({ className, ...props }, ref) => <tr ref={ref} {...props} />
);
TableRow.displayName = "TableRow";

export const TableHead = React.forwardRef<HTMLTableCellElement, React.ThHTMLAttributes<HTMLTableCellElement> & CP>(
  ({ className, ...props }, ref) => <th ref={ref} {...props} />
);
TableHead.displayName = "TableHead";

export const TableCell = React.forwardRef<HTMLTableCellElement, React.TdHTMLAttributes<HTMLTableCellElement> & CP>(
  ({ className, ...props }, ref) => <td ref={ref} {...props} />
);
TableCell.displayName = "TableCell";

export const TableCaption = React.forwardRef<HTMLTableCaptionElement, React.HTMLAttributes<HTMLTableCaptionElement> & CP>(
  ({ className, ...props }, ref) => <caption ref={ref} {...props} />
);
TableCaption.displayName = "TableCaption";
`,
  'tabs.tsx': `"use client";
import * as React from "react";
${CUSTOM_PROPS_INTERFACE}

export const Tabs = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement> & CP>(
  ({ className, asChild, value, onValueChange, defaultValue, ...props }, ref) => <div ref={ref} {...props} />
);
Tabs.displayName = "Tabs";

export const TabsList = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement> & CP>(
  ({ className, asChild, ...props }, ref) => <div role="tablist" ref={ref} {...props} />
);
TabsList.displayName = "TabsList";

export const TabsTrigger = React.forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement> & CP>(
  ({ className, asChild, value, ...props }, ref) => <button role="tab" ref={ref} {...props} />
);
TabsTrigger.displayName = "TabsTrigger";

export const TabsContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement> & CP>(
  ({ className, asChild, value, ...props }, ref) => <div role="tabpanel" ref={ref} {...props} />
);
TabsContent.displayName = "TabsContent";
`,
  'tabs-zenith.tsx': `"use client";
import * as React from "react";
export { Tabs, TabsList, TabsTrigger, TabsContent } from "./tabs";
`,
  'fluent-tabs.tsx': `"use client";
import * as React from "react";
export { Tabs, TabsList, TabsTrigger, TabsContent } from "./tabs";

export const CoopetraesTabsWrapper = ({ children, ...props }: any) => <div {...props}>{children}</div>;
export const CoopetraesTabs = ({ children, ...props }: any) => <div {...props}>{children}</div>;
export const CoopetraesTab = ({ children, ...props }: any) => <button {...props}>{children}</button>;
export const CoopetraesTabPanel = ({ children, ...props }: any) => <div {...props}>{children}</div>;
`,
  'dialog.tsx': `"use client";
import * as React from "react";
${CUSTOM_PROPS_INTERFACE}

export const Dialog = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement> & CP>(
  ({ open, onOpenChange, className, ...props }, ref) => open ? <div ref={ref} {...props} /> : null
);
Dialog.displayName = "Dialog";

export const DialogTrigger = React.forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement> & CP>(
  ({ asChild, className, ...props }, ref) => <button ref={ref} {...props} />
);
DialogTrigger.displayName = "DialogTrigger";

export const DialogPortal = ({ children }: { children: React.ReactNode }) => <>{children}</>;
DialogPortal.displayName = "DialogPortal";

export const DialogOverlay = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement> & CP>(
  ({ className, ...props }, ref) => <div ref={ref} {...props} />
);
DialogOverlay.displayName = "DialogOverlay";

export const DialogClose = React.forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement> & CP>(
  ({ className, ...props }, ref) => <button ref={ref} {...props} />
);
DialogClose.displayName = "DialogClose";

export const DialogContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement> & CP>(
  ({ className, ...props }, ref) => <div ref={ref} {...props} />
);
DialogContent.displayName = "DialogContent";

export const DialogHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement> & CP>(
  ({ className, ...props }, ref) => <div ref={ref} {...props} />
);
DialogHeader.displayName = "DialogHeader";

export const DialogFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement> & CP>(
  ({ className, ...props }, ref) => <div ref={ref} {...props} />
);
DialogFooter.displayName = "DialogFooter";

export const DialogTitle = React.forwardRef<HTMLHeadingElement, React.HTMLAttributes<HTMLHeadingElement> & CP>(
  ({ className, ...props }, ref) => <h2 ref={ref} {...props} />
);
DialogTitle.displayName = "DialogTitle";

export const DialogDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement> & CP>(
  ({ className, ...props }, ref) => <p ref={ref} {...props} />
);
DialogDescription.displayName = "DialogDescription";
`,
  'popover.tsx': `"use client";
import * as React from "react";
${CUSTOM_PROPS_INTERFACE}

export const Popover = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement> & CP>(
  ({ open, onOpenChange, className, ...props }, ref) => <div ref={ref} {...props} />
);
Popover.displayName = "Popover";

export const PopoverTrigger = React.forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement> & CP>(
  ({ asChild, className, ...props }, ref) => <button ref={ref} {...props} />
);
PopoverTrigger.displayName = "PopoverTrigger";

export const PopoverContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement> & CP>(
  ({ align, sideOffset, className, ...props }, ref) => <div ref={ref} {...props} />
);
PopoverContent.displayName = "PopoverContent";
`,
  'command.tsx': `"use client";
import * as React from "react";
${CUSTOM_PROPS_INTERFACE}

export const Command = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement> & CP>(
  ({ className, ...props }, ref) => <div ref={ref} {...props} />
);
Command.displayName = "Command";

export const CommandInput = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement> & CP>(
  ({ className, onValueChange, ...props }, ref) => (
    <input ref={ref} onChange={onValueChange ? (e) => onValueChange(e.target.value) : props.onChange} {...props} />
  )
);
CommandInput.displayName = "CommandInput";

export const CommandList = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement> & CP>(
  ({ className, ...props }, ref) => <div ref={ref} {...props} />
);
CommandList.displayName = "CommandList";

export const CommandEmpty = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement> & CP>(
  ({ className, ...props }, ref) => <div ref={ref} {...props} />
);
CommandEmpty.displayName = "CommandEmpty";

export const CommandGroup = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement> & CP>(
  ({ className, heading, ...props }: any, ref) => <div ref={ref} {...props} />
);
CommandGroup.displayName = "CommandGroup";

export const CommandItem = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement> & CP>(
  ({ className, value, onSelect, ...props }, ref) => (
    <div ref={ref} onClick={onSelect ? () => onSelect(value ?? '') : undefined} {...props} />
  )
);
CommandItem.displayName = "CommandItem";

export const CommandSeparator = React.forwardRef<HTMLHRElement, React.HTMLAttributes<HTMLHRElement> & CP>(
  ({ className, ...props }, ref) => <hr ref={ref} {...props} />
);
CommandSeparator.displayName = "CommandSeparator";
`,
  'dropdown-menu.tsx': `"use client";
import * as React from "react";
${CUSTOM_PROPS_INTERFACE}

export const DropdownMenu = ({ children, open, onOpenChange }: any) => <>{children}</>;
export const DropdownMenuTrigger = React.forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement> & CP>(
  ({ asChild, className, ...props }, ref) => <button ref={ref} {...props} />
);
export const DropdownMenuContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement> & CP>(
  ({ className, align, sideOffset, ...props }, ref) => <div ref={ref} {...props} />
);
export const DropdownMenuItem = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement> & CP>(
  ({ className, inset, ...props }: any, ref) => <div ref={ref} {...props} />
);
export const DropdownMenuCheckboxItem = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement> & CP>(
  ({ className, checked, onCheckedChange, ...props }, ref) => <div ref={ref} {...props} />
);
export const DropdownMenuRadioGroup = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement> & CP>(
  ({ className, value, onValueChange, ...props }, ref) => <div ref={ref} {...props} />
);
export const DropdownMenuRadioItem = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement> & CP>(
  ({ className, value, ...props }, ref) => <div ref={ref} {...props} />
);
export const DropdownMenuLabel = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement> & CP>(
  ({ className, inset, ...props }: any, ref) => <div ref={ref} {...props} />
);
export const DropdownMenuSeparator = React.forwardRef<HTMLHRElement, React.HTMLAttributes<HTMLHRElement> & CP>(
  ({ className, ...props }, ref) => <hr ref={ref} {...props} />
);
export const DropdownMenuShortcut = ({ className, ...props }: any) => <span {...props} />;
export const DropdownMenuGroup = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement> & CP>(
  ({ className, ...props }, ref) => <div ref={ref} {...props} />
);
export const DropdownMenuPortal = ({ children }: any) => <>{children}</>;
export const DropdownMenuSub = ({ children }: any) => <>{children}</>;
export const DropdownMenuSubContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement> & CP>(
  ({ className, ...props }, ref) => <div ref={ref} {...props} />
);
export const DropdownMenuSubTrigger = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement> & CP>(
  ({ className, inset, ...props }: any, ref) => <div ref={ref} {...props} />
);
`,
  'form.tsx': `"use client";
import * as React from "react";
${CUSTOM_PROPS_INTERFACE}

export const Form = ({ children, ...props }: any) => <form {...props}>{children}</form>;
export const FormItem = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement> & CP>(
  ({ className, ...props }, ref) => <div ref={ref} {...props} />
);
FormItem.displayName = "FormItem";
export const FormLabel = React.forwardRef<HTMLLabelElement, React.LabelHTMLAttributes<HTMLLabelElement> & CP>(
  ({ className, ...props }, ref) => <label ref={ref} {...props} />
);
FormLabel.displayName = "FormLabel";
export const FormControl = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement> & CP>(
  ({ className, ...props }, ref) => <div ref={ref} {...props} />
);
FormControl.displayName = "FormControl";
export const FormDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement> & CP>(
  ({ className, ...props }, ref) => <p ref={ref} {...props} />
);
FormDescription.displayName = "FormDescription";
export const FormMessage = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement> & CP>(
  ({ className, ...props }, ref) => <p ref={ref} {...props} />
);
FormMessage.displayName = "FormMessage";
export const FormField = ({ control, name, render }: any) => {
  const field = { name, value: '', onChange: () => {}, onBlur: () => {}, ref: null };
  return render ? render({ field }) : null;
};
`,
  'alert.tsx': `"use client";
import * as React from "react";
${CUSTOM_PROPS_INTERFACE}

export const Alert = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement> & CP>(
  ({ variant, className, ...props }, ref) => <div role="alert" ref={ref} {...props} />
);
Alert.displayName = "Alert";

export const AlertTitle = React.forwardRef<HTMLHeadingElement, React.HTMLAttributes<HTMLHeadingElement> & CP>(
  ({ className, ...props }, ref) => <h5 ref={ref} {...props} />
);
AlertTitle.displayName = "AlertTitle";

export const AlertDescription = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement> & CP>(
  ({ className, ...props }, ref) => <div ref={ref} {...props} />
);
AlertDescription.displayName = "AlertDescription";
`,
  'calendar.tsx': `"use client";
import * as React from "react";
${CUSTOM_PROPS_INTERFACE}

export const Calendar = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement> & CP>(
  ({ className, selected, onSelect, mode, locale, ...props }: any, ref) => (
    <div ref={ref} {...props}>
      <input 
        type="date" 
        value={selected ? (selected instanceof Date ? selected.toISOString().split('T')[0] : '') : ''} 
        onChange={(e) => onSelect && onSelect(e.target.value ? new Date(e.target.value) : undefined)}
      />
    </div>
  )
);
Calendar.displayName = "Calendar";
`,
  'nav-dropdown.tsx': `"use client";
import * as React from "react";
${CUSTOM_PROPS_INTERFACE}

export const NavDropdown = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement> & CP>(
  ({ label, icon, items, className, ...props }: any, ref) => <div ref={ref} {...props} />
);
NavDropdown.displayName = "NavDropdown";
`,
  'pagination.tsx': `"use client";
import * as React from "react";
${CUSTOM_PROPS_INTERFACE}

export const Pagination = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement> & CP>(
  ({ currentPage, totalPages, className, ...props }, ref) => (
    <div ref={ref} {...props}>
      <span>Página {currentPage} de {totalPages}</span>
    </div>
  )
);
Pagination.displayName = "Pagination";
`,
  'stat-card.tsx': `"use client";
import * as React from "react";
${CUSTOM_PROPS_INTERFACE}

export const StatCard = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement> & CP>(
  ({ label, value, icon, color, variant, className, ...props }: any, ref) => (
    <div ref={ref} {...props}>
      <span>{label}: {value}</span>
    </div>
  )
);
StatCard.displayName = "StatCard";
`,
  'minimal-stat-card.tsx': `"use client";
import * as React from "react";
export const MinimalStatCard = ({ label, value, ...props }: any) => (
  <div {...props}><span>{label}: {value}</span></div>
);
`,
  'base-modal.tsx': `"use client";
import * as React from "react";
export const BaseModal = ({ isOpen, onClose, children, title, ...props }: any) => {
  if (!isOpen) return null;
  return (
    <div role="dialog" {...props}>
      {title && <h2>{title}</h2>}
      {children}
      <button onClick={onClose}>Cerrar</button>
    </div>
  );
};
`,
  'confirm-dialog.tsx': `"use client";
import * as React from "react";
export const ConfirmDialog = ({ isOpen, onClose, onConfirm, loading, title, description, ...props }: any) => {
  if (!isOpen) return null;
  return (
    <div role="dialog" {...props}>
      {title && <h2>{title}</h2>}
      {description && <p>{description}</p>}
      <button onClick={onClose} disabled={loading}>Cancelar</button>
      <button onClick={onConfirm} disabled={loading}>{loading ? 'Cargando...' : 'Confirmar'}</button>
    </div>
  );
};
`,
  'form-dialog.tsx': `"use client";
import * as React from "react";
export const FormDialog = ({ isOpen, onClose, onSubmit, children, title, isLoading, submitLabel, ...props }: any) => {
  if (!isOpen) return null;
  return (
    <div role="dialog" {...props}>
      {title && <h2>{title}</h2>}
      <form onSubmit={onSubmit}>
        {children}
        <button type="button" onClick={onClose} disabled={isLoading}>Cancelar</button>
        <button type="submit" disabled={isLoading}>{submitLabel ?? 'Guardar'}</button>
      </form>
    </div>
  );
};
`,
  'form-container.tsx': `"use client";
import * as React from "react";
export const FormContainer = ({ children, ...props }: any) => <div {...props}>{children}</div>;
`,
  'form-field.tsx': `"use client";
import * as React from "react";
${CUSTOM_PROPS_INTERFACE}
export const FormFieldWrapper = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement> & CP>(
  ({ className, ...props }, ref) => <div ref={ref} {...props} />
);
FormFieldWrapper.displayName = "FormFieldWrapper";
// Also export as default alias
export { FormFieldWrapper as FormField };
`,
  'form-select.tsx': `"use client";
import * as React from "react";
export const FormSelect = ({ label, children, error, ...props }: any) => (
  <div>
    {label && <label>{label}</label>}
    <select {...props}>{children}</select>
    {error && <span>{error}</span>}
  </div>
);
`,
  'form-error-modal.tsx': `"use client";
import * as React from "react";
export const FormErrorModal = ({ isOpen, onClose, errors, ...props }: any) => {
  if (!isOpen) return null;
  return (
    <div role="dialog" {...props}>
      <p>Error en formulario</p>
      <button onClick={onClose}>Cerrar</button>
    </div>
  );
};
`,
  'empty-state.tsx': `"use client";
import * as React from "react";
export const EmptyState = ({ title, description, ...props }: any) => (
  <div {...props}>
    {title && <p>{title}</p>}
    {description && <p>{description}</p>}
  </div>
);
`,
  'export-excel-button.tsx': `"use client";
import * as React from "react";
export const ExportExcelButton = ({ data, fileName, label, ...props }: any) => (
  <button {...props}>{label ?? 'Exportar Excel'}</button>
);
`,
  'document-preview-modal.tsx': `"use client";
import * as React from "react";
${CUSTOM_PROPS_INTERFACE}
export const DocumentPreviewModal = ({ open, onOpenChange, archivo, label, ...props }: any) => {
  if (!open) return null;
  return (
    <div role="dialog" {...props}>
      {label && <p>{label}</p>}
      <button onClick={() => onOpenChange && onOpenChange(false)}>Cerrar</button>
    </div>
  );
};
export const PreviewArchivo = DocumentPreviewModal;
`,
  'select-backup.tsx': `"use client";
export { Select } from "./select";
`,
  'native-select.tsx': `"use client";
import * as React from "react";
export const NativeSelect = React.forwardRef<HTMLSelectElement, React.SelectHTMLAttributes<HTMLSelectElement>>(
  ({ className, ...props }, ref) => <select ref={ref} {...props} />
);
NativeSelect.displayName = "NativeSelect";
`,
  'spotlight.tsx': `"use client";
import * as React from "react";
export const Spotlight = ({ children, ...props }: any) => <div {...props}>{children}</div>;
`,
  'bento-grid.tsx': `"use client";
import * as React from "react";
export const BentoGrid = ({ children, ...props }: any) => <div {...props}>{children}</div>;
export const BentoGridItem = ({ children, ...props }: any) => <div {...props}>{children}</div>;
`,
};

const uiDir = path.join(__dirname, 'src', 'components', 'ui');

for (const [filename, content] of Object.entries(COMPONENTS)) {
    const filePath = path.join(uiDir, filename);
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`✅ Reescrito: ${filename}`);
}

console.log('\n🏁 Todos los componentes UI han sido reseteados al mínimo absoluto.');
