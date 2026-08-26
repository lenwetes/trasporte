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
exports.useFuecForm = void 0;
var React = require("react");
var react_hook_form_1 = require("react-hook-form");
var zod_1 = require("@hookform/resolvers/zod");
var fuec_1 = require("@/lib/validations/fuec");
var fuec_2 = require("@/actions/fuec");
var sonner_1 = require("sonner");
function useFuecForm(_a) {
    var isAdmin = _a.isAdmin, contratos = _a.contratos, _b = _a.costoBaseFuec, costoBaseFuec = _b === void 0 ? 10000 : _b;
    var _c = React.useState(false), isSubmitting = _c[0], setIsSubmitting = _c[1];
    var _d = React.useState(1), numConductores = _d[0], setNumConductores = _d[1];
    var _e = React.useState(true), safetyComplete = _e[0], setSafetyComplete = _e[1];
    var _f = React.useState(null), activeResolucion = _f[0], setActiveResolucion = _f[1];
    var _g = React.useState(contratos), localContratos = _g[0], setLocalContratos = _g[1];
    var _h = React.useState(false), showSuccess = _h[0], setShowSuccess = _h[1];
    var _j = React.useState(null), createdFuec = _j[0], setCreatedFuec = _j[1];
    var _k = React.useState(false), manualNumbering = _k[0], setManualNumbering = _k[1];
    var form = react_hook_form_1.useForm({
        resolver: zod_1.zodResolver(fuec_1.fuecSchema),
        mode: "onSubmit",
        reValidateMode: "onSubmit",
        defaultValues: {
            contratoId: "",
            vehiculoId: "",
            conductor1Id: "",
            rutas: [{ origen: "", destino: "", perimetroUrbano: true }],
            fechaInicio: new Date(),
            fechaFin: new Date(),
            force: false,
            justificacion: "",
            modoPago: "EFECTIVO",
            valorIngreso: costoBaseFuec
        }
    });
    var _l = react_hook_form_1.useFieldArray({
        control: form.control,
        name: "rutas"
    }), fields = _l.fields, append = _l.append, remove = _l.remove;
    var isForceEnabled = form.watch("force");
    var selectedContratoId = form.watch("contratoId");
    var selectedVehiculoId = form.watch("vehiculoId");
    var selectedContrato = localContratos.find(function (c) { return c.id === selectedContratoId; });
    React.useEffect(function () {
        if (isAdmin) {
            fuec_2.getResolucionesFuec().then(function (res) {
                if (res.success && res.data) {
                    var data = res.data;
                    var active = data.find(function (r) { return r.habilitada; });
                    if (active)
                        setActiveResolucion(active);
                }
            });
        }
    }, [isAdmin]);
    React.useEffect(function () {
        if (selectedVehiculoId) {
            fuec_2.getVehiculoConductor(selectedVehiculoId).then(function (res) {
                if (res.success && res.data) {
                    var driver = res.data;
                    form.setValue("conductor1Id", driver.id);
                    sonner_1.toast.info("Conductor " + driver.nombre + " auto-cargado.");
                }
            });
        }
    }, [selectedVehiculoId, form]);
    React.useEffect(function () {
        if (selectedContrato) {
            form.setValue("objetoViaje", selectedContrato.objeto || "");
        }
    }, [selectedContratoId, form, selectedContrato]);
    function onSubmit(data) {
        return __awaiter(this, void 0, void 0, function () {
            var res, _error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        setIsSubmitting(true);
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, 4, 5]);
                        return [4 /*yield*/, fuec_2.generateFuec(data)];
                    case 2:
                        res = _a.sent();
                        if (res.success && res.data) {
                            setCreatedFuec(res.data);
                            setShowSuccess(true);
                        }
                        else {
                            sonner_1.toast.error(res.error || "Error al generar FUEC");
                        }
                        return [3 /*break*/, 5];
                    case 3:
                        _error_1 = _a.sent();
                        sonner_1.toast.error("Error inesperado");
                        return [3 /*break*/, 5];
                    case 4:
                        setIsSubmitting(false);
                        return [7 /*endfinally*/];
                    case 5: return [2 /*return*/];
                }
            });
        });
    }
    function onError(errors) {
        var errorMessages = Object.values(errors)
            .map(function (err) { return err === null || err === void 0 ? void 0 : err.message; })
            .filter(Boolean);
        if (errorMessages.length > 0) {
            errorMessages.forEach(function (msg) { return sonner_1.toast.error(msg); });
        }
    }
    return {
        form: form,
        isSubmitting: isSubmitting,
        numConductores: numConductores,
        setNumConductores: setNumConductores,
        safetyComplete: safetyComplete,
        setSafetyComplete: setSafetyComplete,
        activeResolucion: activeResolucion,
        setActiveResolucion: setActiveResolucion,
        localContratos: localContratos,
        setLocalContratos: setLocalContratos,
        showSuccess: showSuccess,
        setShowSuccess: setShowSuccess,
        createdFuec: createdFuec,
        manualNumbering: manualNumbering,
        setManualNumbering: setManualNumbering,
        isForceEnabled: isForceEnabled,
        selectedContrato: selectedContrato,
        fields: fields,
        append: append,
        remove: remove,
        onSubmit: onSubmit,
        onError: onError
    };
}
exports.useFuecForm = useFuecForm;
