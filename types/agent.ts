import { FundStatus, Role } from './enums';

export interface AgentResponse {
  adminUserId: number;
  approved: boolean;
  businessName: string | null;
  telegramId: number;
  username: string | null;
  firstName: string | null;
  lastName: string | null;
  balance: number;
  frozenBalance: number;
  active: boolean;
}

export interface AgentFundRequestResponse {
  id: number;
  agentId: number;
  amount: number;
  screenshotUrl: string | null;
  status: FundStatus;
  approvedBy: number | null;
  approvedAt: string | null;
  rejectionReason: string | null;
  createdAt: string;
}

export interface InviteCodeResponse {
  id: number;
  code: string;
  creatorId: number;
  role: Role;
  active: boolean;
  createdAt: string;
}

export interface InviteCodeStatsResponse {
  totalCodes: number;
  activeCodes: number;
  usedCodes: number;
  totalRegistrations: number;
}

export interface TenantRegistryResponse {
  id: number;
  agentId: number;
  databaseName: string;
  createdAt: string;
}

export interface AgentStatusRequest {
  status: string;
}

export interface AgentFundRequestCreate {
  amount: number;
  screenshotUrl?: string;
}
