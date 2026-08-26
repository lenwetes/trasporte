"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ObligationDialog } from "./obligation-dialog";

export function ObligationDialogWrapper() {
    const [open, setOpen] = useState(false);

    return (
        <>
            <Button
                onClick={() => setOpen(true)}>
                <span>[PLUS]</span>
                Generar Obligación
            </Button>

            <ObligationDialog open={open} setOpen={setOpen} />
        </>
    );
}
