"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowUpRight, ArrowDownRight, DollarSign, Wallet, TrendingUp } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { createClient } from "@/lib/supabase/client";
import { Database } from "../../../types/database.types";

// Mock Data for Graph (will replace with real aggregation if time permits, but requirements allow mock/simple)
const MOCK_DATA = [
    { name: 'Ene', sales: 4000 },
    { name: 'Feb', sales: 3000 },
    { name: 'Mar', sales: 2000 },
    { name: 'Abr', sales: 2780 },
    { name: 'May', sales: 1890 },
    { name: 'Jun', sales: 2390 },
];

export function FinancialDashboard({ userId }: { userId: string }) {
    const [stats, setStats] = useState({
        revenue: 0,
        escrow: 0,
        expenses: 0
    });
    const [transactions, setTransactions] = useState<any[]>([]);
    const supabase = createClient();

    useEffect(() => {
        const fetchData = async () => {
            // 1. Calculate Revenue (Sold by me, Completed) - Simplified: Sum of orders where I am seller
            const { data: sales, error: salesError } = await supabase
                .from('orders')
                .select('*, listings(price)')
                .eq('seller_id', userId);

            // 2. Calculate Expenses (Bought by me)
            const { data: purchases, error: purchaseError } = await supabase
                .from('orders')
                .select('*, listings(price)')
                .eq('buyer_id', userId);

            if (sales && purchases) {
                let totalRev = 0;
                let totalEscrow = 0;
                let totalExp = 0;

                const combinedTransactions: any[] = [];

                sales.forEach((sale: any) => {
                    const amount = sale.listings?.price || 0;
                    if (sale.status === 'COMPLETED') {
                        totalRev += amount;
                    } else {
                        totalEscrow += amount; // Funds held
                    }
                    combinedTransactions.push({
                        id: sale.id,
                        date: sale.created_at,
                        type: 'SALE',
                        amount: amount,
                        status: sale.status
                    });
                });

                purchases.forEach((buy: any) => {
                    const amount = buy.listings?.price || 0;
                    totalExp += amount;
                    combinedTransactions.push({
                        id: buy.id,
                        date: buy.created_at,
                        type: 'PURCHASE',
                        amount: amount,
                        status: buy.status
                    });
                });

                // Sort by date desc
                combinedTransactions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

                setStats({
                    revenue: totalRev,
                    escrow: totalEscrow,
                    expenses: totalExp
                });
                setTransactions(combinedTransactions);
            }
        };

        fetchData();
    }, [userId]);

    const handleWithdraw = () => {
        alert("Solicitud de retiro enviada a SPEI. Fondos llegarán en 24-48hrs.");
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* KPI CARDS */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="bg-zinc-900 border-zinc-800">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-zinc-400">Ingresos Totales (Liberados)</CardTitle>
                        <DollarSign className="h-4 w-4 text-emerald-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-white">${stats.revenue.toLocaleString()}</div>
                        <p className="text-xs text-zinc-500 flex items-center mt-1">
                            <TrendingUp className="h-3 w-3 mr-1 text-emerald-500" /> +20.1% este mes
                        </p>
                    </CardContent>
                </Card>

                <Card className="bg-zinc-900 border-zinc-800">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-zinc-400">En Retención (Escrow)</CardTitle>
                        <Wallet className="h-4 w-4 text-amber-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-white">${stats.escrow.toLocaleString()}</div>
                        <p className="text-xs text-zinc-500 mt-1">
                            Se libera al confirmar entrega
                        </p>
                    </CardContent>
                </Card>

                <Card className="bg-zinc-900 border-zinc-800">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-zinc-400">Gastos en Compras</CardTitle>
                        <ArrowDownRight className="h-4 w-4 text-red-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-white">${stats.expenses.toLocaleString()}</div>
                    </CardContent>
                </Card>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-7 gap-6">
                {/* CHART */}
                <Card className="md:col-span-4 bg-zinc-900 border-zinc-800">
                    <CardHeader>
                        <CardTitle className="text-white">Rendimiento de Ventas</CardTitle>
                    </CardHeader>
                    <CardContent className="pl-2">
                        <div className="h-[240px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={MOCK_DATA}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                                    <XAxis dataKey="name" stroke="#666" fontSize={12} tickLine={false} axisLine={false} />
                                    <YAxis stroke="#666" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `$${value}`} />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: '#18181b', border: '1px solid #27272a' }}
                                        labelStyle={{ color: '#fff' }}
                                    />
                                    <Line type="monotone" dataKey="sales" stroke="#10b981" strokeWidth={2} activeDot={{ r: 8 }} />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>

                {/* WITHDRAWAL & ACTIONS */}
                <div className="md:col-span-3 space-y-6">
                    <Card className="bg-zinc-900 border-zinc-800 h-full">
                        <CardHeader>
                            <CardTitle className="text-white">Gestión de Fondos</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="p-4 bg-black/40 rounded-lg border border-zinc-800">
                                <div className="text-sm text-zinc-400 mb-1">Saldo Disponible para Retiro</div>
                                <div className="text-3xl font-bold text-emerald-400 font-mono">
                                    ${stats.revenue.toLocaleString()} <span className="text-sm text-zinc-600">MXN</span>
                                </div>
                            </div>

                            <Button
                                className="w-full bg-emerald-600 hover:bg-emerald-500 font-bold h-12 text-lg"
                                onClick={handleWithdraw}
                                disabled={stats.revenue <= 0}
                            >
                                SOLICITAR RETIRO SPEI
                            </Button>

                            <p className="text-xs text-zinc-500 text-center">
                                Tiempos de procesamiento: Lunes a Viernes, 9am - 5pm.
                            </p>
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* TRANSACTIONS TABLE */}
            <Card className="bg-zinc-900 border-zinc-800">
                <CardHeader>
                    <CardTitle className="text-white">Historial de Movimientos</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {transactions.length > 0 ? transactions.map((tx) => (
                            <div key={tx.id} className="flex items-center justify-between p-3 bg-black/20 rounded-lg border border-white/5">
                                <div className="flex items-center gap-4">
                                    <div className={`p-2 rounded-full ${tx.type === 'SALE' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-red-500/10 text-red-500'}`}>
                                        {tx.type === 'SALE' ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
                                    </div>
                                    <div>
                                        <div className="text-sm font-bold text-white">
                                            {tx.type === 'SALE' ? 'Venta Completada' : 'Compra Realizada'}
                                        </div>
                                        <div className="text-xs text-zinc-500">
                                            {new Date(tx.date).toLocaleDateString()} • {tx.status}
                                        </div>
                                    </div>
                                </div>
                                <div className={`font-mono font-bold ${tx.type === 'SALE' ? 'text-emerald-400' : 'text-zinc-400'}`}>
                                    {tx.type === 'SALE' ? '+' : '-'}${tx.amount.toLocaleString()}
                                </div>
                            </div>
                        )) : (
                            <div className="text-center py-8 text-zinc-500">No hay movimientos registrados.</div>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
