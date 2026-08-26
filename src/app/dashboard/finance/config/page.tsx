import { Metadata } from "next";
import { getFinanceConfigAction } from "@/actions/finance";
import { FinanceConfigForm } from "./config-form";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
    title: "Configuración Financiera | Coopetraes",
};

export default async function FinanceConfigPage() {
    const configResult = await getFinanceConfigAction();

    // Default seguro en caso de error
    type ConfigData = {
        nombreEmpresa: string;
        montoCuotaAdministracion: number;
        diaCorteMensual: number;
        porcentajeMoraDiaria: number;
    };

    // Default seguro en caso de error
    const config = (
        configResult.success && configResult.data
            ? configResult.data
            : {
                  nombreEmpresa: "COOPETRAES",
                  montoCuotaAdministracion: 80000,
                  diaCorteMensual: 5,
                  porcentajeMoraDiaria: 0,
              }
    ) as ConfigData;

    return (
        <div>
            <div>
                <h1>
                    Configuración Financiera
                </h1>
                <p>
                    Ajuste los parámetros globales de facturación y
                    contabilidad.
                </p>
            </div>

            <Separator />

            <div>
                <Alert
                    variant="default"
                    
                >
                    <span>[ALERTTRIANGLE]</span>
                    <AlertTitle>¡Atención!</AlertTitle>
                    <AlertDescription>
                        Los cambios realizados aquí afectarán a{" "}
                        <strong>todas las facturaciones futuras</strong>.
                        Asegúrese de notificar a los afiliados antes de
                        modificar la cuota de administración.
                    </AlertDescription>
                </Alert>

                <FinanceConfigForm initialData={config} />

                {/* 
                  Futura expansión: Mapa de Cuentas Contables (UI para editar IDs de cuentas)
                  Por ahora se gestiona automáticamente en el backend.
                */}
            </div>
        </div>
    );
}
