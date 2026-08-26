"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight, Home } from "lucide-react";

export function Breadcrumbs({ className }: { className?: string }) {
    const pathname = usePathname();
    const paths = pathname.split("/").filter((p) => p);

    return (
        <nav style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "13px", color: "#64748b" }}>
            <Link href="/dashboard" style={{ color: "#64748b", display: "flex", alignItems: "center" }}>
                <Home size={14} />
            </Link>

            {paths.map((path, index) => {
                const isLast = index === paths.length - 1;
                const href = `/${paths.slice(0, index + 1).join("/")}`;

                // Skip 'dashboard' as we already have it
                if (path === "dashboard") return null;

                const label = path.replace(/-/g, " ");

                return (
                    <div key={path} style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <ChevronRight size={14} />
                        {isLast ? (
                            <span style={{ color: "#0f172a", fontWeight: "bold", textTransform: "capitalize" }}>
                                {label}
                            </span>
                        ) : (
                            <Link href={href} style={{ color: "#64748b", textTransform: "capitalize" }}>{label}</Link>
                        )}
                    </div>
                );
            })}
        </nav>
    );
}
