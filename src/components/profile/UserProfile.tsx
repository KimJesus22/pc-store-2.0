"use client";

import React, { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, Shield, Upload, TrendingUp, Package, History } from "lucide-react";
import { cn } from "@/lib/utils/cn";

// Mock Data Types
interface Transaction {
    id: string;
    item: string;
    amount: number;
    date: string;
    status: "COMPLETED" | "PENDING" | "CANCELLED";
}

const MOCK_SALES: Transaction[] = [
    { id: "TX-101", item: "RTX 3060 Ti", amount: 6500, date: "2024-03-10", status: "COMPLETED" },
    { id: "TX-102", item: "Ryzen 5 5600X", amount: 2800, date: "2024-02-15", status: "COMPLETED" },
];

const MOCK_PURCHASES: Transaction[] = [
    { id: "TX-205", item: "Corsair RAM 32GB", amount: 1200, date: "2024-03-01", status: "COMPLETED" },
];

export function UserProfile() {
    const [isVerified, setIsVerified] = useState(false);
    const [kycUploading, setKycUploading] = useState(false);

    // Gamification Stats
    const reputationScore = 850; // out of 1000
    const level = Math.floor(reputationScore / 100);
    const nextLevelProgress = reputationScore % 100;

    // Neon Aesthetic based on Level
    const isHighLevel = level >= 8;
    const levelColor = isHighLevel ? "text-purple-400 drop-shadow-[0_0_8px_rgba(192,132,252,0.8)]" : "text-trench";
    const progressColor = isHighLevel ? "bg-purple-500 shadow-[0_0_10px_#a855f7]" : "bg-trench";

    const handleKycUpload = () => {
        setKycUploading(true);
        setTimeout(() => {
            setKycUploading(false);
            setIsVerified(true);
            // In real app: upload to Supabase Storage
        }, 2000);
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            {/* HEADER CARD */}
            <Card className="bg-black/80 border-white/10 backdrop-blur overflow-hidden relative">
                {/* Background decoration */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-trench/5 rounded-full blur-3xl -z-10"></div>

                <CardContent className="p-8 flex flex-col md:flex-row items-center gap-8">
                    <div className="relative">
                        <Avatar className="h-32 w-32 border-4 border-slate-900 ring-2 ring-white/20">
                            <AvatarImage src="https://github.com/shadcn.png" />
                            <AvatarFallback>GX</AvatarFallback>
                        </Avatar>
                        {isVerified && (
                            <div className="absolute bottom-0 right-0 bg-blue-500 text-white rounded-full p-1 border-2 border-black" title="Identidad Verificada">
                                <CheckCircle size={20} />
                            </div>
                        )}
                    </div>

                    <div className="flex-1 text-center md:text-left space-y-2">
                        <h1 className="text-3xl font-bold text-white flex items-center justify-center md:justify-start gap-3">
                            GhostUser_99
                            {isVerified ? (
                                <Badge variant="default" className="bg-blue-900/50 text-blue-200 border-blue-500/50">VERIFICADO</Badge>
                            ) : (
                                <Badge variant="outline" className="text-gray-500 border-gray-700">NO VERIFICADO</Badge>
                            )}
                        </h1>
                        <p className="text-gray-400 font-mono text-sm">Miembro desde 2023 • CDMX</p>

                        {/* REPUTATION BAR */}
                        <div className="max-w-md space-y-1 pt-4">
                            <div className="flex justify-between text-xs font-bold font-mono">
                                <span className={cn("tracking-widest", levelColor)}>NIVEL {level} // MERCENARIO</span>
                                <span className="text-gray-500">{reputationScore} / 1000 XP</span>
                            </div>
                            <Progress value={nextLevelProgress} className="h-2 bg-slate-800" indicatorClassName={progressColor} />
                        </div>
                    </div>

                    {/* ACTION: KYC */}
                    {!isVerified && (
                        <div className="p-4 border border-dashed border-white/20 rounded-lg bg-white/5 text-center w-full md:w-auto">
                            <Shield className="mx-auto text-gray-400 mb-2" />
                            <p className="text-xs text-gray-300 mb-3 max-w-[180px]">Sube tu INE/Passport para obtener la insignia.</p>
                            <Button
                                size="sm"
                                variant="outline"
                                onClick={handleKycUpload}
                                disabled={kycUploading}
                                className="w-full border-trench text-trench hover:bg-trench hover:text-black"
                            >
                                {kycUploading ? "Subiendo..." : "Verificar Identidad"} <Upload size={14} className="ml-2" />
                            </Button>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* HISTORY TABS */}
            <Tabs defaultValue="sales" className="w-full">
                <TabsList className="grid w-full grid-cols-2 bg-slate-900 border border-white/10 rounded-none h-12">
                    <TabsTrigger value="sales" className="data-[state=active]:bg-trench data-[state=active]:text-black font-bold font-mono rounded-none">
                        VENTS ({MOCK_SALES.length})
                    </TabsTrigger>
                    <TabsTrigger value="purchases" className="data-[state=active]:bg-white data-[state=active]:text-black font-bold font-mono rounded-none">
                        COMPRAS ({MOCK_PURCHASES.length})
                    </TabsTrigger>
                </TabsList>

                {/* TAB: SALES */}
                <TabsContent value="sales" className="mt-6 space-y-4 animate-in fade-in-50">
                    {MOCK_SALES.map((tx) => (
                        <Card key={tx.id} className="bg-black border-white/10 rounded-none hover:border-trench/30 transition-colors">
                            <CardContent className="p-4 flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="p-2 bg-trench/10 rounded text-trench">
                                        <TrendingUp size={20} />
                                    </div>
                                    <div>
                                        <p className="font-bold text-white">{tx.item}</p>
                                        <p className="text-xs text-gray-500 font-mono">{tx.date} • ID: {tx.id}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="font-bold text-trench font-mono">+ ${tx.amount.toLocaleString()}</p>
                                    <Badge variant="outline" className="text-[10px] border-green-900 text-green-500">{tx.status}</Badge>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </TabsContent>

                {/* TAB: PURCHASES */}
                <TabsContent value="purchases" className="mt-6 space-y-4 animate-in fade-in-50">
                    {MOCK_PURCHASES.map((tx) => (
                        <Card key={tx.id} className="bg-black border-white/10 rounded-none hover:border-white/30 transition-colors">
                            <CardContent className="p-4 flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="p-2 bg-white/10 rounded text-white">
                                        <Package size={20} />
                                    </div>
                                    <div>
                                        <p className="font-bold text-white">{tx.item}</p>
                                        <p className="text-xs text-gray-500 font-mono">{tx.date} • ID: {tx.id}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="font-bold text-white font-mono">- ${tx.amount.toLocaleString()}</p>
                                    <Badge variant="outline" className="text-[10px] border-green-900 text-green-500">{tx.status}</Badge>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </TabsContent>
            </Tabs>
        </div>
    );
}
