"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Loader2, ShieldAlert, SendHorizonal, ShieldCheck } from "lucide-react";

// Componentes del sub-módulo
import { useFuecForm } from "./fuec-form/hooks/use-fuec-form";
import { SupervisorSection } from "./fuec-form/sections/supervisor-section";
import { VehicleContractSection } from "./fuec-form/sections/vehicle-contract-section";
import { DriversSection } from "./fuec-form/sections/drivers-section";
import { RoutesSection } from "./fuec-form/sections/routes-section";
import { TravelDetailsSection } from "./fuec-form/sections/travel-details-section";
import { NumberingSection } from "./fuec-form/sections/numbering-section";

import { FuecVehiculo, FuecConductor, FuecContrato } from "./fuec-form/types";

// Componentes compartidos del módulo fuec
import { FuecSafetyChecklist } from "./fuec-safety-checklist";
import { FuecSuccessModal } from "./fuec-success-modal";
import { Card, CardContent } from "@/components/ui/card";

interface FuecFormProps {
    vehiculos: FuecVehiculo[];
    conductores: FuecConductor[];
    contratos: FuecContrato[];
    isAdmin?: boolean;
    costoBaseFuec?: number;
}

export function FuecForm({
    vehiculos,
    conductores,
    contratos,
    isAdmin,
    costoBaseFuec = 30000,
}: FuecFormProps) {
    const router = useRouter();

    const {
        form,
        isSubmitting,
        numConductores,
        setNumConductores,
        safetyComplete,
        setSafetyComplete,
        activeResolucion,
        setActiveResolucion,
        localContratos,
        setLocalContratos,
        showSuccess,
        setShowSuccess,
        createdFuec,
        manualNumbering,
        setManualNumbering,
        isForceEnabled,
        selectedContrato,
        fields,
        append,
        remove,
        onSubmit,
        onError,
    } = useFuecForm({ isAdmin, contratos, costoBaseFuec });

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit, onError)} className="space-y-12">
                {/* 1. MODO SUPERVISOR (Si aplica) */}
                {isAdmin && (
                    <SupervisorSection
                        form={form}
                        isAdmin={isAdmin}
                        isForceEnabled={!!isForceEnabled}
                    />
                )}

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                    {/* 1. MAESTRO DE ENRUTAMIENTO (FULL WIDTH) */}
                    <div className="lg:col-span-2">
                        <RoutesSection
                            form={form}
                            fields={fields}
                            append={append}
                            remove={remove}
                        />
                    </div>

                    {/* 2. IDENTIFICACIÓN TÉCNICA (COLUMNA IZQUIERDA) */}
                    <div className="space-y-10">
                        <VehicleContractSection
                            form={form}
                            vehiculos={vehiculos}
                            localContratos={localContratos}
                            isAdmin={isAdmin}
                            onContractCreated={(newContrato) => {
                                setLocalContratos((prev) => [...prev, newContrato]);
                                form.setValue("contratoId", newContrato.id);
                            }}
                        />

                        <NumberingSection
                            form={form}
                            isAdmin={isAdmin}
                            activeResolucion={activeResolucion}
                            setActiveResolucion={setActiveResolucion}
                            manualNumbering={manualNumbering}
                            setManualNumbering={setManualNumbering}
                            contratoId={form.watch("contratoId") || undefined}
                        />
                    </div>

                    {/* 3. PERSONAL OPERATIVO Y SEGURIDAD (COLUMNA DERECHA) */}
                    <div className="space-y-10">
                        <DriversSection
                            form={form}
                            conductores={conductores}
                            numConductores={numConductores}
                            setNumConductores={setNumConductores}
                        />

                        <Card className="rounded-none border-none overflow-hidden shadow-2xl bg-white">
                            <div className="bg-primary/5 px-6 py-3 border-b border-primary/10 flex items-center gap-2">
                                <ShieldCheck className="h-4 w-4 text-slate-900" />
                                <h3 className="text-xs font-bold text-primary uppercase tracking-widest text-slate-900">Verificación Técnica Preventiva</h3>
                            </div>
                            <CardContent className="p-8">
                                <FuecSafetyChecklist onComplete={setSafetyComplete} />
                            </CardContent>
                        </Card>
                    </div>

                    {/* 4. DETALLES OPERATIVOS (FULL WIDTH) */}
                    <div className="lg:col-span-2">
                        <TravelDetailsSection
                            form={form}
                            selectedContrato={selectedContrato}
                        />
                    </div>
                </div>

                {/* BOTÓN DE ACCIÓN PRINCIPAL */}
                <div className="pt-8 border-t border-primary/10 flex justify-end">
                    <Button
                        type="submit"
                        size="lg"
                        disabled={isSubmitting}
                        className={cn(
                            "h-14 px-10 gap-3 font-bold text-base transition-all rounded-none",
                            isForceEnabled 
                                ? "bg-red-600 hover:bg-red-700 shadow-lg shadow-red-200" 
                                : "bg-slate-900 hover:bg-slate-800 shadow-lg shadow-slate-900/10"
                        )}
                    >
                        {isSubmitting ? (
                            <Loader2 className="h-5 w-5 animate-spin" />
                        ) : isForceEnabled ? (
                            <>
                                <ShieldAlert className="h-5 w-5" />
                                EMITIR POR FUERZA ADMINISTRATIVA
                            </>
                        ) : (
                            <>
                                <SendHorizonal className="h-5 w-5" />
                                GENERAR PLANILLA FUEC FIRMADA
                            </>
                        )}
                    </Button>
                </div>
            </form>

            <FuecSuccessModal
                open={showSuccess}
                onClose={() => {
                    setShowSuccess(false);
                    router.push("/dashboard/fuec");
                }}
                fuecData={createdFuec}
                wasForced={!!form.getValues("force")}
                justificacion={form.getValues("justificacion") || undefined}
            />
        </Form>
    );
}
