import { DashboardVehicle } from "@/lib/types";
import { DocumentAlert } from "@/lib/alerts";

export const exportToCSV = (vehiclesToExport: DashboardVehicle[]) => {
    const headers = [
        "Placa",
        "Marca",
        "Propietario",
        "Estado",
        "Documentos Vencidos",
    ];
    const rows = vehiclesToExport.map((v) => [
        v.placa,
        v.marca,
        v.propietario,
        v.alertLevel === "red"
            ? "VENCIDO"
            : v.alertLevel === "yellow"
              ? "POR VENCER"
              : "AL DIA",
        v.alerts
            .filter((a: DocumentAlert) => a.status !== "green")
            .map((a: DocumentAlert) => a.tipo)
            .join("; "),
    ]);

    const csvContent = [headers, ...rows].map((e) => e.join(",")).join("\n");
    const blob = new Blob([csvContent], {
        type: "text/csv;charset=utf-8;",
    });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute(
        "download",
        `reporte_flota_${new Date().toISOString().split("T")[0]}.csv`,
    );
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};
