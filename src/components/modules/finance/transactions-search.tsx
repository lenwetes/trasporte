"use client";

import { Input } from "@/components/ui/input";
import { useRouter, useSearchParams } from "next/navigation";
import { useTransition } from "react";

export function TransactionsSearch() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [isPending, startTransition] = useTransition();

    function handleSearch(term: string) {
        const params = new URLSearchParams(searchParams);
        if (term) {
            params.set("search", term);
        } else {
            params.delete("search");
        }
        params.delete("page"); // Reset to page 1 on search

        startTransition(() => {
            router.push(`?${params.toString()}`);
        });
    }

    return (
        <div>
            <span>[SEARCH]</span>
            <Input
                placeholder="Buscar por descripción, tercero o ID..."
                defaultValue={searchParams.get("search")?.toString()}
                onChange={(e) => handleSearch(e.target.value)}
                
            />
        </div>
    );
}
