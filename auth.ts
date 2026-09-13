import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import authConfig from "@/auth.config";

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  adapter: PrismaAdapter(prisma),
  secret: process.env.AUTH_SECRET,
  callbacks: {
    ...authConfig.callbacks,
    async session({ session, user, token }) {
      if (session.user) {
        // Memastikan ID user dari database / token tersambung ke session.user.id
        session.user.id = user?.id || (token?.sub as string) || session.user.id;
      }
      return session;
    },
  },
  events: {
    // Dipanggil otomatis HANYA saat akun user pertama kali dibuat di DB
    async createUser({ user }) {
      if (!user.id) return;

      await prisma.calendar.create({
        data: {
          userId: user.id,
          name: "Kalender Utama",
          colorHex: "#3B82F6",
          provider: "PRIMARY",
          isVisible: true,
          isOverlay: false,
        },
      });
    },
  },
});