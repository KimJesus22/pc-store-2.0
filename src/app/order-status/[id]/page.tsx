"use client";

import { Navbar } from "@/components/layout/Navbar";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Lock, ArrowRight, User, Store, ShieldCheck, Clock } from "lucide-react";
import { useRouter, useParams } from "next/navigation";

export default function OrderStatusPage() {
    const router = useRouter();
    const params = useParams();
    const orderId = params?.id as string || ""; // Safe fallback

    // STEPS: 1=LOCKED, 2=SHIPPED, 3=DELIVERED, 4=RELEASED
    const currentStep = 1;

    return (
        <main className="min-h-screen bg-background pb-20">
            <Navbar />

            <div className="container mx-auto px-4 py-8">
                {/* STATUS HEADER */}
                <div className="text-center mb-12">
                    <div className="inline-flex items-center gap-2 bg-yellow-400/10 text-yellow-500 border border-yellow-500/50 px-4 py-2 rounded-full mb-4 animate-pulse">
                        <Lock size={16} />
                        <span className="font-bold tracking-wider text-sm">FONDOS EN CUSTODIA (ESCROW)</span>
                    </div>
                    <h1 className="text-3xl font-bold text-white mb-2">Orden #{orderId.substring(0, 8)} Confirmada</h1>
                    <p className="text-gray-400">Hemos notificado al vendedor. El dinero está seguro.</p>
                </div>

                {/* MONEY FLOW DIAGRAM */}
                <div className="max-w-4xl mx-auto bg-slate-900 border border-white/10 rounded-xl p-8 mb-12 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-trench to-transparent opacity-50"></div>

                    <div className="flex flex-col md:flex-row items-center justify-between gap-8 py-8 relative z-10">
                        {/* BUYER NODE */}
                        <div className="flex flex-col items-center text-center gap-4 relative">
                            <div className="w-16 h-16 rounded-full bg-gray-800 border-2 border-gray-600 flex items-center justify-center relative">
                                <User className="text-gray-400 w-8 h-8" />
                                <div className="absolute -bottom-2 bg-green-500 text-black text-[10px] font-bold px-2 py-0.5 rounded-full">
                                    PAGADO
                                </div>
                            </div>
                            <div>
                                <h3 className="text-white font-bold">TÚ (Comprador)</h3>
                                <p className="text-xs text-gray-500 font-mono">-$38,500 MXN</p>
                            </div>
                        </div>

                        {/* ARROW 1 */}
                        <div className="flex-1 flex items-center justify-center">
                            <div className="h-1 bg-green-500 flex-1 relative max-w-[100px]">
                                <ArrowRight className="absolute right-0 -top-2.5 text-green-500 ml-auto" />
                            </div>
                        </div>

                        {/* ESCROW NODE (CENTER) */}
                        <div className="flex flex-col items-center text-center gap-4 scale-110">
                            <div className="w-24 h-24 rounded-full bg-trench/10 border-4 border-trench flex items-center justify-center shadow-[0_0_30px_rgba(252,227,0,0.3)] relative">
                                <ShieldCheck className="text-trench w-10 h-10" />
                                <div className="absolute -top-3 bg-black border border-trench text-trench px-3 py-1 rounded text-xs font-bold flex items-center gap-1">
                                    <Lock size={12} /> SECURE
                                </div>
                            </div>
                            <div>
                                <h3 className="text-trench font-bold text-lg">GHOSTWIRE ESCROW</h3>
                                <p className="text-xs text-yellow-200/70 font-mono">Fondos Bloqueados</p>
                            </div>
                        </div>

                        {/* ARROW 2 (LOCKED) */}
                        <div className="flex-1 flex items-center justify-center opacity-30">
                            <div className="h-1 bg-gray-600 flex-1 relative max-w-[100px] border-t border-dashed">
                                <Lock className="absolute left-1/2 -top-3 text-gray-500" size={16} />
                                <ArrowRight className="absolute right-0 -top-2.5 text-gray-600 ml-auto" />
                            </div>
                        </div>

                        {/* SELLER NODE */}
                        <div className="flex flex-col items-center text-center gap-4 opacity-50">
                            <div className="w-16 h-16 rounded-full bg-gray-800 border-2 border-dashed border-gray-600 flex items-center justify-center">
                                <Store className="text-gray-400 w-8 h-8" />
                            </div>
                            <div>
                                <h3 className="text-white font-bold">Vendedor</h3>
                                <p className="text-xs text-gray-500 font-mono">Pendiente de Envío</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-black/30 rounded border border-white/5 p-4 mt-8 text-center">
                        <p className="text-sm text-gray-300">
                            <span className="text-trench font-bold">PRÓXIMO PASO:</span> El vendedor tiene 48 horas para subir la guía de envío. Te notificaremos cuando el paquete esté en camino.
                        </p>
                    </div>
                </div>

                <div className="flex justify-center">
                    <Button variant="outline" className="border-white/10 text-white hover:bg-white/5" onClick={() => router.push('/')}>
                        Volver al Inicio
                    </Button>
                </div>
            </div>
        </main>
    );
}
