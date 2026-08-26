import { ExamenMedicoService } from "./safety/examen-medico.service";
import { DotacionService } from "./safety/dotacion.service";
import { PreoperacionalService } from "./safety/preoperacional.service";
import { SiniestroService } from "./safety/siniestro.service";
import { IndicadoresService } from "./safety/indicadores.service";
import { RecordService } from "./safety/record.service";
import { FleetHealthService } from "./safety/fleet-health.service";
import { CalendarService } from "./safety/calendar.service";

/**
 * SafetyService Facade
 * Delegates logic to specialized services to maintain modularity and respect file size limits.
 */
export class SafetyService {
    // MEDICAL EXAMS
    static createExamenMedico = ExamenMedicoService.create;
    static getExamenesByConductor = ExamenMedicoService.getByConductor;
    static updateExamenMedico = ExamenMedicoService.update;
    static getSGSSTSummary = ExamenMedicoService.getSGSSTSummary;

    // PPE DELIVERY (DOTACIÓN)
    static createEntregaDotacion = DotacionService.create;
    static getEntregasByConductor = DotacionService.getByConductor;
    static getEntregaDotacionById = DotacionService.getById;

    // PREOPERATIONALS
    static createPreoperacional = PreoperacionalService.create;
    static getPreoperacionalesByVehiculo = PreoperacionalService.getByVehiculo;
    static getLatestPreoperacional = PreoperacionalService.getLatest;
    static getPreoperacionalById = PreoperacionalService.getById;

    // ACCIDENT INVESTIGATION
    static createInvestigacionSiniestro = SiniestroService.createInvestigacion;
    static getInvestigacionBySiniestro =
        SiniestroService.getInvestigacionBySiniestro;

    // INDICATORS (KPIs)
    static getSafetyKPIs = IndicadoresService.getSafetyKPIs;
    static getOperationalRiskHeatmap =
        IndicadoresService.getOperationalRiskHeatmap;

    // RECORDS
    static getExpedienteDigital = RecordService.getExpedienteDigital;

    // FLEET STATUS
    static getFleetStatus = FleetHealthService.getStatus;

    // CALENDAR
    static getSafetyCalendarEvents = CalendarService.getEvents;
}
