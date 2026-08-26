"use client";

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { DollarSign } from "lucide-react";
import type { ObligacionFinanciera } from "@prisma/client";

type ReceivablesData = ObligacionFinanciera & {
    usuario: {
        nombres: string;
        apellidos: string;
        numeroDocumento: string | null;
    };
    vehiculo?: {
        placa: string;
    } | null;
};

export function ReceivablesTable({ data }: { data: ReceivablesData[] }) {
    if (data.length === 0) {
        return (
            <div>
                <DollarSign />
                <span>
                    Sin compromisos de pago detectados
                </span>
            </div>
        );
    }

    const formatCurrency = (val: number) => {
        return new Intl.NumberFormat("es-CO", {
            style: "currency",
            currency: "COP",
            maximumFractionDigits: 0,
        }).format(val);
    };

    return (
        <div>
            <table>
                <thead>
                    <tr>
                        <th>
                            Deudor / Documento
                        </th>
                        <th>
                            Concepto Origen
                        </th>
                        <th>
                            Activo Vinculado
                        </th>
                        <th>
                            Exigibilidad
                        </th>
                        <th>
                            Saldo Exigible
                        </th>
                        <th>
                            Acción
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {data.map((item) => (
                        <tr
                            key={item.id}>
 <td>
                                <div>
                                    <span>
                                        {item.usuario.apellidos}{" "}
                                        {item.usuario.nombres}
                                    </span>
                                    <span>
                                        ID:{" "}
                                        {item.usuario.numeroDocumento || "N/A"}
                                    </span>
                                </div>
                            </td>
                            <td>
                                <span>
                                    {item.tipo.replace("_", " ")}
                                </span>
                            </td>
                            <td>
                                <div>
                                    {item.vehiculo?.placa ? (
                                        <div>
                                            <span>
                                                {item.vehiculo.placa}
                                            </span>
                                            <span>
                                                Vehículo Vinculado
                                            </span>
                                        </div>
                                    ) : (
                                        <span>
                                            -
                                        </span>
                                    )}
                                </div>
                            </td>
                            <td>
                                <div>
                                    <span>
                                        {new Date(
                                            item.fechaVence,
                                        ).toLocaleDateString("es-CO", {
                                            day: "2-digit",
                                            month: "short",
                                        })}
                                    </span>
                                    <span>
                                        {new Date(
                                            item.fechaVence,
                                        ).getFullYear()}
                                    </span>
                                </div>
                            </td>
                            <td>
                                <span>
                                    {formatCurrency(
                                        Number(item.saldoPendiente),
                                    )}
                                </span>
                            </td>
                            <td>
                                <Button
                                    asChild
                                    size="sm"
                                    
                                >
                                    <Link
                                        href={`/dashboard/finance/payments?userId=${item.usuarioId}&obligacionId=${item.id}`}>
 <DollarSign />
                                        <span>
                                            Fiscalizar
                                        </span>
                                    </Link>
                                </Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
