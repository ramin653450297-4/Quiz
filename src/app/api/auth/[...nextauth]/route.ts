// src/app/api/auth/[next]/route.ts
import NextAuth, { AuthOptions, Session ,  } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import User from '../../../../../models/User';
import connectMongo from '../../../../../lib/mongodb';
import bcrypt from 'bcrypt';
import { JWT } from 'next-auth/jwt';
import { NextRequest, NextResponse } from 'next/server';

interface Noted {
  id: string;
  email: string;
  // Add any other user properties you have
}
const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email', placeholder: 'user@example.com' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Missing email or password');
        }

        await connectMongo();

        const user = await User.findOne({ email: credentials.email });
        if (user && bcrypt.compareSync(credentials.password, user.password)) {
          return { id: user._id, email: user.email }; // Return the user object
        }

        throw new Error('Invalid credentials');
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    async session({ session, token }) {
      session.user = session.user || {}; 

      if (token?.sub) {
       
      }
      if (token?.email) {
        session.user.email = token.email; 
      }
      
      return session;
    },
  },
};
