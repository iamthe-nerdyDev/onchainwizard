import { Job } from "@/generated/prisma";
import AppClient from "../client";
import { z } from "zod";

const client = new AppClient().getInstance();

export const sendNativeSchema = z
  .function()
  .args(
    z
      .object({
        runAt: z
          .string()
          .optional()
          .describe(
            "Optional ISO 8601 timestamp string specifying when the transaction should be executed. If provided, the transaction will be scheduled as a job for future execution. If omitted, the transaction will be executed immediately."
          ),
        recipients: z
          .array(
            z.object({
              address: z
                .string()
                .min(1, "Recipient address cannot be empty")
                .describe(
                  "The blockchain wallet address of the recipient who will receive the native tokens. Must be a valid address format for the solana blockchain."
                ),
              amount: z
                .number()
                .positive("Amount must be greater than zero")
                .describe(
                  "The amount of native tokens to send to this recipient."
                ),
            })
          )
          .min(1, "At least one recipient is required")
          .max(10, "Maximum 10 recipients allowed per transaction")
          .describe(
            "Array of recipient objects, each containing an address and amount. Supports batch transfers to multiple recipients in a single transaction."
          ),
      })
      .describe(
        "Payload for sending native blockchain tokens to one or more recipients"
      )
  )
  .returns(
    z
      .union([
        z.object({
          signature: z
            .string()
            .describe(
              "The blockchain transaction signature returned when the transaction is executed immediately. This can be used to track the transaction on the blockchain explorer."
            ),
        }),
        z.object({
          job: z
            .custom<Job>()
            .describe(
              "The job object returned when the transaction is scheduled for future execution using the runAt parameter. Contains job metadata including status, scheduling information, and execution details."
            ),
        }),
      ])
      .describe(
        "The return value varies based on execution mode: returns a signature object for immediate execution, or a job object for scheduled execution."
      )
  )
  .describe(
    "Sends native blockchain tokens (Solana or SOL) to one or more recipients. Supports both immediate execution and scheduled execution for future delivery. Returns either a transaction signature for immediate execution or a job object for scheduled execution."
  );

export const sendNative = async (payload: {
  runAt?: string;
  recipients: { address: string; amount: number }[];
}) => {
  const { error, message, data } = await client.post(
    "/onchain/native/send",
    payload
  );

  if (error) throw new Error(message);
  return data as {
    signature?: string;
    job?: Job;
  };
};
