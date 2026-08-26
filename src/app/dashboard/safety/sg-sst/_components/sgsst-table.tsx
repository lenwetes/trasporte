/**
 * SG-SST Table - Refactored with Tailwind CSS
 */
import { SGSSTUser } from "./types";
import { SGSSTTableRow } from "./sgsst-table-row";
import { FileStack } from "lucide-react";

interface SGSSTTableProps {
    users: SGSSTUser[];
}

export function SGSSTTable({ users }: SGSSTTableProps) {
    return (
        <div className="bg-white rounded-[2rem] border border-slate-200 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
                <table className="w-full border-collapse text-left">
                    <thead>
                        <tr className="bg-slate-50 border-b border-slate-100">
                            <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">
                                Colaborador
                            </th>
                            <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">
                                Último Examen Médico
                            </th>
                            <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">
                                Control / Vencimiento
                            </th>
                            <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">
                                Delta Días
                            </th>
                            <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">
                                Dotación (EPP)
                            </th>
                            <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">
                                Acciones
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                        {users.map((user) => (
                            <SGSSTTableRow key={user.id} user={user} />
                        ))}
                    </tbody>
                </table>
            </div>

            {users.length === 0 && (
                <div className="py-20 px-10 text-center flex flex-col items-center gap-4">
                    <div className="w-16 h-16 rounded-3xl bg-slate-50 text-slate-300 flex items-center justify-center border border-slate-100 shadow-inner">
                        <FileStack size={32} />
                    </div>
                    <div className="space-y-1">
                        <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight">
                            Sin Registros
                        </h3>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest max-w-[300px] leading-relaxed mx-auto">
                            No se encontraron colaboradores que coincidan con los
                            criterios de búsqueda actuales.
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
}

