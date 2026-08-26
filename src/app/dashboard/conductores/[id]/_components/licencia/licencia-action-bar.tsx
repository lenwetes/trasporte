import * as React from "react";
import { CreditCard, CloudUpload } from "lucide-react";
import { Button } from "@/components/ui/button";

interface LicenciaActionBarProps {
    startWizard: () => void;
}

export function LicenciaActionBar({ startWizard }: LicenciaActionBarProps) {
    return (
        <div className="bg-slate-50 border-b border-primary/5 p-8 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-6">
                <div className="h-14 w-14 bg-white border border-primary/10 flex items-center justify-center text-primary shadow-sm">
                    <CreditCard className="h-7 w-7" />
                </div>
                <div>
                    <h3 className="text-lg font-black text-primary uppercase tracking-tight">Habilitación Operativa</h3>
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-1">Gesti&oacute;n de Categor&iacute;as y Vencimientos RUNT</p>
                </div>
            </div>

            <Button 
                onClick={startWizard}
                className="h-12 rounded-none bg-primary hover:bg-primary/90 text-white font-black text-[10px] uppercase tracking-widest px-8 shadow-lg shadow-primary/10 gap-2"
            >
                <CloudUpload className="h-4 w-4 text-accent" /> Digitalizar Licencia
            </Button>
        </div>
    );
}
