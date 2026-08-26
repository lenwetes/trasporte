import { LucideIcon, Download, FileText, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface ReportCardProps {
    id: string;
    title: string;
    description: string;
    icon: LucideIcon;
    color: string;
    loading: string | null;
    onExport: (id: string) => void;
    onGenerate: (id: string) => void;
    disabled?: boolean;
}

export function ReportCard({
    id,
    title,
    description,
    icon: Icon,
    color,
    loading,
    onExport,
    onGenerate,
    disabled,
}: ReportCardProps) {
    const isLoading = loading === id || loading === `${id}_excel`;

    return (
        <div className="group relative bg-white border border-primary/10 transition-all duration-300 hover:border-primary/30 shadow-sm hover:shadow-xl flex flex-col md:flex-row md:items-center justify-between p-6 gap-6 mb-4 overflow-hidden">
            {/* Intel Sidebar Indicator */}
            <div 
                className="absolute left-0 top-0 bottom-0 w-1.5 transition-all duration-500 group-hover:w-2"
                style={{ backgroundColor: color }}
            />

            <div className="flex items-center gap-6 flex-1 pl-4">
                <div 
                    className="h-14 w-14 border flex items-center justify-center transition-colors duration-500"
                    style={{ 
                        backgroundColor: `${color}10`, 
                        borderColor: `${color}20`,
                        color: color 
                    }}
                >
                    <Icon className="h-6 w-6" />
                </div>

                <div className="space-y-1">
                    <h3 className="text-sm font-black text-primary uppercase tracking-widest leading-none">
                        {title}
                    </h3>
                    <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-[0.15em] max-w-xl">
                        {description}
                    </p>
                </div>
            </div>

            <div className="flex flex-wrap sm:flex-nowrap gap-3 pl-4 md:pl-0 border-t md:border-t-0 border-primary/5 pt-4 md:pt-0">
                <button
                    onClick={() => onExport(id)}
                    disabled={disabled || loading !== null}
                    className={cn(
                        "h-12 px-6 flex items-center gap-2 border border-primary/10 bg-slate-50 text-[10px] font-black uppercase tracking-widest text-primary transition-all rounded-none",
                        (!disabled && loading === null) && "hover:border-primary/30 hover:bg-white",
                        (disabled || loading !== null) && "opacity-50 cursor-not-allowed"
                    )}
                >
                    {loading === `${id}_excel` ? (
                        <Loader2 className="h-4 w-4 animate-spin text-accent" />
                    ) : (
                        <>
                            <span className="hidden sm:inline">DATA</span> EXCEL
                            <Download className="h-4 w-4 text-slate-900" />
                        </>
                    )}
                </button>
                <button
                    onClick={() => onGenerate(id)}
                    disabled={disabled || loading !== null}
                    className={cn(
                        "h-12 px-6 flex items-center gap-2 border-none bg-primary text-[10px] font-black uppercase tracking-widest text-white transition-all rounded-none shadow-md",
                        (!disabled && loading === null) && "hover:bg-primary/90",
                        (disabled || loading !== null) && "opacity-50 cursor-not-allowed"
                    )}
                >
                    {loading === id ? (
                        <Loader2 className="h-4 w-4 animate-spin text-accent" />
                    ) : (
                        <>
                            REPORTE PDF
                            <FileText className="h-4 w-4 text-accent" />
                        </>
                    )}
                </button>
            </div>
        </div>
    );
}
