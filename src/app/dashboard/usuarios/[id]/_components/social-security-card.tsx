import { Contact, ShieldCheck, Activity, Landmark, Shield, AlertCircle } from "lucide-react";
import { UsuarioWithRelations } from "@/types";

interface SocialSecurityCardProps {
    usuario: UsuarioWithRelations;
}

export function SocialSecurityCard({ usuario }: SocialSecurityCardProps) {
    const hv = usuario.hojaVida;

    return (
        <div className="bg-white border border-slate-200 radius-0 h-full overflow-hidden shadow-sm">
            <div className="bg-white px-6 py-4 border-b border-slate-200 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <ShieldCheck size={18} className="text-brand" />
                    <h4 className="text-[14px] font-bold uppercase tracking-[0.2em] text-brand">Seguridad Social & Salud</h4>
                </div>
                <div className="px-2 py-0.5 bg-emerald-50 text-emerald-600 text-[8px] font-black uppercase tracking-widest border border-emerald-100">
                    Vigente
                </div>
            </div>

            <div className="p-8 space-y-8">
                <div className="grid grid-cols-2 gap-px bg-slate-100 border border-slate-100">
                    <StatusField icon={<Activity size={14} />} label="TIPO_RH" value={hv?.rh || "--"} />
                    <StatusField icon={<ShieldCheck size={14} />} label="ENT_EPS" value={hv?.eps || "Pte. Registro"} />
                    <StatusField icon={<Landmark size={14} />} label="FONDO_PENSIÓN" value={hv?.fondoPensiones || "Pte. Registro"} />
                    <StatusField icon={<Shield size={14} />} label="RIESGO_ARL" value={hv?.arl || "Pte. Registro"} />
                </div>

                <div className="border-t border-slate-100 pt-8">
                    <div className="flex items-center gap-2 mb-4">
                        <AlertCircle size={14} className="text-brand" />
                        <h5 className="text-[10px] font-bold uppercase tracking-widest text-[#018790]">Contacto de Emergencia</h5>
                    </div>
                    
                    <div className="bg-slate-50 border-l-4 border-brand p-5 radius-0">
                        <p className="text-[13px] font-black text-slate-800 uppercase tracking-tight mb-1">
                            {hv?.contactoEmergenciaNombre || "PENDIENTE EL REGISTRO"}
                        </p>
                        <div className="flex items-center gap-2">
                            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest leading-none">Teléfono Directo:</span>
                            <span className="text-[12px] font-bold text-brand">{hv?.contactoEmergenciaTelefono || "----------"}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function StatusField({ icon, label, value }: { icon: any; label: string; value: string }) {
    return (
        <div className="bg-white p-5 flex flex-col gap-2 group hover:bg-slate-50 transition-colors">
            <div className="flex items-center gap-2 text-[#018790]/50 group-hover:text-brand transition-colors">
                {icon}
                <span className="text-[8px] font-bold uppercase tracking-widest opacity-70 italic">{label}</span>
            </div>
            <div className="text-[13px] font-bold text-slate-900 uppercase tracking-wider leading-none">{value}</div>
        </div>
    );
}
