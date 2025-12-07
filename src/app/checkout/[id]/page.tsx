"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import { DigitalContract } from "@/components/legal/DigitalContract";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Loader2, Lock } from "lucide-react";

// Mock Data allowing any ID
const MOCK_PRODUCT = {
    id: "1",
    title: "NVIDIA GeForce RTX 4090 Rog Strix White OC",
    price: 38500,
    seller: "CyberMerchant",
    serialNumber: "SN-4090-ROG-8821X",
};

export default function CheckoutPage() {
    const params = useParams(); // params.id
    const router = useRouter();

    const [step, setStep] = useState<'CONTRACT' | 'PROCESSING' | 'SUCCESS'>('CONTRACT');

    const handleContractAccept = async () => {
        setStep('PROCESSING');

        // Simulate Payment Gateway delay
        setTimeout(() => {
            setStep('SUCCESS');
        }, 2500);
    };

    if (step === 'SUCCESS') {
        return (
            <main className="min-h-screen bg-black flex flex-col items-center justify-center p-4 text-center">
                <div className="bg-green-500/10 p-6 rounded-full border-2 border-green-500 mb-6 animate-in zoom-in duration-300">
                    <CheckCircle2 className="text-green-500 w-16 h-16" />
                </div>
                <h1 className="text-4xl font-mono font-bold text-white mb-2">PAGO COMPLETADO</h1>
                <p className="text-gray-400 max-w-md mb-8">
                    Los fondos están asegurados en Escrow. El vendedor ha sido notificado para iniciar el envío.
                </p>
                <div className="bg-slate-900 p-4 rounded border border-white/10 font-mono text-sm text-left w-full max-w-md mb-8">
                    <p className="text-gray-500 text-xs mb-1">TRANSACTION HASH</p>
                    <p className="text-trench break-all">0x7f9a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s</p>
                </div>
                <Button onClick={() => router.push('/')} className="bg-white text-black hover:bg-gray-200">
                    Volver al Inicio
                </Button>
            </main>
        )
    }

    if (step === 'PROCESSING') {
        return (
            <main className="min-h-screen bg-black flex flex-col items-center justify-center p-4">
                <Loader2 className="text-trench animate-spin w-12 h-12 mb-4" />
                <h2 className="text-xl font-mono text-white animate-pulse">PROCESANDO PAGO SEGURO...</h2>
                <p className="text-gray-500 text-sm mt-2">Encriptando contrato y bloqueando fondos.</p>
            </main>
        )
    }

    return (
        <main className="min-h-screen bg-background pb-20">
            <Navbar />

            <div className="container mx-auto px-4 py-8">
                <div className="flex items-center gap-2 mb-8 text-white/50 text-sm font-mono">
                    <Lock size={14} /> CHECKOUT SEGURO / ID: {params?.id || 'UNKNOWN'}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* LEFT: PRODUCT SUMMARY */}
                    <div className="lg:col-span-1 space-y-4">
                        <div className="bg-slate-900 p-6 border-l-4 border-trench">
                            <h3 className="text-gray-400 text-xs font-bold uppercase mb-2">Estás comprando</h3>
                            <h2 className="text-xl font-bold text-white mb-4">{MOCK_PRODUCT.title}</h2>
                            <div className="flex justify-between items-center border-t border-white/10 pt-4">
                                <span className="text-gray-400">Total a Pagar</span>
                                <span className="text-2xl font-mono text-trench font-bold">
                                    ${MOCK_PRODUCT.price.toLocaleString('es-MX')}
                                </span>
                            </div>
                        </div>
                        <div className="bg-blue-900/10 p-4 border border-blue-500/20 text-xs text-blue-200">
                            <p>🔒 <strong>Protección GhostWire:</strong> El vendedor no recibe el dinero hasta que confirmas que el producto llegó y funciona.</p>
                        </div>
                    </div>

                    {/* RIGHT: CONTRACT */}
                    <div className="lg:col-span-2">
                        <DigitalContract
                            sellerName={MOCK_PRODUCT.seller}
                            buyerName="Usuario Actualmente Logueado" // Mock
                            productName={MOCK_PRODUCT.title}
                            serialNumber={MOCK_PRODUCT.serialNumber}
                            price={MOCK_PRODUCT.price}
                            date={new Date()}
                            onAccept={handleContractAccept}
                        />
                    </div>
                </div>
            </div>
        </main>
    );
}
