"use client";

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Database } from '../../../types/database.types';
import { format } from 'date-fns';

type Dispute = Database['public']['Tables']['disputes']['Row'] & {
    order: {
        id: string;
        amount: number; // Assuming I can get this or similar from order, but order schema in my head was simple. Checking schema again.
        // Order schema: buyer_id, seller_id, listing_id...
        // I probably need to fetch listing to get price or order... Wait table orders doesn't have price?
        // Listing has price. Order references Listing.
    };
};

// Simplified type for now based on what I can easily fetch without complex joins if not setup
type DisputeDisplay = {
    id: string;
    reason: string;
    status: string;
    created_at: string;
    order_id: string;
};

export default function DisputeTable({ onSelectDispute }: { onSelectDispute: (id: string) => void }) {
    const [disputes, setDisputes] = useState<DisputeDisplay[]>([]);
    const supabase = createClient();

    useEffect(() => {
        const fetchDisputes = async () => {
            const { data, error } = await supabase
                .from('disputes')
                .select('*')
                .in('status', ['OPEN', 'UNDER_REVIEW'])
                .order('created_at', { ascending: false });

            if (data) {
                setDisputes(data);
            }
        };

        fetchDisputes();

        // Subscribe to changes
        const channel = supabase
            .channel('disputes_realtime')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'disputes' }, fetchDisputes)
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [supabase]);

    return (
        <div className="bg-zinc-900 border border-zinc-800 rounded-lg overflow-hidden">
            <div className="p-4 bg-zinc-800/50 border-b border-zinc-800">
                <h2 className="text-lg font-bold text-zinc-100">DISPUTAS ACTIVAS</h2>
            </div>
            <table className="w-full text-left text-sm text-zinc-400">
                <thead className="bg-zinc-950 text-zinc-500 uppercase font-mono">
                    <tr>
                        <th className="p-4">ID Caso</th>
                        <th className="p-4">Problema</th>
                        <th className="p-4">Estado</th>
                        <th className="p-4">Fecha Reporte</th>
                        <th className="p-4">Acción</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800">
                    {disputes.map((dispute) => (
                        <tr key={dispute.id} className="hover:bg-zinc-800/50 transition-colors">
                            <td className="p-4 font-mono text-xs">{dispute.id.slice(0, 8)}...</td>
                            <td className="p-4 text-zinc-100 font-medium">{dispute.reason}</td>
                            <td className="p-4">
                                <span className={`px-2 py-1 rounded text-xs font-bold ${dispute.status === 'OPEN' ? 'bg-red-500/10 text-red-500 border border-red-500/20' : 'bg-yellow-500/10 text-yellow-500 border border-yellow-500/20'
                                    }`}>
                                    {dispute.status}
                                </span>
                            </td>
                            <td className="p-4">{format(new Date(dispute.created_at), 'dd/MM/yyyy HH:mm')}</td>
                            <td className="p-4">
                                <button
                                    onClick={() => onSelectDispute(dispute.id)}
                                    className="bg-zinc-100 text-zinc-950 px-3 py-1 rounded text-xs font-bold hover:bg-white transition-colors uppercase tracking-wider"
                                >
                                    Investigar
                                </button>
                            </td>
                        </tr>
                    ))}
                    {disputes.length === 0 && (
                        <tr>
                            <td colSpan={5} className="p-8 text-center text-zinc-600">
                                NO HAY DISPUTAS ACTIVAS. SISTEMA NOMINAL.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}
