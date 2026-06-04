export interface PlayerResponse {
  id: number;
  userId: number;
  agentId: number;
  parentId: number | null;
  createdAt: string;
}

export interface FundPlayerRequest {
  amount: number;
}

export interface PlayerStatusRequest {
  status: string;
}
