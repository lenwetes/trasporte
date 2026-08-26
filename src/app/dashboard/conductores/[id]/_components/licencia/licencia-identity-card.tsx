import * as React from "react";
import { CreditCard, ShieldCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { LicenseManager } from "@/components/forms/license-manager";
import { UsuarioWithRelations } from "@/types";
import { TabLicencia } from "../licencia-tab.types";

interface LicenciaIdentityCardProps {
    conductor: UsuarioWithRelations;
}

export function LicenciaIdentityCard({ conductor }: LicenciaIdentityCardProps) {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 p-8">
            <div className="bg-primary p-8 rounded-none flex flex-col justify-between min-h-[240px] shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-10">
                    <CreditCard className="h-32 w-32 text-white" />
                </div>
                
                <div className="flex justify-between items-start relative z-10">
                    <div className="h-10 w-10 bg-white/10 flex items-center justify-center backdrop-blur-sm">
                        <ShieldCheck className="h-5 w-5 text-accent" />
                    </div>
                    <Badge className="bg-accent text-white border-none rounded-none text-[9px] font-black tracking-widest px-3">LICENCIA ACTIVA</Badge>
                </div>

                <div className="space-y-2 relative z-10">
                    <p className="text-[10px] font-black text-white/50 uppercase tracking-[0.2em]">Referencia RUNT</p>
                    <h4 className="text-3xl font-black text-white tracking-tighter leading-none">
                        {conductor.numeroLicencia || "SIN REGISTRO"}
                    </h4>
                </div>
            </div>

            <div className="lg:col-span-2">
                <LicenseManager
                    usuarioId={conductor.id}
                    licenciasActivas={conductor.licencias?.filter((l: TabLicencia) => l.activo) || []}
                />
            </div>
        </div>
    );
}
