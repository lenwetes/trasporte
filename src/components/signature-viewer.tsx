"use client";

import { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { FileSignature } from "lucide-react";

interface SignatureViewerProps {
    signatureData: string | null;
    label?: string;
}

export function SignatureViewer({
    signatureData,
    label = "Firma Digital",
}: SignatureViewerProps) {
    const [isOpen, setIsOpen] = useState(false);

    if (!signatureData) {
        return (
            <div>
                <FileSignature />
                Sin firma registrada
            </div>
        );
    }

    return (
        <>
            <Button
                variant="outline"
                size="sm"
                onClick={() => setIsOpen(true)}
            >
                <FileSignature />
                Ver Firma
            </Button>

            <Dialog open={isOpen} onOpenChange={setIsOpen}> <DialogContent>
                    <DialogHeader>
                        <DialogTitle>
                            <FileSignature />
                            {label}
                        </DialogTitle>
                    </DialogHeader>
                    <div>
                        <div>
                            <Image
                                src={signatureData}
                                alt="Firma Digital"
                                fill
                                
                            />
                        </div>
                        <div>
                            <p>
                                ✓ Esta firma digital tiene validez legal como
                                constancia de recepción conforme a la Ley 527 de
                                1999 sobre comercio electrónico en Colombia.
                            </p>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
}
