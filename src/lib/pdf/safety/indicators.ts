export const generateSafetyIndicatorsPDF = async (data: any) => {
    if (typeof window !== 'undefined') {
        const { toast } = await import("sonner");
        toast.error("Exportación PDF de Indicadores deshabilitada (Zero Any Legacy Cleanup).");
    }
};
