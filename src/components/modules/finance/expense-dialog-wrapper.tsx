"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ExpenseDialog } from "./expense-dialog";
import { ArrowDownCircle } from "lucide-react";

export function ExpenseDialogWrapper() {
    const [open, setOpen] = useState(false);

    return (
        <>
            <Button
                variant="outline"
                onClick={() => setOpen(true)}
            >
                <ArrowDownCircle />
                Registrar Egreso (Gasto)
            </Button>

            <ExpenseDialog open={open} setOpen={setOpen} />
        </>
    );
}
