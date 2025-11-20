// src/types/next-auth.d.ts
import NextAuth, { DefaultSession } from 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: {
      role?: 'user' | 'admin' | 'super-admin';
    } & DefaultSession['user'];
  }
  interface User {
    role?: 'user' | 'admin' | 'super-admin';
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    role?: 'user' | 'admin' | 'super-admin';
  }
}
