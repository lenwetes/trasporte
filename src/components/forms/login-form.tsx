"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { LoginSchema, type LoginInput } from "@/lib/validations";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Controller } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Mail, Lock, LogIn } from "lucide-react";

export function LoginForm() {
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const {
        control,
        handleSubmit,
        setError: setFormFieldError,
        clearErrors,
        formState: { errors },
    } = useForm<LoginInput>({
        defaultValues: {
            email: "",
            password: "",
        },
    });

    const onSubmit = async (data: LoginInput): Promise<void> => {
        setLoading(true);
        setError(null);
        clearErrors();

        const validation = LoginSchema.safeParse(data);
        if (!validation.success) {
            validation.error.issues.forEach((issue) => {
                const path = issue.path[0] as keyof LoginInput;
                setFormFieldError(path, {
                    type: "manual",
                    message: issue.message,
                });
            });
            setLoading(false);
            return;
        }

        const validatedData = validation.data;

        try {
            const result = await signIn("credentials", {
                email: validatedData.email,
                password: validatedData.password,
                redirect: false,
            });

            if (result?.error) {
                setError(
                    "Credenciales inválidas. Verifique su email y contraseña.",
                );
            } else {
                router.push("/dashboard");
                router.refresh();
            }
        } catch {
            setError("Ocurrió un error inesperado. Intente de nuevo.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <form
            onSubmit={handleSubmit(onSubmit)}
            
            noValidate
        >
            {/* Campo: Email */}
            <div>
                <label
                    htmlFor="login-email"
                    
                >
                    Correo Corporativo
                </label>
                <div>
                    <div>
                        <Mail />
                    </div>
                    <Controller
                        name="email"
                        control={control}
                        render={({ field }: any) => (
                            <input
                                id="login-email"
                                type="email"
                                placeholder="usuario@coopetraes.com"
                                disabled={loading}
                                
                                value={field.value}
                                onChange={(e) => field.onChange(e.target.value)}
                                onBlur={field.onBlur}
                            />
                        )}
                    />
                </div>
                {errors.email && (
                    <p>
                        {errors.email.message}
                    </p>
                )}
            </div>

            {/* Campo: Contraseña */}
            <div>
                <label
                    htmlFor="login-password"
                    
                >
                    Contraseña Seguridad
                </label>
                <div>
                    <div>
                        <Lock />
                    </div>
                    <Controller
                        name="password"
                        control={control}
                        render={({ field }: any) => (
                            <input
                                id="login-password"
                                type="password"
                                placeholder="••••••••••••"
                                disabled={loading}
                                
                                value={field.value}
                                onChange={(e) => field.onChange(e.target.value)}
                                onBlur={field.onBlur}
                            />
                        )}
                    />
                </div>
                {errors.password && (
                    <p>
                        {errors.password.message}
                    </p>
                )}
            </div>

            {/* Alerta de error general */}
            {error && (
                <div>
                    <span>[ALERTCIRCLE]</span>
                    <p>
                        {error}
                    </p>
                </div>
            )}

            {/* Botón de submit */}
            <div>
                <button
                    type="submit"
                    disabled={loading}
                >
                    {loading ? (
                        <>
                            <span>[LOADER2]</span>
                            <span>Validando...</span>
                        </>
                    ) : (
                        <>
                            <LogIn />
                            <span>Acceder al Portal</span>
                        </>
                    )}
                </button>
            </div>
        </form>
    );
}
