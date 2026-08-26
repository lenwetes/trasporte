"use client";

import { useConfiguracionForm } from "./configuracion-general/hooks/use-configuracion-form";
import { EnterpriseInfoSection } from "./configuracion-general/sections/enterprise-info-section";
import { BrandingSection } from "./configuracion-general/sections/branding-section";
import { AppearanceSection } from "./configuracion-general/sections/appearance-section";
import { StorageSection } from "./configuracion-general/sections/storage-section";
import { FinanceSection } from "./configuracion-general/sections/finance-section";

export function ConfiguracionGeneralForm({
    defaultValues,
}: {
    defaultValues: any;
}) {
    const { form, isSubmitting, isUploading, handleFileUpload, onSubmit } =
        useConfiguracionForm({ defaultValues });

    return (
        <div className="bg-white rounded-2xl space-y-8">
            <div className="space-y-1">
                <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight">Información de la Empresa</h2>
                <p className="text-slate-500 font-medium text-sm italic">Personaliza la identidad visual y datos de contacto.</p>
            </div>

            <form onSubmit={onSubmit} className="space-y-12">
                <div className="space-y-12 divide-y divide-slate-100">
                    <section className="pt-0">
                        <EnterpriseInfoSection form={form} />
                    </section>
                    
                    <section className="pt-12">
                        <FinanceSection form={form} />
                    </section>

                    <section className="pt-12">
                        <BrandingSection
                            form={form}
                            isUploading={isUploading}
                            handleFileUpload={handleFileUpload}
                        />
                    </section>

                    <section className="pt-12">
                        <AppearanceSection form={form} />
                    </section>
                </div>

                <div className="pt-8 border-t border-slate-200 flex justify-end">
                    <button 
                        type="submit" 
                        disabled={isSubmitting}
                        className="h-12 px-10 bg-slate-900 hover:bg-slate-800 text-white font-black uppercase tracking-[0.2em] text-[11px] rounded-xl shadow-lg shadow-slate-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isSubmitting ? "Sincronizando..." : "Guardar Cambios Maestros"}
                    </button>
                </div>
            </form>
        </div>
    );
}
