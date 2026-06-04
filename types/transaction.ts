import { TransactionType, TransactionStatus } from './enums';

export interface TransactionResponse {
  id: number;
  userId: number;
  type: TransactionType;
  amount: number;
  status: TransactionStatus;
  referenceId: number | null;
  description: string | null;
  createdAt: string;
}
