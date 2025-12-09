import { Search } from "lucide-react";

export function EmptyState() {
    return (
        <div className="flex flex-col items-center justify-center py-20 text-center animate-in fade-in duration-500">
            <div className="relative mb-6">
                {/* Efecto de fantasma flotando */}
                <div className="text-6xl animate-bounce grayscale">👻</div>
                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-8 h-2 bg-black/50 blur-md rounded-[100%]"></div>
            </div>
            <h3 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-zinc-200 to-zinc-500 font-mono">
                ZONA FANTASMA
            </h3>
            <p className="text-zinc-500 mt-2 max-w-sm">
                No se detectó hardware con esos parámetros. Intenta ajustar tus filtros.
            </p>
        </div>
    );
}
