import type { AppSession } from '@/types/auth';

export function hasAdminAccess(session: AppSession | null): boolean {
  return (
    !!session &&
    !!session.user?.role &&
    ['admin', 'super-admin'].includes(session.user.role)
  );
}

