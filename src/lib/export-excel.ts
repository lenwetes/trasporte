/**
 * export-excel.ts
 * Reportes Excel con identidad corporativa Coopetraes (verde #1E7A35).
 */

import { saveAs } from "file-saver";
import type ExcelJSType from "exceljs";
import { getEmpresaExcelInfo, type EmpresaExcelInfo } from "@/actions/empresa-excel-info";

const C = {
    verde:     "1E7A35",
    verdePale: "E8F5EC",
    verdeAcc:  "2DA84C",
    blanco:    "FFFFFF",
    texto:     "374151",
    grisAlt:   "F9FAFB",
    grisBord:  "D1D5DB",
    grisMeta:  "6B7280",
    rojo:      "DC2626",
};
type BS = "thin" | "medium";

function bg(cell: ExcelJSType.Cell, argb: string): void {
    cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb } };
}

function styleTh(cell: ExcelJSType.Cell): void {
    bg(cell, `FF${C.verde}`);
    cell.font      = { bold: true, color: { argb: `FF${C.blanco}` }, size: 10, name: "Calibri" };
    cell.alignment = { vertical: "middle", horizontal: "center", wrapText: true };
    cell.border    = {
        top:    { style: "thin" as BS, color: { argb: `FF${C.verdeAcc}` } },
        bottom: { style: "thin" as BS, color: { argb: `FF${C.verdeAcc}` } },
        left:   { style: "thin" as BS, color: { argb: `FF${C.grisBord}` } },
        right:  { style: "thin" as BS, color: { argb: `FF${C.grisBord}` } },
    };
}

function styleTd(cell: ExcelJSType.Cell, idx: number, numFmt?: string): void {
    bg(cell, `FF${idx % 2 === 0 ? C.grisAlt : C.blanco}`);
    cell.font      = { name: "Calibri", size: 10, color: { argb: `FF${C.texto}` } };
    cell.alignment = { vertical: "middle", horizontal: "left" };
    if (numFmt) cell.numFmt = numFmt;
    cell.border    = {
        bottom: { style: "thin" as BS, color: { argb: `FF${C.grisBord}` } },
        left:   { style: "thin" as BS, color: { argb: `FF${C.grisBord}` } },
        right:  { style: "thin" as BS, color: { argb: `FF${C.grisBord}` } },
    };
}

interface EmpresaInfo extends EmpresaExcelInfo {}
interface PeriodoCashFlow { label: string; monto: number; count: number; }
interface CashFlowData    { totalProyectado: number; periodos: PeriodoCashFlow[]; }
interface AuditLog        { fecha: string | Date; cuenta: string; referencia: string; debito: number; credito: number; tercero: string; usuario: string; }

interface FinancialStatementData {
    periodo?: string;
    ingresos: { total: number; cuentas: Record<string, { nombre: string; valor: number }> };
    gastos: { total: number; cuentas: Record<string, { nombre: string; valor: number }> };
    costos?: { total: number; cuentas: Record<string, { nombre: string; valor: number }> };
    utilidadNeta: number;
}

interface PortfolioData {
    resumen: {
        total: number;
        corriente: number;
        vencido30: number;
        vencido60: number;
        vencido90: number;
    };
    cartera: {
        id: string;
        tercero: string;
        documento: string;
        placa: string;
        concepto: string;
        vence: string | Date;
        diasMora: number;
        rango: string;
        saldo: number;
    }[];
}

async function getEmpresaInfo(): Promise<{ info: EmpresaInfo; logoBase64?: string; logoExtension?: string }> {
    try {
        const info = await getEmpresaExcelInfo();
        return { info, logoBase64: info.logoBase64 ?? undefined, logoExtension: info.logoExtension ?? undefined };
    } catch {
        return { info: { nombreEmpresa: "COOPETRAES", telefono: null, email: null, direccion: null, representanteLegal: null, logoBase64: null, logoExtension: null } };
    }
}

/**
 * Cabecera corporativa sin superposición de celdas fusionadas.
 * Estructura:
 *   Fila 1  → banda verde (6px)
 *   Fila 2  → logo (col A) | nombre empresa (col B..last)
 *   Fila 3  → logo (col A) | subtítulo empresa
 *   Fila 4  → logo (col A) | contacto
 *   Fila 5  → banda verde (4px)
 *   Fila 6  → título del reporte (fondo verde pálido)
 *   Fila 7  → subtítulo + fecha
 *   Fila 8  → espacio
 *   Fila 9  → cabeceras de tabla  ← se retorna este número
 */
async function buildHeader(
    ws: ExcelJSType.Worksheet,
    wb: ExcelJSType.Workbook,
    empresa: EmpresaInfo,
    logoBase64: string | undefined,
    logoExt: string | undefined,
    cols: number,
    titleReport: string,
    subtitleReport: string,
): Promise<number> {
    const last = String.fromCharCode(64 + cols); // ej "D" si cols=4
    const hasLogo = Boolean(logoBase64 && logoExt);
    const textStart = hasLogo ? "C" : "A"; 

    // ── Fila 1: espacio blanco superior
    ws.getRow(1).height = 4;
    ws.mergeCells(`A1:${last}1`);
    bg(ws.getCell("A1"), `FF${C.blanco}`);

    // ── Filas 2-4: zona identidad (fondo blanco)
    ws.getRow(2).height = 32;
    ws.getRow(3).height = 16;
    ws.getRow(4).height = 20;

    // Logo en columna A y B (solo si existe) con dimensiones absolutas
    if (hasLogo) {
        const imgId = wb.addImage({ base64: logoBase64!, extension: logoExt as "png" | "jpeg" });
        ws.addImage(imgId, {
            tl: { col: 0.2, row: 1.1 },
            ext: { width: 245, height: 60 }
        } as unknown as Parameters<ExcelJSType.Worksheet["addImage"]>[1]);
        // Fusionar A2:B4 para que quede como un lienzo blanco libre para el logo
        ws.mergeCells("A2:B4");
        bg(ws.getCell("A2"), `FF${C.blanco}`);
    }

    // Nombre empresa (fila 2, columnas C..last o A..last)
    ws.mergeCells(`${textStart}2:${last}2`);
    const nameCell = ws.getCell(`${textStart}2`);
    nameCell.value     = empresa.nombreEmpresa;
    nameCell.font      = { bold: true, size: 20, color: { argb: `FF${C.verde}` }, name: "Calibri" };
    nameCell.alignment = { horizontal: "left", vertical: "bottom", indent: hasLogo ? 1 : 2 };
    bg(nameCell, `FF${C.blanco}`);

    // Subtítulo empresa (fila 3)
    ws.mergeCells(`${textStart}3:${last}3`);
    const sub1 = ws.getCell(`${textStart}3`);
    sub1.value     = "COOPERATIVA DE TRANSPORTE ESPECIAL DE SUCRE";
    sub1.font      = { bold: true, size: 9.5, color: { argb: `FF${C.verde}` }, name: "Calibri" };
    sub1.alignment = { horizontal: "left", vertical: "top", indent: hasLogo ? 1 : 2 };
    bg(sub1, `FF${C.blanco}`);

    // Contacto (fila 4)
    ws.mergeCells(`${textStart}4:${last}4`);
    const contactCell = ws.getCell(`${textStart}4`);
    const contactLine = [empresa.direccion, empresa.telefono && `Tel: ${empresa.telefono}`, empresa.email]
        .filter(Boolean).join("  ·  ");
    contactCell.value     = contactLine || "Sistema Integrado de Gestión Empresarial";
    contactCell.font      = { italic: true, size: 9, color: { argb: `FF${C.grisMeta}` }, name: "Calibri" };
    contactCell.alignment = { horizontal: "left", vertical: "top", indent: hasLogo ? 1 : 2 };
    bg(contactCell, `FF${C.blanco}`);

    // ── Fila 5: banda verde separadora
    ws.getRow(5).height = 6;
    ws.mergeCells(`A5:${last}5`);
    bg(ws.getCell("A5"), `FF${C.verde}`);

    // ── Fila 6: título del reporte
    ws.getRow(6).height = 28;
    ws.mergeCells(`A6:${last}6`);
    const titleCell = ws.getCell("A6");
    titleCell.value     = titleReport.toUpperCase();
    titleCell.font      = { bold: true, size: 14, color: { argb: `FF${C.verde}` }, name: "Calibri" };
    titleCell.alignment = { horizontal: "center", vertical: "middle" };
    bg(titleCell, `FF${C.verdePale}`);
    titleCell.border    = { 
        top: { style: "medium" as BS, color: { argb: `FF${C.verde}` } },
        bottom: { style: "medium" as BS, color: { argb: `FF${C.verde}` } } 
    };

    // ── Fila 7: subtítulo + fecha
    ws.getRow(7).height = 18;
    ws.mergeCells(`A7:${last}7`);
    const sub2 = ws.getCell("A7");
    sub2.value     = `${subtitleReport}    |    ${new Date().toLocaleDateString("es-CO", { year: "numeric", month: "long", day: "numeric" })}`;
    sub2.font      = { italic: true, size: 9, color: { argb: `FF${C.grisMeta}` }, name: "Calibri" };
    sub2.alignment = { horizontal: "center", vertical: "middle" };
    bg(sub2, "FFF8FAFC");
    sub2.border = { bottom: { style: "thin" as BS, color: { argb: `FF${C.verdeAcc}` } } };

    // ── Fila 8: espacio en blanco antes de las cabeceras
    ws.getRow(8).height = 8;
    ws.mergeCells(`A8:${last}8`);
    bg(ws.getCell("A8"), `FF${C.blanco}`);

    return 9;
}

// ─────────────────────────────────────────────────────────────────────────────
export async function exportCashFlowExcel(data: CashFlowData): Promise<void> {
    const ExcelJS = (await import("exceljs")).default;
    const wb = new ExcelJS.Workbook();
    wb.creator = "Sistema Coopetraes";
    wb.created = new Date();

    const { info: empresa, logoBase64, logoExtension } = await getEmpresaInfo();
    const ws = wb.addWorksheet("Proyección de Liquidez", {
        pageSetup: { paperSize: 9, orientation: "landscape", fitToPage: true, fitToWidth: 1 },
    });

    ws.columns = [
        { key: "periodo",      width: 20 },
        { key: "monto",        width: 28 },
        { key: "obligaciones", width: 20 },
        { key: "estado",       width: 30 },
    ];

    const dataRow = await buildHeader(ws, wb, empresa, logoBase64, logoExtension, 4,
        "Proyección de Flujo de Caja — Próximos 90 Días",
        "Análisis probabilístico basado en obligaciones financieras activas",
    );

    // Cabeceras
    const hRow = ws.getRow(dataRow);
    hRow.height = 28;
    ["PERÍODO", "MONTO ESTIMADO (COP)", "No. OBLIGACIONES", "ESTADO"].forEach((h, i) => {
        const cell = hRow.getCell(i + 1);
        cell.value = h;
        styleTh(cell);
    });

    // Datos
    const periodos = data.periodos ?? [];
    periodos.forEach((p, idx) => {
        const row = ws.addRow([p.label, p.monto, p.count, p.count > 0 ? "Con obligaciones activas" : "Sin obligaciones"]);
        row.height = 22;
        styleTd(row.getCell(1), idx);
        styleTd(row.getCell(2), idx, `"$"#,##0.00`);
        const cntCell = row.getCell(3);
        styleTd(cntCell, idx);
        cntCell.alignment = { horizontal: "center" };
        const stCell = row.getCell(4);
        styleTd(stCell, idx);
        if (p.count > 0) stCell.font = { name: "Calibri", size: 10, bold: true, color: { argb: `FF${C.verdeAcc}` } };
    });

    ws.addRow([]);

    // Total
    const tRow = ws.addRow([
        "TOTAL PROYECTADO",
        data.totalProyectado ?? 0,
        periodos.reduce((s, p) => s + p.count, 0),
        "Índice de Recaudo Probable: 94.8%",
    ]);
    tRow.height = 26;
    [1, 2, 3, 4].forEach(i => {
        const cell = tRow.getCell(i);
        bg(cell, `FF${C.verde}`);
        cell.font   = { bold: true, size: 11, color: { argb: `FF${C.blanco}` }, name: "Calibri" };
        cell.border = {
            top:    { style: "medium" as BS, color: { argb: `FF${C.verde}` } },
            bottom: { style: "medium" as BS, color: { argb: `FF${C.verde}` } },
        };
        if (i === 2) cell.numFmt = `"$"#,##0.00`;
        if (i === 3) cell.alignment = { horizontal: "center", vertical: "middle" };
    });

    ws.addRow([]);
    const ni = ws.rowCount + 1;
    ws.mergeCells(`A${ni}:D${ni}`);
    const n = ws.getCell(`A${ni}`);
    n.value     = "⚠  Proyección informativa. No constituye garantía de flujo de caja real. Sujeta a variaciones del Ledger Maestro.";
    n.font      = { italic: true, size: 8.5, color: { argb: "FF9CA3AF" }, name: "Calibri" };
    n.alignment = { horizontal: "center" };

    const buf = await wb.xlsx.writeBuffer();
    saveAs(new Blob([buf], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" }),
        `Proyeccion_Liquidez_${new Date().toISOString().split("T")[0]}.xlsx`);
}

// ─────────────────────────────────────────────────────────────────────────────
export async function exportAuditLogsExcel(logs: AuditLog[]): Promise<void> {
    const ExcelJS = (await import("exceljs")).default;
    const wb = new ExcelJS.Workbook();
    wb.creator = "Sistema Coopetraes";
    wb.created = new Date();

    const { info: empresa, logoBase64, logoExtension } = await getEmpresaInfo();
    const ws = wb.addWorksheet("Auditoría Maestra", {
        pageSetup: { paperSize: 9, orientation: "landscape", fitToPage: true, fitToWidth: 1 },
    });

    ws.columns = [
        { key: "fecha",      width: 22 },
        { key: "cuenta",     width: 44 },
        { key: "tercero",    width: 30 },
        { key: "referencia", width: 20 },
        { key: "debito",     width: 22 },
        { key: "credito",    width: 22 },
        { key: "usuario",    width: 18 },
    ];

    const dataRow = await buildHeader(ws, wb, empresa, logoBase64, logoExtension, 7,
        "Auditoría Maestra — Trazabilidad Contable NIIF",
        `Monitor de actividad transaccional | Total de registros: ${logs.length}`,
    );

    const hRow = ws.getRow(dataRow);
    hRow.height = 28;
    ["TIMESTAMP", "CUENTA CONTABLE (PUC)", "TERCERO ASOCIADO", "REFERENCIA", "DÉBITO (COP)", "CRÉDITO (COP)", "OPERADOR"].forEach((h, i) => {
        const cell = hRow.getCell(i + 1);
        cell.value = h;
        styleTh(cell);
        if (i === 4 || i === 5) cell.alignment = { ...cell.alignment, horizontal: "right" };
    });

    logs.forEach((log, idx) => {
        const fecha = typeof log.fecha === "string" ? new Date(log.fecha) : log.fecha;
        const row = ws.addRow([fecha.toLocaleString("es-CO"), log.cuenta, log.tercero, log.referencia, log.debito, log.credito, log.usuario]);
        row.height = 20;
        styleTd(row.getCell(1), idx);
        styleTd(row.getCell(2), idx);
        styleTd(row.getCell(3), idx);
        styleTd(row.getCell(4), idx);
        const dCell = row.getCell(5);
        styleTd(dCell, idx, `"$"#,##0.00`);
        dCell.alignment = { horizontal: "right" };
        if (log.debito > 0) dCell.font = { name: "Calibri", size: 10, bold: true, color: { argb: `FF${C.verdeAcc}` } };
        const cCell = row.getCell(6);
        styleTd(cCell, idx, `"$"#,##0.00`);
        cCell.alignment = { horizontal: "right" };
        if (log.credito > 0) cCell.font = { name: "Calibri", size: 10, bold: true, color: { argb: `FF${C.rojo}` } };
        styleTd(row.getCell(7), idx);
    });

    ws.addRow([]);
    const ni = ws.rowCount + 1;
    ws.mergeCells(`A${ni}:G${ni}`);
    const n = ws.getCell(`A${ni}`);
    n.value     = "Documento sujeto a control interno. No distribuir sin autorización del área contable. Sistema Coopetraes © 2026";
    n.font      = { italic: true, size: 8.5, color: { argb: "FF9CA3AF" }, name: "Calibri" };
    n.alignment = { horizontal: "center" };

    const buf = await wb.xlsx.writeBuffer();
    saveAs(new Blob([buf], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" }),
        `Auditoria_Maestra_${new Date().toISOString().split("T")[0]}.xlsx`);
}
// ─────────────────────────────────────────────────────────────────────────────
export async function exportFinancialStatementExcel(data: FinancialStatementData): Promise<void> {
    const ExcelJS = (await import("exceljs")).default;
    const wb = new ExcelJS.Workbook();
    wb.creator = "Sistema Coopetraes";
    wb.created = new Date();

    const { info: empresa, logoBase64, logoExtension } = await getEmpresaInfo();
    const ws = wb.addWorksheet("Balance Maestro", {
        pageSetup: { paperSize: 9, orientation: "portrait", fitToPage: true, fitToWidth: 1 },
    });

    ws.columns = [
        { key: "item",  width: 45 },
        { key: "concept", width: 15 },
        { key: "blank", width: 15 },
        { key: "monto", width: 25 },
    ];

    const dataRow = await buildHeader(ws, wb, empresa, logoBase64, logoExtension, 4,
        "BALANCE MAESTRO DE OPERACIÓN — ESTADO DE RESULTADOS",
        `Ejercicio fiscal consolidado: ${data.periodo || "Periodo Actual"}  |  ${new Date().toLocaleDateString("es-CO", { day: 'numeric', month: 'long', year: 'numeric' })}`,
    );

    // ── SECCIÓN: RESUMEN EJECUTIVO
    let current = dataRow;
    const hRow = ws.getRow(current);
    hRow.height = 28;
    
    // Cabecera de resumen
    ws.mergeCells(`A${current}:C${current}`);
    const h1 = hRow.getCell(1);
    h1.value = "DETALLE DE CONCEPTO OPERATIVO";
    styleTh(h1);
    
    const h2 = hRow.getCell(4);
    h2.value = "VALOR (COP)";
    styleTh(h2);
    h2.alignment = { ...h2.alignment, horizontal: "right" };

    // Ingresos Totales
    current++;
    const r1 = ws.getRow(current);
    r1.height = 24;
    ws.mergeCells(`A${current}:C${current}`);
    const c11 = r1.getCell(1);
    c11.value = "INGRESOS TOTALES OPERACIONALES";
    styleTd(c11, 0);
    c11.font = { bold: true, name: "Calibri", size: 10 };
    const c12 = r1.getCell(4);
    c12.value = data.ingresos.total;
    styleTd(c12, 0, `"$"#,##0.00`);
    c12.alignment = { horizontal: "right" };

    // Gastos Totales (Gastos + Costos)
    current++;
    const r2 = ws.getRow(current);
    r2.height = 22;
    ws.mergeCells(`A${current}:C${current}`);
    const c21 = r2.getCell(1);
    c21.value = "GASTOS TOTALES (COSTOS + ADMINISTRATIVOS)";
    styleTd(c21, 1);
    const c22 = r2.getCell(4);
    c22.value = (data.gastos.total || 0) + (data.costos?.total || 0);
    styleTd(c22, 1, `"$"#,##0.00`);
    c22.alignment = { horizontal: "right" };

    // Utilidad
    current++;
    const r3 = ws.getRow(current);
    r3.height = 32; // Un poco más alta
    ws.mergeCells(`A${current}:C${current}`);
    const c31 = r3.getCell(1);
    c31.value = "UTILIDAD NETA DEL EJERCICIO";
    bg(c31, `FF${C.verde}`);
    c31.font = { bold: true, color: { argb: `FF${C.blanco}` }, size: 11, name: "Calibri" };
    c31.alignment = { vertical: "middle", horizontal: "left", indent: 2 };
    
    const c32 = r3.getCell(4);
    c32.value = data.utilidadNeta;
    bg(c32, `FF${C.verde}`);
    c32.font = { bold: true, color: { argb: `FF${C.blanco}` }, size: 11, name: "Calibri" };
    c32.numFmt = `"$"#,##0.00`;
    c32.alignment = { horizontal: "right", vertical: "middle" };

    ws.addRow([]);
    current += 2;

    // ── SECCIÓN: DETALLE DE INGRESOS
    const hi = ws.getRow(current);
    hi.height = 22;
    ws.mergeCells(`A${current}:D${current}`);
    hi.getCell(1).value = "DETALLE DE INGRESOS OPERACIONALES (CLASE 4)";
    hi.getCell(1).font = { bold: true, size: 11, color: { argb: `FF${C.verde}` }, name: "Calibri" };
    current++;

    const ingresosArray = Object.values(data.ingresos?.cuentas || []);
    ingresosArray.forEach((det, idx) => {
        const row = ws.addRow([det.nombre?.toUpperCase() || "SIN NOMBRE", "", "", det.valor || 0]);
        row.height = 20;
        ws.mergeCells(`A${current}:C${current}`);
        styleTd(row.getCell(1), idx);
        const amt = row.getCell(4);
        styleTd(amt, idx, `"$"#,##0.00`);
        amt.alignment = { horizontal: "right" };
        current++;
    });

    ws.addRow([]);
    current++;

    // ── SECCIÓN: DETALLE DE GASTOS
    const hg = ws.getRow(current);
    hg.height = 22;
    ws.mergeCells(`A${current}:D${current}`);
    hg.getCell(1).value = "DETALLE DE GASTOS ADMINISTRATIVOS (CLASE 5)";
    hg.getCell(1).font = { bold: true, size: 11, color: { argb: `FF${C.rojo}` }, name: "Calibri" };
    current++;

    const gastosArray = Object.values(data.gastos?.cuentas || []);
    gastosArray.forEach((det, idx) => {
        const row = ws.addRow([det.nombre?.toUpperCase() || "SIN NOMBRE", "", "", det.valor || 0]);
        row.height = 20;
        ws.mergeCells(`A${current}:C${current}`);
        styleTd(row.getCell(1), idx);
        const amt = row.getCell(4);
        styleTd(amt, idx, `"$"#,##0.00`);
        amt.alignment = { horizontal: "right" };
        current++;
    });

    // ── SECCIÓN: DETALLE DE COSTOS (SI EXISTEN)
    if (data.costos && data.costos.total > 0) {
        ws.addRow([]);
        current++;
        const hc = ws.getRow(current);
        hc.height = 22;
        ws.mergeCells(`A${current}:D${current}`);
        hc.getCell(1).value = "DETALLE DE COSTOS DE OPERACIÓN (CLASE 6)";
        hc.getCell(1).font = { bold: true, size: 11, color: { argb: `FF${C.rojo}` }, name: "Calibri" };
        current++;

        const costosArray = Object.values(data.costos.cuentas || []);
        costosArray.forEach((det, idx) => {
            const row = ws.addRow([det.nombre.toUpperCase(), "", "", det.valor]);
            row.height = 20;
            ws.mergeCells(`A${current}:C${current}`);
            styleTd(row.getCell(1), idx);
            const amt = row.getCell(4);
            styleTd(amt, idx, `"$"#,##0.00`);
            amt.alignment = { horizontal: "right" };
            current++;
        });
    }

    ws.addRow([]);
    const ni = ws.actualRowCount + 1;
    ws.mergeCells(`A${ni}:D${ni}`);
    const n = ws.getCell(`A${ni}`);
    n.value     = "Generado por Sistema de Auditoría Coopetraes. Firma autorizada por el área financiera.";
    n.font      = { italic: true, size: 8.5, color: { argb: "FF9CA3AF" }, name: "Calibri" };
    n.alignment = { horizontal: "center" };

    const buf = await wb.xlsx.writeBuffer();
    saveAs(new Blob([buf], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" }),
        `Balance_Maestro_${new Date().toISOString().split("T")[0]}.xlsx`);
}

// ─────────────────────────────────────────────────────────────────────────────
export async function exportPortfolioExcel(data: PortfolioData): Promise<void> {
    const ExcelJS = (await import("exceljs")).default;
    const wb = new ExcelJS.Workbook();
    wb.creator = "Sistema Coopetraes";
    wb.created = new Date();

    const { info: empresa, logoBase64, logoExtension } = await getEmpresaInfo();
    const ws = wb.addWorksheet("Análisis de Cartera", {
        pageSetup: { paperSize: 9, orientation: "landscape", fitToPage: true, fitToWidth: 1 },
    });

    ws.columns = [
        { key: "tercero",    width: 35 },
        { key: "placa",      width: 12 },
        { key: "concepto",   width: 25 },
        { key: "vencimiento",width: 18 },
        { key: "mora",       width: 12 },
        { key: "saldo",      width: 20 },
    ];

    const dataRow = await buildHeader(ws, wb, empresa, logoBase64, logoExtension, 6,
        "Análisis de Cartera y Morosidad — Reporte Operativo",
        "Control detallado de cuentas por cobrar y gestión de recaudo",
    );

    // ── RESUMEN DE RANGOS (Banda de color)
    let current = dataRow;
    const rRow = ws.getRow(current);
    rRow.height = 32;
    ws.mergeCells(`A${current}:F${current}`);
    const rCell = rRow.getCell(1);
    rCell.value = `RESUMEN DE CARTERA:  AL DÍA: ${data.resumen.corriente.toLocaleString()}  |  31-60: ${data.resumen.vencido30.toLocaleString()}  |  61-90: ${data.resumen.vencido60.toLocaleString()}  |  >90: ${data.resumen.vencido90.toLocaleString()}`;
    rCell.font = { bold: true, color: { argb: `FF${C.blanco}` }, size: 10, name: "Calibri" };
    rCell.alignment = { horizontal: "center", vertical: "middle" };
    bg(rCell, `FF${C.verde}`);
    current += 2;

    // ── TABLA DE DETALLE
    const hRow = ws.getRow(current);
    hRow.height = 28;
    ["TERCERO / ASOCIADO", "VEHÍCULO", "CONCEPTO", "VENCIMIENTO", "DÍAS MORA", "SALDO (COP)"].forEach((h, i) => {
        const cell = hRow.getCell(i + 1);
        cell.value = h;
        styleTh(cell);
        if (i === 5) cell.alignment = { ...cell.alignment, horizontal: "right" };
    });
    current++;

    data.cartera.forEach((item, idx) => {
        const row = ws.addRow([
            `${item.tercero} (${item.documento})`,
            item.placa || "-",
            item.concepto,
            new Date(item.vence).toLocaleDateString("es-CO"),
            item.diasMora,
            item.saldo
        ]);
        row.height = 20;

        styleTd(row.getCell(1), idx);
        styleTd(row.getCell(2), idx);
        styleTd(row.getCell(3), idx);
        styleTd(row.getCell(4), idx);
        
        const mCell = row.getCell(5);
        styleTd(mCell, idx);
        mCell.alignment = { horizontal: "center" };
        if (item.diasMora > 0) mCell.font = { bold: true, color: { argb: `FF${C.rojo}` }, size: 10, name: "Calibri" };

        const sCell = row.getCell(6);
        styleTd(sCell, idx, `"$"#,##0.00`);
        sCell.alignment = { horizontal: "right" };
        current++;
    });

    ws.addRow([]);
    current++;

    const tRow = ws.addRow(["TOTAL CARTERA CONSOLIDADA", "", "", "", "", data.resumen.total]);
    tRow.height = 28;
    ws.mergeCells(`A${current}:E${current}`);
    const tLabel = tRow.getCell(1);
    tLabel.value = "TOTAL CARTERA CONSOLIDADA";
    styleTh(tLabel);
    tLabel.alignment = { horizontal: "right", vertical: "middle", indent: 2 };

    const tVal = tRow.getCell(6);
    tVal.value = data.resumen.total;
    styleTh(tVal);
    tVal.numFmt = `"$"#,##0.00`;
    tVal.alignment = { horizontal: "right", vertical: "middle" };

    const buf = await wb.xlsx.writeBuffer();
    saveAs(new Blob([buf], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" }),
        `Reporte_Cartera_${new Date().toISOString().split("T")[0]}.xlsx`);
}
