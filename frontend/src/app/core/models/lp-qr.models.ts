import { UserType } from './lp-core.models';

export interface QrCodeResponse {
  sessionId: string;
  qrData: string; // "NEHZAT-QR:{sessionId}"
  expiresAt: Date;
}

export interface QrPollResponse {
  status: 'pending' | 'confirmed' | 'expired';
  token?: string;
  username?: string;
  userType?: UserType;
  studentId?: number;
  branchId?: number;
}

export interface QrScanConfirm {
  status: 'confirmed' | 'expired' | 'pending';
  message: string;
}



