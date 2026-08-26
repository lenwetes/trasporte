"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { ConceptoDialog } from "@/components/modules/finance/concepto-dialog";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export function CreateConceptButton() {
    const [open, setOpen] = useState(false);
    const router = useRouter();

    return (
        <>
            <Button
                onClick={() => setOpen(true)}
                className="h-12 px-8 rounded-none bg-slate-900 text-white font-black uppercase text-[10px] tracking-widest flex items-center gap-3 shadow-xl hover:-translate-y-1 transition-all group border-2 border-slate-900"
            >
                <Plus size={16} className="text-secondary group-hover:scale-125 transition-transform" />
                Registrar Nuevo Concepto
            </Button>

            <ConceptoDialog
                open={open}
                setOpen={setOpen}
                initialData={null}
                onSuccess={() => {
                    router.refresh();
                }}
            />
        </>
    );
}
