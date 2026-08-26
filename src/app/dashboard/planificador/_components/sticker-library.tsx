"use client";

import React, { useState } from "react";
import { 
  StickyNote, 
  Wrench, 
  Users, 
  ShieldAlert, 
  FileText,
  PlusCircle,
  Move
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export interface StickerTemplate {
    id: string;
    title: string;
    description: string;
    type: "NOTA" | "MANTENIMIENTO" | "OTRO";
    priority: "BAJA" | "MEDIA" | "ALTA";
    icon: React.ReactNode;
}

const TEMPLATES: StickerTemplate[] = [
    {
        id: "tpl-neumaticos",
        title: "Revisión de Neumáticos",
        description: "Inspección de presión y desgaste de toda la flota programada.",
        type: "MANTENIMIENTO",
        priority: "ALTA",
        icon: <Wrench className="h-4 w-4" />
    },
    {
        id: "tpl-socios",
        title: "Reunión de Socios",
        description: "Asamblea mensual para revisión de aportes y beneficios cooperativos.",
        type: "OTRO",
        priority: "MEDIA",
        icon: <Users className="h-4 w-4" />
    },
    {
        id: "tpl-auditoria",
        title: "Auditoría de FUEC",
        description: "Verificación aleatoria de planillas y firmas de conductores.",
        type: "NOTA",
        priority: "ALTA",
        icon: <ShieldAlert className="h-4 w-4" />
    },
    {
        id: "tpl-contable",
        title: "Cierre Contable Mes",
        description: "Preparación de estados financieros y conciliación bancaria.",
        type: "NOTA",
        priority: "MEDIA",
        icon: <FileText className="h-4 w-4" />
    },
    {
        id: "tpl-vencimientos",
        title: "Revisión Documental",
        description: "Chequeo preventivo de SOAT y Tecnomecánica por vencer.",
        type: "NOTA",
        priority: "ALTA",
        icon: <ShieldAlert className="h-4 w-4" />
    }
];

interface StickerLibraryProps {
    onSelect: (tpl: StickerTemplate) => void;
}

export function StickerLibrary({ onSelect }: StickerLibraryProps) {
    return (
        <div className="w-full h-full flex flex-col bg-white border-r border-primary/10">
            <div className="p-6 border-b border-primary/5 bg-slate-50/50">
                <h3 className="text-xs font-black uppercase tracking-[0.2em] text-primary flex items-center gap-2">
                    <PlusCircle className="h-4 w-4 text-accent" />
                    Biblioteca de Stickers
                </h3>
                <p className="text-[9px] font-bold uppercase text-primary mt-1 leading-tight">
                    Selecciona una plantilla para programarla rápidamente
                </p>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
                {TEMPLATES.map((tpl) => (
                    <Card 
                        key={tpl.id}
                        className="rounded-none border-primary/5 p-3 hover:border-accent/30 transition-all cursor-pointer group hover:shadow-lg hover:shadow-accent/5 bg-white relative overflow-hidden active:scale-95 touch-none"
                        draggable
                        onDragStart={(e) => {
                            e.dataTransfer.setData("sticker-template", JSON.stringify(tpl));
                            e.dataTransfer.effectAllowed = "copy";
                            
                            // Visual feedback
                            const dragImage = e.currentTarget.cloneNode(true) as HTMLElement;
                            dragImage.style.width = "200px";
                            dragImage.style.position = "absolute";
                            dragImage.style.top = "-1000px";
                            document.body.appendChild(dragImage);
                            e.dataTransfer.setDragImage(dragImage, 100, 40);
                            setTimeout(() => document.body.removeChild(dragImage), 0);
                        }}
                        onClick={() => onSelect(tpl)}
                    >
                        {/* Indicador de Prioridad sutil */}
                        <div className={cn(
                            "absolute top-0 left-0 w-1 h-full",
                            tpl.priority === "ALTA" ? "bg-red-500" :
                            tpl.priority === "MEDIA" ? "bg-amber-500" : "bg-blue-500"
                        )} />

                        <div className="flex items-start gap-3">
                            <div className="h-8 w-8 shrink-0 flex items-center justify-center bg-slate-100 text-slate-900 group-hover:bg-accent group-hover:text-primary transition-colors">
                                {tpl.icon}
                            </div>
                            <div className="space-y-1 min-w-0">
                                <h4 className="text-[10px] font-black uppercase text-primary leading-none truncate">
                                    {tpl.title}
                                </h4>
                                <p className="text-[9px] font-medium text-primary/50 line-clamp-2 leading-tight">
                                    {tpl.description}
                                </p>
                            </div>
                        </div>

                        <div className="mt-3 flex items-center justify-between border-t border-primary/5 pt-2">
                             <Badge variant="outline" className="text-[8px] font-black uppercase tracking-widest border-primary/5 bg-slate-50 text-slate-900 rounded-none h-4">
                                {tpl.type}
                            </Badge>
                            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                <span className="text-[8px] font-black uppercase text-accent">Programar</span>
                                <Move className="h-2 w-2 text-accent" />
                            </div>
                        </div>
                    </Card>
                ))}

                <div className="pt-8 text-center pb-4">
                     <p className="text-[8px] font-black text-primary/20 uppercase tracking-[0.2em]">Más plantillas próximamente</p>
                </div>
            </div>
        </div>
    );
}
