"use client";

import React from "react";
import { MaintenanceAlert, OrdenRevision } from "../types";
import { PlanMantenimiento, Vehiculo } from "@prisma/client";
import { X, Save, AlertTriangle, Settings, FileText, CheckCircle2, Truck, Wrench, Calendar, DollarSign, Activity, ShieldAlert } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface MaintenanceModalsProps {
    isCompleteModalOpen: boolean;
    setIsCompleteModalOpen: (val: boolean) => void;
    isRegisterModalOpen: boolean;
    setIsRegisterModalOpen: (val: boolean) => void;
    isPlanModalOpen: boolean;
    setIsPlanModalOpen: (val: boolean) => void;
    isValidationModalOpen: boolean;
    setIsValidationModalOpen: (val: boolean) => void;
    selectedAlerta: MaintenanceAlert | null;
    setSelectedAlerta: (alerta: MaintenanceAlert | null) => void;
    setSelectedOrdenId: (id: string | null) => void;
    isSubmitting: boolean;
    vehiculos: Vehiculo[];
    planes: PlanMantenimiento[];
    handleCompleteOrder: (e: React.FormEvent) => Promise<void>;
    handleRegisterMaintenance: (e: React.FormEvent) => Promise<void>;
    handleCreatePlan: (e: React.FormEvent) => Promise<void>;
    handleValidateAlert: (e: React.FormEvent) => Promise<void>;
    selectedOrden: OrdenRevision | null;
    handleRejectOrder: (e: React.FormEvent) => Promise<void>;
}

export function MaintenanceModals({
    isCompleteModalOpen,
    setIsCompleteModalOpen,
    isRegisterModalOpen,
    setIsRegisterModalOpen,
    isPlanModalOpen,
    setIsPlanModalOpen,
    isValidationModalOpen,
    setIsValidationModalOpen,
    selectedAlerta,
    setSelectedAlerta,
    setSelectedOrdenId,
    isSubmitting,
    vehiculos,
    planes,
    handleCompleteOrder,
    handleRegisterMaintenance,
    handleCreatePlan,
    handleValidateAlert,
    selectedOrden,
    handleRejectOrder,
}: MaintenanceModalsProps) {
    if (!isCompleteModalOpen && !isRegisterModalOpen && !isPlanModalOpen && !isValidationModalOpen) return null;

    const closeModal = () => {
        setIsCompleteModalOpen(false);
        setIsRegisterModalOpen(false);
        setIsPlanModalOpen(false);
        setIsValidationModalOpen(false);
        setSelectedAlerta(null);
        setSelectedOrdenId(null);
    };

    const Label = ({ children }: { children: React.ReactNode }) => (
        <label className="block text-[10px] font-black text-slate-900 uppercase tracking-[0.2em] mb-3">
            {children}
        </label>
    );

    const InputClass = "h-14 w-full rounded-none border-primary/10 bg-slate-50 px-4 text-xs font-bold uppercase tracking-widest focus:border-secondary focus:ring-0 transition-colors mb-6";

    return (
        <div 
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300"
            onClick={(e) => e.target === e.currentTarget && closeModal()}
        >
            <div className="bg-white border border-primary/10 shadow-2xl w-full max-w-xl relative overflow-hidden animate-in zoom-in-95 duration-300">
                <div className="absolute top-0 left-0 w-2 h-full bg-secondary" />
                
                {isRegisterModalOpen && (
                    <form onSubmit={handleRegisterMaintenance}>
                        <div className="p-8 border-b border-primary/5 flex justify-between items-center bg-slate-50/50">
                            <div className="flex items-center gap-4">
                                <div className="h-10 w-10 flex items-center justify-center border border-primary/10 bg-white">
                                    <Wrench className="h-5 w-5 text-secondary" />
                                </div>
                                <div>
                                    <h3 className="text-sm font-black text-primary uppercase tracking-widest">Registrar Mantenimiento</h3>
                                    <p className="text-[10px] font-bold text-primary uppercase tracking-[0.2em]">Manual Entry System</p>
                                </div>
                            </div>
                            <button type="button" onClick={closeModal} className="text-primary/20 hover:text-secondary transition-colors">
                                <X size={20} />
                            </button>
                        </div>
                        
                        <div className="p-8 pb-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
                                <div className="md:col-span-2">
                                    <Label>Vehículo de la Flota</Label>
                                    <select name="vehiculoId" required className={InputClass}>
                                        <option value="">SELECCIONE VEHÍCULO...</option>
                                        {vehiculos.map(v => <option key={v.id} value={v.id}>{v.placa} - {v.marca} {v.modelo}</option>)}
                                    </select>
                                </div>

                                <div className="md:col-span-2">
                                    <Label>Plan de Mantenimiento</Label>
                                    <select name="planId" required className={InputClass}>
                                        <option value="">SELECCIONE PLAN...</option>
                                        {planes.map(p => <option key={p.id} value={p.id}>{p.nombre}</option>)}
                                    </select>
                                </div>

                                <div>
                                    <Label>Fecha del Servicio</Label>
                                    <input name="fecha" type="date" required className={InputClass} defaultValue={new Date().toISOString().split('T')[0]} />
                                </div>
                                
                                <div>
                                    <Label>Kilometraje (Odometer)</Label>
                                    <input name="kilometraje" type="number" required placeholder="0" className={InputClass} />
                                </div>

                                <div className="md:col-span-2">
                                    <Label>Observaciones Técnicas</Label>
                                    <textarea name="observaciones" placeholder="DETALLES DEL SERVICIO REALIZADO..." className={cn(InputClass, "h-32 py-4 resize-none")} />
                                </div>
                            </div>
                        </div>

                        <div className="p-8 bg-slate-50 flex justify-end gap-4 border-t border-primary/5">
                            <Button type="button" onClick={closeModal} className="h-14 rounded-none bg-white border border-primary/10 text-slate-900 hover:text-primary hover:bg-slate-100 px-8 text-[11px] font-black uppercase tracking-widest transition-all">
                                Cancelar
                            </Button>
                            <Button type="submit" disabled={isSubmitting} className="h-14 rounded-none bg-slate-900 text-white hover:bg-slate-800 px-10 text-[11px] font-black uppercase tracking-widest gap-2 transition-all shadow-xl">
                                {isSubmitting ? "Procesando..." : "Registrar Servicio"}
                                <Save className="h-4 w-4 text-emerald-400" />
                            </Button>
                        </div>
                    </form>
                )}

                {isPlanModalOpen && (
                    <form onSubmit={handleCreatePlan}>
                        <div className="p-8 border-b border-primary/5 flex justify-between items-center bg-slate-50/50">
                            <div className="flex items-center gap-4">
                                <div className="h-10 w-10 flex items-center justify-center border border-primary/10 bg-white">
                                    <Settings className="h-5 w-5 text-secondary" />
                                </div>
                                <div>
                                    <h3 className="text-sm font-black text-primary uppercase tracking-widest">Configurar Plan</h3>
                                    <p className="text-[10px] font-bold text-primary uppercase tracking-[0.2em]">Preventive Schema Design</p>
                                </div>
                            </div>
                            <button type="button" onClick={closeModal} className="text-primary/20 hover:text-secondary transition-colors">
                                <X size={20} />
                            </button>
                        </div>

                        <div className="p-8 pb-4">
                            <Label>Nombre del Plan Maestro</Label>
                            <input name="nombre" placeholder="EJ: CAMBIO DE ACEITE 5K" required className={InputClass} />
                            
                            <Label>Descripción del Procedimiento</Label>
                            <textarea name="descripcion" placeholder="¿EN QUÉ CONSISTE ESTE MANTENIMIENTO?" className={cn(InputClass, "h-24 py-4 resize-none")} />
                            
                            <div className="grid grid-cols-2 gap-6">
                                <div>
                                    <Label>Frecuencia Operativa</Label>
                                    <select name="frecuencia" className={InputClass}>
                                        <option value="KILOMETROS">POR KILOMETRAJE</option>
                                        <option value="TIEMPO">POR TIEMPO (DÍAS)</option>
                                        <option value="AMBOS">AMBOS FACTORES</option>
                                    </select>
                                </div>
                                <div>
                                    <Label>Valor Umbral</Label>
                                    <input name="valor" type="number" placeholder="EJ: 5000 / 180" className={InputClass} />
                                </div>
                            </div>
                        </div>

                        <div className="p-8 bg-slate-50 flex justify-end gap-4 border-t border-primary/5">
                            <Button type="button" onClick={closeModal} className="h-14 rounded-none bg-white border border-primary/10 text-slate-900 hover:text-primary hover:bg-slate-100 px-8 text-[11px] font-black uppercase tracking-widest transition-all">
                                Cancelar
                            </Button>
                            <Button type="submit" disabled={isSubmitting} className="h-14 rounded-none bg-slate-900 text-white hover:bg-slate-800 px-10 text-[11px] font-black uppercase tracking-widest gap-2 transition-all shadow-xl">
                                <Save className="h-4 w-4 text-emerald-400" />
                                Crear Plan de Flota
                            </Button>
                        </div>
                    </form>
                )}
                
                {isValidationModalOpen && (
                    <form onSubmit={handleValidateAlert}>
                        <div className="p-8 border-b border-primary/5 flex justify-between items-center bg-slate-50/50">
                            <div className="flex items-center gap-4">
                                <div className="h-10 w-10 flex items-center justify-center border border-red-500/10 bg-white">
                                    <ShieldAlert className="h-5 w-5 text-red-600" />
                                </div>
                                <div>
                                    <h3 className="text-sm font-black text-primary uppercase tracking-widest">Validar Alerta Técnica</h3>
                                    <p className="text-[10px] font-bold text-red-500/50 uppercase tracking-[0.2em]">Manual Compliance Override</p>
                                </div>
                            </div>
                            <button type="button" onClick={closeModal} className="text-primary/20 hover:text-secondary transition-colors">
                                <X size={20} />
                            </button>
                        </div>

                        <div className="p-8 pb-4">
                            <div className="mb-8 p-6 bg-red-50 border border-red-500/10 text-red-900 radius-0">
                                <p className="text-xs font-bold uppercase tracking-tight leading-relaxed">
                                    ESTÁ VALIDANDO UNA ALERTA CRÍTICA PARA EL VEHÍCULO: <span className="font-black underline font-mono text-red-600">{selectedAlerta?.placa}</span>
                                </p>
                            </div>
                            
                            <Label>Resolución de Alerta</Label>
                            <select name="accion" required className={InputClass}>
                                <option value="RESUELTO">MANTENIMIENTO REALIZADO (SISTEMA NOMINAL)</option>
                                <option value="REAGENDADO">RE-AGENDAR POR PRIORIDAD OPERATIVA</option>
                                <option value="FALSA_ALARMA">FALSA ALARMA / ERROR DE SENSOR</option>
                            </select>

                            <Label>Notas de Validación y Auditoría</Label>
                            <textarea name="notas" required placeholder="EXPLIQUE EL MOTIVO DEL CIERRE O CAMBIO DE ESTADO..." className={cn(InputClass, "h-32 py-4 resize-none")} />
                        </div>

                        <div className="p-8 bg-slate-50 flex justify-end gap-4 border-t border-primary/5">
                            <Button type="button" onClick={closeModal} className="h-14 rounded-none bg-white border border-primary/10 text-slate-900 hover:text-primary hover:bg-slate-100 px-8 text-[11px] font-black uppercase tracking-widest transition-all">
                                Descartar
                            </Button>
                            <Button type="submit" disabled={isSubmitting} className="h-14 rounded-none bg-red-600 text-white hover:bg-red-700 px-10 text-[11px] font-black uppercase tracking-widest gap-2 transition-all shadow-xl">
                                <CheckCircle2 className="h-4 w-4 text-white" />
                                Confirmar Validación
                            </Button>
                        </div>
                    </form>
                )}

                {isCompleteModalOpen && (
                    <form onSubmit={handleCompleteOrder}>
                        <div className="p-8 border-b border-primary/5 flex justify-between items-center bg-slate-50/50">
                            <div className="flex items-center gap-4">
                                <div className={cn(
                                    "h-10 w-10 flex items-center justify-center border bg-white",
                                    selectedOrden?.estado === 'EN_REVISION' ? "border-amber-500/10" : "border-primary/10"
                                )}>
                                    {selectedOrden?.estado === 'EN_REVISION' ? (
                                        <ShieldAlert className="h-5 w-5 text-amber-500" />
                                    ) : (
                                        <CheckCircle2 className="h-5 w-5 text-secondary" />
                                    )}
                                </div>
                                <div>
                                    <h3 className="text-sm font-black text-primary uppercase tracking-widest">
                                        {selectedOrden?.estado === 'EN_REVISION' ? 'Validar Operación' : 'Gestión de Orden'}
                                    </h3>
                                    <p className={cn(
                                        "text-[10px] font-bold uppercase tracking-[0.2em]",
                                        selectedOrden?.estado === 'EN_REVISION' ? "text-amber-500/70" : "text-primary"
                                    )}>
                                        {selectedOrden?.estado === 'EN_REVISION' ? 'Support Verification' : 'Service Integrity Completion'}
                                    </p>
                                </div>
                            </div>
                            <button type="button" onClick={closeModal} className="text-primary/20 hover:text-secondary transition-colors">
                                <X size={20} />
                            </button>
                        </div>

                        <div className="p-8 pb-4">
                            {selectedOrden?.estado === 'EN_REVISION' && selectedOrden.comprobante && (
                                <div className="mb-6 p-4 bg-amber-50/50 border border-amber-500/20 radius-0">
                                    <Label>Documento Subido por el Usuario</Label>
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs font-mono font-bold text-amber-900">{selectedOrden.comprobante.nombreOriginal}</span>
                                        <a href={selectedOrden.comprobante.rutaAbsoluta} target="_blank" rel="noreferrer" className="text-xs font-black text-secondary uppercase hover:underline">Ver Documento</a>
                                    </div>
                                    {selectedOrden.observacionesConductor && (
                                        <div className="mt-4 pt-4 border-t border-amber-500/10">
                                            <Label>Notas del Usuario</Label>
                                            <p className="text-xs font-medium text-amber-900 italic">"{selectedOrden.observacionesConductor}"</p>
                                        </div>
                                    )}
                                </div>
                            )}
                            <div className="grid grid-cols-2 gap-6">
                                <div>
                                    <Label>Kilometraje Final</Label>
                                    <input name="kilometraje" type="number" required defaultValue={selectedOrden?.kilometrajeReportado || selectedOrden?.vehiculo?.kilometrajeActual || ''} className={InputClass} />
                                </div>
                                <div>
                                    <Label>Inversión Total (Costo)</Label>
                                    <input name="costo" type="number" required defaultValue={selectedOrden?.costoReportado || ''} className={InputClass} placeholder="0" />
                                </div>
                                {selectedOrden?.estado !== 'EN_REVISION' && (
                                    <div className="col-span-2">
                                        <Label>Evidencia / Certificado de Servicio</Label>
                                        <input name="certificado" type="file" required className={cn(InputClass, "pt-4")} />
                                    </div>
                                )}
                                <div className="col-span-2">
                                    <Label>Anomalías Encontradas / Notas Finales</Label>
                                    <textarea name="observaciones" placeholder="DESCRIBA CUALQUIER HALLAZGO ADICIONAL DURANTE EL SERVICIO..." className={cn(InputClass, "h-24 py-4 resize-none")} />
                                </div>
                            </div>
                        </div>

                        <div className="p-8 bg-slate-50 flex justify-between gap-4 border-t border-primary/5">
                            {selectedOrden?.estado === 'EN_REVISION' ? (
                                <Button type="button" onClick={() => {
                                    const motivo = prompt("Motivo de rechazo:");
                                    if (!motivo) return;
                                    const e = { preventDefault: () => {}, target: (() => { const fd = new FormData(); fd.append("motivoRechazo", motivo); return { asMap: () => fd } })() };
                                    // We need to trick handleRejectOrder to use the prompt value.
                                    // Instead of fake event, let's just create a temporary form element in memory
                                    const form = document.createElement("form");
                                    const input = document.createElement("input");
                                    input.name = "motivoRechazo";
                                    input.value = motivo;
                                    form.appendChild(input);
                                    handleRejectOrder({ preventDefault: () => {}, target: form } as any);
                                }} disabled={isSubmitting} className="h-14 rounded-none bg-red-50 text-red-600 hover:bg-red-100 px-8 text-[11px] font-black uppercase tracking-widest transition-all">
                                    Rechazar Documento
                                </Button>
                            ) : (
                                <div />
                            )}
                            <div className="flex gap-4">
                                <Button type="button" onClick={closeModal} className="h-14 rounded-none bg-white border border-primary/10 text-slate-900 hover:text-primary hover:bg-slate-100 px-8 text-[11px] font-black uppercase tracking-widest transition-all">
                                    Cancelar
                                </Button>
                                <Button type="submit" disabled={isSubmitting} className={cn(
                                    "h-14 rounded-none text-white px-10 text-[11px] font-black uppercase tracking-widest gap-2 transition-all shadow-xl",
                                    selectedOrden?.estado === 'EN_REVISION' ? "bg-amber-600 hover:bg-amber-700" : "bg-secondary hover:bg-emerald-600"
                                )}>
                                    <Save className="h-4 w-4 text-white" />
                                    {isSubmitting ? "Procesando..." : selectedOrden?.estado === 'EN_REVISION' ? "Validar Operación" : "Cargar y Validar"}
                                </Button>
                            </div>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
}

