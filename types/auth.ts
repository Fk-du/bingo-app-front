import { Role } from './enums';

export interface LoginRequest {
  initData: string;
}

export interface UserProfileResponse {
  id: number;
  telegramId: number;
  username: string | null;
  firstName: string | null;
  lastName: string | null;
  role: Role;
  agentId: number | null;
  parentId: number | null;
  balance: number;
  frozenBalance: number;
  active: boolean;
}
