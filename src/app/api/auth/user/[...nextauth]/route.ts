// app/api/auth/user/[...nextauth]/route.ts
import NextAuth, { type NextAuthOptions, type DefaultSession } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { queryOne } from '@/lib/db';
import bcrypt from 'bcryptjs';

/**
 * Extend NextAuth types to include `id` and `role` in session.user
 */
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: string;
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    role?: string;
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    Credentials({
      name: 'User Login',
      credentials: {
        email: { label: 'Email', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials): Promise<any> {
        if (!credentials?.email || !credentials.password) throw new Error("Email and password required");

        const user = await queryOne<{
          id: number;
          email: string;
          name: string;
          password: string;
        }>(
          'SELECT id, email, name, password FROM User WHERE email = ?',
          [credentials.email]
        );

        if (!user) throw new Error("User not found");

        const isValid = await bcrypt.compare(credentials.password, user.password);
        if (!isValid) throw new Error("Invalid password");

        return {
          id: user.id.toString(),
          name: user.name,
          email: user.email,
          role: 'user',
        };
      },
    }),
  ],

  session: {
    strategy: 'jwt',
  },

  secret: process.env.NEXTAUTH_SECRET,

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id!;
        session.user.role = token.role!;
      }
      return session;
    },
  },

  pages: {
    signIn: '/auth/user/login', // optional custom login page
    error: '/auth/user/login',  // optional error redirect
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };

