"use client";

import { useState, useMemo } from "react";
import {
    RepositorioArchivo,
    DocumentoVehiculo,
    Vehiculo,
    Usuario,
    DetalleLicencia,
    ExamenMedico,
    Certificado,
    MantenimientoRealizado,
    OrdenServicio,
    Siniestro,
    Transaccion,
    Proveedor,
} from "@prisma/client";
import { isPast, isWithinInterval, addDays } from "date-fns";
import { PreviewArchivo } from "@/components/ui/document-preview-modal";

export type FullFile = RepositorioArchivo & {
    documento?: (DocumentoVehiculo & { vehiculo: Vehiculo }) | null;
    licencia?: (DetalleLicencia & { usuario: Usuario }) | null;
    examenMedico?: (ExamenMedico & { conductor: Usuario }) | null;
    certificado?: (Certificado & { usuario: Usuario }) | null;
    mantenimiento?: (MantenimientoRealizado & { vehiculo: Vehiculo }) | null;
    comprobanteOrden?: (OrdenServicio & { vehiculo: Vehiculo }) | null;
    siniestro?: (Siniestro & { vehiculo: Vehiculo; conductor: Usuario }) | null;
    transaccion?:
        | (Transaccion & {
              tercero: Usuario | null;
              proveedor: Proveedor | null;
          })
        | null;
    fotoPerfilDe?: Usuario | null;
};

export interface UnifiedDocument {
    id: string;
    nombre: string;
    tipo: string;
    tamano: number;
    creadoEn: Date;
    vencimiento?: Date | null;
    entidadNombre: string;
    entidadTipo:
        | "VEHICULO"
        | "CONDUCTOR"
        | "MANTENIMIENTO"
        | "SINIESTRO"
        | "FINANZAS"
        | "OTROS";
    categoriaLabel: string;
    original: FullFile;
}

export function useDocumentBrowser(initialFiles: FullFile[]) {
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    const [activeModule, setActiveModule] = useState("ALL");
    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewArchivo, setPreviewArchivo] = useState<PreviewArchivo | null>(
        null,
    );

    const handlePreview = (doc: UnifiedDocument) => {
        setPreviewArchivo({
            nombreUnico: doc.original.nombreUnico,
            nombreOriginal: doc.nombre,
        });
        setPreviewOpen(true);
    };

    const unifiedDocs = useMemo(() => {
        return initialFiles.map((file) => {
            let entityName = "Sistema";
            let entityType: UnifiedDocument["entidadTipo"] = "OTROS";
            let categoriaLabel = "Archivo General";
            let vencimiento: Date | null = null;

            if (file.documento) {
                entityName = file.documento.vehiculo.placa;
                entityType = "VEHICULO";
                categoriaLabel = file.documento.tipo.replace(/_/g, " ");
                vencimiento = file.documento.fechaVencimiento;
            } else if (file.licencia) {
                entityName = `${file.licencia.usuario.nombres} ${file.licencia.usuario.apellidos}`;
                entityType = "CONDUCTOR";
                categoriaLabel = `Licencia ${file.licencia.categoria}`;
                vencimiento = file.licencia.fechaVencimiento;
            } else if (file.examenMedico) {
                entityName = `${file.examenMedico.conductor.nombres} ${file.examenMedico.conductor.apellidos}`;
                entityType = "CONDUCTOR";
                categoriaLabel = `Examen ${file.examenMedico.tipo}`;
                vencimiento = file.examenMedico.fechaVencimiento;
            } else if (file.certificado) {
                entityName = `${file.certificado.usuario.nombres} ${file.certificado.usuario.apellidos}`;
                entityType = "CONDUCTOR";
                categoriaLabel = `Certificado ${file.certificado.nombre}`;
                vencimiento = file.certificado.fechaVencimiento;
            } else if (file.mantenimiento) {
                entityName = file.mantenimiento.vehiculo.placa;
                entityType = "MANTENIMIENTO";
                categoriaLabel = "Factura Mantenimiento";
            } else if (file.comprobanteOrden) {
                entityName = file.comprobanteOrden.vehiculo.placa;
                entityType = "MANTENIMIENTO";
                categoriaLabel = `Comprobante Orden ${file.comprobanteOrden.codigo}`;
            } else if (file.siniestro) {
                entityName = file.siniestro.vehiculo.placa;
                entityType = "SINIESTRO";
                categoriaLabel = "Evidencia de Siniestro";
            } else if (file.transaccion) {
                entityName =
                    file.transaccion.proveedor?.nombres ||
                    (file.transaccion.tercero
                        ? `${file.transaccion.tercero.nombres} ${file.transaccion.tercero.apellidos}`
                        : "Varios / Caja Menor");
                entityType = "FINANZAS";
                categoriaLabel = `${file.transaccion.tipo} - ${file.transaccion.numeroComprobante || "SN"}`;
            } else if (file.fotoPerfilDe) {
                entityName = `${file.fotoPerfilDe.nombres} ${file.fotoPerfilDe.apellidos}`;
                entityType = "CONDUCTOR";
                categoriaLabel = "Foto de Perfil";
            }

            return {
                id: file.id,
                nombre: file.nombreOriginal,
                tipo: file.tipoMime,
                tamano: file.tamano,
                creadoEn: file.creadoEn,
                vencimiento,
                entidadNombre: entityName,
                entidadTipo: entityType,
                categoriaLabel,
                original: file,
            } as UnifiedDocument;
        });
    }, [initialFiles]);

    const stats = useMemo(() => {
        const now = new Date();
        const soon = addDays(now, 30);
        return {
            totalItems: unifiedDocs.length,
            vencidos: unifiedDocs.filter(
                (d) => d.vencimiento && isPast(new Date(d.vencimiento)),
            ).length,
            proximos: unifiedDocs.filter((d) => {
                if (!d.vencimiento) return false;
                const date = new Date(d.vencimiento);
                return (
                    !isPast(date) &&
                    isWithinInterval(date, { start: now, end: soon })
                );
            }).length,
            mbUsado: (
                unifiedDocs.reduce((acc, curr) => acc + curr.tamano, 0) /
                (1024 * 1024)
            ).toFixed(1),
        };
    }, [unifiedDocs]);

    const filteredDocs = useMemo(() => {
        return unifiedDocs.filter((doc) => {
            const matchesSearch =
                doc.entidadNombre
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase()) ||
                doc.categoriaLabel
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase()) ||
                doc.nombre.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesModule =
                activeModule === "ALL" || doc.entidadTipo === activeModule;
            return matchesSearch && matchesModule;
        });
    }, [unifiedDocs, searchTerm, activeModule]);

    const toggleSelectAll = () => {
        if (selectedIds.length === filteredDocs.length) setSelectedIds([]);
        else setSelectedIds(filteredDocs.map((d) => d.id));
    };

    const toggleSelect = (id: string) => {
        setSelectedIds((prev) =>
            prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
        );
    };

    return {
        searchTerm,
        setSearchTerm,
        selectedIds,
        setSelectedIds,
        activeModule,
        setActiveModule,
        previewOpen,
        setPreviewOpen,
        previewArchivo,
        setPreviewArchivo,
        handlePreview,
        filteredDocs,
        stats,
        toggleSelectAll,
        toggleSelect,
    };
}
