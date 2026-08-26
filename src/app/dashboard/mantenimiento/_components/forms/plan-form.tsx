import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function PlanForm() {
    return (
        <div>
            <div>
                <div>
                    <Label>
                        Nombre del Plan
                    </Label>
                    <Input
                        name="nombre"
                        placeholder="Ej: Cambio de Aceite 10k"
                        required
                        
                    />
                </div>
                <div>
                    <Label>
                        Descripción
                    </Label>
                    <Input
                        name="descripcion"
                        placeholder="Detalles técnicos..."
                        
                    />
                </div>
                <div>
                    <Label>
                        Frecuencia
                    </Label>
                    <select
                        name="frecuencia"
                        
                    >
                        <option value="KILOMETROS">Kilómetros</option>
                        <option value="TIEMPO">Tiempo</option>
                        <option value="AMBOS">
                            Ambos (Lo que ocurra primero)
                        </option>
                    </select>
                </div>
                <div>
                    <Label>
                        Kilómetros de Intervalo
                    </Label>
                    <Input
                        name="kmIntervalo"
                        type="number"
                        placeholder="Ej: 10000"
                        
                    />
                </div>
                <div>
                    <Label>
                        Meses de Intervalo
                    </Label>
                    <Input
                        name="mesesIntervalo"
                        type="number"
                        placeholder="Ej: 6"
                        
                    />
                </div>
            </div>
        </div>
    );
}
