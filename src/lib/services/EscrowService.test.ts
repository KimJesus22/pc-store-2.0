import { describe, it, expect, vi, beforeEach } from 'vitest';
import { EscrowService } from './EscrowService';

// Mock Supabase client
const mockUpdate = vi.fn();
const mockEq = vi.fn();
const mockFrom = vi.fn(() => ({
    update: mockUpdate,
}));

// Chain Mocking
mockUpdate.mockReturnValue({ eq: mockEq });
mockEq.mockResolvedValue({ error: null });

vi.mock("@/lib/supabase/client", () => ({
    createClient: () => ({
        from: mockFrom,
    }),
}));

describe('EscrowService', () => {
    let service: EscrowService;

    beforeEach(() => {
        service = new EscrowService();
        vi.clearAllMocks();
    });

    it('should_lock_funds: checks status change to PAID/LOCKED', async () => {
        const orderId = '123';
        const amount = 5000;

        // Setup mock success
        mockEq.mockResolvedValueOnce({ error: null });

        const result = await service.lockFunds(orderId, amount);

        expect(mockFrom).toHaveBeenCalledWith('orders');
        expect(mockUpdate).toHaveBeenCalledWith({ status: 'PAID' });
        expect(mockEq).toHaveBeenCalledWith('id', orderId);
        expect(result.status).toBe('LOCKED');
        expect(result.success).toBe(true);
    });

    it('should_prevent_release_without_delivery', async () => {
        const orderId = '123';
        const shippingStatus = 'SHIPPED'; // Not DELIVERED

        await expect(service.releaseFunds(orderId, shippingStatus))
            .rejects
            .toThrow("Cannot release funds: Item not delivered.");

        expect(mockUpdate).not.toHaveBeenCalled();
    });

    it('should_refund_on_dispute_win', async () => {
        const orderId = '123';
        const disputeResult = 'RESOLVED_BUYER';

        mockEq.mockResolvedValueOnce({ error: null });

        const result = await service.refundToBuyer(orderId, disputeResult);

        expect(mockUpdate).toHaveBeenCalledWith({ status: 'CANCELLED' });
        expect(result.status).toBe('REFUNDED');
    });

    it('should_fail_refund_if_buyer_lost', async () => {
        const orderId = '123';
        const disputeResult = 'RESOLVED_SELLER';

        await expect(service.refundToBuyer(orderId, disputeResult))
            .rejects
            .toThrow("Refund denied: Dispute not resolved in favor of buyer.");

        expect(mockUpdate).not.toHaveBeenCalled();
    });
});
