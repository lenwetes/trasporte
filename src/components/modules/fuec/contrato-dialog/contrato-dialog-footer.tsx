"use client";

import { DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2, Briefcase, Plus } from "lucide-react";

interface ContratoDialogFooterProps {
    isLoading: boolean;
    isEdit: boolean;
}

export function ContratoDialogFooter({ isLoading, isEdit }: ContratoDialogFooterProps) {
    return (
        <DialogFooter className="pt-6">
            <Button 
                type="submit" 
                disabled={isLoading}
                className="w-full h-14 bg-primary hover:bg-primary/90 text-white font-black uppercase tracking-[0.2em] rounded-none gap-3 shadow-2xl shadow-primary/20 transition-all active:scale-[0.98]"
            >
                {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : (
                    <>
                        {isEdit ? <Briefcase className="h-5 w-5 text-accent" /> : <Plus className="h-5 w-5 text-accent" />} 
                        GUARDAR TÓPICO OPERATIVO
                    </>
                )}
            </Button>
        </DialogFooter>
    );
}
