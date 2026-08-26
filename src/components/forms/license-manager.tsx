"use client";

import { useState } from "react";
import { getHistorialLicencias } from "@/actions";
import { DetalleLicenciaWithActivo } from "@/actions/licencias";
import { LicenseManagerProps } from "./license-manager/types";
import { NewCategoryForm } from "./license-manager/new-category-form";
import { LicenseItem } from "./license-manager/license-item";
import { LicenseHistory } from "./license-manager/license-history";
import { 
    CreditCard, 
    History, 
    Plus, 
    X, 
    ChevronRight,
    Search,
    CloudUpload,
    ShieldCheck
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export function LicenseManager({
    usuarioId,
    licenciasActivas,
    variant = "light",
}: LicenseManagerProps) {
    const [showHistory, setShowHistory] = useState(false);
    const [historial, setHistorial] = useState<DetalleLicenciaWithActivo[]>([]);
    const [loadingHistory, setLoadingHistory] = useState(false);
    const [adding, setAdding] = useState(false);

    const loadHistory = async () => {
        if (showHistory) {
            setShowHistory(false);
            return;
        }

        setLoadingHistory(true);
        try {
            const result = await getHistorialLicencias(usuarioId);
            if (result.success && result.data) {
                setHistorial(result.data as DetalleLicenciaWithActivo[]);
                setShowHistory(true);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoadingHistory(false);
        }
    };

    return (
        <Card className="rounded-none border-primary/10 shadow-sm overflow-hidden bg-white">
            <CardHeader className="bg-slate-50 py-6 border-b border-primary/5 flex flex-col md:flex-row items-center justify-between gap-6 px-8">
                <div className="flex items-center gap-4">
                    <div className="h-10 w-10 bg-primary/5 border border-primary/10 flex items-center justify-center text-primary">
                        <CreditCard className="h-5 w-5" />
                    </div>
                    <div>
                        <CardTitle className="text-[11px] font-black text-primary uppercase tracking-[0.2em]">Licencias Activas</CardTitle>
                        <p className="text-[9px] font-bold text-muted-foreground uppercase mt-1 tracking-widest flex items-center gap-2">
                             Categor&iacute;as vigentes certificadas
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-3 w-full md:w-auto">
                    <Button 
                        type="button" 
                        variant="outline"
                        size="sm"
                        className={cn(
                            "rounded-none h-10 px-4 font-black text-[9px] uppercase tracking-widest transition-all duration-300 gap-2 border-primary/10",
                            adding ? "bg-primary text-white border-primary" : "bg-white text-primary"
                        )}
                        onClick={() => setAdding(!adding)}
                    >
                        {adding ? (
                            <><X className="h-3 w-3" /> Cerrar</>
                        ) : (
                            <><Plus className="h-3 w-3" /> Nueva Categor&iacute;a</>
                        )}
                    </Button>
                    <Button 
                        type="button" 
                        variant="outline"
                        size="sm"
                        disabled={loadingHistory}
                        className="rounded-none h-10 px-4 font-black text-[9px] uppercase tracking-widest border-primary/10 transition-all duration-300 gap-2 hover:bg-slate-100"
                        onClick={loadHistory}
                    >
                        {loadingHistory ? (
                            "..."
                        ) : (
                            showHistory ? (
                                <><X className="h-3 w-3" /> Ocultar Historial</>
                            ) : (
                                <><History className="h-3 w-3 text-accent" /> Ver Historial</>
                            )
                        )}
                    </Button>
                </div>
            </CardHeader>

            <CardContent className="p-8">
                <div className="space-y-10">
                    {/* Adding Category Form View */}
                    {adding && (
                        <div className="animate-in slide-in-from-top-4 duration-500">
                             <NewCategoryForm
                                usuarioId={usuarioId}
                                variant={variant}
                                onCancel={() => setAdding(false)}
                            />
                        </div>
                    )}

                    {/* Active Licenses List Layout */}
                    {licenciasActivas.length === 0 ? (
                        <div className="py-16 text-center border border-dashed border-primary/10 bg-slate-50/50 flex flex-col items-center justify-center space-y-4">
                            <div className="h-14 w-14 bg-white border border-primary/5 flex items-center justify-center text-primary/10">
                                <CreditCard className="h-6 w-6" />
                            </div>
                            <p className="text-[10px] font-black text-primary uppercase tracking-[0.2em] italic">Sin licencias registradas</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 gap-8 pb-4">
                            {licenciasActivas.map((licencia) => (
                                <LicenseItem
                                    key={licencia.id}
                                    licencia={licencia}
                                    usuarioId={usuarioId}
                                    variant={variant}
                                />
                            ))}
                        </div>
                    )}

                    {/* Sequential History Section */}
                    {showHistory && (
                        <div className="mt-12 pt-10 border-t border-primary/5 border-dashed animate-in fade-in duration-500">
                            <div className="flex items-center gap-4 mb-8">
                                <div className="h-0.5 w-8 bg-accent/40" />
                                <h4 className="text-[10px] font-black text-slate-900 uppercase tracking-[0.3em]">
                                    Log de Habilitaciones Hist&oacute;ricas
                                </h4>
                            </div>
                            <LicenseHistory historial={historial} variant={variant} />
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
