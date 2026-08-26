"use client";

import * as React from "react";
import { NovedadFormProps } from "../../novedad-form.types";
import { useNovedadForm } from "../../use-novedad-form";
import { NovedadHeader } from "./novedad-header";
import { NovedadResponsibilitySection } from "./novedad-responsibility-section";
import { NovedadDetailsSection } from "./novedad-details-section";
import { NovedadNarrativeSection } from "./novedad-narrative-section";
import { NovedadActionFooter } from "./novedad-action-footer";

export function NovedadFormRoot(props: NovedadFormProps) {
    const {
        form,
        isSubmitting,
        onSubmit,
        mappedVehiculos,
        mappedConductores,
    } = useNovedadForm(props);

    const {
        handleSubmit,
        control,
        register,
        formState: { errors },
    } = form;

    return (
        <form 
            onSubmit={handleSubmit(onSubmit)} 
            className="flex flex-col gap-10 max-w-7xl mx-auto pb-20 animate-in fade-in duration-1000"
        >
            <NovedadHeader />

            <NovedadResponsibilitySection 
                control={control}
                mappedConductores={mappedConductores}
                mappedVehiculos={mappedVehiculos}
                defaultConductorId={props.defaultConductorId}
                errors={errors}
            />

            <NovedadDetailsSection 
                register={register}
                errors={errors}
            />

            <NovedadNarrativeSection 
                register={register}
                errors={errors}
            />

            <NovedadActionFooter 
                isSubmitting={isSubmitting}
            />
        </form>
    );
}
