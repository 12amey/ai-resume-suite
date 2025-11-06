// Shared OTP store for all auth routes
// Use global object to persist across Next.js hot reloads in development

type OTPData = {
  otp: string;
  expiresAt: number;
  userId?: number;
};

declare global {
  var otpStoreInstance: Map<string, OTPData> | undefined;
}

export const otpStore = global.otpStoreInstance ?? new Map<string, OTPData>();

if (process.env.NODE_ENV !== 'production') {
  global.otpStoreInstance = otpStore;
}