// src/app/api/auth/[next]/route.ts
import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import User from '../../../../../models/User';
import connectMongo from '../../../../../lib/mongodb';
import bcrypt from 'bcrypt';

export default NextAuth({
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
          return { id: user._id, email: user.email };
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
      if (token?.email) {
        session.user.email = token.email; 
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.sub = user.id; 
      }
      return token;
    },
  },
});
