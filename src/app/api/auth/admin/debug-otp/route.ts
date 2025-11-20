import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

export const dynamic = 'force-dynamic';

// Debug route to check OTP records (remove in production)
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const mobile = searchParams.get('mobile');

    if (!mobile) {
      return NextResponse.json(
        { error: 'Mobile number is required' },
        { status: 400 }
      );
    }

    const cleanMobile = mobile.replace(/^\+91/, '').replace(/\D/g, '');
    const mobileWithCode = `+91${cleanMobile}`;

    // Get all OTP records for this mobile
    const otps = await query<{
      id: number;
      mobile: string;
      otp: string;
      expiresAt: Date;
      verified: boolean;
      createdAt: Date;
    }>(
      'SELECT id, mobile, otp, expiresAt, verified, createdAt FROM AdminOTP WHERE mobile = ? OR mobile = ? ORDER BY createdAt DESC LIMIT 5',
      [mobileWithCode, cleanMobile]
    );

    // Get admin user
    const admin = await query<{
      id: number;
      username: string;
      mobile: string;
      status: string;
    }>(
      'SELECT id, username, mobile, status FROM AdminUser WHERE mobile = ? OR mobile = ? OR mobile = ?',
      [mobileWithCode, cleanMobile, mobile]
    );

    return NextResponse.json({
      mobile: {
        original: mobile,
        clean: cleanMobile,
        withCode: mobileWithCode,
      },
      otps: otps.map(otp => ({
        ...otp,
        expiresAt: otp.expiresAt.toString(),
        createdAt: otp.createdAt.toString(),
        isExpired: new Date(otp.expiresAt) < new Date(),
      })),
      admin: admin.length > 0 ? admin[0] : null,
    });
  } catch (error: any) {
    console.error('Debug OTP error:', error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}

