"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import { DigitalContract } from "@/components/legal/DigitalContract";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CheckCircle2, Loader2, Lock, ShieldCheck, ArrowRight, AlertTriangle } from "lucide-react";

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

    const [isThinking, setIsThinking] = useState(false); // For Simulate Payment
    const [legalAccepted, setLegalAccepted] = useState(false);

    // CALCS
    const basePrice = MOCK_PRODUCT.price;
    const serviceFee = basePrice * 0.05;
    const total = basePrice + serviceFee;

    const handleTransferNotification = async () => {
        if (!legalAccepted) return;

        setIsThinking(true);

        // Simulate Network Delay & Lock Animation
        setTimeout(() => {
            router.push(`/order-status/${params?.id || '1'}`);
        }, 2000);
    };

    if (isThinking) {
        return (
            <main className="min-h-screen bg-black flex flex-col items-center justify-center p-4">
                <div className="relative mb-8">
                    <div className="absolute inset-0 bg-trench/20 blur-xl rounded-full"></div>
                    <Lock className="text-trench w-24 h-24 relative z-10 animate-bounce" />
                </div>
                <h2 className="text-2xl font-mono text-white mb-2 tracking-widest">ASEGURANDO FONDOS</h2>
                <p className="text-gray-500 font-mono text-sm animate-pulse">Bloqueando dinero en contrato inteligente...</p>

                <div className="mt-8 w-64 h-2 bg-gray-800 rounded-full overflow-hidden">
                    <div className="h-full bg-trench animate-[loading_2s_ease-in-out_infinite]" style={{ width: '60%' }}></div>
                </div>
            </main>
        )
    }

    return (
        <main className="min-h-screen bg-background pb-20">
            <Navbar />

            <div className="container mx-auto px-4 py-8">
                <div className="flex items-center gap-2 mb-8 text-white/50 text-sm font-mono border-b border-white/10 pb-4">
                    <Lock size={14} /> CHECKOUT SEGURO / ID: {params?.id || 'UNKNOWN'}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* LEFT: CONTRACT (8 cols) */}
                    <div className="lg:col-span-8 space-y-6">
                        <div className="bg-yellow-500/10 border-l-4 border-yellow-500 p-4 mb-4">
                            <h3 className="text-yellow-500 font-bold text-sm flex items-center gap-2 uppercase tracking-wide">
                                <AlertTriangle size={16} />
                                Paso 1: Revisión de Contrato
                            </h3>
                            <p className="text-yellow-200/80 text-xs mt-1">Este documento tiene validez legal una vez confirmada la transferencia.</p>
                        </div>

                        <DigitalContract
                            sellerName={MOCK_PRODUCT.seller}
                            buyerName="Usuario Actualmente Logueado" // Mock
                            productName={MOCK_PRODUCT.title}
                            serialNumber={MOCK_PRODUCT.serialNumber}
                            price={basePrice}
                            date={new Date()}
                        />
                    </div>

                    {/* RIGHT: SUMMARY & ACTIONS (4 cols) */}
                    <div className="lg:col-span-4 space-y-6">
                        <div className="bg-slate-900 border border-white/10 p-6 rounded-lg sticky top-24">
                            <h3 className="text-white font-bold text-lg mb-6 flex items-center gap-2">
                                <ShieldCheck className="text-trench" />
                                Resumen del Pedido
                            </h3>

                            <div className="space-y-4 mb-8">
                                <div className="flex justify-between text-sm text-gray-400">
                                    <span>Producto</span>
                                    <span>${basePrice.toLocaleString('es-MX')}</span>
                                </div>
                                <div className="flex justify-between text-sm text-gray-400">
                                    <span>Comisión de Servicio (5%)</span>
                                    <span>${serviceFee.toLocaleString('es-MX')}</span>
                                </div>
                                <div className="flex justify-between text-sm text-green-400 font-bold">
                                    <span>Envío Asegurado</span>
                                    <span>GRATIS</span>
                                </div>
                                <div className="border-t border-white/10 pt-4 flex justify-between items-end">
                                    <span className="text-white font-bold text-sm">TOTAL A TRANSFERIR</span>
                                    <span className="text-3xl text-trench font-bold font-mono">
                                        ${total.toLocaleString('es-MX')}
                                    </span>
                                </div>
                            </div>

                            {/* LEGAL CHECKBOX */}
                            <div className="bg-black/40 p-4 rounded border border-white/5 mb-6">
                                <label className="flex items-start gap-3 cursor-pointer group">
                                    <input
                                        type="checkbox"
                                        className="mt-1 w-4 h-4 rounded border-gray-600 bg-transparent text-trench focus:ring-trench"
                                        checked={legalAccepted}
                                        onChange={(e) => setLegalAccepted(e.target.checked)}
                                    />
                                    <span className="text-xs text-gray-400 group-hover:text-gray-300 transition-colors">
                                        Declaro bajo protesta de decir verdad que los fondos son lícitos y acepto los <span className="text-trench underline">términos de compraventa mercantil</span>. Reconozco que el dinero será retenido en custodia (Escrow) hasta validar el producto.
                                    </span>
                                </label>
                            </div>

                            {/* ACTION BUTTON */}
                            <Button
                                onClick={handleTransferNotification}
                                disabled={!legalAccepted}
                                className={`w-full font-bold h-14 text-sm uppercase tracking-wider transition-all
                                    ${legalAccepted
                                        ? 'bg-trench text-black hover:bg-yellow-400 shadow-[0_0_20px_rgba(252,227,0,0.4)]'
                                        : 'bg-gray-800 text-gray-500 cursor-not-allowed'
                                    }`}
                            >
                                <Lock size={16} className="mr-2" />
                                Notificar Transferencia
                            </Button>

                            <p className="text-[10px] text-gray-600 text-center mt-4">
                                GhostWire MX actúa como intermediario de confianza conforme a la NOM-151-SCFI-2016.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
