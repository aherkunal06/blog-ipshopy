// src/lib/auth.ts
import type { NextAuthOptions } from "next-auth";
import { getServerSession } from "next-auth";

export const authOptions: NextAuthOptions = {
  providers: [
    // Add providers as needed
  ],
  callbacks: {
    async jwt({ token, user }) {
      // be tolerant to missing values; avoid throwing
      if (user) {
        // persist id; fallback to sub which Auth.js sets to user id for many adapters
        (token as any).id = (user as any).id ?? token.sub ?? null;
      }
      return token;
    },
    async session({ session, token }) {
      const id = (token as any)?.id ?? token?.sub ?? null;
      if (id) (session.user as any).id = id;
      return session;
    },
  },
  // session: { strategy: "jwt" }, // if using JWT sessions
  // secret: process.env.NEXTAUTH_SECRET,
};

export function auth() {
  return getServerSession(authOptions);
}

