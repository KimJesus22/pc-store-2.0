import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { ProductCard } from "@/components/product/ProductCard";
import { Button } from "@/components/ui/button";
import { Database } from "../../types/database.types";
import { ShieldCheck, Truck, Lock } from "lucide-react";

// MOCK DATA for MVP display
const MOCK_LISTINGS: Array<Partial<Database["public"]["Tables"]["listings"]["Row"]> & { seller: { username: string; is_verified_seller: boolean } }> = [
  {
    id: "1",
    title: "NVIDIA GeForce RTX 4090 Rog Strix White OC",
    price: 38500,
    condition: "USED",
    images: ["https://placehold.co/600x600/000000/FCE300/png?text=RTX+4090+White"],
    status: "ACTIVE",
    seller: { username: "CyberMerchant", is_verified_seller: true }
  },
  {
    id: "2",
    title: "AMD Ryzen 9 7950X3D (Nuevo Sellado)",
    price: 11200,
    condition: "NEW",
    images: ["https://placehold.co/600x600/0f172a/white/png?text=Ryzen+9+7950X3D"],
    status: "ACTIVE",
    seller: { username: "HardwareStoreMX", is_verified_seller: true }
  },
  {
    id: "3",
    title: "Monitor Alienware AW3423DWF OLED",
    price: 18000,
    condition: "USED",
    images: ["https://placehold.co/600x600/000000/FCE300/png?text=Alienware+OLED"],
    status: "ACTIVE",
    seller: { username: "GamerCasual", is_verified_seller: false }
  },
  {
    id: "4",
    title: "Custom Loop Distro Plate O11 Dynamic",
    price: 3500,
    condition: "USED",
    images: ["https://placehold.co/600x600/0f172a/white/png?text=Distro+Plate"],
    status: "ACTIVE",
    seller: { username: "ModderPro", is_verified_seller: true }
  }
];

export default function Home() {
  return (
    <main className="min-h-screen bg-background flex flex-col">
      <Navbar />

      {/* HERO SECTION */}
      <section className="relative w-full py-24 md:py-32 overflow-hidden border-b border-white/10">
        <div className="absolute inset-0 bg-grid-pattern opacity-10 pointer-events-none"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-trench/10 blur-[120px] rounded-full pointer-events-none"></div>

        <div className="container relative mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-trench/30 bg-trench/5 text-trench text-xs font-mono mb-6">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-trench opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-trench"></span>
            </span>
            SYSTEM.STATUS: ONLINE
          </div>

          <h1 className="text-4xl md:text-6xl font-black tracking-tighter text-white mb-6">
            COMPRA Y VENDE <span className="text-trench">HARDWARE</span><br />
            SIN RIESGOS EN MÉXICO
          </h1>

          <p className="text-gray-400 max-w-2xl mx-auto mb-8 text-lg">
            El primer marketplace con servicio Escrow especializado en componentes de PC de alto rendimiento. Verificamos cada transacción.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="#listings">
              <Button size="lg" className="bg-trench text-black hover:bg-yellow-400 font-bold rounded-none px-8 text-base h-12">
                VER LISTADOS
              </Button>
            </Link>
            <Link href="/new-listing">
              <Button size="lg" variant="outline" className="text-white border-white/20 hover:bg-white/5 rounded-none h-12">
                VENDER HARDWARE
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* VALUE PROPS */}
      <section className="border-b border-white/10 bg-slate-900/50 py-12">
        <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="flex flex-col items-center text-center p-4">
            <div className="p-3 bg-trench/10 rounded mb-4">
              <ShieldCheck className="text-trench h-8 w-8" />
            </div>
            <h3 className="text-white font-bold mb-2">Pagos Protegidos</h3>
            <p className="text-gray-400 text-sm">Tu dinero se libera al vendedor hasta que recibes y verificas el producto.</p>
          </div>
          <div className="flex flex-col items-center text-center p-4">
            <div className="p-3 bg-blue-500/10 rounded mb-4">
              <Truck className="text-blue-400 h-8 w-8" />
            </div>
            <h3 className="text-white font-bold mb-2">Envíos Seguros</h3>
            <p className="text-gray-400 text-sm">Guías de envío generadas automáticamente con seguro incluido.</p>
          </div>
          <div className="flex flex-col items-center text-center p-4">
            <div className="p-3 bg-purple-500/10 rounded mb-4">
              <Lock className="text-purple-400 h-8 w-8" />
            </div>
            <h3 className="text-white font-bold mb-2">Anti-Fraude</h3>
            <p className="text-gray-400 text-sm">Verificación de identidad de vendedores y sistema de reputación inmutable.</p>
          </div>
        </div>
      </section>

      {/* FEATURED PRODUCTS */}
      <section className="py-20 flex-1">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8 border-l-4 border-trench pl-4">
            <h2 className="text-3xl font-bold text-white tracking-tight">
              DESTACADOS
            </h2>
            <Link href="/browse" className="text-trench text-sm font-mono hover:underline">
                    // VER_TODO
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {MOCK_LISTINGS.map((listing) => (
              <div key={listing.id} className="h-full">
                <ProductCard listing={listing} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FOOTER SIMPLE */}
      <footer className="py-8 border-t border-white/10 bg-black text-center text-gray-600 text-sm font-mono">
        <p>GHOSTWIRE_MX SYSTEM © 2025. ALL RIGHTS RESERVED.</p>
      </footer>
    </main>
  );
}
