import { Navbar } from "@/components/layout/Navbar";
import { SecureChatBox } from "@/components/chat/SecureChatBox";

export default function ChatDemoPage() {
    return (
        <main className="min-h-screen bg-background pb-20">
            <Navbar />

            <div className="container mx-auto px-4 py-8">
                <h1 className="text-3xl font-bold text-white mb-8 border-l-4 border-trench pl-4">
                    SISTEMA DE MENSAJERÍA SEGURA
                </h1>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="md:col-span-2">
                        <SecureChatBox listingId="demo-listing-123" />
                    </div>

                    <div className="space-y-6">
                        <div className="p-6 bg-slate-900 border border-white/10 rounded">
                            <h3 className="text-white font-bold mb-4">Prueba de DLP</h3>
                            <p className="text-gray-400 text-sm mb-4">
                                Intenta escribir lo siguiente para probar los filtros de seguridad:
                            </p>
                            <ul className="space-y-2 text-sm text-gray-400 font-mono bg-black p-4 rounded border border-white/5">
                                <li className="text-red-400">&quot;Llámame al 55 1234 5678&quot;</li>
                                <li className="text-red-400">&quot;Mi correo es test@gmail.com&quot;</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
