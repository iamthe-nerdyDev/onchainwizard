import AppClient from "../client";
import { z } from "zod";

const client = new AppClient().getInstance();

const ContactSchema = z.object({
  id: z.number().describe("Unique identifier for the contact record"),
  userId: z.number().describe("ID of the user who owns this contact"),
  address: z
    .string()
    .describe("Solana wallet address associated with this contact"),
  createdAt: z.date().describe("Timestamp when the contact was first created"),
  updatedAt: z.date().describe("Timestamp when the contact was last updated"),
  name: z.string().describe("Human-readable name/label for the contact"),
});

type Contact = z.infer<typeof ContactSchema>;

export const addContactSchema = z
  .function()
  .args(
    z
      .object({
        name: z
          .string()
          .min(1, "Contact name cannot be empty")
          .describe(
            "Human-readable name or label for the contact (e.g., 'John Doe', 'My Trading Wallet', 'DeFi Protocol')"
          ),
        address: z
          .string()
          .min(1, "Contact address cannot be empty")
          .describe(
            "Blockchain wallet address to associate with this contact. Must be a valid address format for the solana blockchain."
          ),
      })
      .describe("Contact information for creating a new contact entry")
  )
  .returns(
    ContactSchema.describe(
      "The newly created contact with all metadata including ID and timestamps"
    )
  )
  .describe(
    "Creates a new contact entry with a name and blockchain address. Useful for maintaining a personal address book of frequently used wallets."
  );

export const addContact = async (payload: {
  name: string;
  address: string;
}) => {
  const { error, message, data } = await client.post("/contacts", payload);

  if (error) throw new Error(message);
  return data as Contact;
};

export const updateContactNameSchema = z
  .function()
  .args(
    z
      .object({
        filter: z
          .object({
            id: z
              .string()
              .min(1, "Contact ID cannot be empty")
              .describe("The unique identifier of the contact to update"),
          })
          .describe("Filter criteria to identify which contact to update"),
        data: z
          .object({
            name: z
              .string()
              .min(1, "New name cannot be empty")
              .describe("The new name/label to assign to the contact"),
          })
          .describe("Updated contact data"),
      })
      .describe("Update payload containing contact ID and new name")
  )
  .returns(
    ContactSchema.describe(
      "The updated contact with the new name and updated timestamp"
    )
  )
  .describe(
    "Updates the name/label of an existing contact. Useful for renaming contacts or correcting contact information."
  );

export const updateContactName = async (payload: {
  filter: { id: string };
  data: { name: string };
}) => {
  const { error, message, data } = await client.put(
    `/contacts?id=${payload.filter.id}`,
    payload.data
  );

  if (error) throw new Error(message);
  return data as Contact;
};

export const deleteContactSchema = z
  .function()
  .args(
    z
      .object({
        filter: z
          .object({
            id: z
              .string()
              .min(1, "Contact ID cannot be empty")
              .describe("The unique identifier of the contact to delete"),
          })
          .describe("Filter criteria to identify which contact to delete"),
      })
      .describe("Delete payload containing the contact ID to remove")
  )
  .returns(
    ContactSchema.describe("The deleted contact information for confirmation")
  )
  .describe(
    "Permanently removes a contact from the user's address book. This action cannot be undone."
  );

export const deleteContact = async (payload: { filter: { id: string } }) => {
  const { error, message, data } = await client.delete(
    `/contacts?id=${payload.filter.id}`
  );

  if (error) throw new Error(message);
  return data as Contact;
};

export const getContactsSchema = z
  .function()
  .args(
    z
      .void()
      .describe(
        "No parameters required - retrieves all contacts for the current user"
      )
  )
  .returns(
    z
      .array(ContactSchema)
      .describe(
        "Array of all contacts belonging to the current user, ordered by creation date"
      )
  )
  .describe(
    "Retrieves all contacts from the user's address book. Returns an empty array if no contacts exist."
  );

export const getContacts = async () => {
  const { error, message, data } = await client.get("/contacts");

  if (error) throw new Error(message);
  return data as Contact[];
};
