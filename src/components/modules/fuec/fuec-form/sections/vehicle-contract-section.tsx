"use client";

import * as React from "react";
import { UseFormReturn } from "react-hook-form";
import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { FuecInput } from "@/lib/validations/fuec";
import { VehicleSelector } from "../../vehicle-selector";
import { ContractSelector } from "../../contract-selector";
import { FuecVehiculo, FuecContrato } from "../types";
import { Car, Briefcase } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface VehicleContractSectionProps {
    form: UseFormReturn<FuecInput>;
    vehiculos: FuecVehiculo[];
    localContratos: FuecContrato[];
    isAdmin?: boolean;
    onContractCreated: (newContrato: FuecContrato) => void;
}

export function VehicleContractSection({
    form,
    vehiculos,
    localContratos,
    isAdmin,
    onContractCreated,
}: VehicleContractSectionProps) {
    return (
        <Card className="border-primary/10 overflow-hidden">
            <div className="bg-primary/5 px-6 py-3 border-b border-primary/10 flex items-center gap-2">
                <Car className="h-4 w-4 text-slate-900" />
                <h3 className="text-xs font-bold text-primary uppercase tracking-widest">Vehículo y Contrato</h3>
            </div>
            <CardContent className="p-8 space-y-8">
                <FormField
                    control={form.control}
                    name="vehiculoId"
                    render={({ field }: any) => (
                        <FormItem className="space-y-3">
                            <FormLabel className="text-[10px] font-black text-primary/60 uppercase tracking-[0.2em] flex items-center gap-2 pl-1">
                                <Car className="h-4 w-4 text-accent" /> Identificación del Vehículo
                            </FormLabel>
                            <FormControl>
                                <VehicleSelector
                                    vehicles={vehiculos}
                                    value={field.value}
                                    onChange={field.onChange}
                                />
                            </FormControl>
                            <FormMessage className="text-[10px] uppercase font-bold text-red-600 pl-1" />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="contratoId"
                    render={({ field }: any) => (
                        <FormItem className="space-y-3">
                            <FormLabel className="text-[10px] font-black text-primary/60 uppercase tracking-[0.2em] flex items-center gap-2 pl-1">
                                <Briefcase className="h-4 w-4 text-accent" /> Vínculo Contractual de Servicio
                            </FormLabel>
                            <FormControl>
                                <ContractSelector
                                    contracts={localContratos}
                                    value={field.value}
                                    onChange={field.onChange}
                                    isAdmin={isAdmin}
                                    onContractCreated={onContractCreated}
                                />
                            </FormControl>
                            <FormMessage className="text-[10px] uppercase font-bold text-red-600 pl-1" />
                        </FormItem>
                    )}
                />
            </CardContent>
        </Card>
    );
}
