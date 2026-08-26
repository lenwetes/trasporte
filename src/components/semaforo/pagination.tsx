import { Button } from "@/components/ui/button";

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    totalResults: number;
    onPageChange: (page: number) => void;
}

export function Pagination({
    currentPage,
    totalPages,
    totalResults,
    onPageChange,
}: PaginationProps) {
    if (totalPages <= 1) return null;

    return (
        <div>
            <p>
                Página {currentPage} de {totalPages}{" "}
                <span>•</span> Total{" "}
                {totalResults} Resultados
            </p>
            <div style={{ display: "flex", gap: "8px" }}>
                <button
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    style={{ padding: "4px 8px", cursor: currentPage === 1 ? "not-allowed" : "pointer" }}
                >
                    <span>⬅️ Anterior</span>
                </button>
                <button
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    style={{ padding: "4px 8px", cursor: currentPage === totalPages ? "not-allowed" : "pointer" }}
                >
                    <span>Siguiente ➡️</span>
                </button>
            </div>
        </div>
    );
}
