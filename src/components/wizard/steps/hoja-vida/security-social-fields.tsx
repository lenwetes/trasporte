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

interface SecuritySocialFieldsProps {
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

export function SecuritySocialFields({ form }: SecuritySocialFieldsProps) {
    const { formState: { errors } } = form;
    return (
        <>
            <div>
                <FormField
                    control={form.control}
                    name="rh"
                    render={({ field }) => (
                        <FormItem className="space-y-1.5">
                            <FormLabel className="text-[10px] font-black uppercase tracking-widest text-slate-900">
                                Tipo de Sangre (RH)
                            </FormLabel>
                            <FormControl>
                                <input
                                    placeholder="Ej: O+"
                                    className={inputCls(errors.rh?.message as string)}
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
                    name="eps"
                    render={({ field }) => (
                        <FormItem className="space-y-1.5">
                            <FormLabel className="text-[10px] font-black uppercase tracking-widest text-slate-900">
                                Entidad Salud (EPS)
                            </FormLabel>
                            <FormControl>
                                <input
                                    placeholder="Ej: SURA"
                                    className={inputCls(errors.eps?.message as string)}
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
                    name="arl"
                    render={({ field }) => (
                        <FormItem className="space-y-1.5">
                            <FormLabel className="text-[10px] font-black uppercase tracking-widest text-slate-900">
                                Riesgos Lab. (ARL)
                            </FormLabel>
                            <FormControl>
                                <input
                                    placeholder="Ej: POSITIVA"
                                    className={inputCls(errors.arl?.message as string)}
                                    {...field}
                                    value={field.value || ""}
                                    onInput={(e) => { e.currentTarget.value = e.currentTarget.value.toUpperCase(); }}
                                />
                            </FormControl>
                            <FormMessage className="text-[10px] uppercase font-bold" />
                        </FormItem>
                    )}
                />
            </div>

            <div>
                <FormField
                    control={form.control}
                    name="fondoPensiones"
                    render={({ field }) => (
                        <FormItem className="space-y-1.5">
                            <FormLabel className="text-[10px] font-black uppercase tracking-widest text-slate-900">
                                Administradora de Pensiones
                            </FormLabel>
                            <FormControl>
                                <input
                                    placeholder="Ej: PORVENIR"
                                    className={inputCls(errors.fondoPensiones?.message as string)}
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
                    name="fondoCesantias"
                    render={({ field }) => (
                        <FormItem className="space-y-1.5">
                            <FormLabel className="text-[10px] font-black uppercase tracking-widest text-slate-900">
                                Fondo de Cesantías
                            </FormLabel>
                            <FormControl>
                                <input
                                    placeholder="Ej: PROTECCIÓN"
                                    className={inputCls(errors.fondoCesantias?.message as string)}
                                    {...field}
                                    value={field.value || ""}
                                    onInput={(e) => { e.currentTarget.value = e.currentTarget.value.toUpperCase(); }}
                                />
                            </FormControl>
                            <FormMessage className="text-[10px] uppercase font-bold" />
                        </FormItem>
                    )}
                />
            </div>
        </>
    );
}
