import { NextRequest, NextResponse } from 'next/server';
import { queryOne, execute } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const { mobile, otp } = await req.json();

    if (!mobile || !otp) {
      return NextResponse.json(
        { success: false, message: 'Mobile number and OTP are required' },
        { status: 400 }
      );
    }

    // Clean mobile number
    const cleanMobile = mobile.replace(/^\+91/, '').replace(/\D/g, '');
    const mobileWithCode = `+91${cleanMobile}`;

    // Find valid OTP
    const otpRecord = await queryOne<{
      id: number;
      mobile: string;
      otp: string;
      expiresAt: Date;
      verified: boolean;
    }>(
      'SELECT id, mobile, otp, expiresAt, verified FROM AdminOTP WHERE mobile = ? AND otp = ? AND verified = FALSE ORDER BY createdAt DESC LIMIT 1',
      [mobileWithCode, otp]
    );

    if (!otpRecord) {
      return NextResponse.json(
        { success: false, message: 'Invalid OTP' },
        { status: 400 }
      );
    }

    // Check if OTP is expired
    if (new Date(otpRecord.expiresAt) < new Date()) {
      return NextResponse.json(
        { success: false, message: 'OTP has expired. Please request a new one.' },
        { status: 400 }
      );
    }

    // Mark OTP as verified
    await execute('UPDATE AdminOTP SET verified = TRUE WHERE id = ?', [otpRecord.id]);

    // Get admin user details
    const admin = await queryOne<{
      id: number;
      username: string;
      status: string;
      isSuper: boolean;
      role: string;
    }>(
      'SELECT id, username, status, isSuper, role FROM AdminUser WHERE mobile = ? OR mobile = ?',
      [mobileWithCode, cleanMobile]
    );

    if (!admin || admin.status !== 'approved') {
      return NextResponse.json(
        { success: false, message: 'Admin account not found or not approved' },
        { status: 404 }
      );
    }

    // Return admin details for NextAuth
    return NextResponse.json({
      success: true,
      admin: {
        id: admin.id.toString(),
        username: admin.username,
        role: admin.role || (admin.isSuper ? 'super-admin' : 'admin'),
      },
    });
  } catch (error: any) {
    console.error('Error verifying OTP:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to verify OTP. Please try again.' },
      { status: 500 }
    );
  }
}

