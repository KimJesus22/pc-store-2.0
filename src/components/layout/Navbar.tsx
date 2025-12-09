"use client";

import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, ShoppingCart, User, Cpu } from "lucide-react";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Database } from "../../../types/database.types";
import { NotificationCenter } from "@/components/ui/NotificationCenter";

type Profile = Database['public']['Tables']['profiles']['Row'];

export function Navbar() {
    const [profile, setProfile] = useState<Profile | null>(null);
    const supabase = createClient();

    useEffect(() => {
        const getUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                const { data } = await supabase
                    .from('profiles')
                    .select('*')
                    .eq('id', user.id)
                    .maybeSingle();
                if (data) setProfile(data);
            }
        };
        getUser();
    }, [supabase]);

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

                    {profile ? (
                        <div className="flex items-center gap-4">
                            {/* Notification Center */}
                            <NotificationCenter />

                            <Link href="/profile">
                                <Button variant="ghost" className="text-white hover:text-trench hover:bg-white/10 flex items-center gap-2">
                                    <span className="text-sm font-bold truncate max-w-[100px] hidden md:block">
                                        {profile.username || 'USUARIO'}
                                    </span>
                                    <div className="h-8 w-8 rounded bg-zinc-800 overflow-hidden border border-zinc-700">
                                        {profile.avatar_url ? (
                                            <img src={profile.avatar_url} alt="Avatar" className="h-full w-full object-cover" />
                                        ) : (
                                            <div className="h-full w-full flex items-center justify-center bg-trench text-black font-bold">
                                                {profile.username?.[0]?.toUpperCase() || 'U'}
                                            </div>
                                        )}
                                    </div>
                                </Button>
                            </Link>
                        </div>
                    ) : (
                        <Link href="/login">
                            <Button variant="default" size="sm" className="bg-trench text-black hover:bg-yellow-400 font-bold rounded-none">
                                <User size={16} className="mr-2" />
                                LOGIN
                            </Button>
                        </Link>
                    )}
                </div>
            </div>
        </nav>
    );
}
