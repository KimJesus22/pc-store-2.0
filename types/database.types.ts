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
            audit_logs: {
                Row: {
                    id: string
                    admin_id: string
                    action: string
                    target_id: string | null
                    details: Json
                    created_at: string
                }
                Insert: {
                    id?: string
                    admin_id: string
                    action: string
                    target_id?: string | null
                    details?: Json
                    created_at?: string
                }
                Update: {
                    id?: string
                    admin_id?: string
                    action?: string
                    target_id?: string | null
                    details?: Json
                    created_at?: string
                }
            }
            profiles: {
                Row: {
                    id: string
                    username: string | null
                    full_name: string | null
                    avatar_url: string | null
                    reputation_score: number
                    is_verified_seller: boolean
                    role: 'USER' | 'ADMIN' | 'MODERATOR'
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
                    role?: 'USER' | 'ADMIN' | 'MODERATOR'
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
                    role?: 'USER' | 'ADMIN' | 'MODERATOR'
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
                    category: 'GPU' | 'CPU' | 'RAM' | 'MOBO' | 'OTHER'
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
                    category?: 'GPU' | 'CPU' | 'RAM' | 'MOBO' | 'OTHER'
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
                    category?: 'GPU' | 'CPU' | 'RAM' | 'MOBO' | 'OTHER'
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
            disputes: {
                Row: {
                    id: string
                    order_id: string
                    complainant_id: string
                    reason: string
                    description: string | null
                    evidence_urls: string[] | null
                    status: 'OPEN' | 'UNDER_REVIEW' | 'RESOLVED_BUYER' | 'RESOLVED_SELLER' | 'REJECTED'
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    order_id: string
                    complainant_id: string
                    reason: string
                    description?: string | null
                    evidence_urls?: string[] | null
                    status?: 'OPEN' | 'UNDER_REVIEW' | 'RESOLVED_BUYER' | 'RESOLVED_SELLER' | 'REJECTED'
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    order_id?: string
                    complainant_id?: string
                    reason?: string
                    description?: string | null
                    evidence_urls?: string[] | null
                    status?: 'OPEN' | 'UNDER_REVIEW' | 'RESOLVED_BUYER' | 'RESOLVED_SELLER' | 'REJECTED'
                    created_at?: string
                    updated_at?: string
                }
            }
        }
    }
}
