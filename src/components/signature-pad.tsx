"use client";

import {
    useRef,
    useEffect,
    useState,
    forwardRef,
    useImperativeHandle,
} from "react";
import { Button } from "@/components/ui/button";
import { Eraser } from "lucide-react";

export interface SignaturePadRef {
    clear: () => void;
    isEmpty: () => boolean;
    toDataURL: () => string;
}

interface SignaturePadProps {
    onSignatureChange?: (signature: string) => void;
    width?: number;
    height?: number;
}

export const SignaturePad = forwardRef<SignaturePadRef, SignaturePadProps>(
    ({ onSignatureChange, width = 500, height = 200 }, ref) => {
        const canvasRef = useRef<HTMLCanvasElement>(null);
        const [isDrawing, setIsDrawing] = useState(false);
        const [isEmpty, setIsEmpty] = useState(true);

        useImperativeHandle(ref, () => ({
            clear: () => {
                const canvas = canvasRef.current;
                if (!canvas) return;
                const ctx = canvas.getContext("2d");
                if (!ctx) return;
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                setIsEmpty(true);
                onSignatureChange?.("");
            },
            isEmpty: () => isEmpty,
            toDataURL: () => {
                return canvasRef.current?.toDataURL("image/png") || "";
            },
        }));

        useEffect(() => {
            const canvas = canvasRef.current;
            if (!canvas) return;

            const ctx = canvas.getContext("2d");
            if (!ctx) return;

            // Configuración del canvas
            ctx.strokeStyle = "#1e293b";
            ctx.lineWidth = 2;
            ctx.lineCap = "round";
            ctx.lineJoin = "round";

            // Fondo blanco
            ctx.fillStyle = "#ffffff";
            ctx.fillRect(0, 0, canvas.width, canvas.height);
        }, []);

        const startDrawing = (
            e:
                | React.MouseEvent<HTMLCanvasElement>
                | React.TouchEvent<HTMLCanvasElement>,
        ) => {
            const canvas = canvasRef.current;
            if (!canvas) return;

            const ctx = canvas.getContext("2d");
            if (!ctx) return;

            setIsDrawing(true);
            setIsEmpty(false);

            const rect = canvas.getBoundingClientRect();
            const x =
                "touches" in e
                    ? e.touches[0].clientX - rect.left
                    : e.clientX - rect.left;
            const y =
                "touches" in e
                    ? e.touches[0].clientY - rect.top
                    : e.clientY - rect.top;

            ctx.beginPath();
            ctx.moveTo(x, y);
        };

        const draw = (
            e:
                | React.MouseEvent<HTMLCanvasElement>
                | React.TouchEvent<HTMLCanvasElement>,
        ) => {
            if (!isDrawing) return;

            const canvas = canvasRef.current;
            if (!canvas) return;

            const ctx = canvas.getContext("2d");
            if (!ctx) return;

            const rect = canvas.getBoundingClientRect();
            const x =
                "touches" in e
                    ? e.touches[0].clientX - rect.left
                    : e.clientX - rect.left;
            const y =
                "touches" in e
                    ? e.touches[0].clientY - rect.top
                    : e.clientY - rect.top;

            ctx.lineTo(x, y);
            ctx.stroke();
        };

        const stopDrawing = () => {
            if (!isDrawing) return;
            setIsDrawing(false);

            const canvas = canvasRef.current;
            if (!canvas) return;

            const ctx = canvas.getContext("2d");
            if (!ctx) return;

            ctx.closePath();

            // Notificar cambio
            const dataURL = canvas.toDataURL("image/png");
            onSignatureChange?.(dataURL);
        };

        const handleClear = () => {
            const canvas = canvasRef.current;
            if (!canvas) return;

            const ctx = canvas.getContext("2d");
            if (!ctx) return;

            ctx.fillStyle = "#ffffff";
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            setIsEmpty(true);
            onSignatureChange?.("");
        };

        return (
            <div>
                <div>
                    <canvas
                        ref={canvasRef}
                        width={width}
                        height={height}
                        
                        onMouseDown={startDrawing}
                        onMouseMove={draw}
                        onMouseUp={stopDrawing}
                        onMouseLeave={stopDrawing}
                        onTouchStart={startDrawing}
                        onTouchMove={draw}
                        onTouchEnd={stopDrawing}
                    />
                    {isEmpty && (
                        <div>
                            <p>
                                Firme aquí con el mouse o con el dedo
                            </p>
                        </div>
                    )}
                </div>
                <div>
                    <Button
                        type="button"
                        variant="outline"
                        onClick={handleClear}>
 <Eraser />
                        Limpiar
                    </Button>
                </div>
            </div>
        );
    },
);

SignaturePad.displayName = "SignaturePad";
