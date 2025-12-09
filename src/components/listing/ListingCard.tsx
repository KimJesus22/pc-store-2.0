"use client";

import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Eye } from "lucide-react";
import { Database } from "../../../types/database.types";
import Link from "next/link";

type Listing = Database['public']['Tables']['listings']['Row'] & {
    profiles?: { username: string; is_verified_seller: boolean; } | null
};

interface ListingCardProps {
    listing: Listing;
}

export function ListingCard({ listing }: ListingCardProps) {
    const mainImage = listing.images && listing.images.length > 0
        ? listing.images[0]
        : "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?q=80&w=1000&auto=format&fit=crop";
    // Fallback image

    return (
        <Card className="overflow-hidden bg-black border-zinc-800 hover:border-emerald-500/50 transition-all group duration-300">
            {/* Image Containter */}
            <div className="relative aspect-square overflow-hidden bg-zinc-900">
                <img
                    src={mainImage}
                    alt={listing.title}
                    className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute top-2 right-2 flex gap-2">
                    <Badge variant="secondary" className="bg-black/80 text-white backdrop-blur-md border border-white/10 font-mono text-xs">
                        {listing.category || 'OTHER'}
                    </Badge>
                </div>
                {listing.status === 'SOLD' && (
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                        <span className="text-red-500 font-bold border-2 border-red-500 px-4 py-1 rotate-[-15deg] text-xl">VENDIDO</span>
                    </div>
                )}
            </div>

            {/* Content */}
            <CardContent className="p-4">
                <div className="flex justify-between items-start mb-2">
                    <h3 className="text-white font-bold truncate pr-2" title={listing.title}>
                        {listing.title}
                    </h3>
                    <Badge variant={listing.condition === 'NEW' ? "default" : "outline"} className="text-[10px] h-5">
                        {listing.condition === 'NEW' ? 'NUEVO' : 'USADO'}
                    </Badge>
                </div>

                <p className="text-emerald-400 font-mono text-lg font-bold">
                    ${listing.price.toLocaleString()}
                </p>

                <div className="flex items-center gap-2 mt-3 text-xs text-zinc-500">
                    <div className="w-4 h-4 rounded-full bg-zinc-800 flex items-center justify-center text-[8px] text-white">
                        {(listing.profiles?.username?.[0] || 'U').toUpperCase()}
                    </div>
                    <span>{listing.profiles?.username || 'Usuario'}</span>
                    {listing.profiles?.is_verified_seller && (
                        <span className="text-blue-400" title="Vendedor Verificado">✓</span>
                    )}
                </div>
            </CardContent>

            {/* Actions */}
            <CardFooter className="p-4 pt-0 gap-2">
                <Link href={`/listing/${listing.id}`} className="w-full">
                    <Button variant="outline" size="sm" className="w-full border-zinc-700 hover:bg-zinc-800 hover:text-white text-zinc-400 text-xs">
                        <Eye size={14} className="mr-2" /> VER
                    </Button>
                </Link>
                <Button size="sm" className="bg-emerald-600 hover:bg-emerald-500 text-white rounded-md shrink-0">
                    <ShoppingCart size={16} />
                </Button>
            </CardFooter>
        </Card>
    );
}
