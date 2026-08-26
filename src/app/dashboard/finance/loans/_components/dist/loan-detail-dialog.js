"use client";
"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
exports.LoanDetailDialog = void 0;
var react_1 = require("react");
var dialog_1 = require("@/components/ui/dialog");
var button_1 = require("@/components/ui/button");
var badge_1 = require("@/components/ui/badge");
var loans_1 = require("@/actions/finance/loans");
var configuracion_1 = require("@/actions/configuracion");
var uploads_1 = require("@/actions/uploads");
var jspdf_1 = require("jspdf");
var jspdf_autotable_1 = require("jspdf-autotable");
var sonner_1 = require("sonner");
var utils_1 = require("@/lib/utils");
var lucide_react_1 = require("lucide-react");
var utils_2 = require("@/lib/utils");
var loan_statement_1 = require("@/components/modules/finance/loan-statement");
function LoanDetailDialog(_a) {
    var _this = this;
    var _b;
    var loanId = _a.loanId, isOpen = _a.isOpen, onClose = _a.onClose, onUpdated = _a.onUpdated;
    var _c = react_1.useState(false), loading = _c[0], setLoading = _c[1];
    var _d = react_1.useState(null), loan = _d[0], setLoan = _d[1];
    var _e = react_1.useState(false), showStatement = _e[0], setShowStatement = _e[1];
    var _f = react_1.useState({
        nombre: "COOPETRAES",
        nit: "900.543.210-8",
        direccion: "CALLE 25 # 14 - 32, EDIFICIO BOLÍVAR",
        telefono: "(605) 282 4455",
        email: "cartera@coopetraes.com",
        logo: "/logo-empresa.png"
    }), empresaDato = _f[0], setEmpresaDato = _f[1];
    react_1.useEffect(function () {
        if (loanId && isOpen) {
            fetchDetail();
        }
    }, [loanId, isOpen]);
    var fetchDetail = function () { return __awaiter(_this, void 0, void 0, function () {
        var res, configRes, c;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    setLoading(true);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, , 4, 5]);
                    return [4 /*yield*/, loans_1.getLoanDetail(loanId)];
                case 2:
                    res = _a.sent();
                    return [4 /*yield*/, configuracion_1.getConfiguracionGlobal()];
                case 3:
                    configRes = _a.sent();
                    if (res.success) {
                        setLoan(res.data);
                    }
                    if (configRes.success && configRes.data) {
                        c = configRes.data;
                        setEmpresaDato({
                            nombre: c.nombreEmpresa || "COOPETRAES",
                            nit: c.nit || "900.543.210-8",
                            direccion: c.direccion || "CALLE 25 # 14 - 32, EDIFICIO BOLÍVAR",
                            telefono: c.telefono || "(605) 282 4455",
                            email: c.email || "cartera@coopetraes.com",
                            logo: c.logoUrl || (c.logoLocalPath ? "/api/files/" + c.logoLocalPath : "/logo-empresa.png")
                        });
                    }
                    return [3 /*break*/, 5];
                case 4:
                    setLoading(false);
                    return [7 /*endfinally*/];
                case 5: return [2 /*return*/];
            }
        });
    }); };
    var handleDisburse = function () { return __awaiter(_this, void 0, void 0, function () {
        var res;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    setLoading(true);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, , 3, 4]);
                    return [4 /*yield*/, loans_1.disburseLoan(loan.id)];
                case 2:
                    res = _a.sent();
                    if (res.success) {
                        sonner_1.toast.success("Préstamo desembolsado y capital reservado");
                        fetchDetail();
                        onUpdated();
                    }
                    else {
                        sonner_1.toast.error(res.error);
                    }
                    return [3 /*break*/, 4];
                case 3:
                    setLoading(false);
                    return [7 /*endfinally*/];
                case 4: return [2 /*return*/];
            }
        });
    }); };
    var handlePay = function (cuotaId, monto) { return __awaiter(_this, void 0, void 0, function () {
        var res;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    setLoading(true);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, , 3, 4]);
                    return [4 /*yield*/, loans_1.payLoanInstallment({ cuotaId: cuotaId, monto: monto })];
                case 2:
                    res = _a.sent();
                    if (res.success) {
                        sonner_1.toast.success("Recaudo sincronizado con éxito");
                        fetchDetail();
                        onUpdated();
                    }
                    else {
                        sonner_1.toast.error(res.error);
                    }
                    return [3 /*break*/, 4];
                case 3:
                    setLoading(false);
                    return [7 /*endfinally*/];
                case 4: return [2 /*return*/];
            }
        });
    }); };
    var handlePrint = function () { return __awaiter(_this, void 0, void 0, function () {
        var tId, getLogoInfo, logoInfo_1, _a, doc_1, drawPageContent, drawClausesReversePage, pdfBlob, formData, file, uploadRes, err_1;
        var _this = this;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 5, 6, 7]);
                    setLoading(true);
                    tId = sonner_1.toast.loading("Ensamblando Documento PDF Maestro (Libre de Errores CSS)...");
                    getLogoInfo = function (url) { return __awaiter(_this, void 0, void 0, function () {
                        var res, blob_1, base64_1, e_1;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    _a.trys.push([0, 4, , 5]);
                                    return [4 /*yield*/, fetch(url)];
                                case 1:
                                    res = _a.sent();
                                    return [4 /*yield*/, res.blob()];
                                case 2:
                                    blob_1 = _a.sent();
                                    return [4 /*yield*/, new Promise(function (resolve) {
                                            var reader = new FileReader();
                                            reader.onloadend = function () { return resolve(reader.result); };
                                            reader.readAsDataURL(blob_1);
                                        })];
                                case 3:
                                    base64_1 = _a.sent();
                                    return [2 /*return*/, new Promise(function (resolve) {
                                            var img = new Image();
                                            img.onload = function () {
                                                var ratio = img.naturalHeight / img.naturalWidth;
                                                var format = base64_1.split(';')[0].split('/')[1].toUpperCase();
                                                resolve({ base64: base64_1, ratio: ratio, format: format === 'SVG+XML' ? 'PNG' : format });
                                            };
                                            img.src = base64_1;
                                        })];
                                case 4:
                                    e_1 = _a.sent();
                                    return [2 /*return*/, null];
                                case 5: return [2 /*return*/];
                            }
                        });
                    }); };
                    if (!empresaDato.logo) return [3 /*break*/, 2];
                    return [4 /*yield*/, getLogoInfo(empresaDato.logo)];
                case 1:
                    _a = _b.sent();
                    return [3 /*break*/, 3];
                case 2:
                    _a = null;
                    _b.label = 3;
                case 3:
                    logoInfo_1 = _a;
                    doc_1 = new jspdf_1["default"]('p', 'mm', 'a4');
                    drawPageContent = function (isCopyEntity) {
                        var _a, _b, _c, _d, _e, _f, _g, _h;
                        // HEADER - LOGO CPT (DYN RATIO & FORMAT)
                        if (logoInfo_1) {
                            var finalW = 90;
                            var finalH = finalW * logoInfo_1.ratio;
                            if (finalH > 40) { // Max height limit
                                finalH = 40;
                                finalW = finalH / logoInfo_1.ratio;
                            }
                            doc_1.addImage(logoInfo_1.base64, logoInfo_1.format, 14, 10, finalW, finalH, undefined, 'FAST');
                        }
                        else {
                            doc_1.setFillColor(15, 23, 42); // slate-900
                            doc_1.rect(14, 15, 12, 10, 'F');
                            doc_1.setTextColor(255, 255, 255);
                            doc_1.setFontSize(14);
                            doc_1.setFont("helvetica", "bolditalic");
                            doc_1.text("CPT", 16, 22);
                            doc_1.setTextColor(15, 23, 42);
                            doc_1.setFontSize(22);
                            doc_1.setFont("helvetica", "bolditalic");
                            doc_1.text(empresaDato.nombre, 36, 23);
                        }
                        // HEADER - NIT
                        doc_1.setFontSize(11);
                        doc_1.setFont("helvetica", "bolditalic");
                        doc_1.setTextColor(51, 65, 85); // slate-700
                        doc_1.text("NIT: " + empresaDato.nit, 14, 40);
                        // ADDRESS / CONTACT
                        doc_1.setFontSize(8.5);
                        doc_1.setFont("helvetica", "normal");
                        doc_1.setTextColor(71, 85, 105); // slate-600
                        doc_1.text(empresaDato.direccion, 14, 47);
                        doc_1.text("TEL: " + empresaDato.telefono + " \u2014 EMAIL: " + empresaDato.email.toUpperCase(), 14, 52);
                        // HEADER RIGHT - REFS
                        doc_1.setFontSize(8);
                        doc_1.setFont("helvetica", "bolditalic");
                        doc_1.setTextColor(148, 163, 184); // slate-400
                        doc_1.text("DOCUMENTO DE CARTERA NO.", 195, 16, { align: "right" });
                        doc_1.setFontSize(24);
                        doc_1.setTextColor(15, 23, 42); // slate-900
                        doc_1.text("#" + loan.id.slice(-8).toUpperCase(), 195, 25, { align: "right" });
                        // HEADER RIGHT - ESTADO BADGE
                        doc_1.setDrawColor(16, 185, 129); // emerald-500
                        doc_1.setFillColor(236, 253, 245); // emerald-50
                        doc_1.setLineWidth(0.2);
                        doc_1.rect(125, 29, 70, 7, 'FD');
                        doc_1.setFontSize(7.5);
                        doc_1.setTextColor(4, 120, 87); // emerald-700
                        doc_1.setFont("helvetica", "bolditalic");
                        doc_1.text("ESTADO: " + loan.estado + " \u2014 " + new Date(loan.creadoEn).toLocaleDateString(), 160, 33.8, { align: "center" });
                        // MARCA DE AGUA VÍA TEXTO FRONTAL
                        doc_1.setFontSize(8);
                        doc_1.setTextColor(15, 23, 42);
                        doc_1.text(isCopyEntity ? "COPIA PARA LA ENTIDAD" : "COPIA BENEFICIARIO", 195, 41, { align: "right" });
                        // DIVIDER LINE
                        doc_1.setDrawColor(15, 23, 42);
                        doc_1.setLineWidth(0.8);
                        doc_1.line(14, 58, 195, 58);
                        // DATOS DEL TITULAR
                        doc_1.setFontSize(10);
                        doc_1.setTextColor(148, 163, 184);
                        doc_1.text("DATOS DEL TITULAR", 14, 64);
                        doc_1.line(14, 66, 90, 66); // tiny underline
                        doc_1.setFontSize(8);
                        doc_1.text("BENEFICIARIO TITULAR", 14, 72);
                        doc_1.setFontSize(11);
                        doc_1.setTextColor(15, 23, 42);
                        doc_1.text(((_a = loan.usuario) === null || _a === void 0 ? void 0 : _a.nombres) + " " + ((_b = loan.usuario) === null || _b === void 0 ? void 0 : _b.apellidos), 14, 77);
                        doc_1.setFontSize(8);
                        doc_1.setTextColor(148, 163, 184);
                        doc_1.text("NIT / IDENTIFICACIÓN", 14, 84);
                        doc_1.setFontSize(10);
                        doc_1.setTextColor(15, 23, 42);
                        doc_1.text(((_c = loan.usuario) === null || _c === void 0 ? void 0 : _c.numeroDocumento) || "N/A", 14, 88);
                        doc_1.setFontSize(8);
                        doc_1.setTextColor(148, 163, 184);
                        doc_1.text("CONTACTO", 14, 96);
                        doc_1.text("UBICACIÓN", 45, 96);
                        doc_1.setFontSize(9);
                        doc_1.setTextColor(15, 23, 42);
                        doc_1.text(((_d = loan.usuario) === null || _d === void 0 ? void 0 : _d.telefono) || "N/A", 14, 100);
                        doc_1.text(((_f = (_e = loan.usuario) === null || _e === void 0 ? void 0 : _e.direccion) === null || _f === void 0 ? void 0 : _f.slice(0, 20)) || "N/A", 45, 100);
                        // RESUMEN ECONÓMICO
                        doc_1.setFontSize(10);
                        doc_1.setTextColor(148, 163, 184);
                        doc_1.text("RESUMEN ECONÓMICO", 105, 64);
                        doc_1.line(105, 66, 195, 66);
                        var drawSummaryRow = function (label, val, yPos, valColor) {
                            if (valColor === void 0) { valColor = [15, 23, 42]; }
                            doc_1.setTextColor(148, 163, 184);
                            doc_1.setFontSize(8);
                            doc_1.setFont("helvetica", "bolditalic");
                            doc_1.text(label, 105, yPos);
                            doc_1.setTextColor(valColor[0], valColor[1], valColor[2]);
                            doc_1.setFont("helvetica", "bold");
                            doc_1.setFontSize(10);
                            doc_1.text(val, 195, yPos, { align: "right" });
                        };
                        var totalInteres = ((_g = loan.cuotas) === null || _g === void 0 ? void 0 : _g.reduce(function (a, c) { return a + Number(c.valorInteres); }, 0)) || 0;
                        drawSummaryRow("PRINCIPAL DESEMBOLSADO", utils_1.formatCurrency(loan.montoCapital), 72);
                        drawSummaryRow("TASA (" + (loan.tipo === "FLEXIBLE_DIARIO" ? "Diario" : "Mensual") + ")", Number(loan.tasaMensual) * 100 + "%", 80);
                        drawSummaryRow("TOTAL CARGAS PROYECTADAS", utils_1.formatCurrency(Number(loan.montoCapital) + totalInteres), 88, [16, 185, 129]);
                        // THE BIG BLACK BOX
                        doc_1.setFillColor(15, 23, 42);
                        doc_1.rect(105, 94, 90, 14, 'F');
                        doc_1.setFillColor(16, 185, 129);
                        doc_1.rect(105, 94, 2, 14, 'F');
                        doc_1.setTextColor(255, 255, 255);
                        doc_1.setFont("helvetica", "bolditalic");
                        doc_1.setFontSize(9);
                        doc_1.text("SALDO ACTUAL ERP", 110, 103);
                        doc_1.setFont("helvetica", "bold");
                        doc_1.setFontSize(14);
                        doc_1.text(utils_1.formatCurrency(loan.saldoActual), 190, 103.5, { align: "right" });
                        // CUOTAS TABLE
                        var cuotasBody = ((_h = loan.cuotas) === null || _h === void 0 ? void 0 : _h.map(function (c) { return [
                            "SEC-" + String(c.numCuota).padStart(3, '0'),
                            new Date(c.fechaVencimiento).toLocaleDateString(),
                            utils_1.formatCurrency(c.valorCapital),
                            "+" + utils_1.formatCurrency(c.valorInteres),
                            utils_1.formatCurrency(c.totalCuota)
                        ]; })) || [];
                        jspdf_autotable_1["default"](doc_1, {
                            startY: 115,
                            head: [['NO. PAGO', 'VENCIMIENTO', 'AMORTIZACIÓN', 'INTERÉS', 'MONTO FIJO']],
                            body: cuotasBody,
                            theme: 'plain',
                            styles: { fontSize: 8, cellPadding: 4, textColor: [100, 116, 139] },
                            headStyles: {
                                fontStyle: 'bolditalic',
                                textColor: [15, 23, 42],
                                lineWidth: { bottom: 0.5 },
                                lineColor: [15, 23, 42]
                            },
                            columnStyles: {
                                0: { fontStyle: 'bolditalic', textColor: [203, 213, 225] },
                                1: { fontStyle: 'bolditalic', textColor: [148, 163, 184] },
                                4: { fontStyle: 'bold', textColor: [15, 23, 42], halign: 'right' }
                            },
                            didParseCell: function (data) {
                                if (data.section === 'body' && data.row.index % 2 === 0) {
                                    data.cell.styles.fillColor = [248, 250, 252]; // slate-50 alternating
                                }
                            }
                        });
                        // FOOTER TRACE
                        doc_1.setFontSize(6);
                        doc_1.setTextColor(203, 213, 225);
                        doc_1.text(new Date().toLocaleString() + " \u2014 ID TRAZABILIDAD: " + loan.id, 14, 285);
                    };
                    drawClausesReversePage = function () {
                        var _a;
                        doc_1.addPage();
                        // Top line
                        doc_1.setLineWidth(0.5);
                        doc_1.setDrawColor(15, 23, 42); // slate-900
                        doc_1.line(14, 20, 195, 20);
                        // Header
                        doc_1.setFontSize(12);
                        doc_1.setFont("helvetica", "bolditalic");
                        doc_1.setTextColor(15, 23, 42);
                        doc_1.circle(16, 29, 2.5, 'S');
                        doc_1.text("i", 16, 30.2, { align: 'center' });
                        doc_1.text("CLÁUSULAS DEL CONTRATO DE MUTUO COMERCIAL", 21, 30.5);
                        var drawClause = function (num, title, body, x, y) {
                            doc_1.setFontSize(7.5);
                            doc_1.setFont("helvetica", "bold");
                            doc_1.setTextColor(15, 23, 42);
                            doc_1.text(num + ".", x, y);
                            doc_1.text(title + ":", x + 5, y);
                            doc_1.setFont("helvetica", "normal");
                            doc_1.setTextColor(100, 116, 139); // slate-500
                            var textLines = doc_1.splitTextToSize(body, 82);
                            doc_1.text(textLines, x + 5, y + 4.5);
                            return y + 4.5 + (textLines.length * 3.5) + 6;
                        };
                        var leftY = 45;
                        leftY = drawClause("01", "DECLARACIÓN DE OBLIGACIÓN", "EL PRESENTE DOCUMENTO PRESTA M\u00C9RITO EJECUTIVO EN LOS T\u00C9RMINOS DEL ART. 422 DEL CGP. EL BENEFICIARIO RECONOCE ADEUDAR A " + empresaDato.nombre.toUpperCase() + " LA SUMA PRINCIPAL AQU\u00CD DESCRITA.", 14, leftY);
                        leftY = drawClause("02", "INTERESES Y MORA", "EN CASO DE INCUMPLIMIENTO EN LAS FECHAS PROYECTADAS, SE CAUSARÁN INTERESES DE MORA A LA TASA MÁXIMA LEGAL PERMITIDA POR LA SUPERFINANCIERA DE COLOMBIA.", 14, leftY);
                        leftY = drawClause("03", "ACELERACIÓN DE DEUDA", "EL INCUMPLIMIENTO EN EL PAGO DE UNA (1) SOLA CUOTA FACULTA A LA EMPRESA PARA DECLARAR EL PLAZO VENCIDO DE TODA LA OBLIGACIÓN Y EXIGIR SU PAGO TOTAL INMEDIATO.", 14, leftY);
                        var rightY = 45;
                        rightY = drawClause("04", "AUTORIZACIÓN CENTRALES", "EL BENEFICIARIO AUTORIZA IRREVOCABLEMENTE A LA EMPRESA PARA CONSULTAR, REPORTAR Y PROCESAR SUS DATOS FINANCIEROS ANTE CENTRALES DE RIESGO (CIFIN/DATACRÉDITO).", 105, rightY);
                        rightY = drawClause("05", "COSTOS DE RECAUDO", "TODO COSTO DERIVADO DE LA GESTIÓN DE COBRO PRE-JURÍDICO O JURÍDICO (INCLUYENDO HONORARIOS DE ABOGADOS) SERÁ ASUMIDO EN SU TOTALIDAD POR EL DEUDOR.", 105, rightY);
                        rightY = drawClause("06", "IMPUTACIÓN DE PAGOS", "TODO PAGO SE APLICARÁ EN EL SIGUIENTE ORDEN: PRIMERO A GASTOS DE COBRANZA, SEGUNDO A INTERESES DE MORA, TERCERO A INTERESES PACTADOS Y CUARTO A CAPITAL.", 105, rightY);
                        // SIGS
                        var sigY = Math.max(leftY, rightY) + 40;
                        doc_1.setDrawColor(15, 23, 42);
                        doc_1.setLineWidth(0.5);
                        // Left signature 
                        doc_1.line(14, sigY, 90, sigY);
                        doc_1.setFontSize(9);
                        doc_1.setFont("helvetica", "bolditalic");
                        doc_1.setTextColor(15, 23, 42);
                        doc_1.text("AUTORIZADO POR GERENCIA", 52, sigY + 5, { align: 'center' });
                        doc_1.setFontSize(8);
                        doc_1.setFont("helvetica", "bold");
                        doc_1.setTextColor(148, 163, 184); // slate-400
                        doc_1.text(empresaDato.nombre.toUpperCase(), 52, sigY + 9, { align: 'center' });
                        // Right signature 
                        doc_1.line(115, sigY, 195, sigY);
                        doc_1.setFontSize(9);
                        doc_1.setFont("helvetica", "bolditalic");
                        doc_1.setTextColor(15, 23, 42);
                        doc_1.text("ACEPTACIÓN BENEFICIARIO", 155, sigY + 5, { align: 'center' });
                        doc_1.setFontSize(8);
                        doc_1.setFont("helvetica", "bold");
                        doc_1.setTextColor(148, 163, 184);
                        doc_1.text("C.C. " + (((_a = loan.usuario) === null || _a === void 0 ? void 0 : _a.numeroDocumento) || 'N/A'), 155, sigY + 9, { align: 'center' });
                        // REVERSE FOOTER TRACE
                        doc_1.setFont("helvetica", "bold");
                        doc_1.setFontSize(6.5);
                        doc_1.setTextColor(148, 163, 184);
                        // Simple Shield Icon
                        doc_1.line(14, 283, 16, 283);
                        doc_1.line(14, 283, 14, 285);
                        doc_1.line(16, 283, 16, 285);
                        doc_1.line(14, 285, 15, 286);
                        doc_1.line(16, 285, 15, 286);
                        doc_1.text("SISTEMA DE GESTIÓN DE CARTERA — DOCUMENTO CONTROLADO", 18, 285.5);
                        doc_1.setFont("helvetica", "bolditalic");
                        var rightFoot = new Date().toLocaleString() + " \u2014 ID TRAZABILIDAD: " + loan.id.toUpperCase();
                        doc_1.text(rightFoot, 195, 285.5, { align: 'right' });
                    };
                    // PAGE 1 : BENEFICIARIO FRONT
                    drawPageContent(false);
                    // PAGE 2 : BENEFICIARIO REVERSE
                    drawClausesReversePage();
                    // PAGE 3 : ENTIDAD FRONT
                    doc_1.addPage();
                    drawPageContent(true);
                    // PAGE 4 : ENTIDAD REVERSE
                    drawClausesReversePage();
                    pdfBlob = doc_1.output('blob');
                    doc_1.save("COOPETRAES_Extracto_Credito_" + loan.id.slice(-8).toUpperCase() + ".pdf");
                    // Subida al Storage/Auditoria
                    sonner_1.toast.loading("Sincronizando PDF Nativo en bóveda Archivo de Banco...", { id: tId });
                    formData = new FormData();
                    file = new File([pdfBlob], "EXTRACTO_CARTERA_" + loan.id + ".pdf", { type: "application/pdf" });
                    formData.append("file", file);
                    return [4 /*yield*/, uploads_1.uploadFile(formData)];
                case 4:
                    uploadRes = _b.sent();
                    if (uploadRes.success) {
                        sonner_1.toast.success("Documento Oficial PDF Asegurado y Guardado en Base de Datos de forma idéntica.", { id: tId });
                    }
                    else {
                        sonner_1.toast.error("El documento bajó, pero falló copia de seguridad db: " + uploadRes.error, { id: tId });
                    }
                    return [3 /*break*/, 7];
                case 5:
                    err_1 = _b.sent();
                    sonner_1.toast.error("Fallo durante Render de Extacto.");
                    console.error(err_1);
                    return [3 /*break*/, 7];
                case 6:
                    setLoading(false);
                    return [7 /*endfinally*/];
                case 7: return [2 /*return*/];
            }
        });
    }); };
    if (!loan && loading)
        return null;
    return (react_1["default"].createElement(dialog_1.Dialog, { open: isOpen, onOpenChange: function (o) { if (!o) {
            onClose();
            setShowStatement(false);
        } } },
        react_1["default"].createElement(dialog_1.DialogContent, { className: utils_2.cn("rounded-none border-t-8 border-t-slate-900 p-0 overflow-hidden bg-white shadow-2xl transition-all duration-500 print:overflow-visible print:max-h-none print:h-auto print:border-none print:shadow-none print:max-w-none print:w-full", showStatement ? "max-w-[900px] print:w-full" : "max-w-4xl") }, showStatement ? (react_1["default"].createElement("div", { className: "animate-in fade-in zoom-in-95 duration-300 print:animate-none print:transform-none" },
            react_1["default"].createElement("style", { type: "text/css", media: "print" }, "\n                    @media print {\n                        body, html {\n                            overflow: visible !important;\n                            height: auto !important;\n                            background: white !important;\n                        }\n                        /* Ocultar la aplicaci\u00F3n gr\u00E1fica de fondo expl\u00EDcitamente y permitir flujo exclusivo del Modal Radix */\n                        #dashboard-layout {\n                            display: none !important;\n                        }\n                    }\n                    "),
            react_1["default"].createElement("div", { id: "loan-statement-screen-area", className: "bg-slate-50 p-4 border-b border-slate-100 flex justify-between items-center print:hidden" },
                react_1["default"].createElement(button_1.Button, { variant: "ghost", onClick: function () { return setShowStatement(false); }, className: "text-[10px] font-black uppercase tracking-widest gap-2" },
                    react_1["default"].createElement(lucide_react_1.ChevronLeft, { size: 14 }),
                    " Volver al Expediente"),
                react_1["default"].createElement("div", { className: "flex gap-3" },
                    react_1["default"].createElement(button_1.Button, { onClick: handlePrint, className: "bg-slate-900 text-white rounded-none h-10 px-6 text-[10px] font-black uppercase tracking-widest gap-2" },
                        react_1["default"].createElement(lucide_react_1.Printer, { size: 14 }),
                        " Imprimir Extracto"))),
            react_1["default"].createElement("div", { className: "max-h-[80vh] overflow-y-auto print:hidden" },
                react_1["default"].createElement(loan_statement_1.LoanStatement, { loan: loan, empresa: empresaDato })))) : (react_1["default"].createElement(react_1["default"].Fragment, null,
            react_1["default"].createElement(dialog_1.DialogHeader, { className: "p-8 bg-slate-50 border-b border-slate-100" },
                react_1["default"].createElement("div", { className: "flex justify-between items-start" },
                    react_1["default"].createElement("div", { className: "space-y-1" },
                        react_1["default"].createElement("div", { className: "flex items-center gap-3" },
                            react_1["default"].createElement(badge_1.Badge, { className: "bg-slate-900 text-white rounded-none border-none text-[9px] font-black uppercase italic tracking-tighter shadow-lg" },
                                "REF: ", loan === null || loan === void 0 ? void 0 :
                                loan.id.slice(-8).toUpperCase()),
                            react_1["default"].createElement(dialog_1.DialogTitle, { className: "text-xl font-black text-slate-900 uppercase tracking-tighter italic" }, "Control de Cr\u00E9dito Operativo")),
                        react_1["default"].createElement(dialog_1.DialogDescription, { className: "text-[10px] font-black uppercase tracking-widest text-slate-400 italic" },
                            "TITULAR: ", loan === null || loan === void 0 ? void 0 :
                            loan.usuario.nombres,
                            " ", loan === null || loan === void 0 ? void 0 :
                            loan.usuario.apellidos,
                            " \u2014 MODALIDAD: ",
                            (loan === null || loan === void 0 ? void 0 : loan.tipo) === "FLEXIBLE_DIARIO" ? "CRÉDITO RÁPIDO" : "ESTÁNDAR")),
                    react_1["default"].createElement("div", { className: "text-right" },
                        react_1["default"].createElement("p", { className: "text-[10px] font-black text-slate-400 uppercase mb-1 italic tracking-widest" }, "Saldo Pendiente"),
                        react_1["default"].createElement("h3", { className: "text-3xl font-black text-slate-900 tracking-tighter italic" }, utils_1.formatCurrency(Number((loan === null || loan === void 0 ? void 0 : loan.saldoActual) || 0)))))),
            react_1["default"].createElement("div", { className: "grid grid-cols-3 divide-x divide-slate-100" },
                react_1["default"].createElement("div", { className: "p-8 bg-slate-50/50 space-y-6" },
                    react_1["default"].createElement("div", null,
                        react_1["default"].createElement(Label, { text: "Estado de Obligaci\u00F3n" }),
                        react_1["default"].createElement(badge_1.Badge, { className: utils_2.cn("mt-2 w-full justify-center rounded-none border-none text-[10px] font-black uppercase tracking-widest py-3 shadow-md italic", (loan === null || loan === void 0 ? void 0 : loan.estado) === "DESEMBOLSADO" ? "bg-emerald-500 text-white" :
                                (loan === null || loan === void 0 ? void 0 : loan.estado) === "PENDIENTE" ? "bg-amber-500 text-white" : "bg-slate-300 text-slate-500") }, loan === null || loan === void 0 ? void 0 : loan.estado)),
                    react_1["default"].createElement("div", { className: "space-y-3" },
                        react_1["default"].createElement(DataBox, { label: "Monto Desembolsado", value: utils_1.formatCurrency(Number((loan === null || loan === void 0 ? void 0 : loan.montoCapital) || 0)) }),
                        react_1["default"].createElement(DataBox, { label: "Tasa Aplicada", value: (Number((loan === null || loan === void 0 ? void 0 : loan.tasaMensual) || 0) * 100).toFixed(2) + "% " + ((loan === null || loan === void 0 ? void 0 : loan.tipo) === "FLEXIBLE_DIARIO" ? "DV" : "MV") }),
                        react_1["default"].createElement(DataBox, { label: "Plazo Original", value: (loan === null || loan === void 0 ? void 0 : loan.numCuotas) + " " + ((loan === null || loan === void 0 ? void 0 : loan.tipo) === "FLEXIBLE_DIARIO" ? "DÍAS" : "MESES") })),
                    react_1["default"].createElement("div", { className: "pt-4 space-y-3" },
                        react_1["default"].createElement(button_1.Button, { onClick: function () { return setShowStatement(true); }, variant: "outline", className: "w-full rounded-none h-12 border-slate-900 text-slate-900 font-black uppercase tracking-widest text-[9px] hover:bg-slate-900 hover:text-white transition-all gap-3" },
                            react_1["default"].createElement(lucide_react_1.FileText, { className: "h-4 w-4" }),
                            "Generar Extracto T\u00E9cnico"),
                        (loan === null || loan === void 0 ? void 0 : loan.estado) === "PENDIENTE" && (react_1["default"].createElement(button_1.Button, { onClick: handleDisburse, disabled: loading, className: "w-full bg-slate-900 text-white hover:bg-black rounded-none h-14 font-black uppercase tracking-widest text-[10px] shadow-2xl transition-all" }, loading ? "PROCESANDO..." : "AUTORIZAR DESEMBOLSO")))),
                react_1["default"].createElement("div", { className: "col-span-2 p-0 overflow-hidden bg-white" },
                    react_1["default"].createElement("div", { className: "p-6 bg-white border-b border-slate-100 flex justify-between items-center font-black" },
                        react_1["default"].createElement("h4", { className: "text-[11px] text-slate-900 uppercase tracking-widest flex items-center gap-2 italic" },
                            react_1["default"].createElement(lucide_react_1.HandCoins, { className: "h-4 w-4 text-emerald-500" }),
                            "Cronograma de Amortizaci\u00F3n Vigente")),
                    react_1["default"].createElement("div", { className: "h-[400px] overflow-y-auto" },
                        react_1["default"].createElement("table", { className: "w-full text-[10px] text-left" },
                            react_1["default"].createElement("thead", { className: "bg-slate-50 sticky top-0 font-black uppercase tracking-tighter italic border-b border-slate-100 text-slate-400" },
                                react_1["default"].createElement("tr", null,
                                    react_1["default"].createElement("th", { className: "px-6 py-4" }, "N\u00B0"),
                                    react_1["default"].createElement("th", { className: "px-6 py-4" }, "Vencimiento"),
                                    react_1["default"].createElement("th", { className: "px-6 py-4" }, "Valor Cuota"),
                                    react_1["default"].createElement("th", { className: "px-6 py-4" }, "Estado"),
                                    react_1["default"].createElement("th", { className: "px-6 py-4 text-right" }, "Captura Recaudo"))),
                            react_1["default"].createElement("tbody", { className: "divide-y divide-slate-100" }, (_b = loan === null || loan === void 0 ? void 0 : loan.cuotas) === null || _b === void 0 ? void 0 : _b.map(function (c) { return (react_1["default"].createElement("tr", { key: c.id, className: utils_2.cn("transition-colors", c.estado === "PAGADA" ? "bg-emerald-50/30" : "hover:bg-slate-50") },
                                react_1["default"].createElement("td", { className: "px-6 py-4 font-black text-slate-300 italic" },
                                    "#",
                                    String(c.numCuota).padStart(2, '0')),
                                react_1["default"].createElement("td", { className: "px-6 py-4" },
                                    react_1["default"].createElement("div", { className: "flex items-center gap-2 uppercase font-bold text-slate-500 tracking-tighter italic" },
                                        react_1["default"].createElement(lucide_react_1.Calendar, { className: "h-3 w-3 text-slate-300" }),
                                        new Date(c.fechaVencimiento).toLocaleDateString())),
                                react_1["default"].createElement("td", { className: "px-6 py-4 font-black text-slate-900 tabular-nums" }, utils_1.formatCurrency(Number(c.totalCuota))),
                                react_1["default"].createElement("td", { className: "px-6 py-4" },
                                    react_1["default"].createElement(badge_1.Badge, { className: utils_2.cn("rounded-none border-none text-[8px] font-black uppercase tracking-tighter italic px-2", c.estado === "PAGADA" ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800") }, c.estado)),
                                react_1["default"].createElement("td", { className: "px-6 py-4 text-right" },
                                    c.estado !== "PAGADA" && (loan === null || loan === void 0 ? void 0 : loan.estado) === "DESEMBOLSADO" && (react_1["default"].createElement(button_1.Button, { size: "sm", variant: "outline", onClick: function () { return handlePay(c.id, Number(c.totalCuota)); }, className: "rounded-none border-slate-200 text-slate-900 text-[9px] font-black uppercase px-4 h-8 hover:bg-emerald-500 hover:border-emerald-500 hover:text-white transition-all group" },
                                        react_1["default"].createElement(lucide_react_1.ArrowDownCircle, { className: "h-3 w-3 mr-2 group-hover:scale-125 transition-transform" }),
                                        "Recaudar")),
                                    c.estado === "PAGADA" && (react_1["default"].createElement("div", { className: "flex items-center justify-end gap-2 text-emerald-600 font-black text-[9px] uppercase tracking-widest italic animate-in slide-in-from-right duration-300" },
                                        react_1["default"].createElement(lucide_react_1.CheckCircle2, { className: "h-4 w-4" }),
                                        "Sincronizado"))))); }))),
                        (!(loan === null || loan === void 0 ? void 0 : loan.cuotas) || loan.cuotas.length === 0) && (react_1["default"].createElement("div", { className: "p-20 text-center space-y-4" },
                            react_1["default"].createElement(lucide_react_1.AlertTriangle, { className: "h-10 w-10 text-amber-400 mx-auto" }),
                            react_1["default"].createElement("p", { className: "text-[11px] font-black text-slate-300 uppercase italic tracking-widest" }, "Motor de amortizaci\u00F3n en espera del desembolso efectivo de fondos.")))))),
            react_1["default"].createElement(dialog_1.DialogFooter, { className: "p-8 bg-slate-50 border-t border-slate-100" },
                react_1["default"].createElement(button_1.Button, { onClick: onClose, variant: "ghost", className: "rounded-none font-black uppercase text-[10px] tracking-widest h-12 hover:bg-white transition-colors" }, "Cerrar Expediente")))))));
}
exports.LoanDetailDialog = LoanDetailDialog;
function Label(_a) {
    var text = _a.text;
    return react_1["default"].createElement("p", { className: "text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 italic" }, text);
}
function DataBox(_a) {
    var label = _a.label, value = _a.value;
    return (react_1["default"].createElement("div", { className: "bg-white p-4 border border-slate-100 shadow-sm" },
        react_1["default"].createElement("p", { className: "text-[9px] font-black text-slate-400 uppercase tracking-tighter mb-1 italic" }, label),
        react_1["default"].createElement("p", { className: "text-[13px] font-black text-slate-900 truncate tracking-tight uppercase italic tabular-nums" }, value)));
}
