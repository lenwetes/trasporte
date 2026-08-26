/**
 * Componente para visualizar el árbol de cuentas contables del PUC
 * Muestra la jerarquía completa con información de saldos y estética Elegant Light
 */
"use client";

import { useEffect, useState } from "react";
import {
    ChevronRight,
    ChevronDown,
    Wallet,
    TrendingUp,
    TrendingDown,
    Layers,
    Activity,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { getAccountTreeAction } from "@/actions/finance/accounts.actions";
import type { CuentaContable } from "@prisma/client";

interface CuentaConHijos extends Omit<CuentaContable, "saldo"> {
    hijos: CuentaConHijos[];
    saldo: number | string | any; // allow any here as a last resort for the serialized decimal, but within a controlled type
}

export function AccountTreeView() {
    const [accounts, setAccounts] = useState<CuentaConHijos[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        loadAccounts();
    }, []);

    async function loadAccounts() {
        try {
            setLoading(true);
            const result = await getAccountTreeAction();

            if (result.success && result.data) {
                setAccounts(result.data as CuentaConHijos[]);
            } else {
                setError(result.error || "Error al cargar cuentas");
            }
        } catch (err) {
            setError("Error al cargar cuentas");
        } finally {
            setLoading(false);
        }
    }

    if (loading) {
        return (
            <div>
                <div />
                <div>
                    Sincronizando Maestro P.U.C...
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div>
                <div>
                    Error del Sistema: {error}
                </div>
            </div>
        );
    }

    if (accounts.length === 0) {
        return (
            <div>
                <div>
                    <Layers />
                </div>
                <div>
                    Estructura Contable Vacía
                </div>
            </div>
        );
    }

    return (
        <div>
            {accounts.map((account) => (
                <AccountNode key={account.id} account={account} level={0} />
            ))}
        </div>
    );
}

interface AccountNodeProps {
    account: CuentaConHijos;
    level: number;
}

function AccountNode({ account, level }: AccountNodeProps) {
    const [expanded, setExpanded] = useState(level < 2);
    const hasChildren = account.hijos && account.hijos.length > 0;

    const getTipoColor = (tipo: string) => {
        switch (tipo) {
            case "ACTIVO":
                return "bg-emerald-50 text-emerald-700 border-emerald-100";
            case "PASIVO":
                return "bg-rose-50 text-rose-700 border-rose-100";
            case "PATRIMONIO":
                return "bg-slate-100 text-slate-700 border-slate-200";
            case "INGRESO":
                return "bg-emerald-600 text-white border-emerald-600";
            case "GASTO":
                return "bg-slate-900 text-white border-slate-900";
            default:
                return "bg-slate-50 text-slate-700 border-slate-100";
        }
    };

    const getNaturalezaIcon = (naturaleza: string) => {
        return naturaleza === "DEBITO" ? (
            <TrendingUp />
        ) : (
            <TrendingDown />
        );
    };

    const formatSaldo = (saldo: number | string) => {
        const valor = typeof saldo === "string" ? parseFloat(saldo) : saldo;
        return new Intl.NumberFormat("es-CO", {
            style: "currency",
            currency: "COP",
            minimumFractionDigits: 0,
        }).format(valor);
    };

    const isLeaf = account.permiteMovimiento;

    return (
        <div>
            <div>
                {/* Background accent for level 0 */}
                {level === 0 && (
                    <div />
                )}

                {hasChildren ? (
                    <Button
                        variant="ghost"
                        size="icon"
                        
                        onClick={() => setExpanded(!expanded)}>
                        {expanded ? (
                            <ChevronDown />
                        ) : (
                            <span>[CHEVRONRIGHT]</span>
                        )}
                    </Button>
                ) : (
                    <div>
                        <div />
                    </div>
                )}

                <div>
                    <div>
                        <code>
                            {account.codigo}
                        </code>

                        <span>
                            {account.nombre}
                        </span>
                    </div>

                    <div>
                        {level === 0 && (
                            <Badge
                                variant="outline"
                                
                            >
                                {account.tipo}
                            </Badge>
                        )}

                        <Badge
                            variant="outline"
                            
                        >
                            {getNaturalezaIcon(account.naturaleza)}
                            {account.naturaleza}
                        </Badge>

                        {isLeaf && (
                            <Badge
                                variant="secondary"
                                
                            >
                                <Activity />
                                Movimiento
                            </Badge>
                        )}

                        {account.saldo &&
                            parseFloat(account.saldo.toString()) !== 0 && (
                                <div>
                                    {formatSaldo(account.saldo.toString())}
                                </div>
                            )}
                    </div>
                </div>
            </div>

            {hasChildren && expanded && (
                <div>
                    {account.hijos.map((hijo) => (
                        <AccountNode
                            key={hijo.id}
                            account={hijo}
                            level={level + 1}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
