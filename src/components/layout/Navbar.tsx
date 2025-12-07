import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, ShoppingCart, User, Cpu } from "lucide-react";

export function Navbar() {
    return (
        <nav className="sticky top-0 z-50 w-full border-b border-white/10 bg-black/80 backdrop-blur-md">
            <div className="container mx-auto flex h-16 items-center justify-between px-4">
                {/* LOGO */}
                <Link href="/" className="flex items-center gap-2 group">
                    <div className="relative flex h-8 w-8 items-center justify-center rounded bg-trench text-black group-hover:bg-yellow-400 transition-colors">
                        <Cpu size={20} className="stroke-[3]" />
                    </div>
                    <span className="text-lg font-bold tracking-tight text-white font-mono">
                        GHOST<span className="text-trench">WIRE</span>
                        <span className="text-xs text-gray-400 ml-1">MX</span>
                    </span>
                </Link>

                {/* SEARCH BAR */}
                <div className="hidden md:flex flex-1 items-center justify-center px-8 max-w-md">
                    <div className="relative w-full">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                        <Input
                            type="search"
                            placeholder="Buscar hardware (RTX 4090, CPU...)"
                            className="w-full bg-slate-900 border-white/10 text-white placeholder:text-gray-500 focus-visible:ring-trench pl-9 rounded-none"
                        />
                    </div>
                </div>

                {/* ACTIONS */}
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" className="text-white hover:text-trench hover:bg-white/10">
                        <ShoppingCart size={20} />
                    </Button>

                    <div className="h-6 w-px bg-white/10 hidden sm:block"></div>

                    <Link href="/login">
                        <Button variant="default" size="sm" className="bg-trench text-black hover:bg-yellow-400 font-bold rounded-none">
                            <User size={16} className="mr-2" />
                            LOGIN
                        </Button>
                    </Link>
                </div>
            </div>
        </nav>
    );
}
