import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { users } from '@/db/schema';
import { eq } from 'drizzle-orm';
import crypto from 'crypto';
import { sendOTPEmail } from '@/lib/email';
import { otpStore } from '@/lib/otp-store';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, name } = body;

    if (!email || !name) {
      return NextResponse.json(
        { error: 'Email and name are required', code: 'MISSING_FIELDS' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format', code: 'INVALID_EMAIL' },
        { status: 400 }
      );
    }

    const normalizedEmail = email.toLowerCase();

    // Check if user already exists
    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.email, normalizedEmail))
      .limit(1);

    if (existingUser.length > 0) {
      return NextResponse.json(
        { error: 'Email already registered', code: 'EMAIL_EXISTS' },
        { status: 400 }
      );
    }

    // Generate 6-digit OTP
    const otp = crypto.randomInt(100000, 999999).toString();
    const expiresAt = Date.now() + 10 * 60 * 1000; // 10 minutes

    // Store OTP temporarily
    otpStore.set(normalizedEmail, { otp, expiresAt });

    // Debug logging
    console.log('📝 Register OTP Debug:');
    console.log('  Received email:', email);
    console.log('  Normalized email:', normalizedEmail);
    console.log('  Generated OTP:', otp);
    console.log('  OTP expires at:', new Date(expiresAt).toISOString());
    console.log('  OTP Store size after set:', otpStore.size);
    console.log('  OTP Store keys:', Array.from(otpStore.keys()));

    // Send OTP via email
    const emailSent = await sendOTPEmail(email, otp, name);
    
    if (!emailSent) {
      console.warn('⚠️ Email sending failed, but continuing for development');
    }

    return NextResponse.json(
      {
        message: 'OTP sent to your email',
        email: normalizedEmail,
        // In development, return OTP for testing
        ...(process.env.NODE_ENV === 'development' && { otp })
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('POST /api/auth/register error:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + error },
      { status: 500 }
    );
  }
}