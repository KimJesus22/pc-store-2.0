"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { Database } from "../../../types/database.types";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FinancialDashboard } from "@/components/profile/FinancialDashboard";

type Profile = Database["public"]["Tables"]["profiles"]["Row"];

export default function ProfilePage() {
    const [profile, setProfile] = useState<Profile | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [fullName, setFullName] = useState("");
    const [avatarUrl, setAvatarUrl] = useState("");
    const [isSaving, setIsSaving] = useState(false);

    const supabase = createClient();
    const router = useRouter();

    useEffect(() => {
        const getProfile = async () => {
            const {
                data: { user },
            } = await supabase.auth.getUser();

            if (!user) {
                router.push("/login");
                return;
            }

            const { data, error } = await supabase
                .from("profiles")
                .select("*")
                .eq("id", user.id)
                .maybeSingle();

            if (error) {
                console.error("Error loading profile:", error);
            } else if (data) {
                setProfile(data);
                setFullName((data as any).full_name || "");
                setAvatarUrl((data as any).avatar_url || "");
            }
            setIsLoading(false);
        };

        getProfile();
    }, [supabase, router]);

    const handleSave = async () => {
        if (!profile) return;
        setIsSaving(true);

        const updates = {
            id: profile.id,
            full_name: fullName,
            avatar_url: avatarUrl,
            updated_at: new Date().toISOString(),
        };

        const { error } = await supabase.from("profiles").upsert(updates as any);

        if (error) {
            alert("Error al actualizar perfil: " + error.message);
        } else {
            setProfile({ ...profile, full_name: fullName, avatar_url: avatarUrl });
            setIsEditing(false);
        }
        setIsSaving(false);
    };

    const handleLogout = async () => {
        await supabase.auth.signOut();
        router.push("/login");
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-black text-white flex items-center justify-center">
                <div className="animate-pulse text-zinc-500">CARGANDO PERFIL...</div>
            </div>
        );
    }

    if (!profile) {
        return (
            <div className="min-h-screen bg-black text-white flex items-center justify-center">
                <div className="text-red-500">Error: No se encontró el perfil.</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black text-white p-6 md:p-12 font-sans">
            <div className="max-w-6xl mx-auto space-y-8">
                {/* Header */}
                <div className="flex justify-between items-end border-b border-zinc-800 pb-6">
                    <div>
                        <h1 className="text-4xl font-bold tracking-tighter mb-2">
                            MI PERFIL
                        </h1>
                        <p className="text-zinc-500 font-mono text-sm">
                            ID: {profile.id.split("-")[0]}...
                        </p>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="text-red-500 hover:text-red-400 text-sm font-bold tracking-wider border border-zinc-800 hover:border-red-900 px-4 py-2 rounded transition-all bg-zinc-900/50"
                    >
                        CERRAR SESIÓN
                    </button>
                </div>

                <Tabs defaultValue="overview" className="w-full">
                    <TabsList className="bg-zinc-900 border-zinc-800 mb-8">
                        <TabsTrigger value="overview">General</TabsTrigger>
                        <TabsTrigger value="financials">Finanzas</TabsTrigger>
                    </TabsList>

                    <TabsContent value="overview">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {/* Columna Izquierda: Tarjeta de Usuario */}
                            <div className="space-y-6">
                                <div className="bg-zinc-900/50 border border-zinc-800 p-6 rounded-2xl flex flex-col items-center space-y-4">
                                    <div className="w-32 h-32 rounded-full bg-zinc-800 overflow-hidden border-4 border-black shadow-xl relative group">
                                        {profile.avatar_url ? (
                                            <img
                                                src={profile.avatar_url}
                                                alt="Avatar"
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-4xl">
                                                👤
                                            </div>
                                        )}
                                    </div>

                                    <div className="text-center">
                                        <h2 className="text-xl font-bold bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-transparent">
                                            {profile.username || "Usuario"}
                                        </h2>
                                        <div className="mt-2 inline-flex items-center px-3 py-1 rounded-full bg-zinc-800 text-xs font-bold tracking-wider border border-zinc-700">
                                            {profile.role === "ADMIN" ? "🛡️ ADMINISTRADOR" : "USUARIO"}
                                        </div>
                                    </div>

                                    <div className="w-full grid grid-cols-2 gap-2 text-center text-xs mt-4 border-t border-zinc-800 pt-4">
                                        <div>
                                            <div className="font-bold text-emerald-400 text-lg">
                                                {profile.reputation_score}
                                            </div>
                                            <div className="text-zinc-500">Reputación</div>
                                        </div>
                                        <div>
                                            <div className="font-bold text-white text-lg">
                                                {profile.is_verified_seller ? "SI" : "NO"}
                                            </div>
                                            <div className="text-zinc-500">Verificado</div>
                                        </div>
                                    </div>
                                </div>

                                {/* Links Rápidos */}
                                <div className="space-y-2">
                                    {profile.role === 'ADMIN' && (
                                        <button
                                            onClick={() => router.push('/admin/dashboard')}
                                            className="w-full p-4 bg-red-950/20 border border-red-900/50 text-red-500 rounded-xl hover:bg-red-900/20 transition-all font-bold tracking-wider text-left flex items-center justify-between group"
                                        >
                                            <span>PANEL DE ADMIN</span>
                                            <span className="group-hover:translate-x-1 transition-transform">→</span>
                                        </button>
                                    )}
                                </div>
                            </div>

                            {/* Columna Derecha: Detalles y Edición */}
                            <div className="md:col-span-2 space-y-6">
                                <div className="bg-zinc-900/30 border border-zinc-800 rounded-2xl p-8">
                                    <div className="flex justify-between items-center mb-6">
                                        <h3 className="text-xl font-bold">Datos Personales</h3>
                                        {!isEditing && (
                                            <button
                                                onClick={() => setIsEditing(true)}
                                                className="text-emerald-500 hover:text-emerald-400 text-sm font-bold"
                                            >
                                                EDITAR
                                            </button>
                                        )}
                                    </div>

                                    <div className="space-y-6">
                                        <div className="space-y-2">
                                            <label className="text-xs text-zinc-500 uppercase font-bold tracking-wider">
                                                Nombre Completo
                                            </label>
                                            {isEditing ? (
                                                <input
                                                    type="text"
                                                    value={fullName}
                                                    onChange={(e) => setFullName(e.target.value)}
                                                    className="w-full bg-zinc-950 border border-zinc-700 p-3 rounded-lg text-white focus:outline-none focus:border-emerald-500 transition-colors"
                                                    placeholder="Tu nombre real"
                                                />
                                            ) : (
                                                <div className="text-lg font-medium text-zinc-200">
                                                    {profile.full_name || "No especificado"}
                                                </div>
                                            )}
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-xs text-zinc-500 uppercase font-bold tracking-wider">
                                                URL de Avatar
                                            </label>
                                            {isEditing ? (
                                                <input
                                                    type="text"
                                                    value={avatarUrl}
                                                    onChange={(e) => setAvatarUrl(e.target.value)}
                                                    className="w-full bg-zinc-950 border border-zinc-700 p-3 rounded-lg text-white focus:outline-none focus:border-emerald-500 transition-colors"
                                                    placeholder="https://..."
                                                />
                                            ) : (
                                                <div className="text-lg font-medium text-zinc-200 truncate">
                                                    {profile.avatar_url || "No especificado"}
                                                </div>
                                            )}
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-xs text-zinc-500 uppercase font-bold tracking-wider">
                                                Miembro desde
                                            </label>
                                            <div className="text-zinc-400">
                                                {format(new Date(profile.created_at), "PPP", {
                                                    locale: es,
                                                })}
                                            </div>
                                        </div>

                                        {isEditing && (
                                            <div className="flex gap-4 pt-4">
                                                <button
                                                    onClick={handleSave}
                                                    disabled={isSaving}
                                                    className="px-6 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg transition-colors disabled:opacity-50"
                                                >
                                                    {isSaving ? "GUARDANDO..." : "GUARDAR CAMBIOS"}
                                                </button>
                                                <button
                                                    onClick={() => setIsEditing(false)}
                                                    disabled={isSaving}
                                                    className="px-6 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-bold rounded-lg transition-colors"
                                                >
                                                    CANCELAR
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </TabsContent>

                    <TabsContent value="financials">
                        <FinancialDashboard userId={profile.id} />
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
}
