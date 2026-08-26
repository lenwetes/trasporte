import Decimal from "decimal.js";

export class LoanAmortizationCalculator {
  /**
   * Calcula la tabla de amortización (Francés o Diario)
   * Lógica pura sin dependencia de base de datos
   */
  static calculate(
    monto: number,
    tasa: number,
    plazo: number,
    isDiario: boolean = false,
    fechaInicio: Date = new Date()
  ) {
    const P = new Decimal(monto);
    const r = new Decimal(tasa);
    const n = plazo;

    let cuotaMonto = new Decimal(0);
    const plan = [];
    let saldo = P;

    const r_final = r; // La tasa ya viene prorrateada si es necesario

    if (r_final.isZero()) {
        cuotaMonto = P.div(n);
    } else {
        const factor = r_final.plus(1).pow(n);
        cuotaMonto = P.times(r_final.times(factor)).div(factor.minus(1));
    }

    for (let i = 1; i <= n; i++) {
        const interes = saldo.times(r_final);
        const capital = cuotaMonto.minus(interes);
        saldo = saldo.minus(capital);

        const fechaVenc = new Date(fechaInicio);
        if (isDiario) {
            fechaVenc.setDate(fechaVenc.getDate() + i);
        } else {
            fechaVenc.setMonth(fechaVenc.getMonth() + i);
        }

        plan.push({
            numCuota: i,
            fechaVencimiento: fechaVenc,
            valorCapital: capital.toNearest(1, Decimal.ROUND_HALF_UP).toNumber(),
            valorInteres: interes.toNearest(1, Decimal.ROUND_HALF_UP).toNumber(),
            totalCuota: cuotaMonto.toNearest(1, Decimal.ROUND_HALF_UP).toNumber()
        });
    }

    return plan;
  }
}
