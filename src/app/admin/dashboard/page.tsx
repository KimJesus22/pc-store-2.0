"use client";

import { useState, useEffect } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import DisputeTable from "@/components/admin/DisputeTable";
import KillcamView from "@/components/admin/KillcamView";
import ResolutionControls from "@/components/admin/ResolutionControls";
import { createClient } from "@/lib/supabase/client";
import { Database } from "../../../../types/database.types";

// Helper type for fetching full dispute details
type DisputeDetail = Database['public']['Tables']['disputes']['Row'] & {
    order: {
        id: string;
        listing: {
            title: string;
            images: string[];
        }
    }
};

export default function AdminDashboardPage() {
    const [selectedDisputeId, setSelectedDisputeId] = useState<string | null>(null);
    const [disputeDetail, setDisputeDetail] = useState<DisputeDetail | null>(null);
    const supabase = createClient();

    // Fetch details when specific dispute is selected
    useEffect(() => {
        if (!selectedDisputeId) {
            setDisputeDetail(null);
            return;
        }

        const fetchDetail = async () => {
            const { data, error } = await supabase
                .from('disputes')
                .select(`
                    *,
                    order:orders (
                        id,
                        listing:listings (
                            title,
                            images
                        )
                    )
                `)
                .eq('id', selectedDisputeId)
                .single();

            if (error) {
                console.error("Error fetching dispute details:", error);
            } else {
                setDisputeDetail(data as any); // Casting due to complex join typing often needing generics refinement
            }
        };

        fetchDetail();
    }, [selectedDisputeId, supabase]);

    return (
        <AdminLayout>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column: List */}
                <div className="lg:col-span-1">
                    <DisputeTable onSelectDispute={setSelectedDisputeId} />
                </div>

                {/* Right Column: Detail / Workspace */}
                <div className="lg:col-span-2 space-y-6">
                    {selectedDisputeId && disputeDetail ? (
                        <>
                            <div className="bg-zinc-900 border border-zinc-700 p-6 rounded-xl shadow-2xl relative overflow-hidden">
                                <div className="absolute top-0 right-0 p-4 opacity-50 font-mono text-zinc-600 text-xs">
                                    CASE_ID: {disputeDetail.id}
                                </div>
                                <h2 className="text-2xl font-bold text-white mb-2">{disputeDetail.order.listing.title}</h2>
                                <p className="text-zinc-400 mb-4 bg-zinc-950/50 p-4 rounded border-l-2 border-yellow-500 italic">
                                    "{disputeDetail.reason}: {disputeDetail.description}"
                                </p>

                                <KillcamView
                                    sellerImage={disputeDetail.order.listing.images?.[0] || ''}
                                    buyerImage={disputeDetail.evidence_urls?.[0] || ''}
                                />
                            </div>

                            <ResolutionControls
                                disputeId={disputeDetail.id}
                                orderId={disputeDetail.order_id} // Pass correct ID
                                onResolve={() => {
                                    setSelectedDisputeId(null);
                                    // Refresh logic handled by table subscription mostly, but resetting UI
                                }}
                            />
                        </>
                    ) : (
                        <div className="h-full min-h-[400px] flex flex-col items-center justify-center text-zinc-600 border-2 border-dashed border-zinc-800 rounded-xl">
                            <div className="w-16 h-16 bg-zinc-900 rounded-full flex items-center justify-center mb-4 text-2xl">
                                🛡️
                            </div>
                            <p>SELECCIONA UNA DISPUTA PARA INICIAR PROTOCOLO DE RESOLUCIÓN</p>
                        </div>
                    )}
                </div>
            </div>
        </AdminLayout>
    );
}
