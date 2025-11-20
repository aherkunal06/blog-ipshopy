// src/app/api/auth/user/forgot-password/route.ts
import { NextRequest, NextResponse } from "next/server";
import { queryOne, execute } from "@/lib/db";
import bcrypt from "bcryptjs";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json({ message: "Email and password are required" }, { status: 400 });
    }

    const user = await queryOne<{ id: number }>('SELECT id FROM User WHERE email = ?', [email]);

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await execute(
      'UPDATE User SET password = ? WHERE email = ?',
      [hashedPassword, email]
    );

    return NextResponse.json({ message: "Password reset successfully" });
  } catch (err) {
    console.error("Forgot password error:", err);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}

