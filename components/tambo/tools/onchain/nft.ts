import AppClient from "../client";
import { z } from "zod";

const client = new AppClient().getInstance();

export const generateImageSchema = z
  .function()
  .args(
    z
      .string()
      .min(1, "Prompt cannot be empty")
      .describe(
        "A descriptive text prompt for generating the NFT image. Should be detailed and specific to produce the desired visual output (e.g., 'A futuristic robot in a cyberpunk cityscape with neon lights')."
      )
  )
  .returns(
    z
      .object({
        id: z
          .string()
          .describe(
            "Unique identifier for the generated image request. Can be used to reference this specific image generation."
          ),
        output_url: z
          .string()
          .url()
          .describe(
            "Direct URL to the generated image file. This URL can be used to download or display the generated image."
          ),
        share_url: z
          .string()
          .url()
          .describe(
            "Shareable URL for the generated image, typically used for public viewing or sharing on social platforms."
          ),
        backend_request_id: z
          .string()
          .describe(
            "Internal backend request identifier for tracking and debugging purposes."
          ),
      })
      .describe("Generated image information including URLs and identifiers")
  )
  .describe(
    "Generates an AI-created image based on a text prompt. Returns URLs to access the generated image and metadata for tracking."
  );

export const generateImage = async (prompt: string) => {
  const { error, message, data } = await client.post("/onchain/nft/generate", {
    prompt,
  });

  if (error) throw new Error(message);
  return data as {
    id: string;
    output_url: string;
    share_url: string;
    backend_request_id: string;
  };
};

export const mintNFTSchema = z
  .function()
  .args(
    z
      .object({
        name: z
          .string()
          .min(1, "NFT name cannot be empty")
          .describe(
            "The display name of the NFT token. This will be visible in wallets and marketplaces."
          ),
        symbol: z
          .string()
          .min(1, "NFT symbol cannot be empty")
          .describe(
            "The symbol/ticker for the NFT collection. Typically a short abbreviation (e.g., 'MYNFT')."
          ),
        imageUri: z
          .string()
          .url()
          .describe(
            "URL pointing to the NFT's image file. Should be a permanent, accessible URL."
          ),
        description: z
          .string()
          .describe(
            "Detailed description of the NFT. This text will be displayed in NFT marketplaces and wallets to describe what the NFT represents."
          ),
        imgType: z
          .string()
          .describe(
            "The image file type/format (e.g., 'image/png', 'image/jpeg', 'image/gif'). Used for proper rendering and display."
          ),
        attributes: z
          .array(
            z.object({
              trait_type: z
                .string()
                .describe(
                  "The name/type of this trait/attribute (e.g., 'Color', 'Rarity', 'Level')."
                ),
              value: z
                .string()
                .describe(
                  "The value of this trait/attribute (e.g., 'Red', '5', 'Legendary')."
                ),
            })
          )
          .describe(
            "Array of metadata attributes/traits for the NFT. These appear as properties in NFT marketplaces and can be used for filtering and rarity calculations."
          ),
      })
      .describe("Complete NFT metadata and minting configuration")
  )
  .returns(
    z
      .object({
        signature: z
          .string()
          .describe(
            "The blockchain transaction signature for the NFT minting transaction. Can be used to verify the transaction on a blockchain explorer."
          ),
        result: z
          .any()
          .describe(
            "Additional result data from the minting process, which may include mint address, token account details, or other blockchain-specific information."
          ),
      })
      .describe(
        "NFT minting result with transaction signature and additional metadata"
      )
  )
  .describe(
    "Mints a new NFT (Non-Fungible Token) on the blockchain with the provided metadata, image, and attributes. Returns the transaction signature and minting details."
  );

export const mintNFT = async (payload: {
  name: string;
  symbol: string;
  imageUri: string;
  description: string;
  imgType: string;
  attributes: { value: string; trait_type: string }[];
}) => {
  const { error, message, data } = await client.post(
    "/onchain/nft/mint",
    payload
  );

  if (error) throw new Error(message);
  return data as { signature: string; result: any };
};

export const sendNFTSchema = z
  .function()
  .args(
    z
      .object({
        mint: z
          .string()
          .min(1, "Mint address cannot be empty")
          .describe(
            "The mint address (public key) of the NFT to be transferred. This uniquely identifies the specific NFT token on the blockchain."
          ),
        recipient: z
          .string()
          .min(1, "Recipient address cannot be empty")
          .describe(
            "The blockchain wallet address of the recipient who will receive the NFT. Must be a valid address format for the Solana blockchain."
          ),
      })
      .describe(
        "NFT transfer configuration specifying which token to send and where to send it"
      )
  )
  .returns(
    z
      .object({
        signature: z
          .string()
          .describe(
            "The blockchain transaction signature/hash for the NFT transfer transaction. Can be used to verify the transaction on a blockchain explorer."
          ),
      })
      .describe("NFT transfer result with transaction signature")
  )
  .describe(
    "Transfers an existing NFT from the current wallet to a specified recipient address. Returns the transaction signature for verification."
  );

export const sendNFT = async (payload: { mint: string; recipient: string }) => {
  const { error, message, data } = await client.post(
    "/onchain/nft/send",
    payload
  );

  if (error) throw new Error(message);
  return data as { signature: string };
};
