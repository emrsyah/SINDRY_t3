import NextAuth, { type NextAuthOptions } from "next-auth";
import GithubProvider from "next-auth/providers/github";
// Prisma adapter for NextAuth, optional and can be removed
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import CredentialsProvider from "next-auth/providers/credentials";
import sha1 from "sha1";
import { prisma } from "../../../server/db/client";
import { trpc } from "../../../utils/trpc.js";
import { Role } from '../../../types/next-auth';

export const authOptions: NextAuthOptions = {
  // Include user.id on session
  callbacks: {
    async jwt({ token, user }) {
      /* Step 1: update the token based on the user object */
      if (user) {
        token.role = user.role;
        token.id = user.id
      }
      return token;
    },
    session({ session, token }) {
      /* Step 2: update the session.user based on the token object */
      if (token && session.user) {
        session.user.role = token.role;
        session.user.id = token.id
      }
      return session;
    },
    // async jwt({ token, account, user }) {
    //   // Persist the OAuth access_token to the token right after signin
    //   console.log({ token, account, user });
    //   if (account) {
    //     token.role = user?.role
    //     token.accessToken = account.access_token;
    //   }
    //   return token;
    // },
    // async session({ session, token, user }) {
    //   console.log({ session, user, token });
    //   // Send properties to the client, like an access_token from a provider.
    //   session.accessToken = token.accessToken;
    //   session.user?.role = token.role;
    //   // session.user.role = user.
    //   return session;
    // },
    async signIn({ user, account, profile, email, credentials }) {
      const isAllowedToSignIn = true;
      console.log({ user, account, profile, email, credentials });
      if (isAllowedToSignIn) {
        return true;
      } else {
        // Return false to display a default error message
        return false;
        // Or you can return a URL to redirect to:
        // return '/unauthorized'
      }
    },
  },
  pages: {
    signIn: "/", //Need to define custom login page (if using)
  },
  // Configure one or more authentication providers
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: "credentials",
      type: "credentials",
      credentials: {
        email: {
          label: "Email",
          type: "text",
        },
        password: { label: "Password", type: "password" },
      },
      async authorize(credential, req) {
        const { email, password } = credential as {
          email: string;
          password: string;
        };
        const sha1pass = sha1(password);
        const user = await prisma.user.findFirst({
          where: {
            email: email,
            password: sha1pass,
          },
        });
        if (!user) return null;
        return {
          id: user.id,
          name: user.name,
          email: user.email,
          image: user.image,
          role: user.role as Role,
        };
      },
    }),
    // ...add more providers here
  ],
  jwt: {
    maxAge: 24 * 60 * 60,
  },
  session: {
    strategy: "jwt",
  },
  // cookie: {
  //   secure: process.env.NODE_ENV && process.env.NODE_ENV === "production",
  // },
  // cookies: {
  //   sessionToken :
  // }
};

export default NextAuth(authOptions);
