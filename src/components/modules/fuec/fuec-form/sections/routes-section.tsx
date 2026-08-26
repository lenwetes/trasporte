import { COLOMBIAN_CITIES } from "@/lib/constants/cities";
import { Repeat } from "lucide-react";
import { MapPin, Navigation, Trash2, Plus, ArrowRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UseFormReturn, UseFieldArrayReturn } from "react-hook-form";
import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { FuecInput } from "@/lib/validations/fuec";

interface RoutesSectionProps {
    form: UseFormReturn<FuecInput>;
    fields: UseFieldArrayReturn<FuecInput, "rutas">["fields"];
    append: UseFieldArrayReturn<FuecInput, "rutas">["append"];
    remove: UseFieldArrayReturn<FuecInput, "rutas">["remove"];
}

export function RoutesSection({
    form,
    fields,
    append,
    remove,
}: RoutesSectionProps) {
    
    // Función estratégica para generar el retorno automático
    const generarRetorno = () => {
        const lastIndex = fields.length - 1;
        if (lastIndex < 0) return;
        
        const currentOrigen = form.getValues(`rutas.${lastIndex}.origen`);
        const currentDestino = form.getValues(`rutas.${lastIndex}.destino`);

        append({
            origen: currentDestino || "",
            destino: currentOrigen || "",
            perimetroUrbano: true,
        });
    };

    return (
        <Card className="rounded-none border-none overflow-hidden shadow-2xl bg-white">
            <div className="bg-primary/5 px-6 py-3 border-b border-primary/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <div className="h-10 w-10 bg-primary/5 flex items-center justify-center border border-primary/5 shadow-inner">
                        <MapPin className="h-5 w-5 text-slate-900" />
                    </div>
                    <div className="space-y-0.5">
                        <h3 className="text-sm font-bold text-primary uppercase tracking-widest">Enrutamiento Operacional</h3>
                        <p className="text-[9px] font-bold text-slate-900 uppercase tracking-widest leading-none">Corredores Viales y Extractos Jurídicos</p>
                    </div>
                </div>
                <div className="flex items-center gap-3 w-full sm:w-auto">
                    <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="flex-1 sm:flex-initial h-10 text-[10px] font-black text-primary border border-primary/10 hover:bg-primary/5 rounded-none gap-2 px-4 transition-all"
                        onClick={generarRetorno}
                        disabled={fields.length === 0}
                    >
                        <Repeat className="h-4 w-4 text-accent" /> GENERAR RETORNO
                    </Button>
                    <Button
                        type="button"
                        variant="default"
                        size="sm"
                        className="flex-1 sm:flex-initial h-10 text-[10px] font-black bg-accent text-primary hover:bg-accent/90 rounded-none gap-2 px-4 shadow-xl shadow-accent/20"
                        onClick={() => append({
                            origen: "",
                            destino: "",
                            perimetroUrbano: true,
                        })}
                    >
                        <Plus className="h-4 w-4" /> AGREGAR TRAYECTO
                    </Button>
                </div>
            </div>

            <CardContent className="p-8 space-y-10 bg-slate-50/50">
                <datalist id="colombian-cities-list">
                    {COLOMBIAN_CITIES.map((city) => (
                        <option key={city} value={city.toUpperCase()} />
                    ))}
                </datalist>

                {fields.map((field, index) => (
                    <div
                        key={field.id}
                        className="relative p-6 bg-white border border-primary/5 shadow-md hover:shadow-xl transition-all duration-300"
                    >
                        {/* Etiqueta Técnica Lateral */}
                        <div className="absolute -left-1 top-4 bg-primary text-white text-[9px] font-black uppercase tracking-tighter px-3 py-1 shadow-lg flex items-center gap-2">
                             TRAYECTO ESTABLECIDO #{index + 1}
                             <div className="h-1 w-1 bg-accent rounded-full animate-pulse" />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-12 gap-0 mt-8 border border-primary/10 bg-slate-50/50 overflow-hidden transition-all focus-within:border-accent/40 focus-within:shadow-xl group/route">
                            <FormField
                                 control={form.control}
                                 name={`rutas.${index}.origen`}
                                 render={({ field }: any) => (
                                     <FormItem className="sm:col-span-12 lg:col-span-5 space-y-0 border-b lg:border-b-0 lg:border-r border-primary/5">
                                         <FormControl>
                                             <div className="relative group">
                                                 <div className="absolute left-5 top-1/2 -translate-y-1/2 flex items-center gap-2">
                                                     <div className="h-6 w-6 bg-primary/5 flex items-center justify-center rounded-full text-[10px] font-black text-slate-900">O</div>
                                                     <MapPin className="h-5 w-5 text-primary/20 group-focus-within:text-accent transition-colors" />
                                                 </div>
                                                 <Input
                                                     {...field}
                                                     list="colombian-cities-list"
                                                     placeholder="ORIGEN"
                                                     className="h-16 pl-20 pr-4 border-none rounded-none focus-visible:ring-0 font-black text-xs uppercase tracking-widest bg-transparent transition-all"
                                                     onChange={(e) => field.onChange(e.target.value.toUpperCase())}
                                                 />
                                             </div>
                                         </FormControl>
                                     </FormItem>
                                 )}
                             />

                            <div className="hidden lg:flex lg:col-span-2 h-16 items-center justify-center bg-primary/5 text-primary/10 border-r border-primary/5 group-focus-within/route:text-accent group-focus-within/route:bg-accent/5 transition-all">
                                <ArrowRight className="h-5 w-5" />
                            </div>

                            <FormField
                                control={form.control}
                                name={`rutas.${index}.destino`}
                                render={({ field }: any) => (
                                    <FormItem className="sm:col-span-12 lg:col-span-5 space-y-0">
                                        <FormControl>
                                            <div className="relative group">
                                                <div className="absolute left-5 top-1/2 -translate-y-1/2 flex items-center gap-2">
                                                    <div className="h-6 w-6 bg-accent/10 flex items-center justify-center rounded-full text-[10px] font-black text-accent">D</div>
                                                    <Navigation className="h-5 w-5 text-primary/20 group-focus-within:text-accent transition-colors" />
                                                </div>
                                                <Input
                                                    {...field}
                                                    list="colombian-cities-list"
                                                    placeholder="DESTINO"
                                                    className="h-16 pl-20 pr-4 border-none rounded-none focus-visible:ring-0 font-black text-xs uppercase tracking-widest bg-transparent transition-all"
                                                    onChange={(e) => field.onChange(e.target.value.toUpperCase())}
                                                />
                                            </div>
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className="flex justify-between items-center mt-2 px-1">
                            <FormMessage className="text-[10px] uppercase font-bold text-red-600" />
                            <div className="hidden sm:block" /> 
                            <FormMessage className="text-[10px] uppercase font-bold text-red-600" />
                        </div>

                        {fields.length > 1 && (
                            <div className="absolute -top-3 -right-3">
                                <Button
                                    type="button"
                                    variant="destructive"
                                    size="icon"
                                    className="h-8 w-8 rounded-none shadow-xl border border-white/20"
                                    onClick={() => remove(index)}
                                >
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </div>
                        )}
                        
                        {index < fields.length - 1 && (
                            <div className="absolute -bottom-7 left-1/2 -translate-x-1/2 z-10 bg-accent text-primary h-8 w-8 flex items-center justify-center shadow-2xl border-4 border-white rotate-90">
                                <ArrowRight className="h-4 w-4" />
                            </div>
                        )}
                    </div>
                ))}
            </CardContent>
        </Card>
    );
}
