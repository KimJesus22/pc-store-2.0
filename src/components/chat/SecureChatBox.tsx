"use client";

import React, { useState, useEffect, useRef } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, Send, ShieldAlert, Lock } from "lucide-react";
import { cn } from "@/lib/utils/cn";

interface Message {
    id: string;
    content: string;
    sender_id: string;
    created_at: string;
}

// DLP PATTERNS
const PHONE_REGEX = /\b(?:\+?52)?\s?(?:55|33|81|56|\d{2})\s?\d{2}\s?\d{2}\s?\d{2}\s?\d{2}\b|\b\d{10}\b/g;
const EMAIL_REGEX = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;

export function SecureChatBox({ listingId }: { listingId: string }) {
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState("");
    const [securityAlert, setSecurityAlert] = useState<string | null>(null);
    const supabase = createClient();
    const chatContainerRef = useRef<HTMLDivElement>(null);

    // MOCK INITIAL MESSAGES (Until DB is connected)
    useEffect(() => {
        setMessages([
            { id: "1", content: "¿Sigue disponible el artículo?", sender_id: "other", created_at: new Date().toISOString() },
            { id: "2", content: "Sí, claro. Acepto ofertas por el sistema.", sender_id: "me", created_at: new Date().toISOString() }
        ]);

        // SUBSCRIBE TO REALTIME
        const channel = supabase
            .channel(`chat:${listingId}`)
            .on(
                'postgres_changes',
                { event: 'INSERT', schema: 'public', table: 'messages', filter: `listing_id=eq.${listingId}` },
                (payload) => {
                    console.log('New message received!', payload);
                    setMessages((current) => [...current, payload.new as Message]);
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [listingId, supabase]);

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        setSecurityAlert(null);

        // 1. DLP SCAN
        if (PHONE_REGEX.test(newMessage)) {
            setSecurityAlert("PATRÓN DE TELÉFONO DETECTADO. Por tu seguridad, no compartas números personales fuera del Escrow.");
            return;
        }
        if (EMAIL_REGEX.test(newMessage)) {
            setSecurityAlert("EMAIL DETECTADO. El intercambio de correos está prohibido para prevenir estafas de phishing.");
            return;
        }

        // 2. SIMULATE SEND (DB INSERT WOULD GO HERE)
        const optimisticMsg: Message = {
            id: Date.now().toString(),
            content: newMessage,
            sender_id: "me", // In real app, get from auth context
            created_at: new Date().toISOString()
        };

        setMessages((prev) => [...prev, optimisticMsg]);
        setNewMessage("");

        // In real app: await supabase.from('messages').insert({ ... })
    };

    return (
        <Card className="h-[600px] flex flex-col bg-slate-900 border-white/10 shadow-2xl relative overflow-hidden">
            {/* CAUTION TAPE HEADER IF ALERT */}
            {securityAlert && (
                <div className="absolute top-0 left-0 right-0 bg-yellow-400 text-black font-bold text-xs py-1 px-2 z-10 flex items-center justify-center animate-pulse tracking-widest border-b-4 border-black">
                    <ShieldAlert size={16} className="mr-2" />
                    POLICE LINE DO NOT CROSS // SEGURIDAD ACTIVADA // DATOS SENSIBLES BLOQUEADOS
                </div>
            )}

            <CardHeader className="border-b border-white/10 bg-black/40 pt-8 pb-4">
                <CardTitle className="flex items-center gap-2 text-white text-sm font-mono">
                    <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                    CANAL ENCRIPTADO: {listingId.substring(0, 8)}...
                    <Lock size={14} className="ml-auto text-gray-500" />
                </CardTitle>
            </CardHeader>

            <CardContent className="flex-1 overflow-y-auto p-4 space-y-4" ref={chatContainerRef}>
                {messages.map((msg) => (
                    <div key={msg.id} className={cn("flex w-full", msg.sender_id === "me" ? "justify-end" : "justify-start")}>
                        <div className={cn(
                            "max-w-[80%] p-3 rounded-lg text-sm",
                            msg.sender_id === "me"
                                ? "bg-trench text-black font-medium rounded-tr-none"
                                : "bg-white/10 text-white rounded-tl-none border border-white/5"
                        )}>
                            {msg.content}
                            <p className="text-[10px] opacity-50 mt-1 text-right">
                                {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </p>
                        </div>
                    </div>
                ))}

                {/* SYSTEM ALERT BUBBLE */}
                {securityAlert && (
                    <div className="flex w-full justify-center animate-bounce">
                        <div className="bg-red-900/80 border border-red-500 text-red-200 p-3 rounded text-xs flex items-center gap-2 max-w-[90%] backdrop-blur">
                            <AlertTriangle size={24} className="shrink-0 text-yellow-400" />
                            <div>
                                <p className="font-bold text-yellow-400">¡ENVÍO BLOQUEADO!</p>
                                <p>{securityAlert}</p>
                            </div>
                        </div>
                    </div>
                )}
            </CardContent>

            <div className="p-4 bg-black/60 border-t border-white/10">
                <form onSubmit={handleSendMessage} className="flex gap-2">
                    <Input
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Escribe un mensaje seguro..."
                        className={cn(
                            "bg-slate-800 border-white/10 text-white focus-visible:ring-trench transition-all",
                            securityAlert ? "border-red-500 ring-1 ring-red-500" : ""
                        )}
                    />
                    <Button type="submit" size="icon" className="bg-trench text-black hover:bg-yellow-400 hover:scale-105 transition-transform">
                        <Send size={18} />
                    </Button>
                </form>
                <div className="text-[10px] text-gray-600 mt-2 text-center font-mono">
                    Protegido por GhostWire DLP v1.0. No compartas info personal.
                </div>
            </div>
        </Card>
    );
}
