import Link from "next/link";
import { ArrowRight, ShieldCheck, Zap, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="min-h-screen bg-black text-white selection:bg-yellow-500 selection:text-black overflow-hidden relative">
      {/* Background Grid Effect */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f1f1f_1px,transparent_1px),linear-gradient(to_bottom,#1f1f1f_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-20"></div>
        <div className="absolute bottom-0 left-0 right-0 h-[50vh] bg-gradient-to-t from-[#FCE300]/5 to-transparent blur-3xl opacity-30"></div>
      </div>

      <main className="relative z-10 container mx-auto px-6 pt-32 pb-16 min-h-[90vh] flex flex-col justify-center items-center text-center">
        {/* Badge */}
        <div className="mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <span className="px-4 py-1.5 rounded-full border border-zinc-800 bg-zinc-900/50 text-zinc-400 text-xs font-mono tracking-widest uppercase backdrop-blur-md">
            v2.0 Beta Live
          </span>
        </div>

        {/* Headline */}
        <h1 className="text-5xl md:text-8xl font-black tracking-tighter mb-6 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-100 max-w-5xl mx-auto leading-[0.9]">
          COMPRA HARDWARE. <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-zinc-200 via-zinc-400 to-zinc-600">SIN ESTAFAS.</span> <br />
          <span className="text-[#FCE300]">SIN MIEDO.</span>
        </h1>

        {/* Subtitle */}
        <p className="text-zinc-400 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
          El primer marketplace en México con{" "}
          <span className="text-white font-bold">Escrow Digital</span> y{" "}
          <span className="text-white font-bold">Validación de Identidad</span>.
          Tu dinero no se libera hasta que confirmas que el hardware funciona.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-4 items-center animate-in fade-in slide-in-from-bottom-8 duration-700 delay-300 w-full justify-center">
          <Link href="/new-listing" className="w-full sm:w-auto">
            <Button className="w-full sm:w-auto px-8 py-6 text-lg font-bold bg-[#FCE300] text-black hover:bg-[#E6CF00] hover:scale-105 transition-all rounded-none skew-x-[-10deg]">
              <span className="skew-x-[10deg] flex items-center gap-2">
                <Zap className="fill-black" size={20} /> VENDER HARDWARE
              </span>
            </Button>
          </Link>

          <Link href="/search" className="w-full sm:w-auto">
            <Button variant="outline" className="w-full sm:w-auto px-8 py-6 text-lg font-bold border-zinc-700 text-white hover:bg-white/10 hover:border-white transition-all rounded-none skew-x-[-10deg]">
              <span className="skew-x-[10deg] flex items-center gap-2">
                EXPLORAR OFERTAS <ArrowRight size={20} />
              </span>
            </Button>
          </Link>
        </div>

        {/* Trust Indicators */}
        <div className="mt-24 grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-16 text-zinc-600 animate-in fade-in duration-1000 delay-500 opacity-50 grayscale hover:grayscale-0 transition-all">
          {/* Simple Text Logos acting as placeholders/brands */}
          <div className="flex items-center justify-center gap-2 font-black text-2xl tracking-tighter">
            <ShieldCheck size={32} />
            <span>SECURE</span>
          </div>
          <div className="flex items-center justify-center gap-2 font-black text-2xl tracking-tighter">
            <Lock size={32} />
            <span>ESCROW</span>
          </div>
          <div className="flex items-center justify-center font-black text-2xl tracking-tighter uppercase">
            NVIDIA
          </div>
          <div className="flex items-center justify-center font-black text-2xl tracking-tighter uppercase">
            AMD
          </div>
        </div>
      </main>

      {/* Decorative Floor */}
      <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#FCE300]/50 to-transparent"></div>
    </div>
  );
}
