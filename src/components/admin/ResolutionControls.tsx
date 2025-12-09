"use client";

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';

interface ResolutionControlsProps {
    disputeId: string;
    orderId: string;
    onResolve: () => void;
}

export default function ResolutionControls({ disputeId, orderId, onResolve }: ResolutionControlsProps) {
    const [isProcessing, setIsProcessing] = useState(false);
    const supabase = createClient();
    const router = useRouter();

    const handleResolution = async (resolution: 'BUYER' | 'SELLER') => {
        if (!confirm(`¿Estás SEGURO de fallar a favor del ${resolution === 'BUYER' ? 'COMPRADOR' : 'VENDEDOR'}? Esta acción es irreversible.`)) return;

        setIsProcessing(true);

        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error('No admin user');

            // 1. Update Dispute Status
            const status = resolution === 'BUYER' ? 'RESOLVED_BUYER' : 'RESOLVED_SELLER';
            const { error: disputeError } = await supabase
                .from('disputes')
                // @ts-ignore
                .update({ status: status })
                .eq('id', disputeId);

            if (disputeError) throw disputeError;

            // 2. Log Audit
            const { error: auditError } = await supabase
                .from('audit_logs')
                .insert({
                    admin_id: user.id,
                    action: `RESOLVE_DISPUTE_${resolution}`,
                    target_id: disputeId,
                    details: { order_id: orderId, resolution, timestamp: new Date().toISOString() }
                } as any);

            if (auditError) throw auditError;

            // 3. Update Order Status (Optional/Context aware)
            // If resolved to buyer -> Refunded logic (Order CANCELLED/REFUNDED)
            // If resolved to seller -> Completed logic (Order COMPLETED)
            const orderStatus = resolution === 'BUYER' ? 'CANCELLED' : 'COMPLETED';
            // @ts-ignore
            await supabase.from('orders').update({ status: orderStatus }).eq('id', orderId);

            onResolve();
            alert('SENTENCIA EJECUTADA. CASO CERRADO.');
        } catch (e: any) {
            alert('ERROR EN EJECUCIÓN: ' + e.message);
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-xl space-y-4">
            <h3 className="text-xl font-bold text-zinc-100 uppercase tracking-tighter">
                ⚖️ SENTENCIA FINAL
            </h3>
            <p className="text-zinc-500 text-sm">
                Esta acción liberará los fondos de la cuenta de garantía (Escrow) y cerrará el caso permanentemente.
                La acción quedará registrada en el Log de Auditoría inmutable.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                <button
                    disabled={isProcessing}
                    onClick={() => handleResolution('SELLER')}
                    className="group relative overflow-hidden bg-zinc-950 border border-emerald-900 hover:border-emerald-500 transition-all p-4 rounded-lg text-left"
                >
                    <div className="relative z-10">
                        <div className="font-bold text-emerald-500 mb-1">LIBERAR FONDOS AL VENDEDOR</div>
                        <div className="text-xs text-zinc-500 group-hover:text-emerald-400/70">
                            Desestimar reclamo. El artículo cumple con la descripción.
                        </div>
                    </div>
                    <div className="absolute inset-0 bg-emerald-500/5 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                </button>

                <button
                    disabled={isProcessing}
                    onClick={() => handleResolution('BUYER')}
                    className="group relative overflow-hidden bg-zinc-950 border border-red-900 hover:border-red-500 transition-all p-4 rounded-lg text-left"
                >
                    <div className="relative z-10">
                        <div className="font-bold text-red-500 mb-1">REEMBOLSAR AL COMPRADOR</div>
                        <div className="text-xs text-zinc-500 group-hover:text-red-400/70">
                            Confirmar fraude o artículo defectuoso. Devolución total.
                        </div>
                    </div>
                    <div className="absolute inset-0 bg-red-500/5 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                </button>
            </div>
        </div>
    );
}
