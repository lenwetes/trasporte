"use client";

import { useState, useEffect } from "react";
import { XMLParser } from "fast-xml-parser";
import {
    getFinanceMetadata,
    createManualTransaction,
} from "@/actions/finance/transactions";
import { upsertProvider as createProveedor } from "@/actions/finance/providers";
import { uploadFile } from "@/actions/uploads";
import { toast } from "sonner";
import {
    CuentaContable,
    Proveedor,
    ConceptoFinanciero,
    Usuario,
    Vehiculo,
} from "@prisma/client";

export const SUGGESTED_CONCEPTS = [
    {
        label: "Servicio de Limpieza y Aseo",
        account: "5195",
        hint: "Gasto Diversos",
    },
    {
        label: "Mantenimiento de Oficina",
        account: "5145",
        hint: "Mantenimiento y Reparaciones",
    },
    {
        label: "Mantenimiento de Vehículos",
        account: "5145",
        hint: "Mantenimiento Propio/Externo",
    },
    {
        label: "Energía Eléctrica / Agua",
        account: "5135",
        hint: "Servicios Públicos",
    },
    { label: "Arrendamiento Local", account: "5120", hint: "Arrendamientos" },
    { label: "Papelería y Útiles", account: "5130", hint: "Seguros / Útiles" },
    {
        label: "Honorarios Contables/Legales",
        account: "5110",
        hint: "Honorarios",
    },
    {
        label: "Internet y Telefonía",
        account: "5135",
        hint: "Servicios de Com.",
    },
    {
        label: "Cafetería y Alimentos",
        account: "5195",
        hint: "Gastos Diversos",
    },
];

export interface FinanceMetadata {
    cuentas: CuentaContable[];
    proveedores: Proveedor[];
    usuarios: Usuario[];
    vehiculos: Vehiculo[];
    conceptos: (ConceptoFinanciero & { cuenta: CuentaContable })[];
}

export function useExpenseForm(
    open: boolean,
    setOpen: (open: boolean) => void,
) {
    const [loading, setLoading] = useState(false);
    const [metadata, setMetadata] = useState<FinanceMetadata | null>(null);
    const [showNewProvider, setShowNewProvider] = useState(false);
    const [uploading, setUploading] = useState(false);

    const [formData, setFormData] = useState({
        descripcion: "",
        proveedorId: "",
        monto: "",
        cuentaGastoId: "",
        cuentaCajaId: "",
        esElectronica: false,
        cufe: "",
        documentoNumero: "",
        archivoIds: [] as string[],
        archivoNames: [] as string[],
    });

    const [providerData, setProviderData] = useState({
        nombres: "",
        apellidos: "",
        numeroDocumento: "",
        celular: "",
        email: "",
    });

    const load = async () => {
        try {
            const res = await getFinanceMetadata();
            if (res.success && res.data) {
                const data = res.data as unknown as FinanceMetadata;
                setMetadata(data);
                const caja = data.cuentas?.find(
                    (c) => c.codigo === "110505",
                );
                if (caja)
                    setFormData((f) => ({ ...f, cuentaCajaId: caja.id }));
            }
        } catch (error) {
            console.error("Error loading finance metadata:", error);
        }
    };

    useEffect(() => {
        if (open) {
            load();
        }
    }, [open]);

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        try {
            const upFormData = new FormData();
            upFormData.append("file", file);

            const res = await uploadFile(upFormData);
            if (res.success && res.data) {
                const archivo = res.data as { id: string; nombreOriginal: string };
                let autoData: Partial<typeof formData> = {};

                if (file.name.toLowerCase().endsWith(".xml")) {
                    try {
                        const text = await file.text();
                        const parser = new XMLParser({
                            ignoreAttributes: false,
                            attributeNamePrefix: "@_",
                        });
                        const xml = parser.parse(text);
                        const invoice =
                            xml.Invoice || xml["sem:Invoice"] || xml["fe:Invoice"];

                        if (invoice) {
                            const invoiceFullId = invoice["cbc:ID"] || "";
                            const cufeValue = invoice["cbc:UUID"] || "";
                            
                            // Navegación segura por el XML de la DIAN
                            const accountingSupplier = invoice["cac:AccountingSupplierParty"];
                            const party = accountingSupplier?.["cac:Party"];
                            const partyNameNode = party?.["cac:PartyName"]?.["cbc:Name"] || 
                                party?.["cac:PartyTaxScheme"]?.["cbc:RegistrationName"] || "";
                            
                            const companyIdNode = party?.["cac:PartyTaxScheme"]?.["cbc:CompanyID"];
                            const nitValue = typeof companyIdNode === 'object' ? companyIdNode?.["#text"] : companyIdNode || "";

                            const monetaryTotal = invoice["cac:LegalMonetaryTotal"];
                            const payableAmountNode = monetaryTotal?.["cbc:PayableAmount"];
                            const amountValue = typeof payableAmountNode === 'object' ? payableAmountNode?.["#text"] : payableAmountNode || "0";

                            autoData = {
                                documentoNumero: invoiceFullId,
                                cufe: cufeValue,
                                monto: amountValue,
                                esElectronica: true,
                                descripcion: `Corresponde a Factura ${invoiceFullId} - ${partyNameNode}`,
                            };

                            toast.success("Información extraída de Factura Electrónica");

                            if (partyNameNode && metadata?.proveedores) {
                                const p = metadata.proveedores.find(
                                    (pv) => pv.numeroDocumento === nitValue,
                                );
                                if (p) {
                                    autoData.proveedorId = p.id;
                                } else {
                                    setProviderData((prev) => ({
                                        ...prev,
                                        nombres: String(partyNameNode),
                                        numeroDocumento: String(nitValue),
                                    }));
                                    toast.info(
                                        "Proveedor nuevo detectado. Complete el registro.",
                                    );
                                    setShowNewProvider(true);
                                }
                            }
                        }
                    } catch (e) {
                        console.error("XML Parse Error", e);
                        toast.error("Error al leer el contenido del XML");
                    }
                }

                setFormData((f) => ({
                    ...f,
                    ...autoData,
                    archivoIds: [...f.archivoIds, archivo.id],
                    archivoNames: [...f.archivoNames, archivo.nombreOriginal],
                }));
                toast.success("Documento adjunto correctamente");
            } else {
                toast.error(res.error || "Error al subir archivo");
            }
        } catch (err) {
            toast.error("Error crítico en la subida");
        } finally {
            setUploading(false);
        }
    };

    const removeArchivo = (index: number) => {
        setFormData((f) => ({
            ...f,
            archivoIds: f.archivoIds.filter((_, i) => i !== index),
            archivoNames: f.archivoNames.filter((_, i) => i !== index),
        }));
    };

    const handleConceptChange = (val: string) => {
        setFormData((f) => ({ ...f, descripcion: val }));
        const suggestion = SUGGESTED_CONCEPTS.find((s) =>
            val.toLowerCase().includes(s.label.toLowerCase().split(" ")[0]),
        );
        if (suggestion && metadata) {
            const account = metadata.cuentas.find((c) =>
                c.codigo.startsWith(suggestion.account),
            );
            if (account)
                setFormData((f) => ({ ...f, cuentaGastoId: account.id }));
        }
    };

    const handleCreateProvider = async () => {
        if (!providerData.nombres || !providerData.numeroDocumento) {
            return toast.error("Nombre y Documento son requeridos");
        }
        setLoading(true);
        try {
            const res = await createProveedor({
                ...providerData,
                tipoDocumento: "NIT",
                activo: true,
            });
            if (res.success && res.data) {
                toast.success("Proveedor vinculado exitosamente");
                const newRes = await getFinanceMetadata();
                if (newRes.success && newRes.data) {
                    setMetadata(newRes.data as unknown as FinanceMetadata);
                    setFormData((f) => ({
                        ...f,
                        proveedorId: (res.data as Proveedor).id,
                    }));
                }
                setShowNewProvider(false);
            } else {
                toast.error(res.error || "Error al crear proveedor");
            }
        } catch (err) {
            toast.error("Error procesando solicitud");
        } finally {
            setLoading(false);
        }
    };

    const isValidCUFE = (cufe: string) => /^[a-fA-F0-9]{40,100}$/.test(cufe);

    const handleSubmit = async () => {
        if (!formData.proveedorId)
            return toast.error("Debe seleccionar un proveedor");
        if (!formData.cuentaGastoId || !formData.cuentaCajaId)
            return toast.error("Es obligatorio parametrizar las cuentas");
        if (!formData.monto || Number(formData.monto) <= 0)
            return toast.error("Monto inválido para egreso");

        if (formData.esElectronica) {
            if (!formData.documentoNumero)
                return toast.error(
                    "El número de factura externa es obligatorio para electrónicos",
                );
            if (formData.cufe && !isValidCUFE(formData.cufe)) {
                return toast.error("El CUFE ingresado no tiene un formato válido");
            }
        }

        setLoading(true);
        try {
            const payload = {
                descripcion: formData.descripcion,
                tipo: "EGRESO" as const,
                proveedorId: formData.proveedorId,
                documentoNumero: formData.documentoNumero,
                cufe: formData.cufe,
                esElectronica: formData.esElectronica,
                archivoIds: formData.archivoIds,
                asientos: [
                    {
                        cuentaId: formData.cuentaGastoId,
                        debito: Number(formData.monto),
                        credito: 0,
                    },
                    {
                        cuentaId: formData.cuentaCajaId,
                        debito: 0,
                        credito: Number(formData.monto),
                    },
                ],
            };

            const res = await createManualTransaction(payload);
            if (res.success) {
                toast.success("Comprobante de Egreso generado y causado");
                setOpen(false);
                setFormData({
                    descripcion: "",
                    proveedorId: "",
                    monto: "",
                    cuentaGastoId: "",
                    cuentaCajaId: formData.cuentaCajaId, // Mantenemos la caja por defecto
                    esElectronica: false,
                    cufe: "",
                    documentoNumero: "",
                    archivoIds: [],
                    archivoNames: [],
                });
            } else {
                toast.error(res.error || "Error al causar egreso");
            }
        } catch (error) {
            console.error(error);
            toast.error("Error crítico al procesar el egreso");
        } finally {
            setLoading(false);
        }
    };

    return {
        loading,
        metadata,
        showNewProvider,
        setShowNewProvider,
        uploading,
        formData,
        setFormData,
        providerData,
        setProviderData,
        handleFileUpload,
        removeArchivo,
        handleConceptChange,
        handleCreateProvider,
        handleSubmit,
    };
}
