import { NextResponse } from 'next/server';
import { insert, queryOne } from '@/lib/db';
import bcrypt from 'bcryptjs';
import { getToken } from 'next-auth/jwt';
import { NextRequest } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    // Check if the request is from a super-admin
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    const role = (token as { role?: string })?.role;

    if (!token || role !== 'super-admin') {
      return NextResponse.json({ error: "Unauthorized. Only super admins can add new admins." }, { status: 403 });
    }

    const { username, password, email, name, role: newAdminRole } = await req.json();

    if (!username || !password || !email || !name) {
      return NextResponse.json({ error: "Username, password, email, and name are required" }, { status: 400 });
    }

    // Check if username or email already exists
    const existingAdmin = await queryOne<{ id: number }>(
      'SELECT id FROM AdminUser WHERE username = ? OR email = ?',
      [username, email]
    );

    if (existingAdmin) {
      return NextResponse.json({ error: "Username or email already exists" }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const isSuper = newAdminRole === 'super-admin';
    const finalRole = newAdminRole || 'admin';

    // Create new admin with approved status
    const adminId = await insert(
      `INSERT INTO AdminUser (username, email, name, password, role, isSuper, status) 
       VALUES (?, ?, ?, ?, ?, ?, 'approved')`,
      [username, email, name, hashedPassword, finalRole, isSuper]
    );

    // Fetch the created admin without password
    const admin = await queryOne<{
      id: number;
      username: string;
      email: string;
      name: string;
      role: string;
      isSuper: boolean;
      status: string;
    }>(
      'SELECT id, username, email, name, role, isSuper, status FROM AdminUser WHERE id = ?',
      [adminId]
    );

    return NextResponse.json(admin, { status: 201 });
  } catch (error) {
    console.error('Error adding admin:', error);
    return NextResponse.json({ error: "Failed to add admin" }, { status: 500 });
  }
}

