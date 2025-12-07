export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[]

export interface Database {
    public: {
        Tables: {
            profiles: {
                Row: {
                    id: string
                    username: string | null
                    full_name: string | null
                    avatar_url: string | null
                    reputation_score: number
                    is_verified_seller: boolean
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id: string
                    username?: string | null
                    full_name?: string | null
                    avatar_url?: string | null
                    reputation_score?: number
                    is_verified_seller?: boolean
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    username?: string | null
                    full_name?: string | null
                    avatar_url?: string | null
                    reputation_score?: number
                    is_verified_seller?: boolean
                    created_at?: string
                    updated_at?: string
                }
            }
            listings: {
                Row: {
                    id: string
                    seller_id: string
                    title: string
                    description: string
                    price: number
                    condition: 'NEW' | 'USED' | 'REFURBISHED' | 'DAMAGED'
                    specs: Json
                    images: string[]
                    status: 'DRAFT' | 'ACTIVE' | 'SOLD' | 'SUSPENDED'
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    seller_id: string
                    title: string
                    description: string
                    price: number
                    condition: 'NEW' | 'USED' | 'REFURBISHED' | 'DAMAGED'
                    specs?: Json
                    images?: string[]
                    status?: 'DRAFT' | 'ACTIVE' | 'SOLD' | 'SUSPENDED'
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    seller_id?: string
                    title?: string
                    description?: string
                    price?: number
                    condition?: 'NEW' | 'USED' | 'REFURBISHED' | 'DAMAGED'
                    specs?: Json
                    images?: string[]
                    status?: 'DRAFT' | 'ACTIVE' | 'SOLD' | 'SUSPENDED'
                    created_at?: string
                    updated_at?: string
                }
            }
            orders: {
                Row: {
                    id: string
                    buyer_id: string
                    seller_id: string
                    listing_id: string
                    status: 'PENDING' | 'PAID' | 'SHIPPED' | 'COMPLETED' | 'CANCELLED' | 'DISPUTED'
                    shipping_address: Json | null
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    buyer_id: string
                    seller_id: string
                    listing_id: string
                    status?: 'PENDING' | 'PAID' | 'SHIPPED' | 'COMPLETED' | 'CANCELLED' | 'DISPUTED'
                    shipping_address?: Json | null
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    buyer_id?: string
                    seller_id?: string
                    listing_id?: string
                    status?: 'PENDING' | 'PAID' | 'SHIPPED' | 'COMPLETED' | 'CANCELLED' | 'DISPUTED'
                    shipping_address?: Json | null
                    created_at?: string
                    updated_at?: string
                }
            }
        }
    }
}
