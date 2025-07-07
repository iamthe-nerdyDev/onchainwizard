import { TamboTool } from "@tambo-ai/react";
import { sendNative, sendNativeSchema } from "./onchain/native";
import {
  generateImage,
  generateImageSchema,
  mintNFT,
  mintNFTSchema,
  sendNFT,
  sendNFTSchema,
} from "./onchain/nft";
import {
  getTokenShield,
  getTokenShieldSchema,
  searchToken,
  searchTokenSchema,
  sendToken,
  sendTokenSchema,
  swapToken,
  swapTokenSchema,
} from "./onchain/token";

export const onchainTools: TamboTool[] = [
  {
    name: "sendNative",
    description:
      "A tool to send native blockchain tokens (Solana or SOL) to one or more recipients. Supports both immediate execution and scheduled execution for future delivery. Returns either a transaction signature for immediate execution or a job object for scheduled execution.",
    tool: sendNative,
    toolSchema: sendNativeSchema,
  },
  {
    name: "generateImage",
    description:
      "A tool to generate an AI-created image based on a text prompt. Returns URLs to access the generated image and metadata for tracking.",
    tool: generateImage,
    toolSchema: generateImageSchema,
  },
  {
    name: "mintNFT",
    description:
      "A tool to mint a new NFT (Non-Fungible Token) on the blockchain with the provided metadata, image, and attributes. Returns the transaction signature and minting details.",
    tool: mintNFT,
    toolSchema: mintNFTSchema,
  },
  {
    name: "sendNFT",
    description:
      "A tool to transfer an existing NFT from the user current wallet to a specified recipient address. Returns the transaction signature for verification.",
    tool: sendNFT,
    toolSchema: sendNFTSchema,
  },
  {
    name: "sendToken",
    description:
      "A tool to send SPL tokens to one or more recipients. Supports both immediate execution and scheduled execution for future delivery. Returns either a transaction signature for immediate execution or a job object for scheduled execution.",
    tool: sendToken,
    toolSchema: sendTokenSchema,
  },
  {
    name: "searchToken",
    description:
      "A tool that searches for tokens by name, symbol, or mint address. Returns detailed information about matching tokens including price, liquidity, holder statistics, and security audit data.",
    tool: searchToken,
    toolSchema: searchTokenSchema,
  },
  {
    name: "getTokenShield",
    description:
      "A tool that analyzes a token for security risks, suspicious activities, and potential red flags. Returns an array of warnings with severity levels to help users make informed decisions.",
    tool: getTokenShield,
    toolSchema: getTokenShieldSchema,
  },
  {
    name: "swapToken",
    description:
      "A tool to execute a token swap transaction on Solana. Swaps a specified amount of one token for another token at current market rates. Returns transaction signature and swap details.",
    tool: swapToken,
    toolSchema: swapTokenSchema,
  },
];
