"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
// removed zodResolver to avoid runtime crash
import { UsuarioCreateSchema, UsuarioCreate } from "@/lib/validations";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createUser } from "@/actions";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FormErrorModal } from "@/components/ui/form-error-modal";
import { Mail, Lock } from "lucide-react";

export function RegisterForm() {
    const [errorMsg, setErrorMsg] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [showErrorModal, setShowErrorModal] = useState(false);
    const router = useRouter();

    const {
        register,
        handleSubmit,
        setError,
        clearErrors,
        formState: { errors },
    } = useForm<UsuarioCreate>({
        defaultValues: {
            rol: "CONDUCTOR",
            tipoDocumento: "CC",
            municipio: "Sincelejo",
        },
    });

    const onSubmit = async (values: UsuarioCreate) => {
        setLoading(true);
        setErrorMsg(null);
        clearErrors();

        // Manual validation
        const validation = UsuarioCreateSchema.safeParse(values);

        if (!validation.success) {
            validation.error.issues.forEach((issue) => {
                const path = issue.path[0] as keyof UsuarioCreate;
                setError(path, {
                    type: "manual",
                    message: issue.message,
                });
            });
            setShowErrorModal(true);
            setLoading(false);
            return;
        }

        const validatedData = validation.data;

        try {
            const result = await createUser(validatedData as UsuarioCreate);
            if (result.success) {
                router.push("/login?registered=true");
            } else {
                setErrorMsg(result.error || "Error al crear la cuenta");
                setShowErrorModal(true);
            }
        } catch (err) {
            console.error(err);
            setErrorMsg("Ocurrió un error inesperado");
            setShowErrorModal(true);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <FormErrorModal
                isOpen={showErrorModal}
                onClose={() => setShowErrorModal(false)}
                errors={
                    errorMsg
                        ? { server: { message: errorMsg }, ...errors }
                        : errors
                }
            />

            <form onSubmit={handleSubmit(onSubmit)}>
                <div>
                    <div>
                        <label>Nombres</label>
                        <div>
                            <span>[USER]</span>
                            <Input
                                {...register("nombres")}
                                
                                placeholder="Juan"
                            />
                        </div>
                        {errors.nombres && (
                            <p>
                                {errors.nombres.message as string}
                            </p>
                        )}
                    </div>
                    <div>
                        <label>Apellidos</label>
                        <Input
                            {...register("apellidos")}
                            
                            placeholder="Pérez"
                        />
                        {errors.apellidos && (
                            <p>
                                {errors.apellidos.message as string}
                            </p>
                        )}
                    </div>
                </div>

                <div>
                    <div>
                        <label>Tipo Doc.</label>
                        <select
                            {...register("tipoDocumento")}
                        >
                            <option value="CC">CC</option>
                            <option value="CE">CE</option>
                            <option value="NIT">NIT</option>
                        </select>
                    </div>
                    <div>
                        <label>
                            Número Doc.
                        </label>
                        <div>
                            <span>[FILETEXT]</span>
                            <Input
                                {...register("numeroDocumento")}
                                
                                placeholder="12345678"
                            />
                        </div>
                        {errors.numeroDocumento && (
                            <p>
                                {errors.numeroDocumento.message as string}
                            </p>
                        )}
                    </div>
                </div>

                <div>
                    <label>
                        Correo Electrónico
                    </label>
                    <div>
                        <Mail />
                        <Input
                            {...register("email")}
                            type="email"
                            
                            placeholder="correo@ejemplo.com"
                        />
                    </div>
                    {errors.email && (
                        <p>
                            {errors.email.message as string}
                        </p>
                    )}
                </div>

                <div>
                    <label>Contraseña</label>
                    <div>
                        <Lock />
                        <Input
                            {...register("password")}
                            type="password"
                            
                            placeholder="••••••••"
                        />
                    </div>
                    {errors.password && (
                        <p>
                            {errors.password.message as string}
                        </p>
                    )}
                </div>

                <div>
                    <label>Municipio</label>
                    <Input
                        {...register("municipio")}
                        
                        placeholder="Sincelejo"
                    />
                    {errors.municipio && (
                        <p>
                            {errors.municipio.message as string}
                        </p>
                    )}
                </div>

                <Button
                    type="submit"
                    disabled={loading}
                >
                    {loading ? (
                        <>
                            <span>[LOADER2]</span>
                            Creando cuenta...
                        </>
                    ) : (
                        <>
                            <span>[USER]</span>
                            Registrarse
                        </>
                    )}
                </Button>

                <div>
                    ¿Ya tienes una cuenta?{" "}
                    <Link
                        href="/login"
                        
                    >
                        Inicia sesión aquí
                    </Link>
                </div>
            </form>
        </>
    );
}
