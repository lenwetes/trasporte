import { describe, it, expect } from "vitest";
import { LoanAmortizationCalculator } from "../loan-amortization.calculator";

describe("LoanAmortizationCalculator", () => {
    it("debe calcular correctamente un plan de amortización mensual estándar (Francés)", () => {
        const monto = 1000000;
        const tasa = 0.02; // 2% mensual
        const plazo = 12;
        const fechaInicio = new Date("2026-04-01T12:00:00Z");

        const plan = LoanAmortizationCalculator.calculate(monto, tasa, plazo, false, fechaInicio);

        expect(plan).toHaveLength(plazo);
        
        // Verificación de la primera cuota
        // Formula: A = P * (r * (1+r)^n) / ((1+r)^n - 1)
        // A = 1,000,000 * (0.02 * (1.02)^12) / ((1.02)^12 - 1)
        // A = 1,000,000 * 0.02 * 1.26824179 / 0.26824179
        // A = 25364.83 / 0.26824179 = 94559.59...
        // Redondeado: 94560
        
        expect(plan[0].totalCuota).toBe(94560);
        expect(plan[0].valorInteres).toBe(20000); // 1,000,000 * 0.02
        expect(plan[0].valorCapital).toBe(74560); // 94560 - 20000
        
        // Fecha de la primera cuota (un mes después)
        const fechaCuota1 = new Date(plan[0].fechaVencimiento);
        expect(fechaCuota1.getUTCMonth()).toBe(4); // Mayo (0-indexed: 4)
    });

    it("debe calcular correctamente un plan con tasa 0%", () => {
        const monto = 1200000;
        const tasa = 0;
        const plazo = 12;

        const plan = LoanAmortizationCalculator.calculate(monto, tasa, plazo);

        expect(plan).toHaveLength(12);
        expect(plan[0].totalCuota).toBe(100000);
        expect(plan[0].valorInteres).toBe(0);
        expect(plan[0].valorCapital).toBe(100000);
        expect(plan[11].valorCapital).toBe(100000);
    });

    it("debe manejar correctamente el plan diario", () => {
        const monto = 100000;
        const tasa = 0.001; // 0.1% diario
        const plazo = 5;
        const fechaInicio = new Date("2026-04-01T12:00:00Z");

        const plan = LoanAmortizationCalculator.calculate(monto, tasa, plazo, true, fechaInicio);

        expect(plan).toHaveLength(5);
        
        // Diferencia de días entre cuota 1 y fecha inicio
        const diffMs = plan[0].fechaVencimiento.getTime() - fechaInicio.getTime();
        const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));
        expect(diffDays).toBe(1);

        const diffMs5 = plan[4].fechaVencimiento.getTime() - fechaInicio.getTime();
        const diffDays5 = Math.round(diffMs5 / (1000 * 60 * 60 * 24));
        expect(diffDays5).toBe(5);
    });

    it("la suma de capitales debe ser igual al monto inicial (con redondeo)", () => {
        const monto = 1000000;
        const tasa = 0.0245; // Tasa con más decimales
        const plazo = 24;

        const plan = LoanAmortizationCalculator.calculate(monto, tasa, plazo);
        
        const sumaCapital = plan.reduce((acc, c) => acc + c.valorCapital, 0);
        
        // El redondeo puede causar diferencias de +1 o -1 peso acumulativo, 
        // pero la formula debería ser precisa.
        expect(Math.abs(sumaCapital - monto)).toBeLessThanOrEqual(5); 
    });

    it("debe manejar errores o valores extraños devolviendo un plan vacío o coherente", () => {
        // Si el plazo es 0, debería retornar []
        const planZero = LoanAmortizationCalculator.calculate(1000000, 0.02, 0);
        expect(planZero).toHaveLength(0);

        // Si el monto es 0, debería retornar cuotas en 0
        const planMontoZero = LoanAmortizationCalculator.calculate(0, 0.02, 12);
        expect(planMontoZero[0].totalCuota).toBe(0);
        expect(planMontoZero[0].valorCapital).toBe(0);
    });
});
