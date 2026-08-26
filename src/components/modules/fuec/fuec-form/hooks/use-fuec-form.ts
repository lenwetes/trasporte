"use client";

import * as React from "react";
import { useForm, useFieldArray, FieldErrors } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { PlanillaFUEC, ResolucionFUEC } from "@prisma/client";
import { FuecInput, fuecSchema } from "@/lib/validations/fuec";
import {
    generateFuec,
    getResolucionesFuec,
    getVehiculoConductor,
} from "@/actions/fuec";

import { FuecContrato } from "../types";
import { toast } from "sonner";

interface UseFuecFormProps {
    isAdmin?: boolean;
    contratos: FuecContrato[];
    costoBaseFuec?: number;
}

export function useFuecForm({ isAdmin, contratos, costoBaseFuec = 10000 }: UseFuecFormProps) {
    const [isSubmitting, setIsSubmitting] = React.useState(false);
    const [numConductores, setNumConductores] = React.useState(1);
    const [safetyComplete, setSafetyComplete] = React.useState(true);
    const [activeResolucion, setActiveResolucion] =
        React.useState<ResolucionFUEC | null>(null);
    const [localContratos, setLocalContratos] =
        React.useState<FuecContrato[]>(contratos);
    const [showSuccess, setShowSuccess] = React.useState(false);
    const [createdFuec, setCreatedFuec] = React.useState<PlanillaFUEC | null>(
        null,
    );
    const [manualNumbering, setManualNumbering] = React.useState(false);

    const form = useForm<FuecInput>({
        resolver: zodResolver(fuecSchema),
        mode: "onSubmit",
        reValidateMode: "onSubmit",
        defaultValues: {
            contratoId: "",
            vehiculoId: "",
            conductor1Id: "",
            rutas: [{ origen: "", destino: "", perimetroUrbano: true }],
            fechaInicio: new Date(),
            fechaFin: new Date(),
            force: false,
            justificacion: "",
            modoPago: "EFECTIVO",
            valorIngreso: costoBaseFuec,
        },
    });

    const { fields, append, remove } = useFieldArray({
        control: form.control,
        name: "rutas",
    });

    const isForceEnabled = form.watch("force");
    const selectedContratoId = form.watch("contratoId");
    const selectedVehiculoId = form.watch("vehiculoId");

    const selectedContrato = localContratos.find(
        (c) => c.id === selectedContratoId,
    );

    React.useEffect(() => {
        if (isAdmin) {
            getResolucionesFuec().then((res) => {
                if (res.success && res.data) {
                    const data = res.data as ResolucionFUEC[];
                    const active = data.find((r) => r.habilitada);
                    if (active) setActiveResolucion(active);
                }
            });
        }
    }, [isAdmin]);

    React.useEffect(() => {
        if (selectedVehiculoId) {
            getVehiculoConductor(selectedVehiculoId).then((res) => {
                if (res.success && res.data) {
                    const driver = res.data as { id: string; nombre: string };
                    form.setValue("conductor1Id", driver.id);
                    toast.info(`Conductor ${driver.nombre} auto-cargado.`);
                }
            });
        }
    }, [selectedVehiculoId, form]);

    React.useEffect(() => {
        if (selectedContrato) {
            form.setValue("objetoViaje", selectedContrato.objeto || "");
        }
    }, [selectedContratoId, form, selectedContrato]);

    async function onSubmit(data: FuecInput) {
        setIsSubmitting(true);
        try {
            const res = await generateFuec(data);
            if (res.success && res.data) {
                setCreatedFuec(res.data as PlanillaFUEC);
                setShowSuccess(true);
            } else {
                toast.error(res.error || "Error al generar FUEC");
            }
        } catch (_error) {
            toast.error("Error inesperado");
        } finally {
            setIsSubmitting(false);
        }
    }

    function onError(errors: FieldErrors<FuecInput>) {
        const errorMessages = Object.values(errors)
            .map((err) => err?.message)
            .filter(Boolean) as string[];
        if (errorMessages.length > 0) {
            errorMessages.forEach((msg) => toast.error(msg));
        }
    }

    return {
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
    };
}
