"use client";

import { Button } from "@/components/ui/button";
import { Briefcase, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { ExperienciaLaboral } from "../hooks/use-experience";

interface ExperienceItemProps {
    exp: ExperienciaLaboral;
    onDelete: (id: string) => Promise<void>;
}

export function ExperienceItem({ exp, onDelete }: ExperienceItemProps) {
    return (
        <div>
            <div>
                <div>
                    <Briefcase />
                </div>
                <div>
                    <h4>
                        {exp.cargo}
                    </h4>
                    <p>
                        {exp.empresa} •
                        {exp.fechaInicio
                            ? format(new Date(exp.fechaInicio), " MMM yyyy", {
                                  locale: es,
                              })
                            : " S/F"}{" "}
                        -
                        {exp.fechaFin
                            ? format(new Date(exp.fechaFin), " MMM yyyy", {
                                  locale: es,
                              })
                            : " Actualidad"}
                    </p>
                    {(exp.jefeInmediato || exp.telefonoJefe) && (
                        <p>
                            Ref: {exp.jefeInmediato} - {exp.telefonoJefe}
                        </p>
                    )}
                </div>
            </div>
            <div>
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onDelete(exp.id)}
                >
                    <Trash2 />
                </Button>
            </div>
        </div>
    );
}
