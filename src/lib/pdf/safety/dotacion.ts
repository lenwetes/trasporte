"use client";

import { toast } from "sonner";
import type { EntregaDotacionPDFData } from "./types";

export const generateEntregaDotacionPDF = async (
    data: EntregaDotacionPDFData,
) => {
    toast.error("Generación de Dotación legacy desactivada (Migrando a @react-pdf/renderer)");
};
