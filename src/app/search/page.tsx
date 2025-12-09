"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Database } from "../../../types/database.types";
import { ListingCard } from "@/components/listing/ListingCard";
import { EmptyState } from "@/components/ui/EmptyState";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { useDebounce } from "@/hooks/useDebounce";
import { SlidersHorizontal, ArrowUpDown, X, Search } from "lucide-react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

type Listing = Database['public']['Tables']['listings']['Row'] & {
    profiles?: { username: string; is_verified_seller: boolean; } | null
};

// Mock categories
const CATEGORIES = ["GPU", "CPU", "RAM", "MOBO", "OTHER"];

export default function SearchPage() {
    const [listings, setListings] = useState<Listing[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // Filters
    const [searchTerm, setSearchTerm] = useState("");
    const debouncedSearch = useDebounce(searchTerm, 300);

    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [condition, setCondition] = useState<string | null>(null); // 'NEW' | 'USED' | null
    const [priceRange, setPriceRange] = useState<[number, number]>([0, 50000]);
    const [maxPriceLimit, setMaxPriceLimit] = useState(100000); // Dynamic max

    const [sortBy, setSortBy] = useState<string>("newest"); // 'newest', 'price_asc', 'price_desc'

    const supabase = createClient();

    useEffect(() => {
        fetchListings();
    }, [debouncedSearch, selectedCategory, condition, sortBy, priceRange[1]]); // Trigger on filters

    const fetchListings = async () => {
        setIsLoading(true);

        let query = supabase
            .from("listings")
            .select("*, profiles(username, is_verified_seller)")
            .eq("status", "ACTIVE");

        // 1. Text Search
        if (debouncedSearch) {
            query = query.ilike("title", `%${debouncedSearch}%`);
        }

        // 2. Category
        if (selectedCategory) {
            query = query.eq("category", selectedCategory);
        }

        // 3. Condition
        if (condition) {
            query = query.eq("condition", condition);
        }

        // 4. Price (Max only for now for simplicity in UI, logic supports both)
        if (priceRange[1] < 100000) {
            query = query.lte("price", priceRange[1]);
        }

        // 5. Sorting
        if (sortBy === "price_asc") {
            query = query.order("price", { ascending: true });
        } else if (sortBy === "price_desc") {
            query = query.order("price", { ascending: false });
        } else {
            query = query.order("created_at", { ascending: false }); // Default
        }

        const { data, error } = await query;

        if (error) {
            console.error("Error fetching listings:", error);
        } else {
            setListings(data as any); // Casting for relations
        }

        setIsLoading(false);
    };

    return (
        <div className="min-h-screen bg-black text-white font-sans">
            {/* Top Bar for Mobile/General Search */}
            <div className="sticky top-16 z-40 bg-black/80 backdrop-blur-md border-b border-zinc-900 p-4">
                <div className="container mx-auto flex gap-4 max-w-7xl">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-3 h-4 w-4 text-zinc-500" />
                        <Input
                            placeholder="Buscar RTX 4090, Ryzen 7..."
                            className="pl-10 bg-zinc-900 border-zinc-800 focus:ring-emerald-500"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <Select value={sortBy} onValueChange={setSortBy}>
                        <SelectTrigger className="w-[180px] bg-zinc-900 border-zinc-800">
                            <SelectValue placeholder="Ordenar por" />
                        </SelectTrigger>
                        <SelectContent className="bg-zinc-900 border-zinc-800 text-white">
                            <SelectItem value="newest">Más Nuevos</SelectItem>
                            <SelectItem value="price_asc">Menor Precio</SelectItem>
                            <SelectItem value="price_desc">Mayor Precio</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <div className="container mx-auto max-w-7xl p-4 md:p-8 flex flex-col md:flex-row gap-8">

                {/* Sidebar Filters */}
                <aside className="w-full md:w-64 space-y-8 shrink-0">
                    <div>
                        <h3 className="text-sm font-bold text-zinc-500 uppercase tracking-wider mb-4 flex items-center gap-2">
                            <SlidersHorizontal size={16} /> Filtros
                        </h3>

                        {/* Categories */}
                        <div className="space-y-2">
                            <label className="text-xs font-semibold text-white">Categoría</label>
                            <div className="flex flex-wrap gap-2">
                                {CATEGORIES.map(cat => (
                                    <button
                                        key={cat}
                                        onClick={() => setSelectedCategory(selectedCategory === cat ? null : cat)}
                                        className={`px-3 py-1 rounded-full text-xs font-bold border transition-all ${selectedCategory === cat
                                            ? "bg-emerald-600 border-emerald-500 text-white shadow-[0_0_10px_rgba(16,185,129,0.5)]"
                                            : "bg-zinc-900 border-zinc-800 text-zinc-400 hover:border-zinc-700"
                                            }`}
                                    >
                                        {cat}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Condition */}
                        <div className="mt-6 space-y-2">
                            <label className="text-xs font-semibold text-white">Condición</label>
                            <div className="grid grid-cols-2 gap-2">
                                <button
                                    onClick={() => setCondition(condition === 'NEW' ? null : 'NEW')}
                                    className={`p-2 rounded-lg border text-sm font-bold flex items-center justify-center gap-2 ${condition === 'NEW'
                                        ? "bg-zinc-800 border-emerald-500 text-emerald-400"
                                        : "bg-zinc-900 border-zinc-800 text-zinc-500 hover:bg-zinc-800"
                                        }`}
                                >
                                    ✨ NUEVO
                                </button>
                                <button
                                    onClick={() => setCondition(condition === 'USED' ? null : 'USED')}
                                    className={`p-2 rounded-lg border text-sm font-bold flex items-center justify-center gap-2 ${condition === 'USED'
                                        ? "bg-zinc-800 border-amber-500 text-amber-400"
                                        : "bg-zinc-900 border-zinc-800 text-zinc-500 hover:bg-zinc-800"
                                        }`}
                                >
                                    📦 USADO
                                </button>
                            </div>
                        </div>

                        {/* Price Range */}
                        <div className="mt-6 space-y-4">
                            <div className="flex justify-between text-xs">
                                <label className="font-semibold text-white">Precio Máximo</label>
                                <span className="text-emerald-400 font-mono">${priceRange[1].toLocaleString()}</span>
                            </div>
                            <input
                                type="range"
                                min={0}
                                max={100000}
                                step={1000}
                                value={priceRange[1]}
                                onChange={(e) => setPriceRange([0, parseInt(e.target.value)])}
                                className="w-full h-2 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                            />
                            <div className="flex justify-between text-[10px] text-zinc-600 font-mono">
                                <span>$0</span>
                                <span>$100k+</span>
                            </div>
                        </div>

                        {/* Reset */}
                        {(selectedCategory || condition || searchTerm || priceRange[1] < 100000) && (
                            <Button
                                variant="ghost"
                                className="w-full mt-6 text-red-400 hover:text-red-300 hover:bg-red-950/20"
                                onClick={() => {
                                    setSelectedCategory(null);
                                    setCondition(null);
                                    setSearchTerm("");
                                    setPriceRange([0, 100000]);
                                }}
                            >
                                <X size={14} className="mr-2" /> Limpiar Filtros
                            </Button>
                        )}
                    </div>
                </aside>

                {/* Main Grid */}
                <main className="flex-1">
                    {isLoading ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {[1, 2, 3, 4, 5, 6].map((i) => (
                                <div key={i} className="aspect-[3/4] bg-zinc-900 rounded-xl animate-pulse" />
                            ))}
                        </div>
                    ) : listings.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in duration-500 slide-in-from-bottom-4">
                            {listings.map((listing) => (
                                <ListingCard key={listing.id} listing={listing} />
                            ))}
                        </div>
                    ) : (
                        <EmptyState />
                    )}
                </main>
            </div>
        </div>
    );
}
