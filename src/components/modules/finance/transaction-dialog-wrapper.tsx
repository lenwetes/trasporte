/**
 * Wrapper para el diálogo de transacciones contables manuales.
 */
"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { TransactionDialog } from "./transaction-dialog";
import { ArrowRightLeft } from "lucide-react";

export function TransactionDialogWrapper() {
    const [open, setOpen] = useState(false);

    return (
        <>
            <Button
                onClick={() => setOpen(true)}>
                <ArrowRightLeft />
                Nueva Nota Contable
            </Button>

            <TransactionDialog open={open} setOpen={setOpen} />
        </>
    );
}
