import { z } from "zod";
import { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { generateOTP, getExpiryDate } from "./utils";
import resend from "./adapters/resend";
import prisma from "./adapters/prisma";

export const authOptions: AuthOptions = {
  session: {
    strategy: "jwt",
  },
  callbacks: {
    jwt({ token, user, trigger, session }) {
      if (trigger === "update" && session?.id) {
        token = { ...token, user: session };
      }

      if (user) token = { ...token, user };
      return token;
    },
    async session({ session, token }) {
      session.user = token.user as any;
      return session;
    },
  },
  providers: [
    CredentialsProvider({
      id: "otp-login",
      name: "OTP Login",
      credentials: {
        email: {
          label: "Email Addresss",
          type: "email",
          placeholder: "user@domain.ltd",
        },
        step: {
          type: "hidden",
        },
        otp: {
          label: "One-Time Password",
          type: "number",
        },
      },
      async authorize(credentials) {
        if (credentials?.step === "email") {
          const { data: email, error } = z
            .string()
            .email()
            .safeParse(credentials.email);
          if (error) throw new Error(error.message);

          let user = await prisma.user.findFirst({ where: { email } });
          if (!user) {
            user = await prisma.user.create({ data: { email } });
          }

          const otp = generateOTP(5);
          await resend.emails.send({
            from: "OnchainWizard <onboarding@resend.dev>",
            to: email,
            subject: "Login to OnchainWizard",
            html: `
                <div>
                    <p>
                      Your email address <b>${email}</b> was used to initiate a log in request
                      on <b>OnchainWizard</b>, use to OTP below to continue
                    </p>
                    <br />
                    <h1>${otp}</h1>
                </div>
              `,
          });

          await prisma.oTP.create({
            data: {
              expiresAt: getExpiryDate(5),
              otp,
              userId: user.id,
            },
          });

          return null;
        }

        if (credentials?.step === "otp") {
          const { otp, email } = credentials;

          const user = await prisma.user.findFirst({ where: { email } });
          if (!user) throw new Error("User with email not found");

          const Otp = await prisma.oTP.findFirst({
            where: { userId: user.id, otp },
          });
          if (!Otp) throw new Error("Invalid OTP provided");

          const { expiresAt, isUsed } = Otp;

          if (isUsed) throw new Error("OTP already used");
          if (Date.now() > new Date(expiresAt).getTime()) {
            throw new Error("OTP code has expired");
          }

          return { ...user, id: String(user.id) };
        }

        return null;
      },
    }),
  ],
};
