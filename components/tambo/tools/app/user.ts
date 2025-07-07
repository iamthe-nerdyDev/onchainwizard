import AppClient from "../client";
import { z } from "zod";

const client = new AppClient().getInstance();

type User = {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  name: string | null;
  age: number | null;
  experience: "BEGINNER" | "INTERMEDIATE" | "ADVANCED" | null;
  email: string;
  language: string | null;
};

export const updateUserInformationSchema = z
  .function()
  .args(
    z
      .object({
        name: z
          .string()
          .min(1, "Name must not be empty")
          .optional()
          .describe("The user's display name"),
        age: z
          .number()
          .int("Age must be an integer")
          .optional()
          .describe("The user's age in years"),
        experience: z
          .enum(["BEGINNER", "INTERMEDIATE", "ADVANCED"])
          .optional()
          .describe(
            "The user's experience level: BEGINNER for new users to web3, INTERMEDIATE for users with some experience with web3, ADVANCED for expert web3 users"
          ),
      })
      .describe("User information update payload - all fields are optional")
  )
  .returns(
    z
      .object({
        id: z.number().describe("Unique user identifier"),
        createdAt: z.date().describe("When the user account was created"),
        updatedAt: z.date().describe("When the user account was last updated"),
        name: z.string().nullable().describe("User's display name"),
        age: z.number().nullable().describe("User's age in years"),
        experience: z
          .enum(["BEGINNER", "INTERMEDIATE", "ADVANCED"])
          .nullable()
          .describe("User's experience level"),
        email: z.string().email().describe("User's email address"),
      })
      .describe("Updated user information")
  );

export const updateUserInformation = async (payload: {
  name?: string;
  age?: number;
  experience?: "BEGINNER" | "INTERMEDIATE" | "ADVANCED";
}) => {
  const { error, message, data } = await client.put("/user", payload);

  if (error) throw new Error(message);
  return data as User;
};

type Wallet = {
  id: number;
  userId: number;
  address: string;
  createdAt: Date;
  updatedAt: Date;
};

export const getUserWalletSchema = z
  .function()
  .args()
  .returns(
    z
      .object({
        id: z.number().describe("Unique wallet identifier"),
        userId: z.number().describe("ID of the user who owns this wallet"),
        address: z.string().describe("Blockchain wallet address"),
        createdAt: z.date().describe("When the wallet was created"),
        updatedAt: z.date().describe("When the wallet was last updated"),
      })
      .describe("User's cryptocurrency wallet information")
  );

export const getUserWallet = async () => {
  const { error, message, data } = await client.get("/user/wallet");

  if (error) throw new Error(message);
  return data as Wallet;
};
