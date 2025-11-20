import { NextResponse } from 'next/server';
import { queryOne, insert, execute } from '@/lib/db';
import crypto from 'crypto';

export const dynamic = 'force-dynamic';

// Function to send email (placeholder - implement your actual email service here)
async function sendPasswordResetEmail(email: string, token: string) {
  const resetUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/admin/reset-password?token=${token}`;

  // --- Placeholder for actual email sending logic ---
  // Example using a simple console log for demonstration.
  // In a real application, you would configure and use a transporter
  // const transporter = nodemailer.createTransport({
  //   service: 'gmail', // or 'smtp', or other service
  //   auth: {
  //     user: process.env.EMAIL_USER,
  //     pass: process.env.EMAIL_PASS,
  //   },
  // });

  // await transporter.sendMail({
  //   from: process.env.EMAIL_FROM,
  //   to: email,
  //   subject: 'Password Reset Request',
  //   html: `<p>You requested a password reset. Click this link to reset your password:</p>
  //          <p><a href="${resetUrl}">${resetUrl}</a></p>
  //          <p>This link is valid for 1 hour.</p>`,
  // });
  // --- End of placeholder ---

  console.log(`Password reset link for ${email}: ${resetUrl}`);
  // In a production app, you would typically use a service like SendGrid, Mailgun, or configure Nodemailer.
  // Ensure you have environment variables for EMAIL_USER, EMAIL_PASS, EMAIL_FROM, etc.
}

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ success: false, message: 'Email is required' }, { status: 400 });
    }

    const admin = await queryOne<{ id: number; email: string }>(
      'SELECT id, email FROM AdminUser WHERE email = ?',
      [email]
    );

    if (!admin) {
      // Don't reveal if the email doesn't exist for security reasons
      return NextResponse.json({ success: true, message: 'If an account with that email exists, a password reset link has been sent.' });
    }

    // Generate a unique, cryptographically secure token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 3600 * 1000); // Token valid for 1 hour

    // Check if token already exists for this user
    const existingToken = await queryOne<{ id: number }>(
      'SELECT id FROM PasswordResetToken WHERE userId = ?',
      [admin.id]
    );

    if (existingToken) {
      // Update existing token
      await execute(
        'UPDATE PasswordResetToken SET token = ?, expiresAt = ? WHERE userId = ?',
        [resetToken, expiresAt, admin.id]
      );
    } else {
      // Create new token
      await insert(
        'INSERT INTO PasswordResetToken (userId, token, expiresAt) VALUES (?, ?, ?)',
        [admin.id, resetToken, expiresAt]
      );
    }

    // Send the email with the reset link
    await sendPasswordResetEmail(admin.email, resetToken);

    return NextResponse.json({ success: true, message: 'If an account with that email exists, a password reset link has been sent.' });
  } catch (error: any) {
    console.error('Error requesting password reset:', error);
    return NextResponse.json({ success: false, message: 'Failed to process password reset request.' }, { status: 500 });
  }
}

