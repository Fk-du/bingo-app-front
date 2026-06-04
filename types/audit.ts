export interface AuditLogResponse {
  id: number;
  userId: number;
  action: string;
  details: string | null;
  ipAddress: string | null;
  createdAt: string;
}
