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
import {
    ChevronLeft,
    ChevronRight,
    Download,
    ArrowUpCircle,
    ArrowDownCircle,
    FileText,
} from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import type { Transaccion, AsientoContable } from "@prisma/client";

// Tipo extendido para incluir asientos (según return de FinanceService)
type TransactionWithSeats = Transaccion & {
    asientos?: AsientoContable[];
};

interface TransactionsTableProps {
    initialData: TransactionWithSeats[];
    totalPages: number;
    currentPage: number;
}

export function TransactionsTable({
    initialData,
    totalPages,
    currentPage,
}: TransactionsTableProps) {
    const router = useRouter();
    const searchParams = useSearchParams();

    const handlePageChange = (newPage: number) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set("page", newPage.toString());
        router.push(`?${params.toString()}`);
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat("es-CO", {
            style: "currency",
            currency: "COP",
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(amount);
    };

    // Calcular el monto total de la transacción sumando los débitos (o créditos)
    // Asumimos que la suma de débitos = suma de créditos
    const getTransactionAmount = (tx: TransactionWithSeats) => {
        if (!tx.asientos || tx.asientos.length === 0) return 0;
        return tx.asientos.reduce(
            (sum, asiento) => sum + Number(asiento.debito),
            0,
        );
    };

    return (
        <div>
            <div>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Fecha</TableHead>
                            <TableHead>No.</TableHead>
                            <TableHead>Tipo</TableHead>
                            <TableHead>Descripción</TableHead>
                            <TableHead>Monto</TableHead>
                            <TableHead>
                                Acciones
                            </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {initialData.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6}>
                                    No se encontraron transacciones.
                                </TableCell>
                            </TableRow>
                        ) : (
                            initialData.map((tx) => (
                                <TableRow key={tx.id}>
                                    <TableCell>
                                        {new Date(
                                            tx.fecha,
                                        ).toLocaleDateString()}
                                    </TableCell>
                                    <TableCell>
                                        {tx.consecutivo}
                                    </TableCell>
                                    <TableCell>
                                        <div>
                                            {tx.tipo === "INGRESO" && (
                                                <ArrowUpCircle />
                                            )}
                                            {tx.tipo === "EGRESO" && (
                                                <ArrowDownCircle />
                                            )}
                                            {tx.tipo}
                                        </div>
                                    </TableCell>
                                    <TableCell title={tx.descripcion || undefined}>{tx.descripcion}
                                    </TableCell>
                                    <TableCell>
                                        {formatCurrency(
                                            getTransactionAmount(tx),
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        <div>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                title="Ver Detalle">
 <span>[FILETEXT]</span>
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                title="Descargar Soporte">
 <span>[DOWNLOAD]</span>
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Pagination Controls — Elegant Light */}
            <div>
                <p>
                    Página {currentPage} de {totalPages}
                </p>
                <div>
                    <Button
                        variant="outline"
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage <= 1}
                    >
                        <span>[CHEVRONLEFT]</span>
                        Anterior
                    </Button>
                    <Button
                        variant="outline"
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage >= totalPages}
                    >
                        Siguiente
                        <span>[CHEVRONRIGHT]</span>
                    </Button>
                </div>
            </div>
        </div>
    );
}
