import type { NextAuthOptions } from "next-auth";
import GitHubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";

import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { getPrismaClient } from "@/lib/prisma";

const prisma = getPrismaClient();

export const options: NextAuthOptions = {
  session: {
    strategy: "jwt",
  },
  providers: [
    // GitHubProvider({
    //     clientId: process.env.GITHUB_ID as string,
    //     clientSecret: process.env.GITHUB_SECRET as string,
    // }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: {
          label: "Username:",
          type: "text",
          placeholder: "your-cool-username",
        },
        password: {
          label: "Password:",
          type: "password",
          placeholder: "your-awesome-password",
        },
      },
      async authorize(credentials) {
        // This is where you need to retrieve user data
        // to verify with credentials
        // Docs: https://next-auth.js.org/configuration/providers/credentials
        const user = { id: "42", name: "Dave", password: "nextauth" };
        console.log("hellooooooooo line 30");

        // if (
        //   credentials?.username === user.name &&
        //   credentials?.password === user.password
        // ) {
        return user;
        // } else {
        //   return null;
        // }
      },
    }),
  ],
  adapter: PrismaAdapter(prisma),
  callbacks: {
    async jwt({ token, account, profile, user, session }) {
      console.log("hellooooooooo");
      // Persist the OAuth access_token and or the user id to the token right after signin
      if (account) {
        token.accessToken = account.access_token;
        console.log("line 47: ");
        console.log("token: ", token);
        console.log("account: ", account);
        console.log("user: ", user);
        console.log("session: ", session);
        console.log("profile: ", profile);
      }
      return token;
    },
    async session({ session, token, user }) {
      // Send properties to the client, like an access_token and user id from a provider.
      console.log("line 58: ");
      console.log("token: ", token);
      console.log("user: ", user);
      console.log("session: ", session);

      return session;
    },
  },
};
