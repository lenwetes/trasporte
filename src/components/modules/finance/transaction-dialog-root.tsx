"use client";

import { Dialog, DialogContent } from "@/components/ui/dialog";
import { ProviderDialog } from "./provider-dialog";
import { useTransactionForm } from "./transaction-dialog/use-transaction-form";
import { TransactionDialogHeader } from "./transaction-dialog/transaction-dialog-header";
import { TransactionDetailPanel } from "./transaction-dialog/transaction-detail-panel";
import { TransactionLedgerPanel } from "./transaction-dialog/transaction-ledger-panel";
import { TransactionSummaryFooter } from "./transaction-dialog/transaction-summary-footer";

interface TransactionDialogProps {
    open: boolean;
    setOpen: (open: boolean) => void;
    defaultType?: "INGRESO" | "EGRESO" | "NOTA_CONTABLE";
}

export function TransactionDialogRoot({
    open,
    setOpen,
    defaultType = "NOTA_CONTABLE",
}: TransactionDialogProps) {
    const {
        loading,
        metadata,
        mode,
        setMode,
        terceroType,
        setTerceroType,
        providerDialogOpen,
        setProviderDialogOpen,
        formData,
        setFormData,
        simpleData,
        setSimpleData,
        handleAddAsiento,
        handleRemoveAsiento,
        updateAsiento,
        totalDebito,
        totalCredito,
        isBalanced,
        handleSubmit,
        loadMetadata
    } = useTransactionForm(open, setOpen, defaultType);

    if (!open) return null;

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="max-w-5xl p-0 border-none bg-transparent shadow-none rounded-none flex flex-col max-h-[95vh] animate-in zoom-in-95 duration-300 z-[9999]">
                <div className="bg-white border-2 border-primary shadow-2xl relative overflow-hidden flex flex-col h-full ring-8 ring-primary/5">
                    
                    <TransactionDialogHeader 
                        loading={loading}
                        tipo={formData.tipo}
                        mode={mode}
                        setMode={setMode}
                        isBalanced={isBalanced}
                        setOpen={setOpen}
                    />

                    <div className="overflow-y-auto flex-1 custom-scrollbar bg-slate-50/30">
                        <div className="p-10 space-y-10">
                            <TransactionDetailPanel 
                                formData={formData}
                                setFormData={setFormData}
                                metadata={metadata}
                                terceroType={terceroType}
                                setTerceroType={setTerceroType}
                                setProviderDialogOpen={setProviderDialogOpen}
                            />
                            
                            <TransactionLedgerPanel 
                                mode={mode}
                                metadata={metadata}
                                simpleData={simpleData}
                                setSimpleData={setSimpleData}
                                formData={formData}
                                handleAddAsiento={handleAddAsiento}
                                handleRemoveAsiento={handleRemoveAsiento}
                                updateAsiento={updateAsiento}
                            />
                        </div>

                        <TransactionSummaryFooter 
                            isBalanced={isBalanced}
                            totalDebito={totalDebito}
                            totalCredito={totalCredito}
                            loading={loading}
                            handleSubmit={handleSubmit}
                            setOpen={setOpen}
                        />
                    </div>

                    <ProviderDialog 
                        open={providerDialogOpen}
                        setOpen={setProviderDialogOpen}
                        onSuccess={() => {
                            loadMetadata();
                            setProviderDialogOpen(false);
                        }}
                    />
                </div>
            </DialogContent>
        </Dialog>
    );
}
