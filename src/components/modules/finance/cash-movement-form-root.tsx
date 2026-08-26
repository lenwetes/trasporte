"use client";

import { Form } from "@/components/ui/form";
import { toast } from "sonner";
import { ProviderDialog } from "./provider-dialog";
import type { ProviderData } from "./provider-dialog/use-provider-form";
import { useCashMovementForm } from "./cash-movement/use-cash-movement-form";
import type { CashMovementFormProps } from "./cash-movement/types";

// Extracted Sub-components
import { CashMovementStatusBar } from "./cash-movement/cash-movement-status-bar";
import { CashMovementTypeToggle } from "./cash-movement/cash-movement-type-toggle";
import { CashMovementIdentificationPanel } from "./cash-movement/cash-movement-identification-panel";
import { CashMovementPaymentPanel } from "./cash-movement/cash-movement-payment-panel";
import { CashMovementActionButtons } from "./cash-movement/cash-movement-action-buttons";
import { CashMovementPreviewModal } from "./cash-movement/cash-movement-preview-modal";

export function CashMovementFormRoot({
    conceptosIngreso,
    conceptosEgreso,
}: CashMovementFormProps) {
    const {
        form,
        fields,
        append,
        remove,
        tipoSeleccionado,
        conceptosDisponibles,
        isSubmitting,
        showProviderDialog,
        setShowProviderDialog,
        terceroData,
        setTerceroData,
        metadata,
        previewTransaction,
        showPreviewModal,
        setShowPreviewModal,
        preparePreview,
        onSubmit,
        isSplitMode,
        toggleSplitMode,
        loadMetadata,
        getPenduloValue
    } = useCashMovementForm({ conceptosIngreso, conceptosEgreso });

    return (
        <div className="bg-white border border-primary/10 flex flex-col h-full shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
            <CashMovementStatusBar 
                isSplitMode={isSplitMode} 
                toggleSplitMode={toggleSplitMode} 
            />
            
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-6">
                    <CashMovementTypeToggle />

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 p-10 items-start">
                        <CashMovementIdentificationPanel 
                            conceptosDisponibles={conceptosDisponibles} 
                            terceroData={terceroData} 
                            setTerceroData={setTerceroData} 
                            setShowProviderDialog={setShowProviderDialog} 
                            metadata={metadata} 
                        />
                        
                        <CashMovementPaymentPanel 
                            fields={fields} 
                            isSplitMode={isSplitMode} 
                            append={append} 
                            remove={remove} 
                            getPenduloValue={getPenduloValue} 
                        />
                    </div>

                    <CashMovementActionButtons 
                        tipoSeleccionado={tipoSeleccionado} 
                        isSubmitting={isSubmitting} 
                        preparePreview={preparePreview} 
                    />
                </form>
            </Form>

            <CashMovementPreviewModal 
                showPreviewModal={showPreviewModal} 
                setShowPreviewModal={setShowPreviewModal} 
                previewTransaction={previewTransaction} 
                tipoSeleccionado={tipoSeleccionado} 
            />

            <ProviderDialog 
                open={showProviderDialog} 
                setOpen={setShowProviderDialog} 
                onSuccess={(newProvider?: ProviderData) => {
                    loadMetadata();
                    if (newProvider?.id) {
                        setTerceroData({ 
                            id: newProvider.id, 
                            type: "provider", 
                            nombres: newProvider.nombres ?? "", 
                            documento: newProvider.numeroDocumento || "" 
                        });
                        toast.success("Proveedor vinculado");
                    }
                }} 
            />
        </div>
    );
}
