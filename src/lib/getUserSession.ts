import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/user/[...nextauth]/route';

import type { AppSession } from '@/types/auth';
export async function getUserSession() {
  const session = await getServerSession(authOptions) as AppSession;
  return session;
}

