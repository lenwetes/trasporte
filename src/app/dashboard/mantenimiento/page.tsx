import { MantenimientoView } from "./_components/mantenimiento-view";

export const dynamic = "force-dynamic";

export default function MantenimientoPage() {
    return (
        <div className="space-y-10 animate-in fade-in slide-in-from-top-4 duration-1000 p-8 lg:p-12 bg-slate-50/10 min-h-screen">
            <MantenimientoView />
        </div>
    );
}
