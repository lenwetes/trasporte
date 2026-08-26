"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useTransition, useState, useEffect, useRef } from "react";
import { Search, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface SearchInputProps {
    placeholder?: string;
    className?: string;
}

export function SearchInput({
    placeholder = "🔍 ESCANEANDO REGISTROS...",
    className,
}: SearchInputProps) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const [isPending, startTransition] = useTransition();
    const initialRender = useRef(true);

    const [term, setTerm] = useState(
        searchParams.get("search")?.toString() || "",
    );

    // Sync state with URL when it changes externally
    useEffect(() => {
        const currentSearch = searchParams.get("search") || "";
        if (currentSearch !== term) {
            setTerm(currentSearch);
        }
    }, [searchParams]);

    useEffect(() => {
        if (initialRender.current) {
            initialRender.current = false;
            return;
        }

        const timeoutId = setTimeout(() => {
            const currentSearch = searchParams.get("search") || "";
            if (term !== currentSearch) {
                const params = new URLSearchParams(searchParams);
                if (term) {
                    params.set("search", term);
                } else {
                    params.delete("search");
                }
                params.delete("page");

                startTransition(() => {
                    router.push(`${pathname}?${params.toString()}`);
                });
            }
        }, 400);

        return () => clearTimeout(timeoutId);
    }, [term, searchParams, router, pathname]);

    return (
        <div className={cn("relative w-full group", className)}>
            <div className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-900 pointer-events-none transition-transform group-focus-within:scale-110">
                <Search className="h-full w-full" />
            </div>
            <input
                type="text"
                placeholder={placeholder}
                value={term}
                onChange={(e) => setTerm(e.target.value)}
                className="w-full h-11 pl-10 pr-12 bg-white border border-slate-200 rounded-none text-xs font-black uppercase tracking-widest text-slate-900 placeholder:text-slate-400 focus:border-cyan-600 focus:ring-0 transition-all outline-none"
            />
            
            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
                {isPending ? (
                    <Loader2 className="h-4 w-4 animate-spin text-cyan-600" />
                ) : (
                    <div className="text-[8px] font-black border border-slate-200 px-1 py-0.5 opacity-30 select-none">
                        F
                    </div>
                )}
            </div>
        </div>
    );
}
