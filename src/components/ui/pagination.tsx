"use client";

import React from "react";
import { useRouter, useSearchParams } from "next/navigation";

interface PaginationProps {
    currentPage: number;
    totalPages: number;
}

export function Pagination({ currentPage, totalPages }: PaginationProps) {
    const router = useRouter();
    const searchParams = useSearchParams();

    const createPageUrl = (pageNumber: number) => {
        const params = new URLSearchParams(searchParams);
        params.set("page", pageNumber.toString());
        return `?${params.toString()}`;
    };

    if (totalPages <= 1) return null;

    return (
        <div style={{ display: "flex", gap: "5px", alignItems: "center" }}>
            <button
                onClick={() => router.push(createPageUrl(currentPage - 1))}
                disabled={currentPage <= 1}
                style={{
                    padding: "8px 12px",
                    borderRadius: "8px",
                    border: "1px solid #e2e8f0",
                    backgroundColor: currentPage <= 1 ? "#f1f5f9" : "#fff",
                    color: currentPage <= 1 ? "#94a3b8" : "#475569",
                    fontSize: "12px",
                    fontWeight: "bold",
                    cursor: currentPage <= 1 ? "not-allowed" : "pointer"
                }}
            >
                Anterior
            </button>

            <div style={{ display: "flex", gap: "5px" }}>
                {[...Array(totalPages)].map((_, i) => {
                    const page = i + 1;
                    const isActive = page === currentPage;
                    
                    // Solo mostrar algunas páginas si hay muchas
                    if (totalPages > 7) {
                        if (page !== 1 && page !== totalPages && Math.abs(page - currentPage) > 1) {
                            if (page === 2 || page === totalPages - 1) return <span key={page} style={{ padding: "0 5px" }}>...</span>;
                            return null;
                        }
                    }

                    return (
                        <button
                            key={page}
                            onClick={() => router.push(createPageUrl(page))}
                            style={{
                                width: "35px",
                                height: "35px",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                borderRadius: "8px",
                                border: isActive ? "none" : "1px solid #e2e8f0",
                                backgroundColor: isActive ? "#0f172a" : "#fff",
                                color: isActive ? "#fff" : "#475569",
                                fontSize: "12px",
                                fontWeight: "900",
                                cursor: "pointer",
                                transition: "all 0.2s"
                            }}
                        >
                            {page}
                        </button>
                    );
                })}
            </div>

            <button
                onClick={() => router.push(createPageUrl(currentPage + 1))}
                disabled={currentPage >= totalPages}
                style={{
                    padding: "8px 12px",
                    borderRadius: "8px",
                    border: "1px solid #e2e8f0",
                    backgroundColor: currentPage >= totalPages ? "#f1f5f9" : "#fff",
                    color: currentPage >= totalPages ? "#94a3b8" : "#475569",
                    fontSize: "12px",
                    fontWeight: "bold",
                    cursor: currentPage >= totalPages ? "not-allowed" : "pointer"
                }}
            >
                Siguiente
            </button>
        </div>
    );
}
