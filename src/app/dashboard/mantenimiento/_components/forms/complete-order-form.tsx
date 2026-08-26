import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function CompleteOrderForm() {
    return (
        <div>
            <div>
                <div>
                    <Label>
                        Fecha de Realización
                    </Label>
                    <Input
                        name="fecha"
                        type="date"
                        required
                        defaultValue={new Date().toISOString().split("T")[0]}
                        
                    />
                </div>
                <div>
                    <Label>
                        Kilometraje Actual
                    </Label>
                    <Input
                        name="kilometraje"
                        type="number"
                        required
                        placeholder="0"
                        
                    />
                </div>
                <div>
                    <Label>
                        Inversión ($)
                    </Label>
                    <Input
                        name="costo"
                        type="number"
                        placeholder="0"
                        required
                        
                    />
                </div>
                <div>
                    <Label>
                        Certificado / Factura
                    </Label>
                    <Input
                        name="certificado"
                        type="file"
                        accept=".pdf,.jpg,.jpeg,.png"
                        
                    />
                </div>
                <div>
                    <Label>
                        Observaciones
                    </Label>
                    <Input
                        name="observaciones"
                        placeholder="Detalles del trabajo realizado..."
                        
                    />
                </div>
            </div>
        </div>
    );
}
