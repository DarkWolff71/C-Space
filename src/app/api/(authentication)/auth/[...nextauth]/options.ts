import type { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";

import { PrismaAdapter } from "@auth/prisma-adapter";
import { getPrismaClient } from "@/lib/helpers/prisma";

const prisma = getPrismaClient();

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
  },
  providers: [
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
  ],

  //@ts-ignore
  adapter: PrismaAdapter(prisma),
  callbacks: {
    async jwt({ token, session, trigger }) {
      if (trigger === "update") {
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
            // @ts-ignore
            if (dbResult && dbResult.owners.length > 0) {
              token.roomName = session.roomName;
              token.role = "owner";
              // @ts-ignore
              token.ownersInCurrentRoom = dbResult._count.owners;
            }
          } else if (session.role === "editor") {
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
              token.roomName = session.roomName;
              token.role = "editor";
              //@ts-ignore
              token.ownersInCurrentRoom = dbResult._count.owners;
            }
          }
        } else {
          const { roomName, role, ...newToken } = token;
          token = newToken;
        }
      }

      return token;
    },

    async session({ session, token }) {
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

      return session;
    },
  },
};
