import { NextRequest, NextResponse } from 'next/server';
import { queryOne, execute } from '@/lib/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '../[...nextauth]/route';

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

    // Clean mobile number and OTP
    const cleanMobile = mobile.replace(/^\+91/, '').replace(/\D/g, '');
    const mobileWithCode = `+91${cleanMobile}`;
    const mobileWithoutCode = cleanMobile;
    const cleanOtp = otp.trim().replace(/\D/g, '');

    console.log('OTP login attempt:', { 
      originalMobile: mobile, 
      cleanMobile, 
      mobileWithCode, 
      originalOtp: otp,
      cleanOtp
    });

    // Find valid OTP - check both formats
    const otpRecord = await queryOne<{
      id: number;
      mobile: string;
      otp: string;
      expiresAt: Date;
      verified: boolean;
    }>(
      'SELECT id, mobile, otp, expiresAt, verified FROM AdminOTP WHERE (mobile = ? OR mobile = ?) AND otp = ? AND verified = FALSE ORDER BY createdAt DESC LIMIT 1',
      [mobileWithCode, mobileWithoutCode, cleanOtp]
    );

    console.log('OTP record found:', otpRecord ? 'Yes' : 'No');

    if (!otpRecord) {
      console.error('OTP login: No valid OTP found for mobile:', mobileWithCode, 'OTP:', cleanOtp);
      return NextResponse.json(
        { success: false, message: 'Invalid OTP' },
        { status: 400 }
      );
    }

    // Check if OTP is expired
    const expiresAt = new Date(otpRecord.expiresAt);
    const now = new Date();
    if (expiresAt < now) {
      console.error('OTP login: OTP expired. Expires:', expiresAt, 'Now:', now);
      return NextResponse.json(
        { success: false, message: 'OTP has expired. Please request a new one.' },
        { status: 400 }
      );
    }

    // Mark OTP as verified
    await execute('UPDATE AdminOTP SET verified = TRUE WHERE id = ?', [otpRecord.id]);

    // Get admin user details - check both mobile formats
    const admin = await queryOne<{
      id: number;
      username: string;
      status: string;
      isSuper: boolean;
      role: string;
    }>(
      'SELECT id, username, status, isSuper, role FROM AdminUser WHERE mobile = ? OR mobile = ? OR mobile = ?',
      [mobileWithCode, mobileWithoutCode, cleanMobile]
    );

    console.log('Admin found:', admin ? 'Yes' : 'No', admin ? { id: admin.id, status: admin.status } : null);

    if (!admin || admin.status !== 'approved') {
      console.error('OTP login: Admin not found or not approved', { admin: admin ? admin.status : 'not found' });
      return NextResponse.json(
        { success: false, message: 'Admin account not found or not approved' },
        { status: 404 }
      );
    }

    console.log('OTP login successful for admin:', admin.username);

    // Return success - the frontend will use this to call signIn
    return NextResponse.json({
      success: true,
      admin: {
        id: admin.id.toString(),
        username: admin.username,
        role: admin.role || (admin.isSuper ? 'super-admin' : 'admin'),
      },
    });
  } catch (error: any) {
    console.error('OTP login error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to verify OTP. Please try again.' },
      { status: 500 }
    );
  }
}

