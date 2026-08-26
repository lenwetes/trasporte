import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

export function SectionTitle({ 
    title, 
    className, 
    icon: Icon 
}: { 
    title: string; 
    className?: string;
    icon?: LucideIcon;
}) {
    return (
        <div className={cn("bg-white px-6 py-4 border border-slate-200 border-b-0 flex items-center gap-3 print:bg-slate-50 print:py-3", className)}>
            {Icon && <Icon size={18} className="text-brand" />}
            <h3 className="text-[14px] font-bold uppercase tracking-wide text-brand">
                {title}
            </h3>
        </div>
    );
}

export function DataField({
    label,
    value,
    className,
    icon: Icon,
}: {
    label: string;
    value: string | null | undefined;
    className?: string;
    icon?: LucideIcon;
}) {
    return (
        <div className={cn("border-b border-slate-100 py-4 flex flex-col gap-1.5 print:py-3", className)}>
            <div className="flex items-center gap-2">
                {Icon && <Icon size={12} className="text-brand opacity-60" />}
                <p className="text-[10px] font-bold uppercase tracking-widest text-[#018790] opacity-70">
                    {label}
                </p>
            </div>
            <p className="text-[13px] font-bold text-slate-900 uppercase tracking-tight leading-tight">
                {value || "---"}
            </p>
        </div>
    );
}
