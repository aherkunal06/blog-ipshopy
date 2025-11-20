import { NextResponse } from 'next/server';
import { queryOne, execute } from '@/lib/db';
import bcrypt from 'bcryptjs';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const { token, newPassword } = await req.json();

    if (!token || !newPassword) {
      return NextResponse.json({ success: false, message: 'Token and new password are required' }, { status: 400 });
    }

    // Find and validate the token
    const resetTokenRecord = await queryOne<{
      id: number;
      userId: number;
      expiresAt: Date;
    }>(
      'SELECT id, userId, expiresAt FROM PasswordResetToken WHERE token = ?',
      [token]
    );

    if (!resetTokenRecord || new Date(resetTokenRecord.expiresAt) < new Date()) {
      return NextResponse.json({ success: false, message: 'Invalid or expired token' }, { status: 400 });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update the admin user's password
    await execute(
      'UPDATE AdminUser SET password = ? WHERE id = ?',
      [hashedPassword, resetTokenRecord.userId]
    );

    // Invalidate/delete the used token
    await execute(
      'DELETE FROM PasswordResetToken WHERE id = ?',
      [resetTokenRecord.id]
    );

    return NextResponse.json({ success: true, message: 'Password has been reset successfully.' });
  } catch (error: any) {
    console.error('Error resetting password:', error);
    return NextResponse.json({ success: false, message: 'Failed to reset password.' }, { status: 500 });
  }
}

