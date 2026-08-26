import { ChevronRight } from "lucide-react";
// [REMOVED IMPORT]
import { Calendar } from "@/components/ui/calendar";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { cn } from "@/lib/utils";
import React from "react";

interface CalendarAlert {
    date: Date;
    placa: string;
    tipo: string;
    status: string;
    vehicleId: string;
}

interface CalendarViewProps {
    calendarAlerts: CalendarAlert[];
    selectedDate: Date | undefined;
    setSelectedDate: (date: Date | undefined) => void;
    currentMonth: Date;
    setCurrentMonth: (date: Date) => void;
}

export function CalendarView({
    calendarAlerts,
    selectedDate,
    setSelectedDate,
    currentMonth,
    setCurrentMonth,
}: CalendarViewProps) {
    const router = useRouter();

    return (
        <div key="calendar" style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: "24px", minHeight: "600px" }}>
            <div style={{ backgroundColor: "white", borderRadius: "24px", padding: "32px", border: "1px solid #e2e8f0", boxShadow: "0 10px 30px -10px rgba(0,0,0,0.05)" }}>
                <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={(date) => setSelectedDate(date)}
                    onMonthChange={setCurrentMonth}
                    classNames={{
                        month: "space-y-8 w-full",
                        caption_label:
                            "text-2xl font-black text-slate-900 tracking-tight",
                        nav_button:
                            "h-12 w-12 rounded-2xl border border-slate-100 hover:bg-emerald-50 hover:text-emerald-700 transition-all",
                        head_cell:
                            "text-slate-900 font-bold text-xs uppercase tracking-[0.2em] pb-6",
                        day: "h-20 w-20 p-1 flex items-center justify-center font-bold text-sm transition-all",
                        day_today:
                            "bg-emerald-50 text-emerald-600 rounded-2xl border-2 border-emerald-100",
                        day_outside: "opacity-10",
                    }}
                    modifiers={{
                        hasAlertRed: (date: Date) => calendarAlerts.some((a) => {
                                const ad = new Date(a.date);
                                return (
                                    ad.getUTCFullYear() ===
                                        date.getFullYear() &&
                                    ad.getUTCMonth() === date.getMonth() &&
                                    ad.getUTCDate() === date.getDate() &&
                                    a.status === "red"
                                );
                            }),
                        hasAlertYellow: (date: Date) =>
                            calendarAlerts.some((a) => {
                                const ad = new Date(a.date);
                                return (
                                    ad.getUTCFullYear() ===
                                        date.getFullYear() &&
                                    ad.getUTCMonth() === date.getMonth() &&
                                    ad.getUTCDate() === date.getDate() &&
                                    a.status === "yellow"
                                );
                            }),
                    }}
                    modifiersClassNames={{
                        hasAlertRed:
                            "bg-rose-50 text-rose-600 rounded-2xl border-2 border-rose-100 shadow-sm shadow-rose-200/20 scale-105",
                        hasAlertYellow:
                            "bg-amber-50 text-amber-600 rounded-2xl border-2 border-amber-100",
                        selected:
                            "bg-emerald-600 !text-white hover:bg-emerald-700 hover:!text-white shadow-lg shadow-emerald-500/20 rounded-2xl scale-110 z-20",
                    }}
                    components={{
                        DayButton: ({
                            day,
                            modifiers,
                            ...props
                        }: {
                            day: { date: Date };
                            modifiers: Record<string, unknown>;
                        } & React.ButtonHTMLAttributes<HTMLButtonElement>) => {
                            const date = day.date;
                            const dayAlerts = calendarAlerts.filter((a) => {
                                const ad = new Date(a.date);
                                return (
                                    ad.getUTCFullYear() ===
                                        date.getFullYear() &&
                                    ad.getUTCMonth() === date.getMonth() &&
                                    ad.getUTCDate() === date.getDate()
                                );
                            });

                            return (
                                <button
                                    {...props}
                                    style={{
                                        position: "relative",
                                        width: "100%",
                                        height: "100%",
                                        display: "flex",
                                        flexDirection: "column",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        gap: "4px"
                                    }}
                                >
                                    <span style={{ fontSize: "16px", fontWeight: "800" }}>
                                        {day.date.getDate()}
                                    </span>

                                    {dayAlerts.length > 0 && (
                                        <div style={{ display: "flex", gap: "2px" }}>
                                            {dayAlerts
                                                .slice(0, 3)
                                                .map((alert, i) => (
                                                    <div
                                                        key={i}
                                                        style={{
                                                            width: "4px",
                                                            height: "4px",
                                                            borderRadius: "50%",
                                                            backgroundColor: alert.status === "red" ? "#ef4444" : "#f59e0b"
                                                        }}
                                                    />
                                                ))}
                                        </div>
                                    )}
                                    {dayAlerts.length > 0 && (
                                        <div style={{ 
                                            position: "absolute", 
                                            top: "4px", 
                                            right: "4px", 
                                            fontSize: "10px", 
                                            backgroundColor: "#1e293b", 
                                            color: "white", 
                                            width: "16px", 
                                            height: "16px", 
                                            borderRadius: "4px",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center"
                                        }}>
                                            {dayAlerts.length}
                                        </div>
                                    )}
                                </button>
                            );
                        },
                    }}
                />
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                <h3 style={{ fontSize: "14px", fontWeight: "800", color: "#64748b", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "8px" }}>
                    {selectedDate ? `Alertas ${format(selectedDate, "d MMM", { locale: es })}` : "Alertas del Mes"}
                </h3>
                {calendarAlerts
                    .filter((a) => {
                        const ad = new Date(a.date);
                        if (selectedDate) {
                            return (
                                ad.getUTCFullYear() ===
                                    selectedDate.getFullYear() &&
                                ad.getUTCMonth() === selectedDate.getMonth() &&
                                ad.getUTCDate() === selectedDate.getDate()
                            );
                        }
                        return (
                            ad.getUTCMonth() === currentMonth.getMonth() &&
                            ad.getUTCFullYear() === currentMonth.getFullYear()
                        );
                    })
                    .slice(0, 8)
                    .map((alert, i: number) => (
                        <div
                            key={i}
                            onClick={() => router.push(
                                    `/dashboard/vehiculos/${alert.vehicleId}`,
                                )
                            }
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "12px",
                                padding: "12px",
                                backgroundColor: "white",
                                borderRadius: "16px",
                                border: "1px solid #e2e8f0",
                                cursor: "pointer",
                                transition: "all 0.2s"
                            }}
                        >
                            <div style={{ 
                                width: "40px", 
                                height: "40px", 
                                borderRadius: "12px", 
                                backgroundColor: alert.status === "red" ? "#fef2f2" : "#fffbeb",
                                color: alert.status === "red" ? "#ef4444" : "#f59e0b",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                fontSize: "14px",
                                fontWeight: "800"
                            }}>
                                {alert.placa.slice(-3)}
                            </div>
                            <div style={{ flex: 1, minWidth: 0 }}>
                                <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                                    <span style={{ fontWeight: "800", fontSize: "13px", color: "#1e293b" }}>
                                        {alert.placa}
                                    </span>
                                    <div style={{ width: "6px", height: "6px", borderRadius: "50%", backgroundColor: alert.status === "red" ? "#ef4444" : "#f59e0b" }} />
                                </div>
                                <p style={{ margin: 0, fontSize: "11px", color: "#64748b", fontWeight: "600", textOverflow: "ellipsis", overflow: "hidden", whiteSpace: "nowrap" }}>
                                    {alert.tipo}
                                </p>
                                <p style={{ margin: 0, fontSize: "10px", color: "#94a3b8" }}>
                                    Vence:{" "}
                                    {format(
                                        new Date(alert.date),
                                        "d 'de' MMMM",
                                        { locale: es },
                                    )}
                                </p>
                            </div>
                            <div style={{ color: "#cbd5e1" }}>
                                <ChevronRight size={18} />
                            </div>
                        </div>
                    ))}
                {calendarAlerts.filter((a) => {
                    const ad = new Date(a.date);
                    if (selectedDate) {
                        return (
                            ad.getUTCFullYear() ===
                                selectedDate.getFullYear() &&
                            ad.getUTCMonth() === selectedDate.getMonth() &&
                            ad.getUTCDate() === selectedDate.getDate()
                        );
                    }
                    return (
                        ad.getUTCMonth() === currentMonth.getMonth() &&
                        ad.getUTCFullYear() === currentMonth.getFullYear()
                    );
                }).length === 0 && (
                    <div>
                        <p>
                            {selectedDate
                                ? "Sin vencimientos para este día"
                                : "Sin vencimientos en este mes"}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
