import { ReactNode } from "react";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { Metadata } from "next";
import { FinanceNav } from "@/components/modules/finance/finance-nav";

export const metadata: Metadata = {
    title: "Gestión Financiera - Coopetraes",
    description: "Operaciones de caja menor, recaudos y reportes financieros bajo sistema de auditoría premium.",
};

export default async function FinanceLayout({
    children,
}: {
    children: ReactNode;
}) {
    const session = await auth();

    // Restricted to ADMIN and SECRETARIA
    if (
        !session ||
        (session.user.rol !== "ADMIN" && session.user.rol !== "SECRETARIA")
    ) {
        redirect("/dashboard");
    }

    return (
        <div className="space-y-12">
            {/* Nav Superior Premium - Solid Sharp */}
            <div className="bg-white border border-primary/10 -mx-8 px-8 lg:-mx-12 lg:px-12 py-0 sticky top-0 z-40 backdrop-blur-sm bg-white/90 shadow-sm">
                <FinanceNav />
            </div>

            <main className="animate-in fade-in duration-700">
                {children}
            </main>
        </div>
    );
}
