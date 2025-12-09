"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Database } from '../../../types/database.types';

type Profile = Database['public']['Tables']['profiles']['Row'];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);
    const [isAuthorized, setIsAuthorized] = useState(false);
    const supabase = createClient();

    useEffect(() => {
        const checkUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();

            if (!user) {
                router.push('/login');
                return;
            }

            const { data: profile } = await supabase
                .from('profiles')
                .select('role')
                .eq('id', user.id)
                .maybeSingle();

            if ((profile as any)?.role === 'ADMIN') {
                setIsAuthorized(true);
            } else {
                router.push('/'); // Redirect non-admins
            }
            setIsLoading(false);
        };

        checkUser();
    }, [router, supabase]);

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-zinc-950 text-emerald-500 font-mono">
                <div className="animate-pulse">VERIFICANDO CREDENCIALES NIVEL 5...</div>
            </div>
        );
    }

    if (!isAuthorized) return null;

    return (
        <div className="min-h-screen bg-zinc-950 text-zinc-100 font-mono">
            <nav className="border-b border-zinc-800 bg-zinc-900/50 backdrop-blur-md p-4 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
                        <span className="font-bold tracking-widest text-red-500">ADMINISTRACIÓN // GHOSTWIRE</span>
                    </div>
                    <div className="text-xs text-zinc-500">
                        SISTEMA SEGURO v2.0
                    </div>
                </div>
            </nav>
            <main className="max-w-7xl mx-auto p-6">
                {children}
            </main>
        </div>
    );
}
