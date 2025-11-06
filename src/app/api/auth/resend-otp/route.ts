import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { sendOTPEmail } from '@/lib/email';
import { otpStore } from '@/lib/otp-store';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, name } = body;

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required', code: 'MISSING_EMAIL' },
        { status: 400 }
      );
    }

    // Generate new 6-digit OTP
    const otp = crypto.randomInt(100000, 999999).toString();
    const expiresAt = Date.now() + 10 * 60 * 1000; // 10 minutes

    // Get existing data if any
    const existingData = otpStore.get(email.toLowerCase());

    // Store new OTP
    otpStore.set(email.toLowerCase(), {
      otp,
      expiresAt,
      userId: existingData?.userId,
    });

    // Send OTP via email
    const emailSent = await sendOTPEmail(email, otp, name);
    
    if (!emailSent) {
      console.warn('⚠️ Email sending failed, but continuing for development');
    }

    return NextResponse.json(
      {
        message: 'New OTP sent to your email',
        email: email.toLowerCase(),
        // In development, return OTP for testing
        ...(process.env.NODE_ENV === 'development' && { otp })
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('POST /api/auth/resend-otp error:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + error },
      { status: 500 }
    );
  }
}