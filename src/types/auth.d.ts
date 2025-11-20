import type { Session, JWT } from 'next-auth';

export type AppUserRole = 'user' | 'admin' | 'super-admin';

export interface JWTWithRole extends JWT {
  role?: AppUserRole;
}

export interface SessionUser {
  name?: string | null;
  email?: string | null;
  role?: AppUserRole;
  id?: string;
}

export interface AppSession extends Session {
  user: SessionUser;
}

