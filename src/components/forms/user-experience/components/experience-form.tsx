"use client";

import {Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface ExperienceFormProps {
    newExp: {
        empresa: string;
        cargo: string;
        jefeInmediato: string;
        telefonoJefe: string;
        fechaInicio: string;
        fechaFin: string;
        tiempoLaborado: string;
    };
    setNewExp: (exp: ExperienceFormProps["newExp"]) => void;
    onAdd: () => Promise<void>;
    isLoading: boolean;
}

export function ExperienceForm({
    newExp,
    setNewExp,
    onAdd,
    isLoading,
}: ExperienceFormProps) {
    return (
        <div>
            <div>
                <div>
                    <label>
                        Empresa
                    </label>
                    <Input
                        value={newExp.empresa}
                        onChange={(e) => setNewExp({
                                ...newExp,
                                empresa: e.target.value,
                            })
                        }
                        placeholder="Ej: Transportes del Norte"
                        
                    />
                </div>
                <div>
                    <label>
                        Cargo
                    </label>
                    <Input
                        value={newExp.cargo}
                        onChange={(e) => setNewExp({
                                ...newExp,
                                cargo: e.target.value,
                            })
                        }
                        placeholder="Ej: Conductor de Bus"
                        
                    />
                </div>
                <div>
                    <label>
                        Jefe Inmediato
                    </label>
                    <Input
                        value={newExp.jefeInmediato}
                        onChange={(e) => setNewExp({
                                ...newExp,
                                jefeInmediato: e.target.value,
                            })
                        }
                        placeholder="Nombre del jefe"
                        
                    />
                </div>
                <div>
                    <label>
                        Teléfono Jefe
                    </label>
                    <Input
                        value={newExp.telefonoJefe}
                        onChange={(e) => setNewExp({
                                ...newExp,
                                telefonoJefe: e.target.value,
                            })
                        }
                        placeholder="Teléfono de contacto"
                        
                    />
                </div>
                <div>
                    <label>
                        Fecha Inicio
                    </label>
                    <Input
                        type="date"
                        value={newExp.fechaInicio}
                        onChange={(e) => setNewExp({
                                ...newExp,
                                fechaInicio: e.target.value,
                            })
                        }
                        
                    />
                </div>
                <div>
                    <label>
                        Fecha Fin
                    </label>
                    <Input
                        type="date"
                        value={newExp.fechaFin}
                        onChange={(e) => setNewExp({
                                ...newExp,
                                fechaFin: e.target.value,
                            })
                        }
                        
                    />
                </div>
                <div>
                    <label>
                        Tiempo Laborado (Opcional)
                    </label>
                    <Input
                        value={newExp.tiempoLaborado}
                        onChange={(e) => setNewExp({
                                ...newExp,
                                tiempoLaborado: e.target.value,
                            })
                        }
                        placeholder="Ej: 2 años y 3 meses"
                        
                    />
                </div>
            </div>
            <Button onClick={onAdd}
                disabled={isLoading }>{isLoading  ? (<span>[LOADER2]</span>
                ) : (
                    "Guardar Experiencia"
                )}
            </Button>
        </div>
    );
}
