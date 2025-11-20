import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/admin/[...nextauth]/route';
import type { AppSession } from '@/types/auth';

export async function getAdminSession() {
  const session = await getServerSession(authOptions) as AppSession;
  return session;
}

