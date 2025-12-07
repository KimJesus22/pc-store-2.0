"use client";

import { Navbar } from "@/components/layout/Navbar";
import { CreateListingForm } from "@/components/listing/CreateListingForm";

export default function NewListingPage() {
    return (
        <main className="min-h-screen bg-background pb-24">
            <Navbar />

            <div className="container mx-auto px-4 py-8">
                <h1 className="text-3xl font-bold text-white mb-8 border-l-4 border-trench pl-4">
                    CREAR NUEVA PUBLICACIÓN
                </h1>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* MAIN FORM */}
                    <div className="lg:col-span-2">
                        <CreateListingForm />
                    </div>

                    {/* SIDEBAR HELP */}
                    <div className="hidden lg:block space-y-6">
                        <div className="p-6 bg-slate-900 border border-white/10 rounded">
                            <h3 className="text-white font-bold mb-4">Guía de Publicación</h3>
                            <ul className="space-y-3 text-sm text-gray-400 list-disc list-inside">
                                <li>Las fotos deben tener metadatos EXIF originales.</li>
                                <li>Prohibido subir capturas de pantalla de otros sitios.</li>
                                <li>Si vendes GPUs usadas para minería, decláralo para evitar disputas.</li>
                                <li>El sistema agregará una marca de agua automáticamente.</li>
                            </ul>
                        </div>

                        <div className="p-4 border-l-2 border-yellow-500 bg-yellow-500/10">
                            <p className="text-yellow-200 text-xs font-mono">
                                ADVERTENCIA: Tu IP quedará registrada en el contrato inteligente al momento de publicar.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
