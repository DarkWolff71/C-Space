import type { NextAuthOptions } from "next-auth";
import GitHubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";

import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { getPrismaClient } from "@/lib/helpers/prisma";

const prisma = getPrismaClient();

export const authOptions: NextAuthOptions = {
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
      authorization: {
        params: {
          scope:
            "https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile",
        },
      },
    }),
    // CredentialsProvider({
    //   name: "Credentials",
    //   credentials: {
    //     username: {
    //       label: "Username:",
    //       type: "text",
    //       placeholder: "your-cool-username",
    //     },
    //     password: {
    //       label: "Password:",
    //       type: "password",
    //       placeholder: "your-awesome-password",
    //     },
    //   },
    //   async authorize(credentials) {
    //     // This is where you need to retrieve user data
    //     // to verify with credentials
    //     // Docs: https://next-auth.js.org/configuration/providers/credentials
    //     const user = { id: "42", name: "Dave", password: "nextauth" };
    //     console.log("hellooooooooo line 30");

    //     // if (
    //     //   credentials?.username === user.name &&
    //     //   credentials?.password === user.password
    //     // ) {
    //     return user;
    //     // } else {
    //     //   return null;
    //     // }
    //   },
    // }),
  ],
  //@ts-ignore
  adapter: PrismaAdapter(prisma),
  callbacks: {
    async jwt({ token, user, session, trigger }) {
      if (trigger === "update") {
        console.log("line 677777777777");
        if (session.roomName && session.role) {
          if (session.role === "owner") {
            let dbResult = await prisma.room.findUnique({
              where: { name: session.roomName },
              select: {
                owners: {
                  //@ts-ignore
                  where: { email: token.email },
                  select: { name: true, email: true },
                },
                _count: {
                  select: {
                    owners: true,
                  },
                },
              },
            });
            console.log("line 80");

            // @ts-ignore
            if (dbResult && dbResult.owners.length > 0) {
              console.log("line 84");

              token.roomName = session.roomName;
              token.role = "owner";
              // @ts-ignore
              token.ownersInCurrentRoom = dbResult._count.owners;
            }
          } else if (session.role === "editor") {
            console.log("line 90");

            let dbResult = await prisma.room.findUnique({
              where: { name: session.roomName },
              select: {
                editors: {
                  //@ts-ignore
                  where: { email: token.email },
                  select: { name: true, email: true },
                },
                _count: {
                  select: {
                    owners: true,
                  },
                },
              },
            });
            //@ts-ignore
            if (dbResult && dbResult.editors.length > 0) {
              console.log("line 105");

              token.roomName = session.roomName;
              token.role = "editor";
              //@ts-ignore
              token.ownersInCurrentRoom = dbResult._count.owners;
            }
          }
        } else {
          // console.log("I'm in else update");
          const { roomName, role, ...newToken } = token;
          token = newToken;
        }
      }
      // console.log("I'm in auth JWT callback");
      // console.log("token: ", token);
      // console.log();
      // console.log("user: ", user);
      // console.log("session: ", session);
      // console.log();
      // console.log("I'm exiting auth JWT callback");

      return token;
    },
    // async jwt({ token, account, profile, user, session }) {
    //   console.log("hellooooooooo");
    //   // Persist the OAuth access_token and or the user id to the token right after signin
    //   if (account) {
    //     token.accessToken = account.access_token;
    //     // console.log("line 47: ");
    //     // console.log("token: ", token);
    //     // console.log("account: ", account);
    //     // console.log("user: ", user);
    //     // console.log("session: ", session);
    //     // console.log("profile: ", profile);
    //   }
    //   return token;
    // },
    async session({ session, token, user }) {
      // console.log("I'm in auth session callback");
      // console.log("session: ", session);
      // console.log("token: ", token);
      // console.log("user: ", user);
      if (token) {
        if (token.roomName && token.role && token.ownersInCurrentRoom) {
          // @ts-ignore
          session.user.roomName = token.roomName;
          // @ts-ignore
          session.user.role = token.role;
          // @ts-ignore
          session.user.ownersInCurrentRoom = token.ownersInCurrentRoom;
        } else {
          delete session.user.role;
          delete session.user.roomName;
          delete session.user.ownersInCurrentRoom;
        }
      }
      // console.log("I'm exiting auth session callback");

      return session;
    },
  },
};
