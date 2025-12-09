"use client";

import { useState } from "react";
// Would use Image from next/image but for external urls often needs config. Using img tag for MVP safety or configured domains.

interface KillcamProps {
    sellerImage: string;
    buyerImage: string;
}

export default function KillcamView({ sellerImage, buyerImage }: KillcamProps) {
    const [zoom, setZoom] = useState<'seller' | 'buyer' | null>(null);

    return (
        <div className="space-y-4">
            <h3 className="text-xl font-bold text-red-500 tracking-tighter uppercase mb-4 flex items-center gap-2">
                <span className="text-2xl">👁</span> THE KILLCAM: EVIDENCIA VISUAL
            </h3>

            <div className="grid grid-cols-2 gap-4">
                {/* Seller View */}
                <div className="relative group rounded-xl overflow-hidden border-2 border-zinc-800 bg-black">
                    <div className="absolute top-0 left-0 bg-green-500 text-black font-bold px-3 py-1 text-xs z-10">
                        EVIDENCIA ORIGINAL (VENDEDOR)
                    </div>
                    <div className="aspect-square relative cursor-pointer" onClick={() => setZoom('seller')}>
                        <img
                            src={sellerImage || '/placeholder_evidence.jpg'}
                            alt="Seller Evidence"
                            className="object-cover w-full h-full opacity-80 group-hover:opacity-100 transition-opacity"
                        />
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                            <span className="bg-black/50 text-white px-2 py-1 text-xs rounded border border-white/20">VER COMPLETO</span>
                        </div>
                    </div>
                </div>

                {/* Buyer View */}
                <div className="relative group rounded-xl overflow-hidden border-2 border-zinc-800 bg-black">
                    <div className="absolute top-0 left-0 bg-red-500 text-black font-bold px-3 py-1 text-xs z-10">
                        EVIDENCIA RECLAMO (COMPRADOR)
                    </div>
                    <div className="aspect-square relative cursor-pointer" onClick={() => setZoom('buyer')}>
                        <img
                            src={buyerImage || '/placeholder_evidence.jpg'}
                            alt="Buyer Evidence"
                            className="object-cover w-full h-full opacity-80 group-hover:opacity-100 transition-opacity"
                        />
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                            <span className="bg-black/50 text-white px-2 py-1 text-xs rounded border border-white/20">VER COMPLETO</span>
                        </div>
                    </div>
                </div>
            </div>

            {zoom && (
                <div className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-8" onClick={() => setZoom(null)}>
                    <img
                        src={zoom === 'seller' ? sellerImage : buyerImage}
                        className="max-h-full max-w-full rounded border border-zinc-700 shadow-2xl shadow-zinc-900"
                    />
                    <button className="absolute top-4 right-4 text-white hover:text-red-500 text-sm font-mono uppercase">
                        [Cerrar Vista Táctica]
                    </button>
                </div>
            )}
        </div>
    );
}
