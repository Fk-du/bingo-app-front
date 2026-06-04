export * from './enums';
export * from './api';
export * from './auth';
export * from './agent';
export * from './game';
export * from './card';
export * from './player';
export * from './coin';
export * from './withdrawal';
export * from './transaction';
export * from './audit';

export interface BroadcastRequest {
  target: string;
  message: string;
}

export interface ConfigUpdateRequest {
  config: Record<string, unknown>;
}
