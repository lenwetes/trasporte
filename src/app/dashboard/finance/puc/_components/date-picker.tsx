"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Calendar } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function PUCDatePicker() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [date, setDate] = useState(searchParams.get("date") || format(new Date(), "yyyy-MM-dd"));

    const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newDate = e.target.value;
        setDate(newDate);
        router.push(`/dashboard/finance/puc?date=${newDate}`);
    };

    return (
        <div className="flex items-center gap-4 bg-slate-50 ring-1 ring-primary/5 p-4 border-r-4 border-accent shadow-lg shadow-primary/5 group">
            <div className="space-y-1">
                <p className="text-[9px] font-black text-slate-900 uppercase tracking-[0.2em] group-hover:text-accent transition-colors">Selector de Auditoría</p>
                <div className="flex items-center gap-3">
                    <Calendar size={14} className="text-primary/60 group-hover:text-accent transition-colors" />
                    <input 
                        type="date" 
                        value={date}
                        onChange={handleDateChange}
                        className="bg-transparent text-[12px] font-black text-primary uppercase tracking-widest outline-none cursor-pointer"
                    />
                </div>
            </div>
            <div className="h-10 w-[1px] bg-primary/10 rotate-12 mx-2" />
            <div className="hidden md:block">
                <p className="text-[10px] font-black text-primary uppercase tracking-[0.1em] italic">
                    Consultando libro diario al: <br />
                    <span className="text-primary/60">{format(new Date(date), "PPP", { locale: es })}</span>
                </p>
            </div>
        </div>
    );
}
