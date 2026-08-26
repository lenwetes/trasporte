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
var client_1 = require("@prisma/client");
var faker_1 = require("@faker-js/faker");
var fs_1 = require("fs");
var path_1 = require("path");
var crypto_1 = require("crypto");
var prisma = new client_1.PrismaClient();
var MODELS = [
    { marca: 'Nissan', modelos: ['Urvan', 'Frontier'] },
    { marca: 'Toyota', modelos: ['Hiace', 'Hilux'] },
    { marca: 'Renault', modelos: ['Master', 'Kangoo'] },
    { marca: 'Mercedes-Benz', modelos: ['Sprinter 313', 'Sprinter 515'] },
    { marca: 'Volkswagen', modelos: ['Crafter', 'Transporter'] },
    { marca: 'Chevrolet', modelos: ['NKR', 'NHR', 'NPR'] },
    { marca: 'Hino', modelos: ['Dutro', '300'] }
];
var COLORS = ['Blanco', 'Plateado', 'Gris', 'Verde (Escolar)', 'Blanco/Azul'];
function createDummyPDF(name) {
    return __awaiter(this, void 0, void 0, function () {
        var uploadsDir, nombreUnico, rutaAbsoluta, stats, file;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    uploadsDir = path_1["default"].join(process.cwd(), 'storage', 'uploads');
                    if (!fs_1["default"].existsSync(uploadsDir)) {
                        fs_1["default"].mkdirSync(uploadsDir, { recursive: true });
                    }
                    nombreUnico = Date.now() + "-" + crypto_1["default"].randomBytes(4).toString('hex') + "-" + name;
                    rutaAbsoluta = path_1["default"].join(uploadsDir, nombreUnico);
                    // Create a minimal "PDF-like" file (just text for testing)
                    fs_1["default"].writeFileSync(rutaAbsoluta, "%PDF-1.4\n%Dummy PDF for " + name + "\n%%EOF");
                    stats = fs_1["default"].statSync(rutaAbsoluta);
                    return [4 /*yield*/, prisma.repositorioArchivo.create({
                            data: {
                                nombreOriginal: name,
                                nombreUnico: nombreUnico,
                                rutaAbsoluta: rutaAbsoluta,
                                tipoMime: 'application/pdf',
                                tamano: stats.size
                            }
                        })];
                case 1:
                    file = _a.sent();
                    return [2 /*return*/, file.id];
            }
        });
    });
}
function main() {
    return __awaiter(this, void 0, void 0, function () {
        var propietarios, i, firstName, lastName, user, conductores, i, firstName, lastName, docId, licId, medId, user, planes, planIds, _i, planes_1, p, plan, i, brandData, modelStr, placa, owner, driver, soatId, tecnoId, operId, rceId, rccId, vehiculo, tipos, j;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log('🧹 Limpiando base de datos para banco de pruebas...');
                    return [4 /*yield*/, prisma.novedad.deleteMany()];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, prisma.obligacionFinanciera.deleteMany()];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, prisma.documentoVehiculo.deleteMany()];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, prisma.vinculacion.deleteMany()];
                case 4:
                    _a.sent();
                    return [4 /*yield*/, prisma.hojaVidaVehiculo.deleteMany()];
                case 5:
                    _a.sent();
                    return [4 /*yield*/, prisma.vehiculo.deleteMany()];
                case 6:
                    _a.sent();
                    return [4 /*yield*/, prisma.examenMedico.deleteMany()];
                case 7:
                    _a.sent();
                    return [4 /*yield*/, prisma.detalleLicencia.deleteMany()];
                case 8:
                    _a.sent();
                    return [4 /*yield*/, prisma.hojaVida.deleteMany()];
                case 9:
                    _a.sent();
                    // No borramos todos los usuarios para no perder el admin si existe, 
                    // pero sí los de roles específicos de prueba
                    return [4 /*yield*/, prisma.usuario.deleteMany({ where: { rol: { "in": [client_1.Rol.CONDUCTOR, client_1.Rol.PROPIETARIO] } } })];
                case 10:
                    // No borramos todos los usuarios para no perder el admin si existe, 
                    // pero sí los de roles específicos de prueba
                    _a.sent();
                    return [4 /*yield*/, prisma.planMantenimiento.deleteMany()];
                case 11:
                    _a.sent();
                    console.log('🚀 Iniciando siembra de datos de prueba completos...');
                    // 1. Crear Propietarios (15)
                    console.log('👥 Creando 15 Propietarios...');
                    propietarios = [];
                    i = 0;
                    _a.label = 12;
                case 12:
                    if (!(i < 15)) return [3 /*break*/, 15];
                    firstName = faker_1.fakerES_MX.person.firstName();
                    lastName = faker_1.fakerES_MX.person.lastName();
                    return [4 /*yield*/, prisma.usuario.create({
                            data: {
                                nombres: firstName,
                                apellidos: lastName,
                                tipoDocumento: client_1.TipoDocumento.CC,
                                numeroDocumento: faker_1.fakerES_MX.string.numeric(10),
                                email: faker_1.fakerES_MX.internet.email({ firstName: firstName, lastName: lastName }).toLowerCase(),
                                passwordHash: '$argon2id$v=19$m=65536,t=3,p=4$6mU+K...',
                                rol: client_1.Rol.PROPIETARIO,
                                telefono: '3' + faker_1.fakerES_MX.string.numeric(9),
                                direccion: faker_1.fakerES_MX.location.streetAddress(),
                                municipio: 'Sincelejo',
                                activo: true
                            }
                        })];
                case 13:
                    user = _a.sent();
                    propietarios.push(user);
                    _a.label = 14;
                case 14:
                    i++;
                    return [3 /*break*/, 12];
                case 15:
                    // 2. Crear Conductores (30)
                    console.log('👨‍✈️ Creando 30 Conductores con datos completos...');
                    conductores = [];
                    i = 0;
                    _a.label = 16;
                case 16:
                    if (!(i < 30)) return [3 /*break*/, 22];
                    firstName = faker_1.fakerES_MX.person.firstName();
                    lastName = faker_1.fakerES_MX.person.lastName();
                    return [4 /*yield*/, createDummyPDF("cc-" + firstName + ".pdf")];
                case 17:
                    docId = _a.sent();
                    return [4 /*yield*/, createDummyPDF("licencia-" + firstName + ".pdf")];
                case 18:
                    licId = _a.sent();
                    return [4 /*yield*/, createDummyPDF("examen-medico-" + firstName + ".pdf")];
                case 19:
                    medId = _a.sent();
                    return [4 /*yield*/, prisma.usuario.create({
                            data: {
                                nombres: firstName,
                                apellidos: lastName,
                                tipoDocumento: client_1.TipoDocumento.CC,
                                numeroDocumento: faker_1.fakerES_MX.string.numeric(10),
                                email: faker_1.fakerES_MX.internet.email({ firstName: firstName, lastName: lastName }).toLowerCase(),
                                passwordHash: '$argon2id$v=19$m=65536,t=3,p=4$6mU+K...',
                                rol: client_1.Rol.CONDUCTOR,
                                telefono: '3' + faker_1.fakerES_MX.string.numeric(9),
                                direccion: faker_1.fakerES_MX.location.streetAddress(),
                                municipio: i % 2 === 0 ? 'Sincelejo' : 'Corozal',
                                fechaNacimiento: faker_1.fakerES_MX.date.birthdate({ min: 18, max: 65, mode: 'age' }),
                                estadoCivil: faker_1.fakerES_MX.helpers.arrayElement(['Soltero', 'Casado', 'Union Libre']),
                                numeroLicencia: faker_1.fakerES_MX.string.numeric(12),
                                idDocumentoIdentidad: docId,
                                hojaVida: {
                                    create: {
                                        rh: faker_1.fakerES_MX.helpers.arrayElement(['O+', 'O-', 'A+', 'B+']),
                                        eps: 'Sura',
                                        arl: 'Positiva',
                                        fondoPensiones: 'Protección',
                                        contactoEmergenciaNombre: faker_1.fakerES_MX.person.fullName(),
                                        contactoEmergenciaTelefono: '3' + faker_1.fakerES_MX.string.numeric(9),
                                        perfilProfesional: 'Conductor con amplia experiencia en transporte especial.'
                                    }
                                },
                                licencias: {
                                    create: {
                                        categoria: 'C2',
                                        servicio: 'PUBLICO',
                                        fechaVencimiento: faker_1.fakerES_MX.date.future({ years: 3 }),
                                        archivoId: licId
                                    }
                                },
                                examenesMedicos: {
                                    create: {
                                        tipo: 'INGRESO',
                                        fechaRealizacion: faker_1.fakerES_MX.date.past(),
                                        fechaVencimiento: faker_1.fakerES_MX.date.future(),
                                        entidadMedica: 'Sura Salud',
                                        concepto: 'APTO',
                                        archivoId: medId
                                    }
                                }
                            }
                        })];
                case 20:
                    user = _a.sent();
                    conductores.push(user);
                    _a.label = 21;
                case 21:
                    i++;
                    return [3 /*break*/, 16];
                case 22:
                    // 3. Crear Planes de Mantenimiento (Tiempo)
                    console.log('🔧 Creando Planes de Mantenimiento...');
                    planes = [
                        { nombre: 'Preventivo Mensual', meses: 1 },
                        { nombre: 'Revisión Bimestral', meses: 2 },
                        { nombre: 'Preventivo Trimestral', meses: 3 },
                        { nombre: 'Mantenimiento Semestral', meses: 6 },
                        { nombre: 'Certificación Anual', meses: 12 }
                    ];
                    planIds = [];
                    _i = 0, planes_1 = planes;
                    _a.label = 23;
                case 23:
                    if (!(_i < planes_1.length)) return [3 /*break*/, 26];
                    p = planes_1[_i];
                    return [4 /*yield*/, prisma.planMantenimiento.create({
                            data: {
                                nombre: p.nombre,
                                frecuencia: client_1.FrecuenciaMantenimiento.TIEMPO,
                                mesesIntervalo: p.meses,
                                descripcion: "Plan autom\u00E1tico cada " + p.meses + " meses."
                            }
                        })];
                case 24:
                    plan = _a.sent();
                    planIds.push(plan.id);
                    _a.label = 25;
                case 25:
                    _i++;
                    return [3 /*break*/, 23];
                case 26:
                    // 4. Crear Vehículos (30)
                    console.log('🚐 Creando 30 Vehículos de transporte especial...');
                    i = 0;
                    _a.label = 27;
                case 27:
                    if (!(i < 30)) return [3 /*break*/, 40];
                    brandData = faker_1.fakerES_MX.helpers.arrayElement(MODELS);
                    modelStr = faker_1.fakerES_MX.helpers.arrayElement(brandData.modelos);
                    placa = faker_1.fakerES_MX.string.alpha({ length: 3, casing: 'upper' }) + "-" + faker_1.fakerES_MX.string.numeric(3);
                    owner = faker_1.fakerES_MX.helpers.arrayElement(propietarios);
                    driver = conductores[i];
                    return [4 /*yield*/, createDummyPDF("soat-" + placa + ".pdf")];
                case 28:
                    soatId = _a.sent();
                    return [4 /*yield*/, createDummyPDF("tecnomecanica-" + placa + ".pdf")];
                case 29:
                    tecnoId = _a.sent();
                    return [4 /*yield*/, createDummyPDF("operacion-" + placa + ".pdf")];
                case 30:
                    operId = _a.sent();
                    return [4 /*yield*/, createDummyPDF("rce-" + placa + ".pdf")];
                case 31:
                    rceId = _a.sent();
                    return [4 /*yield*/, createDummyPDF("rcc-" + placa + ".pdf")];
                case 32:
                    rccId = _a.sent();
                    return [4 /*yield*/, prisma.vehiculo.create({
                            data: {
                                placa: placa,
                                marca: brandData.marca,
                                modelo: modelStr,
                                anho: faker_1.fakerES_MX.number.int({ min: 2015, max: 2024 }),
                                color: faker_1.fakerES_MX.helpers.arrayElement(COLORS),
                                capacidadPuestos: faker_1.fakerES_MX.number.int({ min: 5, max: 25 }),
                                numeroMotor: faker_1.fakerES_MX.string.alphanumeric(15).toUpperCase(),
                                numeroChasis: faker_1.fakerES_MX.string.alphanumeric(17).toUpperCase(),
                                numeroInterno: (200 + i).toString(),
                                clase: modelStr === 'NKR' || modelStr === 'NPR' ? client_1.ClaseVehiculo.BUSETA : client_1.ClaseVehiculo.MICROBUS,
                                modalidad: client_1.Modalidad.CONVENIO_EXTERNO,
                                propietarioId: owner.id,
                                kilometrajeActual: faker_1.fakerES_MX.number.int({ min: 10000, max: 200000 }),
                                vinculaciones: {
                                    create: {
                                        conductorId: driver.id,
                                        activo: true
                                    }
                                },
                                documentos: {
                                    create: [
                                        { tipo: 'SOAT', fechaVencimiento: faker_1.fakerES_MX.date.future(), archivoId: soatId },
                                        { tipo: 'REVISION_TECNOMECANICA', fechaVencimiento: faker_1.fakerES_MX.date.future(), archivoId: tecnoId },
                                        { tipo: 'TARJETA_OPERACION', fechaVencimiento: faker_1.fakerES_MX.date.future(), archivoId: operId },
                                        { tipo: 'POLIZA_EXTRACONTRACTUAL', fechaVencimiento: faker_1.fakerES_MX.date.future(), archivoId: rceId },
                                        { tipo: 'POLIZA_CONTRACTUAL', fechaVencimiento: faker_1.fakerES_MX.date.future(), archivoId: rccId }
                                    ]
                                },
                                hojaVida: {
                                    create: {
                                        observaciones: 'Vehículo en excelentes condiciones operativas.'
                                    }
                                }
                            }
                        })];
                case 33:
                    vehiculo = _a.sent();
                    tipos = Object.values(client_1.TipoNovedad);
                    j = 0;
                    _a.label = 34;
                case 34:
                    if (!(j < 3)) return [3 /*break*/, 37];
                    return [4 /*yield*/, prisma.novedad.create({
                            data: {
                                tipo: faker_1.fakerES_MX.helpers.arrayElement(tipos),
                                descripcion: faker_1.fakerES_MX.lorem.sentence(),
                                fecha: faker_1.fakerES_MX.date.recent({ days: 60 }),
                                monto: faker_1.fakerES_MX.number.float({ min: 10000, max: 500000 }),
                                estado: faker_1.fakerES_MX.helpers.arrayElement([client_1.EstadoNovedad.PENDIENTE, client_1.EstadoNovedad.RESUELTO]),
                                vehiculoId: vehiculo.id,
                                conductorId: driver.id
                            }
                        })];
                case 35:
                    _a.sent();
                    _a.label = 36;
                case 36:
                    j++;
                    return [3 /*break*/, 34];
                case 37: 
                // 6. Crear una Obligación de Seguro (Financiera)
                return [4 /*yield*/, prisma.obligacionFinanciera.create({
                        data: {
                            usuarioId: owner.id,
                            vehiculoId: vehiculo.id,
                            tipo: client_1.TipoObligacion.OTRO,
                            periodo: new Date(),
                            fechaVence: faker_1.fakerES_MX.date.future(),
                            montoInicial: "450000",
                            saldoPendiente: "450000",
                            estado: client_1.EstadoObligacion.PENDIENTE
                        }
                    })];
                case 38:
                    // 6. Crear una Obligación de Seguro (Financiera)
                    _a.sent();
                    _a.label = 39;
                case 39:
                    i++;
                    return [3 /*break*/, 27];
                case 40:
                    console.log('✅ Siembra de datos completada con éxito.');
                    return [2 /*return*/];
            }
        });
    });
}
main()["catch"](function (e) {
    console.error(e);
    process.exit(1);
})["finally"](function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, prisma.$disconnect()];
            case 1:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); });
