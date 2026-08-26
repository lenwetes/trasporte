"use client";

import { useFormContext } from "react-hook-form";
import { RolSchema } from "@/lib/validations";
import { Lock, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";

function FieldError({ message }: { message?: string }) {
    if (!message) return null;
    return <p className="mt-1 text-[10px] font-black uppercase tracking-widest text-red-500">{message}</p>;
}

function FieldLabel({ children, icon: Icon }: { children: React.ReactNode; icon?: React.ComponentType<{ size?: number; className?: string }> }) {
    return (
        <label className="flex items-center gap-1.5 text-[10px] font-black text-slate-900 uppercase tracking-widest mb-2">
            {Icon && <Icon size={12} className="text-brand" />}
            {children}
        </label>
    );
}

const inputCls = (error?: string) => cn(
    "w-full h-11 px-3 rounded-none border text-sm bg-white transition-colors",
    "focus:outline-none focus:ring-1",
    error
        ? "border-red-400 focus:border-red-500 focus:ring-red-200"
        : "border-slate-200 focus:border-brand focus:ring-brand/20"
);

export function BasicInfoAccountFields() {
    const { register, formState: { errors } } = useFormContext();

    return (
        <div className="space-y-4">
            <div>
                <FieldLabel icon={Lock}>Contraseña de Acceso</FieldLabel>
                <input
                    {...register("password")}
                    type="password"
                    placeholder="mínimo 8 caracteres (opcional)"
                    tabIndex={10}
                    className={inputCls(errors.password?.message as string)}
                    autoComplete="new-password"
                />
                <FieldError message={errors.password?.message as string} />
                <p className="mt-1.5 text-[10px] text-slate-900 font-bold uppercase tracking-wider">
                    Si se omite, se genera una contraseña temporal automáticamente.
                </p>
            </div>

            <div>
                <FieldLabel icon={ShieldCheck}>Nivel de Privilegios *</FieldLabel>
                <select
                    {...register("rol")}
                    tabIndex={11}
                    className={inputCls(errors.rol?.message as string)}
                >
                    {RolSchema.options.map((option) => (
                        <option key={option} value={option}>{option}</option>
                    ))}
                </select>
                <FieldError message={errors.rol?.message as string} />
            </div>
        </div>
    );
}
