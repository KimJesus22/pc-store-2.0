"use client";

import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Database } from "../../../types/database.types";
import { ShoppingCart } from "lucide-react";
import Image from "next/image";

type Listing = Database["public"]["Tables"]["listings"]["Row"];

interface ProductCardProps {
    listing: Partial<Listing> & {
        seller?: { username: string; is_verified_seller: boolean }; // Mock relation
    };
}

export function ProductCard({ listing }: ProductCardProps) {
    const isNew = listing.condition === "NEW";

    // Format Price
    const priceFormatter = new Intl.NumberFormat('es-MX', {
        style: 'currency',
        currency: 'MXN',
    });

    return (
        <Card className="group overflow-hidden border-white/10 bg-black hover:border-trench/50 transition-all duration-300 rounded-none h-full flex flex-col">
            {/* IMAGE PLACEHOLDER */}
            <div className="relative aspect-square w-full bg-slate-900 overflow-hidden">
                {listing.images && listing.images.length > 0 ? (
                    // Normally use Image from next/image, but for now fallback or direct img if using external URLs in mock
                    <img
                        src={listing.images[0]}
                        alt={listing.title || 'Product'}
                        className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
                    />
                ) : (
                    <div className="flex items-center justify-center h-full text-white/20 font-mono text-xs">
                        NO IMAGE
                    </div>
                )}

                {/* CONDITION BADGE */}
                <div className="absolute top-2 left-2">
                    {isNew ? (
                        <span className="bg-green-500/90 text-black text-[10px] font-bold px-2 py-0.5 uppercase tracking-wide border border-green-400">
                            NUEVO
                        </span>
                    ) : (
                        <span className="bg-trench/90 text-black text-[10px] font-bold px-2 py-0.5 uppercase tracking-wide border border-yellow-400">
                            USADO - VERIFICADO
                        </span>
                    )}
                </div>
            </div>

            <CardContent className="p-4 flex-1 flex flex-col gap-2">
                <h3 className="font-medium text-white line-clamp-2 min-h-[3rem] group-hover:text-trench transition-colors">
                    {listing.title || "Untitled Product"}
                </h3>

                <div className="mt-auto">
                    <p className="text-2xl font-bold text-trench font-mono tracking-tighter">
                        {priceFormatter.format(listing.price || 0)}
                    </p>
                    <p className="text-xs text-gray-500 font-mono mt-1">
                        Vendedor: <span className="text-gray-300">{listing.seller?.username || "Anon"}</span>
                        {listing.seller?.is_verified_seller && (
                            <span className="ml-1 text-blue-400" title="Verificado">✓</span>
                        )}
                    </p>
                </div>
            </CardContent>

            <CardFooter className="p-4 pt-0">
                <Button
                    className="w-full bg-white/10 hover:bg-white/20 text-white rounded-none border border-white/5 hover:border-white/20"
                    size="sm"
                    onClick={() => window.location.href = `/checkout/${listing.id}`}
                >
                    <ShoppingCart size={16} className="mr-2" />
                    Comprar Ahora
                </Button>
            </CardFooter>
        </Card>
    );
}
