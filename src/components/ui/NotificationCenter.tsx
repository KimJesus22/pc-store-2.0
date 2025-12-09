"use client";

import { useEffect, useState } from "react";
import { Bell, ShieldAlert, BadgeDollarSign, Info, X } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { Database } from "../../../types/database.types";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

type Notification = Database['public']['Tables']['notifications']['Row'];

export function NotificationCenter() {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [isOpen, setIsOpen] = useState(false);
    const supabase = createClient();
    const router = useRouter();

    useEffect(() => {
        const fetchNotifications = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            // Fetch recent notifications
            const { data } = await supabase
                .from('notifications')
                .select('*')
                .eq('user_id', user.id)
                .order('created_at', { ascending: false })
                .limit(10)
                .returns<Notification[]>();

            if (data) {
                setNotifications(data);
                setUnreadCount(data.filter(n => !n.read).length);
            }

            // Realtime Subscription
            const channel = supabase
                .channel('notifications-changes')
                .on(
                    'postgres_changes',
                    {
                        event: 'INSERT',
                        schema: 'public',
                        table: 'notifications',
                        filter: `user_id=eq.${user.id}`
                    },
                    (payload) => {
                        const newNotif = payload.new as Notification;
                        setNotifications(prev => [newNotif, ...prev]);
                        setUnreadCount(prev => prev + 1);

                        // Play sound (optional)
                        // const audio = new Audio('/notification.mp3');
                        // audio.play().catch(() => {});
                    }
                )
                .subscribe();

            return () => {
                supabase.removeChannel(channel);
            };
        };

        fetchNotifications();
    }, []);

    const handleMarkAsRead = async (id: string, link: string | null) => {
        // Optimistic update
        setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
        setUnreadCount(prev => Math.max(0, prev - 1));

        await supabase.from('notifications').update({ read: true } as any).eq('id', id);

        if (link) {
            setIsOpen(false);
            router.push(link);
        }
    };

    const getIcon = (type: string) => {
        switch (type) {
            case 'SECURITY': return <ShieldAlert className="text-red-500" size={20} />;
            case 'ESCROW': return <BadgeDollarSign className="text-yellow-400" size={20} />;
            default: return <Info className="text-blue-400" size={20} />;
        }
    };

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="relative p-2 text-zinc-400 hover:text-white transition-colors"
                title="Notificaciones"
            >
                <Bell size={20} />
                {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 h-2.5 w-2.5 bg-red-500 rounded-full border border-black animate-pulse"></span>
                )}
            </button>

            {isOpen && (
                <>
                    {/* Backdrop to close */}
                    <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />

                    <div className="absolute right-0 mt-2 w-80 md:w-96 bg-zinc-950 border border-zinc-800 rounded-xl shadow-2xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                        <div className="flex items-center justify-between p-4 border-b border-zinc-900 bg-zinc-900/50">
                            <h3 className="font-bold text-sm text-zinc-300">Notificaciones</h3>
                            {unreadCount > 0 && (
                                <span className="text-[10px] bg-red-500/10 text-red-500 px-2 py-0.5 rounded-full font-mono">
                                    {unreadCount} NUEVAS
                                </span>
                            )}
                        </div>

                        <div className="max-h-[60vh] overflow-y-auto">
                            {notifications.length > 0 ? (
                                <div className="divide-y divide-zinc-900">
                                    {notifications.map((n) => (
                                        <div
                                            key={n.id}
                                            onClick={() => handleMarkAsRead(n.id, n.link)}
                                            className={cn(
                                                "p-4 flex gap-4 cursor-pointer hover:bg-zinc-900/50 transition-colors",
                                                !n.read ? "bg-zinc-900/20" : "opacity-60"
                                            )}
                                        >
                                            <div className="mt-1 shrink-0">
                                                {getIcon(n.type)}
                                            </div>
                                            <div className="flex-1 space-y-1">
                                                <p className={cn("text-xs leading-relaxed", !n.read ? "text-white font-medium" : "text-zinc-500")}>
                                                    {n.message}
                                                </p>
                                                <p className="text-[10px] text-zinc-600 font-mono">
                                                    {new Date(n.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </p>
                                            </div>
                                            {!n.read && (
                                                <div className="shrink-0 self-center">
                                                    <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="p-8 text-center text-zinc-500 text-sm">
                                    <Bell className="mx-auto mb-2 opacity-20" size={32} />
                                    No tienes notificaciones
                                </div>
                            )}
                        </div>

                        {notifications.length > 0 && (
                            <div className="p-2 bg-zinc-900/30 border-t border-zinc-900 text-center">
                                <button
                                    onClick={async () => {
                                        setNotifications(prev => prev.map(n => ({ ...n, read: true })));
                                        setUnreadCount(0);
                                        const { data: { user } } = await supabase.auth.getUser();
                                        if (user) {
                                            await supabase.from('notifications').update({ read: true } as any).eq('user_id', user.id);
                                        }
                                    }}
                                    className="text-xs text-zinc-500 hover:text-white transition-colors w-full py-2"
                                >
                                    Marcar todo como leído
                                </button>
                            </div>
                        )}
                    </div>
                </>
            )}
        </div>
    );
}
