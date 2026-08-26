// unused import removed
import { UseFormReturn } from "react-hook-form";
import { UsuarioCreate, UsuarioUpdate } from "@/lib/validations";

export interface UsuarioFormSectionProps {
    form: UseFormReturn<UsuarioCreate | UsuarioUpdate>;
    isEdit: boolean;
    initialData?: {
        fotoPerfil?: {
            nombreUnico: string;
        } | null;
    };
    onPhotoSelect?: (file: File | null) => void;
    canManageRoles?: boolean;
}
