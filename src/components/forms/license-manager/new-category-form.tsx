"use client";

import { useState } from "react";
import { crearLicenciaCategoria } from "@/actions";
import { NewCategoryState } from "./types";
import { 
    Settings2, 
    ChevronRight, 
    ArrowRight,
    Search,
    ShieldCheck,
    X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
    Select, 
    SelectContent, 
    SelectItem, 
    SelectTrigger, 
    SelectValue 
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

import { toast } from "sonner";

interface NewCategoryFormProps {
    usuarioId: string;
    variant: "light" | "dark";
    onCancel: () => void;
}

export function NewCategoryForm({
    usuarioId,
    onCancel,
}: NewCategoryFormProps) {
    const [loading, setLoading] = useState(false);
    const [newCategory, setNewCategory] = useState<NewCategoryState>({
        categoria: "",
        servicio: "PÚBLICO",
        fechaVencimiento: "",
    });

    const handleAddCategory = async () => {
        if (!newCategory.categoria) {
            toast.error("Por favor ingresa la categoría RUNT");
            return;
        }
        
        if (!newCategory.fechaVencimiento) {
            toast.error("Debes seleccionar una fecha de vencimiento");
            return;
        }

        setLoading(true);
        try {
            const result = await crearLicenciaCategoria(
                usuarioId,
                newCategory.categoria.toUpperCase(),
                newCategory.servicio,
                new Date(`${newCategory.fechaVencimiento}T12:00:00Z`),
            );

            if (result.success) {
                toast.success("Categoría sincronizada exitosamente");
                onCancel();
            } else {
                toast.error(result.error || "No se pudo sincronizar la categoría");
            }
        } catch (error) {
            console.error(error);
            toast.error("Ocurrió un error inesperado al procesar la solicitud");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-8 animate-in slide-in-from-top-4 duration-500">
            <div className="flex justify-between items-center border-b border-primary/5 pb-6">
                <div className="flex items-center gap-3">
                    <div className="h-8 w-8 bg-accent/10 flex items-center justify-center text-accent">
                        <Settings2 className="h-4 w-4" />
                    </div>
                    <h5 className="text-[11px] font-black text-primary uppercase tracking-[0.2em]">Parametrizaci&oacute;n T&eacute;cnica</h5>
                </div>
                <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={onCancel} 
                    className="h-8 text-red-600/60 hover:text-red-600 hover:bg-red-50 font-black text-[9px] uppercase tracking-widest px-4 rounded-none"
                >
                    <X className="h-3 w-3 mr-2" /> Descartar
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="space-y-3">
                    <Label className="text-[9px] font-black text-slate-900 uppercase tracking-[0.2em]">Categor&iacute;a RUNT</Label>
                    <Input
                        placeholder="EJ: C2, A2"
                        value={newCategory.categoria}
                        onChange={(e) => setNewCategory({ ...newCategory, categoria: e.target.value.toUpperCase() })}
                        className="h-11 rounded-none border-primary/10 bg-slate-50/50 font-black text-xs focus-visible:ring-accent/20 uppercase"
                    />
                </div>
                <div className="space-y-3">
                    <Label className="text-[9px] font-black text-slate-900 uppercase tracking-[0.2em]">R&eacute;gimen de Servicio</Label>
                    <Select
                        value={newCategory.servicio}
                        onValueChange={(v) => setNewCategory({ ...newCategory, servicio: v })}
                    >
                        <SelectTrigger className="h-11 rounded-none border-primary/10 bg-slate-50/50 font-black text-xs">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="rounded-none font-bold">
                            <SelectItem value="PÚBLICO">SERVICIO P&Uacute;BLICO</SelectItem>
                            <SelectItem value="PARTICULAR">SERVICIO PARTICULAR</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div className="space-y-3">
                    <Label className="text-[9px] font-black text-slate-900 uppercase tracking-[0.2em]">Expiraci&oacute;n Legal</Label>
                    <Input
                        type="date"
                        defaultValue={newCategory.fechaVencimiento}
                        onChange={(e) => setNewCategory({ ...newCategory, fechaVencimiento: e.target.value })}
                        className="h-11 rounded-none border-primary/10 bg-slate-50/50 font-black text-xs"
                    />
                </div>
            </div>

            <Button 
                onClick={handleAddCategory}
                disabled={loading}
                className="w-full h-12 bg-primary hover:bg-primary/95 text-white rounded-none font-black text-[10px] uppercase tracking-widest shadow-2xl shadow-primary/20 gap-2 transition-all duration-300"
            >
                {loading ? (
                    "PROCESANDO REGISTRO..."
                ) : (
                    <><ShieldCheck className="h-4 w-4 text-accent" /> Sincronizar Categor&iacute;a en Habilitaci&oacute;n</>
                )}
            </Button>
        </div>
    );
}
