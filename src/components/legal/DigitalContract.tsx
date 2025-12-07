"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ShieldAlert, FileSignature } from "lucide-react";

interface DigitalContractProps {
    sellerName: string;
    buyerName: string;
    productName: string;
    serialNumber: string;
    price: number;
    date: Date;
}

export function DigitalContract({
    sellerName,
    buyerName,
    productName,
    serialNumber,
    price,
    date,
}: DigitalContractProps) {
    const formattedPrice = new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(price);
    const formattedDate = date.toLocaleDateString('es-MX', { year: 'numeric', month: 'long', day: 'numeric' });

    // Fix hydration mismatch by generating hash only on client
    const [contractHash, setContractHash] = useState("");
    useEffect(() => {
        setContractHash(Math.random().toString(36).substring(7).toUpperCase());
    }, []);

    return (
        <Card className="max-w-3xl mx-auto bg-slate-900 border border-trench/50 shadow-2xl rounded-none">
            <CardHeader className="bg-black/50 border-b border-white/10 flex flex-row items-center gap-4">
                <FileSignature className="text-trench h-8 w-8" />
                <div>
                    <CardTitle className="text-xl font-mono text-trench tracking-widest uppercase">
                        Contrato Digital de Compraventa
                    </CardTitle>
                    <p className="text-xs text-gray-500 font-mono">HASH: {contractHash || "..."}</p>
                </div>
            </CardHeader>

            <CardContent className="p-8 font-mono text-sm leading-relaxed text-gray-300">
                <div className="space-y-6">
                    <p className="bg-white/5 p-4 rounded border-l-2 border-trench">
                        En la ciudad de México, a <strong>{formattedDate}</strong>, comparecen por una parte el C. <strong>{sellerName}</strong> (en adelante "EL VENDEDOR") y por la otra el C. <strong>{buyerName}</strong> (en adelante "EL COMPRADOR").
                    </p>

                    <div className="space-y-2">
                        <h3 className="text-white font-bold uppercase border-b border-gray-700 pb-1">Cláusula Primera: Objeto</h3>
                        <p>
                            EL VENDEDOR transmite la propiedad del componente de hardware descrito como <strong>{productName}</strong> con Número de Serie <strong>{serialNumber}</strong> a favor de EL COMPRADOR, quien lo adquiere por el precio de <strong>{formattedPrice}</strong> MXN.
                        </p>
                    </div>

                    <div className="space-y-2">
                        <h3 className="text-white font-bold uppercase border-b border-gray-700 pb-1">Cláusula Segunda: Vicios Ocultos</h3>
                        <p className="text-justify">
                            EL VENDEDOR declara que el bien objeto de este contrato se encuentra en las condiciones descritas en la publicación. Sin embargo, en conformidad con el artículo <span className="text-trench">2142 del Código Civil Federal</span>, EL VENDEDOR responde de los <strong>vicios ocultos</strong> que el bien tuviere, si lo hacen impropio para el uso a que se le destina, o si disminuyen de tal modo este uso que, de haberlo conocido EL COMPRADOR, no lo habría adquirido o habría dado menos precio por él.
                        </p>
                        <div className="flex items-start gap-3 mt-4 bg-red-900/20 p-4 border border-red-900/50 rounded">
                            <ShieldAlert className="text-red-500 shrink-0 mt-0.5" size={20} />
                            <p className="text-red-200 text-xs">
                                <strong>GARANTÍA DE 30 DÍAS:</strong> Las partes acuerdan que EL COMPRADOR tendrá un plazo de 30 días naturales a partir de la recepción para reclamar cualquier vicio oculto no derivado de mal uso o negligencia.
                            </p>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <h3 className="text-white font-bold uppercase border-b border-gray-700 pb-1">Cláusula Tercera: Jurisdicción</h3>
                        <p>
                            Para la interpretación y cumplimiento del presente contrato, las partes se someten a la jurisdicción de los tribunales competentes de la Ciudad de México y a las leyes aplicables en materia de comercio electrónico.
                        </p>
                    </div>

                </div>
            </CardContent>
        </Card>
    );
}
