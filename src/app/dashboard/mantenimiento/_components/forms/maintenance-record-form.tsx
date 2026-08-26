"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PlanMantenimiento, Vehiculo } from "@prisma/client";
import { SearchableSelect } from "./searchable-select";

interface MaintenanceFormProps {
    vehiculos: Vehiculo[];
    planes: PlanMantenimiento[];
}

export function MaintenanceForm({ vehiculos, planes }: MaintenanceFormProps) {
    return (
        <div>
            <div>
                <div>
                    <SearchableSelect
                        label="Vehículo"
                        name="vehiculoId"
                        options={vehiculos.map((v: any) => ({
                            value: v.id,
                            label: v.placa,
                        }))}
                        placeholder="Buscar por placa..."
                        required
                    />
                </div>
                <div>
                    <SearchableSelect
                        label="Plan de Servicio"
                        name="planId"
                        options={planes.map((p) => ({
                            value: p.id,
                            label: p.nombre,
                        }))}
                        placeholder="Buscar servicio..."
                        required
                    />
                </div>
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
                        Inversión (Opcional)
                    </Label>
                    <Input
                        name="costo"
                        type="number"
                        placeholder="$ 0.00"
                        
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
