import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { HojaVidaFormValues } from "./schema";

import { cn } from "@/lib/utils";

interface EmergencyContactFieldsProps {
    form: UseFormReturn<HojaVidaFormValues>;
}

const inputCls = (error?: string) =>
    cn(
        "w-full h-11 px-3 rounded-none border text-sm bg-white transition-colors uppercase placeholder:normal-case placeholder:text-slate-900",
        "focus:outline-none focus:ring-1",
        error
            ? "border-red-400 focus:border-red-500 focus:ring-red-200"
            : "border-slate-200 focus:border-brand focus:ring-brand/20",
    );

export function EmergencyContactFields({ form }: EmergencyContactFieldsProps) {
    const { formState: { errors } } = form;
    return (
        <div>
            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-900 mb-6 border-b border-slate-100 pb-2">
                Protocolo de Contacto de Emergencia
            </h4>
            <div>
                <FormField
                    control={form.control}
                    name="contactoEmergenciaNombre"
                    render={({ field }: { field: import("react-hook-form").ControllerRenderProps<HojaVidaFormValues, "contactoEmergenciaNombre"> }) => (
                        <FormItem className="space-y-1.5">
                            <FormLabel className="text-[10px] font-black uppercase tracking-widest text-slate-900">
                                Nombre del Contacto
                            </FormLabel>
                            <FormControl>
                                <input
                                    placeholder="Ej: MARÍA RODRÍGUEZ"
                                    className={inputCls(errors.contactoEmergenciaNombre?.message as string)}
                                    {...field}
                                    value={field.value || ""}
                                    onInput={(e) => { e.currentTarget.value = e.currentTarget.value.toUpperCase(); }}
                                />
                            </FormControl>
                            <FormMessage className="text-[10px] uppercase font-bold" />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="contactoEmergenciaTelefono"
                    render={({ field }: { field: import("react-hook-form").ControllerRenderProps<HojaVidaFormValues, "contactoEmergenciaTelefono"> }) => (
                        <FormItem className="space-y-1.5">
                            <FormLabel className="text-[10px] font-black uppercase tracking-widest text-slate-900">
                                Teléfono de Enlace
                            </FormLabel>
                            <FormControl>
                                <input
                                    placeholder="Ej: 300 000 0000"
                                    className={inputCls(errors.contactoEmergenciaTelefono?.message as string)}
                                    {...field}
                                    value={field.value || ""}
                                />
                            </FormControl>
                            <FormMessage className="text-[10px] uppercase font-bold" />
                        </FormItem>
                    )}
                />
            </div>
        </div>
    );
}
