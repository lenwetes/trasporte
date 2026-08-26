"use client";

import { useState } from "react";
import {
    ShieldCheck,
    CheckSquare,
    Square,
    AlertCircle,
    Info,
    CheckCircle2,
    Check
} from "lucide-react";
import { DEFAULT_ITEMS } from "@/app/dashboard/preoperacional/_components/preoperacional-constants";
import { cn } from "@/lib/utils";

interface SafetyChecklistProps {
    onComplete: (isComplete: boolean) => void;
}

export function FuecSafetyChecklist({ onComplete }: SafetyChecklistProps) {
    // Tomamos una sección representativa para no hacer el formulario extremadamente largo
    const items = DEFAULT_ITEMS.filter((item) => item.criticidad === "ALTA"); 

    const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});

    const toggleItem = (name: string) => {
        const newState = {
            ...checkedItems,
            [name]: !checkedItems[name],
        };
        setCheckedItems(newState);

        const allChecked = items.every((item) => newState[item.item]);
        onComplete(allChecked);
    };

    const isAllChecked = items.every((item) => checkedItems[item.item]);

    const toggleAll = () => {
        if (isAllChecked) {
            setCheckedItems({});
            onComplete(false);
        } else {
            const newState: Record<string, boolean> = {};
            items.forEach((item) => {
                newState[item.item] = true;
            });
            setCheckedItems(newState);
            onComplete(true);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-primary/[0.03] p-4 border border-primary/10">
                <div className="flex items-center gap-3">
                    <div className={cn(
                        "h-10 w-10 flex items-center justify-center transition-colors",
                        isAllChecked ? "bg-accent text-white" : "bg-primary/5 text-slate-900"
                    )}>
                        <ShieldCheck className="h-5 w-5" />
                    </div>
                    <div>
                        <h3 className="text-xs font-black text-primary uppercase tracking-tighter">Manifestación Técnica</h3>
                        <p className="text-[10px] text-muted-foreground font-medium">Verificación del estado de componentes críticos.</p>
                    </div>
                </div>
                
                <div className="flex items-center gap-3">
                    <button
                        type="button"
                        onClick={toggleAll}
                        className="text-[10px] font-bold text-primary/60 hover:text-primary transition-colors flex items-center gap-2"
                    >
                        {isAllChecked ? <Square className="h-3 w-3" /> : <CheckCircle2 className="h-3 w-3" />}
                        {isAllChecked ? "DESMARCAR TODO" : "MARCAR TODOS"}
                    </button>
                    <div className={cn(
                        "px-3 py-1 text-[9px] font-black uppercase tracking-widest flex items-center gap-1.5",
                        isAllChecked ? "bg-accent/10 text-accent border border-accent/20" : "bg-primary/5 text-slate-900 border border-primary/10"
                    )}>
                        {isAllChecked ? <CheckCircle2 className="h-3 w-3" /> : <AlertCircle className="h-3 w-3" />}
                        {isAllChecked ? "VERIFICADO" : "PENDIENTE"}
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {items.map((item) => (
                    <button
                        key={item.item}
                        type="button"
                        onClick={() => toggleItem(item.item)}
                        className={cn(
                            "flex items-center gap-3 p-3 text-left transition-all border rounded-none group",
                            checkedItems[item.item] 
                                ? "bg-accent/5 border-accent/40 text-primary" 
                                : "bg-white border-primary/10 text-primary/60 hover:border-primary/20"
                        )}
                    >
                        <div className={cn(
                            "h-5 w-5 shrink-0 flex items-center justify-center border transition-colors",
                            checkedItems[item.item] 
                                ? "bg-accent border-accent text-white" 
                                : "bg-white border-primary/20 group-hover:border-primary/40"
                        )}>
                            {checkedItems[item.item] && <Check className="h-3 w-3" />}
                        </div>
                        <div className="leading-tight">
                            <span className="text-[11px] font-bold block">{item.item}</span>
                            <span className="text-[9px] text-muted-foreground uppercase font-bold text-accent/60 tracking-wider font-mono">
                                {item.group}
                            </span>
                        </div>
                    </button>
                ))}
            </div>

            <div className="flex items-start gap-3 p-4 bg-primary/[0.02] border border-primary/5">
                <Info className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                <p className="text-[10px] text-muted-foreground leading-relaxed italic font-medium">
                    Esta verificación manual sirve como declaración responsable de buen estado por parte del operador, 
                    complementando el preoperacional digital obligatorio del sistema.
                </p>
            </div>
        </div>
    );
}
