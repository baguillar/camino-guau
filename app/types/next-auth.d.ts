
import NextAuth from 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      email: string;
      name?: string | null;
      role?: string;
      profileImage?: string | null;
    }
  }

  interface User {
    role?: string;
    profileImage?: string | null;
  }

  interface JWT {
    role?: string;
    profileImage?: string | null;
  }
}
