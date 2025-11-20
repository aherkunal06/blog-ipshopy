import NextAuth, { type NextAuthOptions } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { queryOne } from '@/lib/db';
import bcrypt from 'bcryptjs';
import type { JWT } from 'next-auth/jwt';
import type { Session } from 'next-auth';

export const authOptions: NextAuthOptions = {
  providers: [
    Credentials({
      name: 'Credentials',
      credentials: {
        type: { label: 'Login Type', type: 'text' }, // 'user' or 'admin'
        email: { label: 'Email', type: 'text' },
        username: { label: 'Username', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        try {
          if (!credentials?.type || !credentials.password) return null;

          if (credentials.type === 'user' && credentials.email) {
            const user = await queryOne<{
              id: number;
              email: string;
              name: string;
              password: string;
            }>(
              'SELECT id, email, name, password FROM User WHERE email = ?',
              [credentials.email]
            );
            if (user && await bcrypt.compare(credentials.password, user.password)) {
              return { id: user.id.toString(), name: user.name, email: user.email, role: 'user' };
            }
          }

          if (credentials.type === 'admin' && credentials.username) {
            const admin = await queryOne<{
              id: number;
              username: string;
              password: string;
              status: string;
              isSuper: boolean;
              role: string;
            }>(
              'SELECT id, username, password, status, isSuper, role FROM AdminUser WHERE username = ?',
              [credentials.username]
            );
            if (
              admin &&
              await bcrypt.compare(credentials.password, admin.password) &&
              admin.status === 'approved'
            ) {
              const role = admin.role || (admin.isSuper ? 'super-admin' : 'admin');
              return { id: admin.id.toString(), name: admin.username, role: role };
            }
          }

          return null;
        } catch (err) {
          console.error('Authorize error:', err);
          return null; // Always return null on failure, never throw
        }
      },
    }),
  ],

  session: { strategy: 'jwt' },
  secret: process.env.NEXTAUTH_SECRET,

  callbacks: {
    async jwt({ token, user }: { token: JWT; user?: any }) {
      if (user) token.role = user.role;
      return token;
    },
    async session({ session, token }: { session: Session; token: JWT }) {
      if (session.user) session.user.role = token.role;
      return session;
    },
  },

  pages: {
    signIn: '/auth/signin', // optional custom sign-in page
    error: '/auth/error', // optional error page
  },

  debug: true, // enables logging for development
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };

