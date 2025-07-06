import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import prisma from "./adapters/prisma";
import { magicLink } from "better-auth/plugins";
import resend from "./adapters/resend";
import { LoginEmail } from "@/components/email";

export const auth = betterAuth({
  appName: "OnchainWizard",
  database: prismaAdapter(prisma, { provider: "postgresql" }),
  plugins: [
    magicLink({
      disableSignUp: true,
      sendMagicLink: async ({ email, url }) => {
        await resend.emails.send({
          from: "OnchainWizard <onboarding@resend.dev>",
          to: email,
          subject: "Login to OnchainWizard",
          react: LoginEmail({ email, url }),
        });
      },
    }),
  ],
});
