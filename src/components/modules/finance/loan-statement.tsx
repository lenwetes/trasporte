import React from "react";
import { formatCurrency } from "@/lib/utils";
import { Prisma } from "@prisma/client";

interface LoanStatementData {
   id: string;
   estado: string;
   creadoEn: string | Date;
   montoCapital: number | string | Prisma.Decimal;
   tipo: string;
   tasaMensual: number | string | Prisma.Decimal;
   saldoActual: number | string | Prisma.Decimal;
   usuario?: { 
      nombres: string; 
      apellidos: string; 
      numeroDocumento: string | null; 
      telefono: string | null; 
      direccion: string | null; 
   } | null;
   cuotas?: { 
      id: string; 
      numCuota: number; 
      fechaVencimiento: string | Date; 
      valorCapital: number | string | Prisma.Decimal; 
      valorInteres: number | string | Prisma.Decimal; 
      totalCuota: number | string | Prisma.Decimal; 
   }[];
}

interface LoanStatementProps {
   loan: LoanStatementData;
   empresa: {
      nombre: string;
      nit: string;
      direccion: string;
      telefono: string;
      email: string;
      logo?: string;
   };
   watermark?: string;
}

export function LoanStatement({ loan, empresa, watermark }: LoanStatementProps) {
   if (!loan) return null;

   const totalInteres = loan.cuotas?.reduce((acc: number, c) => acc + Number(c.valorInteres || 0), 0) || 0;
   const totalPagar = Number(loan.montoCapital || 0) + totalInteres;

   return (
      <div className="bg-white p-8 sm:p-12 max-w-[850px] mx-auto font-sans text-[#0f172a] border border-[#e2e8f0] print:border-none print:p-0 print:m-0 print:max-w-none w-full shadow-2xl print:shadow-none">
         <style jsx global>{`
            @media print {
               .print-bg-slate-950 { background-color: #0f172a !important; -webkit-print-color-adjust: exact; color-adjust: exact; color: white !important; }
               .print-text-white { color: white !important; }
               .print-border-black { border-color: #000 !important; }
               .print-text-black { color: #000 !important; }
               .print-hidden { display: none !important; }
               * { -webkit-print-color-adjust: exact !important; color-adjust: exact !important; }
               @page { margin: 1.5cm; size: auto; }
               body { background: white !important; }
            }
         `}</style>
         
         {/* HEADER CABECERA BANCO */}
         <div className="flex justify-between items-start border-b-[3px] border-[#0f172a] pb-6 mb-8">
            <div className="flex gap-4">
               {empresa.logo ? (
                  <img src={empresa.logo} alt="Logo" className="h-20 w-auto object-contain" />
               ) : (
                  <div className="bg-[#0f172a] text-white p-2 font-black text-xl italic leading-none">CPT</div>
               )}
               <div className="flex flex-col justify-center">
                  <h1 className="text-xl font-black uppercase tracking-tighter text-[#0f172a] leading-none">{empresa.nombre}</h1>
                  <p className="text-[10px] font-bold text-[#64748b] mt-1 uppercase">NIT: {empresa.nit}</p>
                  <div className="text-[9px] font-semibold text-[#94a3b8] uppercase leading-tight mt-0.5">
                     <p>{empresa.direccion}</p>
                     <p>TEL: {empresa.telefono} — {empresa.email}</p>
                  </div>
               </div>
            </div>
            <div className="text-right flex flex-col items-end">
               <div className="bg-[#0f172a] text-white px-3 py-1 mb-2">
                  <span className="text-[9px] font-black uppercase tracking-widest italic">EXTRACTO DE CARTERA</span>
               </div>
               <p className="text-2xl font-black text-[#0f172a] tabular-nums italic leading-none">#{loan.id.slice(-8).toUpperCase()}</p>
               <p className="text-[9px] font-black text-[#64748b] uppercase mt-2 italic">EMISIÓN: {new Date().toLocaleDateString()}</p>
            </div>
         </div>

         {/* GRID DE INFORMACIÓN PRINCIPAL */}
         <div className="grid grid-cols-12 gap-6 mb-8">
            {/* Beneficiario */}
            <div className="col-span-12 md:col-span-7 bg-white p-6 border border-[#f1f5f9] shadow-sm print:shadow-none">
               <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-[#94a3b8] mb-4 border-b border-[#f1f5f9] pb-2 italic flex items-center gap-2">
                  <span className="w-2 h-2 bg-[#e2e8f0]"></span>
                  01. Datos del Titular de la Obligación
               </h3>
               <div className="grid grid-cols-2 gap-y-4 gap-x-6">
                  <div className="col-span-2">
                     <p className="text-[9px] font-black text-[#94a3b8] uppercase tracking-widest leading-none mb-1.5">Nombre Completo o Razón Social</p>
                     <p className="text-base font-black text-[#0f172a] uppercase italic tracking-tight">{loan.usuario?.nombres} {loan.usuario?.apellidos}</p>
                  </div>
                  <div>
                     <p className="text-[9px] font-black text-[#94a3b8] uppercase tracking-widest leading-none mb-1.5">Documento de Identidad</p>
                     <p className="text-sm font-black text-[#1e293b] tabular-nums">{loan.usuario?.numeroDocumento || "—"}</p>
                  </div>
                  <div>
                     <p className="text-[9px] font-black text-[#94a3b8] uppercase tracking-widest leading-none mb-1.5">Contacto Telefónico</p>
                     <p className="text-sm font-black text-[#1e293b] tabular-nums">{loan.usuario?.telefono || "—"}</p>
                  </div>
                  <div className="col-span-2">
                     <p className="text-[9px] font-black text-[#94a3b8] uppercase tracking-widest leading-none mb-1.5">Dirección Registrada</p>
                     <p className="text-[11px] font-bold text-[#64748b] uppercase italic leading-tight">{loan.usuario?.direccion || "DOMICILIO NO REGISTRADO"}</p>
                  </div>
               </div>
            </div>

            {/* Resumen Económico */}
            <div className="col-span-12 md:col-span-5 flex flex-col justify-center">
               <div className="bg-white p-6 border-2 border-[#0f172a] shadow-[6px_6px_0px_0px_rgba(15,23,42,1)] print:shadow-none transform hover:-translate-x-1 hover:-translate-y-1 transition-transform">
                  <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-[#0f172a] mb-5 border-b border-[#f1f5f9] pb-2 italic">02. Resumen de la Operación</h3>
                  <div className="space-y-4">
                     <div className="flex justify-between items-end">
                        <span className="text-[10px] font-black text-[#94a3b8] uppercase italic tracking-widest">Capital Inicial</span>
                        <span className="text-sm font-black text-[#0f172a] tabular-nums">{formatCurrency(Number(loan.montoCapital || 0))}</span>
                     </div>
                     <div className="flex justify-between items-end">
                        <span className="text-[10px] font-black text-[#94a3b8] uppercase italic tracking-widest">Tasa Pactada</span>
                        <span className="text-sm font-black text-[#0f172a]">{(Number(loan.tasaMensual || 0) * 100).toFixed(2)}% {loan.tipo === "FLEXIBLE_DIARIO" ? "Ef.D" : "Nom.M"}</span>
                     </div>
                     <div className="flex justify-between items-end pt-3 border-t-2 border-[#f8fafc]">
                        <span className="text-[10px] font-black text-[#0f172a] uppercase italic tracking-widest">Total Proyectado</span>
                        <span className="text-lg font-black text-[#10b981] tabular-nums leading-none tracking-tighter">{formatCurrency(totalPagar)}</span>
                     </div>
                  </div>
               </div>
            </div>
         </div>

         {/* BLOQUE DE SALDO ACTUAL - DESIGN MATCH IMAGE 1 */}
         <div className="bg-[#0f172a] text-white p-8 mb-10 flex justify-between items-center relative overflow-hidden shadow-2xl print:bg-[#0f172a] print-bg-slate-950">
            <div className="absolute left-0 top-0 bottom-0 w-2 bg-[#10b981]"></div>
            <div className="z-10 text-white">
               <p className="text-[11px] font-black uppercase tracking-[0.4em] text-[#34d399] italic mb-2">Estado de Cartera Actualizada</p>
               <h2 className="text-3xl sm:text-4xl font-black italic tracking-tighter leading-none pr-4 text-white uppercase">Saldo Vigente en ERP</h2>
            </div>
            <div className="text-right z-10 text-white">
               <p className="text-4xl sm:text-6xl font-black tabular-nums tracking-tighter text-white italic leading-none mb-3">
                  {formatCurrency(Number(loan.saldoActual || 0))}
               </p>
               <div className="inline-block px-4 py-1.5 bg-[#10b981] text-[10px] font-black uppercase text-[#0f172a] tracking-[0.2em] italic shadow-lg">
                  SITUACIÓN: {loan.estado.replace('_', ' ').toUpperCase()}
               </div>
            </div>
            {/* Subtle background decoration */}
            <div className="absolute right-[-20px] top-[-20px] text-white opacity-[0.05] font-black text-8xl italic select-none pointer-events-none">SISTEMA</div>
         </div>

         {/* TABLA DE CUOTAS */}
         <div className="mb-12">
            <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-[#0f172a] mb-6 flex items-center gap-3 italic">
               <span className="w-12 h-[1px] bg-[#e2e8f0]"></span> 
               03. Cronograma de Pagos y Amortización
            </h3>
            <div className="border border-[#e2e8f0] overflow-hidden shadow-sm">
               <table className="w-full border-collapse">
                  <thead>
                     <tr className="bg-[#f8fafc] border-b border-[#e2e8f0]">
                        <th className="p-4 text-[10px] font-black text-[#94a3b8] text-left uppercase italic tracking-widest">Referencia</th>
                        <th className="p-4 text-[10px] font-black text-[#0f172a] text-left uppercase italic tracking-widest">Vencimiento</th>
                        <th className="p-4 text-[10px] font-black text-[#94a3b8] text-right uppercase italic tracking-widest">Amortización</th>
                        <th className="p-4 text-[10px] font-black text-[#0f172a] text-right uppercase italic tracking-widest">Interés</th>
                        <th className="p-4 text-[10px] font-black text-[#0f172a] text-right uppercase italic tracking-[0.1em]">Total Cuota</th>
                     </tr>
                  </thead>
                  <tbody className="divide-y divide-[#f1f5f9]">
                     {loan.cuotas?.map((c) => (
                        <tr key={c.id} className="hover:bg-[#f8fafc] transition-colors group">
                           <td className="px-4 py-3 text-[10px] font-black text-[#cbd5e1] uppercase italic group-hover:text-[#94a3b8]">SEC-{String(c.numCuota).padStart(3, '0')}</td>
                           <td className="px-4 py-3 text-[12px] font-black text-[#0f172a] tabular-nums italic">
                              {new Date(c.fechaVencimiento).toLocaleDateString("es-CO", { day: '2-digit', month: '2-digit', year: 'numeric' })}
                           </td>
                           <td className="px-4 py-3 text-[11px] font-bold text-[#94a3b8] tabular-nums text-right">{formatCurrency(Number(c.valorCapital || 0))}</td>
                           <td className="px-4 py-3 text-[11px] font-black text-[#10b981] tabular-nums text-right">+{formatCurrency(Number(c.valorInteres || 0))}</td>
                           <td className="px-4 py-3 text-[13px] font-black text-[#0f172a] tabular-nums text-right bg-[#f8fafc] group-hover:bg-[#f1f5f9]">
                              {formatCurrency(Number(c.totalCuota || 0))}
                           </td>
                        </tr>
                     ))}
                  </tbody>
               </table>
            </div>
         </div>

         {/* PIE DE PÁGINA LEGAL / FIRMAS */}
         <div className="grid grid-cols-1 sm:grid-cols-2 gap-12 pt-10 border-t-2 border-[#0f172a] mt-16 bg-white relative">
            <div className="space-y-6">
               <h4 className="text-[11px] font-black uppercase text-[#0f172a] italic tracking-widest border-l-4 border-[#0f172a] pl-3">Resumen de Cláusulas Principales</h4>
               <div className="space-y-4">
                  <div className="flex gap-3">
                     <span className="text-[10px] font-black text-[#cbd5e1]">01.</span>
                     <p className="text-[9px] font-bold text-[#64748b] uppercase leading-relaxed tracking-tight">
                        Este documento presta mérito ejecutivo (Art. 422 CGP). El beneficiario reconoce adeudar a {empresa.nombre} la suma principal aquí descrita.
                     </p>
                  </div>
                  <div className="flex gap-3">
                     <span className="text-[10px] font-black text-[#cbd5e1]">02.</span>
                     <p className="text-[9px] font-bold text-[#64748b] uppercase leading-relaxed tracking-tight">
                        El incumplimiento en una cuota faculta a la empresa para declarar el plazo vencido y exigir el pago total de la obligación (Cláusula Aceleratoria).
                     </p>
                  </div>
                  <div className="flex gap-3">
                     <span className="text-[10px] font-black text-[#cbd5e1]">03.</span>
                     <p className="text-[9px] font-bold text-[#64748b] uppercase leading-relaxed tracking-tight">
                        Se autoriza reporte negativo ante centrales de riesgo (Datacrédito/CIFIN) en caso de mora superior a 30 días.
                     </p>
                  </div>
               </div>
            </div>
            <div className="flex flex-col justify-between items-end">
               <div className="w-full max-w-[280px] space-y-16">
                  <div className="border-b-2 border-[#0f172a] text-center pb-3">
                     <p className="text-[11px] font-black uppercase text-[#0f172a] italic tracking-tighter leading-none mb-1">{loan.usuario?.nombres} {loan.usuario?.apellidos}</p>
                     <p className="text-[9px] font-bold uppercase text-[#94a3b8]">Aceptación Beneficiario (C.C. {loan.usuario?.numeroDocumento || '—'})</p>
                  </div>
                  <div className="text-right space-y-1 opacity-50">
                     <p className="text-[8px] font-black text-[#94a3b8] uppercase italic tracking-widest">Generado electrónicamente — Sistema Integrado Coopetraes</p>
                     <p className="text-[8px] font-black text-[#94a3b8] uppercase italic tracking-widest">Código de Seguridad: {loan.id.toUpperCase()}</p>
                     <p className="text-[8px] font-black text-[#94a3b8] uppercase italic tracking-widest">Página 1 de 2</p>
                  </div>
               </div>
            </div>
         </div>

         {/* SEGUNDA PÁGINA: CONTRATO DETALLADO (Para PDF) */}
         <div className="mt-20 pt-20 border-t border-dashed border-[#e2e8f0] break-before-page page-break-before-always print:mt-0 print:pt-0">
            <div className="flex justify-between items-center mb-10 pb-6 border-b-2 border-[#0f172a]">
                <div className="flex items-center gap-3">
                    <div className="bg-[#0f172a] text-white p-2 font-black italic">CPT</div>
                    <h3 className="text-sm font-black uppercase tracking-widest italic">Anexo Contractual Mutuo Comercial</h3>
                </div>
                <p className="text-[10px] font-black text-[#94a3b8] uppercase italic">Doc Ref: #{loan.id.slice(-8).toUpperCase()}</p>
            </div>

            <div className="grid grid-cols-2 gap-10">
               <div className="space-y-6">
                  <div className="space-y-2">
                     <h5 className="text-[11px] font-black uppercase italic text-[#0f172a]">Cláusula 1: Objeto y Monto</h5>
                     <p className="text-[10px] text-[#64748b] leading-relaxed uppercase font-semibold">LA EMPRESA entrega al MUTUARIO la suma de {formatCurrency(Number(loan.montoCapital))}, la cual el MUTUARIO declara haber recibido a entera satisfacción para libre inversión.</p>
                  </div>
                  <div className="space-y-2">
                     <h5 className="text-[11px] font-black uppercase italic text-[#0f172a]">Cláusula 2: Intereses</h5>
                     <p className="text-[10px] text-[#64748b] leading-relaxed uppercase font-semibold">Las partes pactan un interés del {(Number(loan.tasaMensual || 0) * 100).toFixed(2)}% mensual sobre saldos. El interés de mora será el máximo legal permitido por la ley colombiana.</p>
                  </div>
                  <div className="space-y-2">
                     <h5 className="text-[11px] font-black uppercase italic text-[#0f172a]">Cláusula 3: Plazo y Forma de Pago</h5>
                     <p className="text-[10px] text-[#64748b] leading-relaxed uppercase font-semibold">El crédito se amortizará en {loan.cuotas?.length} cuotas según el cronograma anexo. El pago se realizará mediante transferencia o consignación en las cuentas autorizadas por LA EMPRESA.</p>
                  </div>
               </div>
               <div className="space-y-6">
                  <div className="space-y-2">
                     <h5 className="text-[11px] font-black uppercase italic text-[#0f172a]">Cláusula 4: Mérito Ejecutivo</h5>
                     <p className="text-[10px] text-[#64748b] leading-relaxed uppercase font-semibold">El presente documento presta mérito ejecutivo sin necesidad de requerimiento privado ni judicial para la constitución en mora. El MUTUARIO renuncia a cualquier requerimiento.</p>
                  </div>
                  <div className="space-y-2">
                     <h5 className="text-[11px] font-black uppercase italic text-[#0f172a]">Cláusula 5: Aceleración</h5>
                     <p className="text-[10px] text-[#64748b] leading-relaxed uppercase font-semibold">EL MUTUANTE podrá declarar vencido el plazo de la obligación y exigir el pago total si el MUTUARIO incumple el pago de una sola cuota de capital o interés.</p>
                  </div>
                  <div className="space-y-2">
                     <h5 className="text-[11px] font-black uppercase italic text-[#0f172a]">Cláusula 6: Gastos de Cobro</h5>
                     <p className="text-[10px] text-[#64748b] leading-relaxed uppercase font-semibold">Serán de cargo del MUTUARIO todos los gastos y honorarios que se causen por la gestión de cobro prejudicial o judicial de las sumas adeudadas.</p>
                  </div>
               </div>
            </div>

            <div className="mt-20 flex justify-between items-end gap-20">
               <div className="flex-1 border-t-2 border-[#0f172a] pt-3 text-center">
                  <p className="text-[11px] font-black uppercase italic text-[#0f172a]">Representante Legal Coopetraes</p>
                  <p className="text-[9px] font-bold text-[#94a3b8] capitalize">Mutuante</p>
               </div>
               <div className="flex-1 border-t-2 border-[#0f172a] pt-3 text-center">
                  <p className="text-[11px] font-black uppercase italic text-[#0f172a]">{loan.usuario?.nombres} {loan.usuario?.apellidos}</p>
                  <p className="text-[9px] font-bold text-[#94a3b8] capitalize">Mutuario (C.C. {loan.usuario?.numeroDocumento})</p>
               </div>
            </div>
            
            <div className="mt-12 text-center">
                <p className="text-[8px] font-black text-[#cbd5e1] uppercase italic tracking-widest">DOCUMENTO OFICIAL VALIDADOR — PÁGINA 2 de 2</p>
            </div>
         </div>
      </div>
   );
}

