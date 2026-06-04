import { RequestStatus } from './enums';

export interface WithdrawalResponse {
  id: number;
  userId: number;
  amount: number;
  payoutMethod: string | null;
  payoutDetails: string | null;
  status: RequestStatus;
  processedBy: number | null;
  processedAt: string | null;
  rejectionReason: string | null;
  createdAt: string;
}

export interface WithdrawalPayRequest {
  transactionId?: string;
}
