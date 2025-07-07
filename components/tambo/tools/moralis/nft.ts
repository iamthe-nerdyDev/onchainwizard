import AppClient from "../client";
import { z } from "zod";

const client = new AppClient().getInstance();

export const getNFTSchema = z
  .function()
  .args(
    z
      .string()
      .describe(
        "The wallet address or mint address of the NFT to retrieve detailed information for"
      )
  )
  .returns(
    z
      .object({
        associatedTokenAddress: z
          .string()
          .describe(
            "The associated token account address that holds this NFT for the owner"
          ),
        mint: z
          .string()
          .describe(
            "The unique mint address that identifies this specific NFT on the blockchain"
          ),
        name: z
          .string()
          .describe("The display name of the NFT as defined in its metadata"),
        symbol: z
          .string()
          .describe("The ticker symbol or short identifier for this NFT"),
        decimals: z
          .number()
          .describe(
            "Number of decimal places for the token (typically 0 for NFTs since they're non-divisible)"
          ),
        tokenStandard: z
          .number()
          .describe(
            "The token standard specification number (e.g., Metaplex Token Standard)"
          ),
        amount: z
          .string()
          .describe("The quantity of this token held (usually '1' for NFTs)"),
        amountRaw: z
          .string()
          .describe("The raw amount value without decimal formatting"),
        possibleSpam: z
          .boolean()
          .describe(
            "Flag indicating whether this NFT has been flagged as potential spam or fraudulent content"
          ),
        media: z
          .object({
            status: z
              .string()
              .describe(
                "The current status of media processing (e.g., 'success', 'failed')"
              ),
            mimetype: z
              .string()
              .describe(
                "The MIME type of the NFT's primary media file (e.g., 'image/png', 'video/mp4')"
              ),
            originalMediaUrl: z
              .string()
              .describe(
                "The original URL where the NFT's media content is hosted"
              ),
            updatedAt: z
              .string()
              .describe(
                "ISO timestamp of when the media information was last updated"
              ),
            mediaCollection: z
              .object({
                low: z
                  .object({
                    height: z
                      .number()
                      .describe(
                        "Height in pixels of the low-resolution version"
                      ),
                    width: z
                      .number()
                      .describe(
                        "Width in pixels of the low-resolution version"
                      ),
                    url: z
                      .string()
                      .describe(
                        "URL to access the low-resolution version of the media"
                      ),
                  })
                  .describe(
                    "Low-resolution version of the NFT media for faster loading"
                  ),
                medium: z
                  .object({
                    height: z
                      .number()
                      .describe(
                        "Height in pixels of the medium-resolution version"
                      ),
                    width: z
                      .number()
                      .describe(
                        "Width in pixels of the medium-resolution version"
                      ),
                    url: z
                      .string()
                      .describe(
                        "URL to access the medium-resolution version of the media"
                      ),
                  })
                  .describe(
                    "Medium-resolution version of the NFT media for balanced quality and loading speed"
                  ),
                high: z
                  .object({
                    height: z
                      .number()
                      .describe(
                        "Height in pixels of the high-resolution version"
                      ),
                    width: z
                      .number()
                      .describe(
                        "Width in pixels of the high-resolution version"
                      ),
                    url: z
                      .string()
                      .describe(
                        "URL to access the high-resolution version of the media"
                      ),
                  })
                  .describe(
                    "High-resolution version of the NFT media for maximum quality"
                  ),
              })
              .describe(
                "Collection of different resolution versions of the NFT media for various display contexts"
              ),
          })
          .describe(
            "Comprehensive media information including URLs and processing status for the NFT's visual content"
          ),
        totalSupply: z
          .string()
          .describe(
            "The total number of tokens that exist for this mint (typically '1' for unique NFTs)"
          ),
        attributes: z
          .array(
            z
              .object({
                traitType: z
                  .string()
                  .describe(
                    "The category or type of this trait (e.g., 'Background', 'Eyes', 'Rarity')"
                  ),
                value: z
                  .string()
                  .describe(
                    "The specific value for this trait (e.g., 'Blue', 'Laser Eyes', 'Legendary')"
                  ),
              })
              .describe(
                "Individual trait or attribute that defines a characteristic of this NFT"
              )
          )
          .describe(
            "Array of traits and attributes that define the unique characteristics and rarity of this NFT"
          ),
        contract: z
          .object({
            type: z
              .string()
              .describe(
                "The type of smart contract standard (e.g., 'nft', 'spl-token')"
              ),
            name: z
              .string()
              .describe("The name of the contract or token program"),
            symbol: z
              .string()
              .describe("The symbol identifier for the contract"),
          })
          .describe(
            "Information about the smart contract that governs this NFT"
          ),
        collection: z
          .object({
            collectionAddress: z
              .string()
              .describe(
                "The unique address that identifies the collection this NFT belongs to"
              ),
            name: z.string().describe("The display name of the NFT collection"),
            description: z
              .string()
              .describe(
                "Detailed description of the collection's theme, purpose, or story"
              ),
            imageOriginalUrl: z
              .string()
              .describe("URL to the original collection artwork or logo image"),
            externalUrl: z
              .string()
              .nullable()
              .describe(
                "Optional external website URL for the collection (project homepage, social media, etc.)"
              ),
            metaplexMint: z
              .string()
              .describe(
                "The Metaplex mint address associated with this collection"
              ),
            sellerFeeBasisPoints: z
              .number()
              .describe(
                "The royalty fee in basis points (1/100th of a percent) that creators receive on secondary sales"
              ),
          })
          .describe(
            "Detailed information about the collection that this NFT is part of"
          ),
        firstCreated: z
          .object({
            mintTimestamp: z
              .string()
              .nullable()
              .describe(
                "ISO timestamp of when this NFT was first minted on the blockchain"
              ),
            mintBlockNumber: z
              .string()
              .nullable()
              .describe("The block number in which this NFT was first minted"),
            mintTransaction: z
              .string()
              .nullable()
              .describe(
                "The transaction hash/signature of the minting transaction"
              ),
          })
          .describe(
            "Historical information about when and how this NFT was originally created"
          ),
        creators: z
          .array(
            z
              .object({
                address: z
                  .string()
                  .describe("The wallet address of the creator or artist"),
                share: z
                  .number()
                  .describe(
                    "The percentage share of royalties this creator receives (0-100)"
                  ),
                verified: z
                  .boolean()
                  .describe(
                    "Whether this creator's signature has been verified on the NFT"
                  ),
              })
              .describe(
                "Individual creator or collaborator who contributed to this NFT"
              )
          )
          .describe(
            "Array of verified creators and their royalty share percentages for this NFT"
          ),
        properties: z
          .object({
            creators: z
              .array(
                z
                  .object({
                    address: z.string().describe("Creator's wallet address"),
                    share: z
                      .number()
                      .describe("Percentage of ownership or royalties (0-100)"),
                  })
                  .describe("Creator information with their ownership stake")
              )
              .describe(
                "List of creators with their respective ownership percentages"
              ),
            files: z
              .array(
                z
                  .object({
                    uri: z
                      .string()
                      .describe("URI/URL pointing to the file resource"),
                    type: z
                      .string()
                      .describe(
                        "File type or MIME type (e.g., 'image/png', 'application/json')"
                      ),
                  })
                  .describe("Individual file resource associated with this NFT")
              )
              .describe(
                "Array of all files and resources that make up this NFT (images, metadata, etc.)"
              ),
          })
          .describe(
            "Additional properties and file information that provide comprehensive details about the NFT's composition"
          ),
      })
      .describe(
        "Complete NFT information including metadata, media, ownership, and collection details"
      )
  );

export const getNFT = async (address: string) => {
  const { error, message, data } = await client.get(`/moralis/nft/${address}`);

  if (error) throw new Error(message);
  return data as WalletNFT;
};
