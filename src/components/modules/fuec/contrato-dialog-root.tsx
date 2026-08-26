"use client";

import { useState } from "react";
import { Form } from "@/components/ui/form";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

import { ContratoDialogProps } from "./contrato-dialog/types";
import { useContratoForm } from "./contrato-dialog/use-contrato-form";
import { ContratoDialogHeader } from "./contrato-dialog/contrato-dialog-header";
import { ContratoIdentificationPanel } from "./contrato-dialog/contrato-identification-panel";
import { ContratoClientPanel } from "./contrato-dialog/contrato-client-panel";
import { ContratoObjectPanel } from "./contrato-dialog/contrato-object-panel";
import { ContratoAuthPanel } from "./contrato-dialog/contrato-auth-panel";
import { ContratoDialogFooter } from "./contrato-dialog/contrato-dialog-footer";

export function ContratoDialogRoot({ onCreated, onUpdated, trigger, initialData }: ContratoDialogProps) {
    const [open, setOpen] = useState(false);
    
    const { 
        form, 
        isLoading, 
        fastClients, 
        fastResponsables, 
        onSubmit 
    } = useContratoForm({ onCreated, onUpdated, initialData, open, setOpen });

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {trigger || (
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-accent hover:bg-accent/10 rounded-none border border-accent/20">
                        <Plus className="h-4 w-4" />
                    </Button>
                )}
            </DialogTrigger>
            <DialogContent className="max-w-3xl p-0 border-none rounded-none overflow-hidden shadow-2xl">
                <ContratoDialogHeader isEdit={!!initialData} />

                <div className="p-10 bg-white">
                    <Form {...form}>
                        <form onSubmit={onSubmit} className="space-y-10">
                            <ContratoIdentificationPanel />
                            <ContratoClientPanel fastClients={fastClients} />
                            <ContratoObjectPanel />
                            <ContratoAuthPanel fastResponsables={fastResponsables} />
                            <ContratoDialogFooter isLoading={isLoading} isEdit={!!initialData} />
                        </form>
                    </Form>
                </div>
            </DialogContent>
        </Dialog>
    );
}
