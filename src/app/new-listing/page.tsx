"use client";

import React, { useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils/cn";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FraudDetectionService, FraudAnalysisResult } from "@/lib/services/FraudDetectionService";
import { AlertCircle, CheckCircle, ShieldAlert, Upload } from "lucide-react";

export default function NewListingPage() {
    const [images, setImages] = useState<File[]>([]);
    const [fraudAnalysis, setFraudAnalysis] = useState<FraudAnalysisResult | null>(null);
    const [timestampProof, setTimestampProof] = useState<File | null>(null);

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setImages([file]); // Single image MVP

            // Analyze Fraud Risk
            const result = await FraudDetectionService.analyzeImage(file);
            setFraudAnalysis(result);
        }
    };

    const handleTimestampUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setTimestampProof(e.target.files[0]);
        }
    };

    const isFormValid = images.length > 0 && timestampProof !== null && fraudAnalysis?.riskLevel !== 'HIGH';

    return (
        <main className="min-h-screen bg-background pb-20">
            <Navbar />

            <div className="container mx-auto px-4 py-8 max-w-2xl">
                <h1 className="text-3xl font-bold text-white mb-2">Vender Hardware</h1>
                <p className="text-gray-400 mb-8 border-l-2 border-trench pl-4">
                    Complete los detalles para listar su componente. Nuestro sistema de IA analizará las imágenes por seguridad.
                </p>

                <Card className="bg-slate-900 border-white/10">
                    <CardHeader>
                        <CardTitle className="text-xl text-white">Detalles del Producto</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">

                        {/* TITULO */}
                        <div className="space-y-2">
                            <Label htmlFor="title" className="text-white">Nombre del Producto</Label>
                            <Input id="title" placeholder="Ej: NVIDIA RTX 3080 Founders Edition" className="bg-black text-white border-white/20" />
                        </div>

                        {/* PRECIO */}
                        <div className="space-y-2">
                            <Label htmlFor="price" className="text-white">Precio (MXN)</Label>
                            <Input id="price" type="number" placeholder="0.00" className="bg-black text-white border-white/20" />
                        </div>

                        {/* CONDICION */}
                        <div className="space-y-2">
                            <Label htmlFor="condition" className="text-white">Condición</Label>
                            <select className="flex h-10 w-full rounded-md border border-white/20 bg-black px-3 py-2 text-sm text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-trench disabled:cursor-not-allowed disabled:opacity-50">
                                <option value="USED">Usado - Buen Estado</option>
                                <option value="NEW">Nuevo (Sellado)</option>
                                <option value="REFURBISHED">Reacondicionado</option>
                                <option value="DAMAGED">Para Piezas / Dañado</option>
                            </select>
                        </div>

                        {/* DESCRIPCION */}
                        <div className="space-y-2">
                            <Label htmlFor="description" className="text-white">Descripción y Detalles Técnicos</Label>
                            <Textarea id="description" placeholder="Incluye detalles como tiempo de uso, si se usó para minería, etc." className="bg-black text-white border-white/20 min-h-[100px]" />
                        </div>

                        {/* IMAGENES ANTI-FRAUDE */}
                        <div className="pt-4 border-t border-white/10 space-y-4">
                            <h3 className="text-lg font-bold text-trench flex items-center gap-2">
                                <ShieldAlert size={20} /> Verificación Anti-Fraude
                            </h3>

                            {/* MAIN PHOTO */}
                            <div className="space-y-2">
                                <Label className="text-white">Foto Principal del Producto (Original)</Label>
                                <div className="border-2 border-dashed border-white/20 rounded-lg p-6 text-center hover:bg-white/5 transition-colors relative">
                                    <Input
                                        type="file"
                                        accept="image/jpeg,image/png"
                                        onChange={handleImageUpload}
                                        className="opacity-0 absolute inset-0 w-full h-full cursor-pointer"
                                    />
                                    <div className="flex flex-col items-center justify-center pointer-events-none">
                                        <Upload className="h-8 w-8 text-gray-500 mb-2" />
                                        <p className="text-gray-400 text-sm">
                                            {images.length > 0 ? images[0].name : "Arrastra o selecciona una foto original"}
                                        </p>
                                        <p className="text-xs text-gray-600 mt-1">Analizaremos los metadatos EXIF</p>
                                    </div>
                                </div>

                                {fraudAnalysis && (
                                    <div className={cn("p-4 rounded border text-sm mt-2 font-mono",
                                        fraudAnalysis.riskLevel === 'HIGH' ? "bg-red-900/20 border-red-500 text-red-200" :
                                            fraudAnalysis.riskLevel === 'MEDIUM' ? "bg-yellow-900/20 border-yellow-500 text-yellow-200" :
                                                "bg-green-900/20 border-green-500 text-green-200"
                                    )}>
                                        <p className="font-bold flex items-center gap-2">
                                            RIESGO DETECTADO: {fraudAnalysis.riskLevel}
                                            {fraudAnalysis.riskLevel === 'LOW' && <CheckCircle size={16} />}
                                            {fraudAnalysis.riskLevel !== 'LOW' && <AlertCircle size={16} />}
                                        </p>
                                        {fraudAnalysis.reasons.length > 0 && (
                                            <ul className="list-disc list-inside mt-2 text-xs opacity-80">
                                                {fraudAnalysis.reasons.map((r, i) => <li key={i}>{r}</li>)}
                                            </ul>
                                        )}
                                    </div>
                                )}
                            </div>

                            {/* TIMESTAMP PROOF */}
                            <div className="space-y-2">
                                <Label className="text-white">Foto con Timestamp (Papel con tu usuario y fecha)</Label>
                                <Input
                                    type="file"
                                    onChange={handleTimestampUpload}
                                    className="bg-black text-white border-white/20 file:bg-white/10 file:text-white file:border-0"
                                />
                                {!timestampProof && <p className="text-red-400 text-xs">* Obligatorio para publicar</p>}
                            </div>
                        </div>

                        <Button
                            disabled={!isFormValid}
                            className="w-full bg-trench text-black hover:bg-yellow-400 font-bold h-12 text-lg rounded-none mt-6"
                        >
                            {fraudAnalysis?.riskLevel === 'HIGH' ? "REQUIERE REVISIÓN MANUAL" : "PUBLICAR AHORA"}
                        </Button>

                    </CardContent>
                </Card>
            </div>
        </main>
    );
}
