"use client";

import React from "react";
import { CreditCard, Plus, ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LoanDialog } from "./_components/loan-dialog";
import { LoanDetailDialog } from "./_components/loan-detail-dialog";
import { LoansRechargeModal } from "./_components/loans-recharge-modal";
import { LoansMetricsWidget } from "./_components/loans-metrics-widget";
import { LoansRecentTableWidget } from "./_components/loans-recent-table-widget";
import { LoansRiskWidget } from "./_components/loans-risk-widget";
import { useLoansDashboard } from "./_components/use-loans-dashboard";

// @refactored: Fase 1 (M10) - Dividido en Widgets.
export default function LoansPage() {
  const {
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
  } = useLoansDashboard();

  return (
    <div className="p-6 space-y-8 animate-in fade-in duration-500 bg-slate-50/30">
      {/* HEADER CORPORATIVO */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b-4 border-primary pb-6">
        <div>
          <h1 className="text-4xl font-black text-primary tracking-tighter uppercase italic flex items-center gap-3">
            <CreditCard className="h-10 w-10 text-accent" />
            Cartera de Créditos
          </h1>
          <p className="text-[11px] font-black text-slate-900 uppercase tracking-[0.2em] mt-1 pl-1">
            Gestión de Préstamos y Auxilios — Motor Operativo Coopetraes
          </p>
        </div>
        
        <div className="flex gap-4">
           <Button 
            onClick={() => setIsRechargeOpen(true)}
            variant="outline"
            className="rounded-none h-14 px-8 font-black uppercase tracking-widest text-[11px] border-primary/20 hover:bg-white flex items-center gap-3 shadow-xl transition-all"
          >
            <ArrowUpRight className="h-5 w-5 text-accent" />
            Recargar Fondo
          </Button>

           <Button 
            onClick={() => setIsDialogOpen(true)}
            className="rounded-none h-14 px-10 font-black uppercase tracking-widest text-[11px] bg-primary text-white hover:bg-black flex items-center gap-3 shadow-2xl"
          >
            <Plus className="h-5 w-5 text-accent" />
            Nuevo Crédito
          </Button>
        </div>
      </div>

      <LoansMetricsWidget data={dashboardData} />

      {/* ÁREA DE TRABAJO */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <LoansRecentTableWidget 
           loading={loading} 
           recientes={dashboardData.recientes} 
           onSelectLoan={(id) => {
              setSelectedLoanId(id);
              setIsDetailOpen(true);
           }}
        />
        <LoansRiskWidget data={dashboardData} />
      </div>

      <LoanDialog 
        isOpen={isDialogOpen} 
        onClose={() => setIsDialogOpen(false)} 
        onCreated={fetchDashboard} 
      />
      
      {selectedLoanId && (
        <LoanDetailDialog
          loanId={selectedLoanId}
          isOpen={isDetailOpen}
          onClose={() => {
            setIsDetailOpen(false);
            setSelectedLoanId(null);
          }}
          onUpdated={fetchDashboard}
        />
      )}

      <LoansRechargeModal
        isOpen={isRechargeOpen}
        onOpenChange={setIsRechargeOpen}
        cajaGeneral={dashboardData.cajaGeneral}
        rechargeAmount={rechargeAmount}
        setRechargeAmount={setRechargeAmount}
        handleRecharge={handleRecharge}
        isRecharging={isRecharging}
      />
    </div>
  );
}
