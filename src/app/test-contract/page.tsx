"use client";
import { generateContract } from "@/lib/utils/ContractGenerator";
import { Button } from "@/components/ui/button";

export default function TestContractPage() {
    const handleTest = () => {
        try {
            generateContract({
                orderId: "TEST-UUID-1234-5678",
                buyerName: "Tester Comprador",
                sellerName: "Tester Vendedor",
                productTitle: "Tarjeta Gráfica de Prueba 3000",
                productSerial: "SN-TEST-001",
                price: 15000,
                date: new Date()
            });
            alert("PDF generado correctamente!");
        } catch (e) {
            console.error(e);
            alert("Error al generar PDF");
        }
    };

    return (
        <div className="min-h-screen bg-black flex flex-col items-center justify-center gap-4 text-white">
            <h1 className="text-2xl font-bold">Prueba de Contrato Digital</h1>
            <Button onClick={handleTest} id="gen-btn" className="bg-[#FCE300] text-black font-bold px-8 py-4 rounded-none skew-x-[-10deg]">
                GENERAR PDF AHORA
            </Button>
        </div>
    );
}
