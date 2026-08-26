import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { UseFormReturn } from "react-hook-form";
import { HojaVidaFormValues } from "./schema";

interface ProfessionalProfileFieldsProps {
    form: UseFormReturn<HojaVidaFormValues>;
}

export function ProfessionalProfileFields({
    form,
}: ProfessionalProfileFieldsProps) {
    return (
        <div>
            <FormField
                control={form.control}
                name="perfilProfesional"
                render={({ field }: { field: import("react-hook-form").ControllerRenderProps<HojaVidaFormValues, "perfilProfesional"> }) => (
                    <FormItem>
                        <FormLabel>
                            <span>/</span>{" "}
                            Perfil Profesional Consolidado
                        </FormLabel>
                        <FormControl>
                            <Textarea
                                placeholder="Describa brevemente su trayectoria y habilidades técnicas..."
                                
                                {...field}
                                value={field.value || ""}
                            />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
        </div>
    );
}
