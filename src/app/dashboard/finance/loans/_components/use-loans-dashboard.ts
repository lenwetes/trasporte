import { useState, useEffect } from "react";
import { toast } from "sonner";
import { getLoanDashboard, reloadLoanFund } from "@/actions/finance/loans";
import { DashboardData } from "@/types";

export function useLoansDashboard() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<DashboardData | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedLoanId, setSelectedLoanId] = useState<string | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isRechargeOpen, setIsRechargeOpen] = useState(false);
  const [rechargeAmount, setRechargeAmount] = useState("");
  const [isRecharging, setIsRecharging] = useState(false);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    setLoading(true);
    try {
      const res = await getLoanDashboard();
      if (res.success && res.data) {
        setData(res.data as unknown as DashboardData);
      } else {
        toast.error("Fallo al recuperar datos de cartera operativa");
      }
    } catch (error) {
       toast.error("Error de enlace permanente con el servicio de cartera");
       console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleRecharge = async () => {
      const monto = Number(rechargeAmount);
      if (!monto || monto <= 0) {
          toast.error("Monto inválido para recarga de fondo");
          return;
      }
      setIsRecharging(true);
      try {
          const res = await reloadLoanFund(monto);
          if (res.success) {
              toast.success("FONDO DE PRÉSTAMOS RECARGADO ✅");
              setIsRechargeOpen(false);
              setRechargeAmount("");
              fetchDashboard();
          } else {
              toast.error(res.error || "No se pudo autorizar la recarga del fondo");
          }
      } catch (e) {
          toast.error("Fallo técnico en la autorización de tesorería");
          console.error(e);
      } finally {
          setIsRecharging(false);
      }
  };

  const dashboardData: DashboardData = data || {
      totalPrestado: 0,
      carteraVigente: 0,
      prestamosActivos: 0,
      fondoDisponible: 0,
      cajaGeneral: 0,
      nombreFondo: "CARGANDO...",
      recientes: []
  };

  return {
    loading,
    data: dashboardData,
    isDialogOpen,
    setIsDialogOpen,
    selectedLoanId,
    setSelectedLoanId,
    isDetailOpen,
    setIsDetailOpen,
    isRechargeOpen,
    setIsRechargeOpen,
    rechargeAmount,
    setRechargeAmount,
    isRecharging,
    handleRecharge,
    fetchDashboard
  };
}
