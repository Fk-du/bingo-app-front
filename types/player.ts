export interface PlayerResponse {
  id: number;
  userId: number;
  adminUserId?: number;
  parentId: number | null;
  balance: number;
  frozenBalance: number;
  createdAt: string;
}

export interface FundPlayerRequest {
  amount: number;
}

export interface WalletResponse {
  balance: number;
  frozenBalance: number;
}

export interface PlayerStatusRequest {
  status: string;
}
