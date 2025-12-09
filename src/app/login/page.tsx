"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function LoginPage() {
    const router = useRouter();
    const supabase = createClient();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const { error: authError } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (authError) {
            setError(authError.message);
            setLoading(false);
        } else {
            router.push('/admin/dashboard'); // Redirect to dashboard or home
        }
    };

    const handleSignUp = async () => {
        setLoading(true);
        setError(null);
        const { error: signUpError } = await supabase.auth.signUp({
            email,
            password,
        });

        if (signUpError) {
            setError(signUpError.message);
            setLoading(false);
        } else {
            alert('Registro exitoso. Revisa tu email o inicia sesión si el auto-confirm está activado.');
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-4">
            <div className="w-full max-w-md space-y-8">
                <div className="text-center">
                    <div className="inline-block p-4 bg-trench rounded-full mb-4">
                        <span className="text-2xl">🔐</span>
                    </div>
                    <h2 className="text-3xl font-bold tracking-tight">Acceso al Sistema</h2>
                    <p className="text-zinc-500 mt-2">GhostWire MX // Secure Login</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-4 bg-zinc-900/50 p-8 rounded-xl border border-zinc-800">
                    <div>
                        <label className="block text-sm font-medium mb-1 text-zinc-400">Email</label>
                        <Input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="bg-zinc-950 border-zinc-700 text-white"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1 text-zinc-400">Password</label>
                        <Input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="bg-zinc-950 border-zinc-700 text-white"
                            required
                        />
                    </div>

                    {error && (
                        <div className="p-3 bg-red-500/10 border border-red-500/50 rounded text-red-500 text-sm">
                            {error}
                        </div>
                    )}

                    <Button type="submit" disabled={loading} className="w-full bg-trench text-black hover:bg-yellow-400 font-bold">
                        {loading ? 'Procesando...' : 'Iniciar Sesión'}
                    </Button>

                    <Button
                        type="button"
                        variant="outline"
                        onClick={handleSignUp}
                        disabled={loading}
                        className="w-full border-zinc-700 text-zinc-300 hover:bg-zinc-800"
                    >
                        Registrarse
                    </Button>
                </form>
            </div>
        </div>
    );
}
