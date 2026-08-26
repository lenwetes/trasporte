import Link from "next/link";
import { auth } from "@/auth";
import { ShieldCheck, LogIn, LayoutDashboard } from "lucide-react";
import { Button } from "@/components/ui/button";

export async function Navbar() {
    const session = await auth();
    
    return (
        <header className="h-20 bg-white border-b border-primary/10 flex items-center justify-between px-6 lg:px-8 sticky top-0 z-50 transition-colors">
            <div className="flex items-center gap-12">
                <Link href="/" className="flex items-center gap-3 group">
                    <div className="h-10 w-10 bg-primary flex items-center justify-center transition-colors group-hover:bg-accent border border-primary/20">
                        <ShieldCheck className="h-5 w-5 text-white" />
                    </div>
                    <div>
                        <span className="block text-sm font-black uppercase text-primary tracking-[0.2em] leading-none">SGIT</span>
                        <span className="block text-[9px] font-black uppercase text-muted-foreground tracking-widest mt-1">COOPETRAES</span>
                    </div>
                </Link>

                <nav className="hidden md:flex items-center gap-8">
                    {/* Only show nav links if authenticated, as it's a private system for operations mostly */}
                    {session?.user && (
                        <>
                            <Link href="/dashboard" className="text-[10px] font-black text-primary/60 hover:text-primary uppercase tracking-widest transition-colors py-2 border-b-2 border-transparent hover:border-accent">DASHBOARD</Link>
                            <Link href="/dashboard/vehiculos" className="text-[10px] font-black text-primary/60 hover:text-primary uppercase tracking-widest transition-colors py-2 border-b-2 border-transparent hover:border-accent">FLOTA</Link>
                            <Link href="/dashboard/fuec" className="text-[10px] font-black text-primary/60 hover:text-primary uppercase tracking-widest transition-colors py-2 border-b-2 border-transparent hover:border-accent">FUEC</Link>
                        </>
                    )}
                </nav>
            </div>

            <div>
                {session?.user ? (
                    <div className="flex items-center gap-6">
                        <div className="hidden sm:block text-right">
                            <span className="block text-[10px] font-black text-slate-900 uppercase tracking-[0.2em]">OPERADOR VINCULADO</span>
                            <span className="block text-xs font-black text-primary uppercase tracking-tight">{session.user.name}</span>
                        </div>
                        <Link href="/dashboard">
                            <Button className="h-10 rounded-none bg-primary hover:bg-primary/90 text-white font-black uppercase tracking-widest text-[10px] gap-2">
                                <LayoutDashboard className="h-4 w-4 text-accent" /> DASHBOARD
                            </Button>
                        </Link>
                    </div>
                ) : (
                    <Link href="/login">
                        <Button variant="outline" className="h-10 rounded-none border-primary/20 hover:bg-primary/5 text-primary font-black uppercase tracking-widest text-[10px] gap-2">
                            ACCESO <LogIn className="h-4 w-4" />
                        </Button>
                    </Link>
                )}
            </div>
        </header>
    );
}
