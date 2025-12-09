import { createClient } from "@/lib/supabase/client";

export type EscrowStatus = 'PENDING' | 'LOCKED' | 'RELEASED' | 'REFUNDED' | 'DISPUTED';

export class EscrowService {
    private supabase = createClient();

    async lockFunds(orderId: string, amount: number): Promise<{ success: boolean; status: EscrowStatus }> {
        // Simulate API call / DB Transaction
        // In a real app, this would verify payment provider capture
        const { error } = await this.supabase
            .from('orders')
            .update({ status: 'PAID' }) // Mapping LOCKED logic to PAID for this MVP
            .eq('id', orderId);

        if (error) throw new Error(error.message);

        return { success: true, status: 'LOCKED' };
    }

    async releaseFunds(orderId: string, shippingStatus: string): Promise<{ success: boolean; status: EscrowStatus }> {
        if (shippingStatus !== 'DELIVERED') {
            throw new Error("Cannot release funds: Item not delivered.");
        }

        const { error } = await this.supabase
            .from('orders')
            .update({ status: 'COMPLETED' })
            .eq('id', orderId);

        if (error) throw new Error(error.message);

        return { success: true, status: 'RELEASED' };
    }

    async refundToBuyer(orderId: string, disputeResult: 'RESOLVED_BUYER' | 'RESOLVED_SELLER'): Promise<{ success: boolean; status: EscrowStatus }> {
        if (disputeResult !== 'RESOLVED_BUYER') {
            throw new Error("Refund denied: Dispute not resolved in favor of buyer.");
        }

        const { error } = await this.supabase
            .from('orders')
            .update({ status: 'CANCELLED' }) // Mapping REFUND logic
            .eq('id', orderId);

        if (error) throw new Error(error.message);

        return { success: true, status: 'REFUNDED' };
    }
}
