import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";
import { Toaster } from "sonner";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "SGIT Coopetraes - Gestión Integral de Transporte",
    description: "Sistema corporativo avanzado de control y gestión de flota",
    manifest: "/manifest.json",
    appleWebApp: {
        capable: true,
        statusBarStyle: "default",
        title: "Coopetraes",
    },
};

export const viewport: Viewport = {
    themeColor: "#FFFFFF",
    colorScheme: "light",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="es" suppressHydrationWarning>
            <body className={`${geistSans.variable} ${geistMono.variable} antialiased font-sans overflow-hidden h-screen w-screen`} suppressHydrationWarning>
                <Providers>
                    {children}
                    <Toaster position="top-right" richColors closeButton />
                </Providers>
            </body>
        </html>
    );
}
