import * as React from "react";
import { 
    CloudUpload, 
    ChevronRight, 
    Plus, 
    CreditCard, 
    Trash2, 
    ShieldCheck, 
    Upload 
} from "lucide-react";
import { 
    Dialog, 
    DialogContent, 
    DialogHeader, 
    DialogTitle 
} from "@/components/ui/dialog";
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
import { TempCategory } from "../licencia-tab.types";

interface LicenciaDigitizeWizardProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    step: number;
    setStep: (step: number) => void;
    numLicencia: string;
    setNumLicencia: (val: string) => void;
    tempCategories: TempCategory[];
    addTempCategory: () => void;
    removeTempCategory: (index: number) => void;
    updateTempCategory: (index: number, field: string, value: string) => void;
    fileInputRef: React.RefObject<HTMLInputElement | null>;
    handleFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
    handleFinalSync: () => Promise<void>;
    isUploading: boolean;
    uploadedFileId: string | null;
}

export function LicenciaDigitizeWizard({
    isOpen,
    onOpenChange,
    step,
    setStep,
    numLicencia,
    setNumLicencia,
    tempCategories,
    addTempCategory,
    removeTempCategory,
    updateTempCategory,
    fileInputRef,
    handleFileUpload,
    handleFinalSync,
    isUploading,
    uploadedFileId,
}: LicenciaDigitizeWizardProps) {
    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-xl p-0 overflow-hidden border-none rounded-none shadow-2xl">
                <DialogHeader className="bg-primary p-8 text-white relative">
                    <div className="h-10 w-10 bg-white/10 flex items-center justify-center backdrop-blur-sm mb-4">
                        <CloudUpload className="h-5 w-5 text-accent" />
                    </div>
                    <DialogTitle className="text-2xl font-black uppercase tracking-tighter">Sincronización Maestra</DialogTitle>
                    <p className="text-white/60 text-[10px] font-bold uppercase tracking-widest mt-2 px-1">Digitalización de Habilitación Vial RUNT</p>
                </DialogHeader>

                <div className="p-8 space-y-8">
                    {step === 1 && (
                        <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
                            <div className="space-y-3">
                                <Label className="text-[10px] font-black text-primary/40 uppercase tracking-widest">N&uacute;mero de Licencia</Label>
                                <Input 
                                    value={numLicencia} 
                                    onChange={(e) => setNumLicencia(e.target.value.toUpperCase())} 
                                    className="h-14 rounded-none border-primary/10 bg-slate-50 font-black text-lg focus-visible:ring-accent/20"
                                    placeholder="EJ: 123456789"
                                />
                            </div>
                            <Button className="w-full h-14 bg-primary rounded-none font-black uppercase tracking-widest gap-2" onClick={() => setStep(2)}>
                                Continuar a Categor&iacute;as <ChevronRight className="h-4 w-4" />
                            </Button>
                        </div>
                    )}

                    {step === 2 && (
                        <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
                            <div className="flex justify-between items-center">
                                <Label className="text-[10px] font-black text-primary/40 uppercase tracking-widest">Categor&iacute;as Identificadas</Label>
                                <Button variant="outline" size="sm" onClick={addTempCategory} className="rounded-none border-primary/10 font-bold text-[9px] uppercase px-4">
                                    <Plus className="h-3 w-3 mr-1" /> Agregar
                                </Button>
                            </div>
                            
                            <div className="max-h-[300px] overflow-y-auto space-y-4 pr-2">
                                {tempCategories.length === 0 && (
                                    <div className="py-12 border border-dashed border-primary/10 flex flex-col items-center justify-center text-primary/30">
                                        <CreditCard className="h-8 w-8 mb-2 opacity-20" />
                                        <p className="text-[10px] font-bold uppercase tracking-widest">Sin categorías definidas</p>
                                    </div>
                                )}
                                {tempCategories.map((cat, idx) => (
                                    <div key={cat.id} className="p-4 bg-slate-50 border border-primary/5 flex flex-wrap md:flex-nowrap gap-4 items-end">
                                        <div className="flex-1 min-w-[60px]">
                                            <Label className="text-[8px] font-black text-primary/30 uppercase block mb-2">CAT</Label>
                                            <Input 
                                                value={cat.categoria} 
                                                onChange={(e) => updateTempCategory(idx, "categoria", e.target.value.toUpperCase())} 
                                                className="h-10 rounded-none bg-white border-primary/10 uppercase font-bold"
                                                placeholder="C2"
                                            />
                                        </div>
                                        <div className="flex-1 min-w-[120px]">
                                            <Label className="text-[8px] font-black text-primary/30 uppercase block mb-2">SERVICIO</Label>
                                            <Select value={cat.servicio} onValueChange={(v) => updateTempCategory(idx, "servicio", v)}>
                                                <SelectTrigger className="h-10 rounded-none bg-white border-primary/10 font-bold">
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent className="rounded-none font-bold">
                                                    <SelectItem value="PÚBLICO">P&Uacute;BLICO</SelectItem>
                                                    <SelectItem value="PARTICULAR">PARTICULAR</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="flex-1 min-w-[140px]">
                                            <Label className="text-[8px] font-black text-primary/30 uppercase block mb-2">VENCIMIENTO</Label>
                                            <Input 
                                                type="date" 
                                                defaultValue={cat.fechaVencimiento} 
                                                onChange={(e) => updateTempCategory(idx, "fechaVencimiento", e.target.value)} 
                                                className="h-10 rounded-none bg-white border-primary/10 font-bold"
                                            />
                                        </div>
                                        <Button variant="ghost" size="icon" onClick={() => removeTempCategory(idx)} className="h-10 w-10 text-red-600/40 hover:text-red-600 hover:bg-red-50 rounded-none">
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                ))}
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <Button variant="outline" className="h-14 rounded-none font-black uppercase text-[10px]" onClick={() => setStep(1)}>Atr&aacute;s</Button>
                                <Button className="h-14 rounded-none bg-primary font-black uppercase text-[10px]" onClick={() => setStep(3)}>Siguiente</Button>
                            </div>
                        </div>
                    )}

                    {step === 3 && (
                        <div className="space-y-8 animate-in slide-in-from-right-4 duration-300">
                            <div 
                                className={cn(
                                    "border-2 border-dashed p-12 text-center transition-all duration-300 cursor-pointer group",
                                    uploadedFileId ? "border-emerald-200 bg-emerald-50" : "border-primary/10 bg-slate-50 hover:border-accent/40"
                                )}
                                onClick={() => fileInputRef.current?.click()}
                            >
                                <div className="flex flex-col items-center">
                                    <div className={cn(
                                        "h-16 w-16 flex items-center justify-center mb-4 transition-all duration-300",
                                        uploadedFileId ? "bg-emerald-500 text-white" : "bg-white text-primary/20 group-hover:text-accent shadow-sm"
                                    )}>
                                        {uploadedFileId ? <ShieldCheck className="h-8 w-8" /> : <Upload className="h-8 w-8" />}
                                    </div>
                                    <p className="text-sm font-black text-primary uppercase tracking-tight">
                                        {uploadedFileId ? "Soporte Digital Cargado" : "Cargar Soporte RUNT"}
                                    </p>
                                    <p className="text-[10px] text-muted-foreground uppercase font-bold mt-2">
                                        PDF, JPG o PNG (Max 10MB)
                                    </p>
                                </div>
                                <input ref={fileInputRef} type="file" hidden accept="image/*,application/pdf" onChange={handleFileUpload} />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <Button variant="outline" className="h-14 rounded-none font-black uppercase text-[10px]" onClick={() => setStep(2)}>Atr&aacute;s</Button>
                                <Button 
                                    className="h-14 rounded-none bg-accent hover:bg-accent/90 text-white font-black uppercase text-[10px] shadow-lg shadow-accent/20" 
                                    onClick={handleFinalSync}
                                    disabled={isUploading || !uploadedFileId}
                                >
                                    {isUploading ? "PROCESANDO..." : "SINCRONIZAR MÓDULO"}
                                </Button>
                            </div>
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}
