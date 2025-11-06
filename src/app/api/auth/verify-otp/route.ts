import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { users } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { otpStore } from '@/lib/otp-store';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, otp, name } = body;

    if (!email || !otp) {
      return NextResponse.json(
        { error: 'Email and OTP are required', code: 'MISSING_FIELDS' },
        { status: 400 }
      );
    }

    const normalizedEmail = email.toLowerCase();
    
    // Debug logging
    console.log('🔍 Verify OTP Debug:');
    console.log('  Received email:', email);
    console.log('  Normalized email:', normalizedEmail);
    console.log('  Received OTP:', otp);
    console.log('  OTP Store size:', otpStore.size);
    console.log('  OTP Store keys:', Array.from(otpStore.keys()));

    // Get stored OTP
    const storedData = otpStore.get(normalizedEmail);
    
    console.log('  Stored data:', storedData);

    if (!storedData) {
      return NextResponse.json(
        { error: 'OTP not found or expired', code: 'OTP_NOT_FOUND' },
        { status: 400 }
      );
    }

    // Check if OTP expired
    if (Date.now() > storedData.expiresAt) {
      otpStore.delete(normalizedEmail);
      return NextResponse.json(
        { error: 'OTP expired', code: 'OTP_EXPIRED' },
        { status: 400 }
      );
    }

    // Verify OTP
    console.log('  Comparing OTPs:', { received: otp, stored: storedData.otp });
    
    if (storedData.otp !== otp) {
      return NextResponse.json(
        { error: 'Invalid OTP', code: 'INVALID_OTP' },
        { status: 400 }
      );
    }

    // Check if this is for registration (has name) or login
    if (name) {
      // Create new user
      const currentTimestamp = new Date().toISOString();
      const newUser = await db
        .insert(users)
        .values({
          email: normalizedEmail,
          name: name.trim(),
          createdAt: currentTimestamp,
          updatedAt: currentTimestamp,
        })
        .returning();

      // Clean up OTP
      otpStore.delete(normalizedEmail);

      return NextResponse.json(
        {
          message: 'Registration successful',
          user: {
            id: newUser[0].id,
            email: newUser[0].email,
            name: newUser[0].name,
          },
        },
        { status: 201 }
      );
    } else {
      // Login - user should already exist
      const existingUser = await db
        .select()
        .from(users)
        .where(eq(users.email, normalizedEmail))
        .limit(1);

      if (existingUser.length === 0) {
        return NextResponse.json(
          { error: 'User not found', code: 'USER_NOT_FOUND' },
          { status: 404 }
        );
      }

      // Clean up OTP
      otpStore.delete(normalizedEmail);

      return NextResponse.json(
        {
          message: 'Login successful',
          user: {
            id: existingUser[0].id,
            email: existingUser[0].email,
            name: existingUser[0].name,
          },
        },
        { status: 200 }
      );
    }
  } catch (error) {
    console.error('POST /api/auth/verify-otp error:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + error },
      { status: 500 }
    );
  }
}