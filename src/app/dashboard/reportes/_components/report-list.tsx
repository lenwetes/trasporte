import { ReportCard } from "@/components/reports/report-card";
import { REPORT_TYPES } from "../types";

interface ReportListProps {
    isAdminOrSecretary: boolean;
    vehiculosCount: number;
    loading: string | null;
    onExport: (type: string) => void;
    onGenerate: (type: string) => void;
}

export function ReportList({
    isAdminOrSecretary,
    vehiculosCount,
    loading,
    onExport,
    onGenerate,
}: ReportListProps) {
    const filteredReportTypes = REPORT_TYPES.filter((r) => {
        if (r.adminOnly && !isAdminOrSecretary) return false;
        return true;
    });

    return (
        <div>
            {filteredReportTypes.map((report) => (
                <ReportCard
                    key={report.id}
                    id={report.id}
                    title={report.title}
                    description={report.description}
                    icon={report.icon}
                    color={report.color}
                    loading={loading}
                    onExport={onExport}
                    onGenerate={onGenerate}
                    disabled={!isAdminOrSecretary && vehiculosCount === 0}
                />
            ))}
        </div>
    );
}
