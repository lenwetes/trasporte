import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { FolderOpen, Search, Filter, Upload, FileSignature } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export const dynamic = "force-dynamic";

export default async function GestionDocumentalPage() {
    const session = await auth();
    if (!session?.user?.id) redirect("/login");

    return (
        <div style={{ maxWidth: "1600px", margin: "0 auto", padding: "20px" }}>
            <DashboardHeader
                title="Gestor Documental"
                tagline="Archivo Central"
                subtitle="Repositorio criptográfico unificado de pólizas, Soat y verificaciones técnicas"
                icon={FolderOpen}
                iconGradient="from-slate-700 to-primary"
            />

            <div className="mt-8 space-y-6">
                {/* Intel Bar: Actions */}
                <div className="bg-white border border-primary/10 flex flex-col md:flex-row items-center justify-between p-6 gap-6">
                    <div className="flex flex-col sm:flex-row items-center gap-8 w-full md:w-auto text-center sm:text-left">
                        <div className="space-y-1 py-1 px-4 border-l-2 border-accent">
                            <div className="text-[10px] font-black text-slate-900 uppercase tracking-[0.2em] mb-1">Volumen de Archivo</div>
                            <div className="flex items-center gap-2">
                            <FileSignature className="h-4 w-4 text-accent" />
                            <span className="text-xl font-black text-primary tracking-tighter uppercase">
                                    -- FOJAS
                            </span>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-4 w-full md:w-auto">
                        <div className="relative flex-1 sm:min-w-[400px]">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-primary/20" />
                            <Input 
                                placeholder="IDENTIFICADOR ÚNICO O METADATOS..."
                                className="h-14 pl-12 rounded-none border-primary/10 bg-slate-50 text-[11px] font-black uppercase tracking-widest focus-visible:ring-primary/20 focus-visible:border-accent transition-all"
                            />
                        </div>
                        
                        <Button variant="outline" className="h-14 rounded-none border-primary/10 hover:bg-primary/5 text-primary font-black uppercase tracking-widest px-6 gap-3 shadow-sm transition-all w-full sm:w-auto">
                            <Filter className="h-4 w-4" /> REGLAS
                        </Button>
                        <Button className="h-14 rounded-none bg-primary hover:bg-primary/90 text-white font-black uppercase tracking-widest px-8 gap-3 shadow-xl transition-all w-full sm:w-auto">
                            <Upload className="h-5 w-5 text-accent" /> DIGITALIZAR
                        </Button>
                    </div>
                </div>

                {/* Blank State */}
                <div className="bg-white border border-primary/10 min-h-[500px] flex flex-col items-center justify-center p-8 space-y-4">
                    <div className="h-20 w-20 bg-slate-50 border border-primary/5 flex items-center justify-center text-primary/10">
                        <FolderOpen className="h-10 w-10" />
                    </div>
                    <div className="text-center space-y-1">
                        <h3 className="text-sm font-black text-primary uppercase tracking-widest">Indexación Pendiente</h3>
                        <p className="text-[10px] font-bold text-muted-foreground uppercase max-w-xs leading-relaxed">
                            No se han sincronizado paquetes de datos operativos todavía.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
