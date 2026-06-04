import { RequestStatus } from './enums';

export interface CoinRequestResponse {
  id: number;
  userId: number;
  amount: number;
  screenshotUrl: string | null;
  status: RequestStatus;
  approvedBy: number | null;
  approvedAt: string | null;
  rejectionReason: string | null;
  createdAt: string;
}

export interface CoinRequestAction {
  action: 'APPROVE' | 'REJECT';
  reason?: string;
}
