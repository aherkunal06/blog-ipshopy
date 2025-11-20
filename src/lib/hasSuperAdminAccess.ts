import type { AppSession } from '@/types/auth';

export function hasSuperAdminAccess(session: AppSession | null): boolean {
  return !!session?.user?.role && session.user.role === 'super-admin';
}

