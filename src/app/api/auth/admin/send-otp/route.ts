import { NextRequest, NextResponse } from 'next/server';
import { queryOne, insert } from '@/lib/db';
import crypto from 'crypto';

export const dynamic = 'force-dynamic';

interface InteraktPayload {
  countryCode: string;
  phoneNumber: string;
  callbackData: string;
  type: string;
  template: {
    name: string;
    languageCode: string;
    bodyValues: string[];
    buttonValues: {
      [key: string]: string[];
    };
  };
}

export async function POST(req: NextRequest) {
  try {
    const { mobile } = await req.json();

    if (!mobile) {
      return NextResponse.json(
        { success: false, message: 'Mobile number is required' },
        { status: 400 }
      );
    }

    // Remove country code if present and clean the number
    const cleanMobile = mobile.replace(/^\+91/, '').replace(/\D/g, '');
    
    if (cleanMobile.length !== 10) {
      return NextResponse.json(
        { success: false, message: 'Invalid mobile number. Please enter a 10-digit number' },
        { status: 400 }
      );
    }

    // Check if admin exists with this mobile number
    const admin = await queryOne<{ id: number; mobile: string; status: string }>(
      'SELECT id, mobile, status FROM AdminUser WHERE mobile = ? OR mobile = ?',
      [`+91${cleanMobile}`, cleanMobile]
    );

    if (!admin) {
      return NextResponse.json(
        { success: false, message: 'No admin found with this mobile number' },
        { status: 404 }
      );
    }

    if (admin.status !== 'approved') {
      return NextResponse.json(
        { success: false, message: 'Your account is not approved yet' },
        { status: 403 }
      );
    }

    // Generate 6-digit OTP
    const otp = crypto.randomInt(100000, 999999).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Store OTP in database
    await insert(
      'INSERT INTO AdminOTP (mobile, otp, expiresAt) VALUES (?, ?, ?)',
      [`+91${cleanMobile}`, otp, expiresAt]
    );

    // Send OTP via Interakt
    const interaktPayload: InteraktPayload = {
      countryCode: process.env.INTERAKT_COUNTRY_CODE || '+91',
      phoneNumber: cleanMobile,
      callbackData: process.env.INTERAKT_CALLBACK_DATA || 'Ipshopy OTP Request',
      type: 'Template',
      template: {
        name: process.env.INTERAKT_TEMPLATE_NAME || 'o_t_p_d6',
        languageCode: process.env.INTERAKT_LANGUAGE_CODE || 'en',
        bodyValues: [otp],
        buttonValues: {
          '0': [otp],
        },
      },
    };

    const apiUrl = process.env.INTERAKT_API_URL || 'https://api.interakt.ai/v1/public/message/';
    const apiToken = process.env.INTERAKT_API_TOKEN || '';
    
    const interaktResponse = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Basic ${apiToken}`,
      },
      body: JSON.stringify(interaktPayload),
    });

    if (!interaktResponse.ok) {
      const errorText = await interaktResponse.text();
      console.error('Interakt API error:', errorText);
      return NextResponse.json(
        { success: false, message: 'Failed to send OTP. Please try again.' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'OTP sent successfully to your mobile number',
    });
  } catch (error: any) {
    console.error('Error sending OTP:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to send OTP. Please try again.' },
      { status: 500 }
    );
  }
}

