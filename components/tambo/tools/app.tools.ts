import { TamboTool } from "@tambo-ai/react";
import {
  addContact,
  addContactSchema,
  deleteContact,
  deleteContactSchema,
  getContacts,
  getContactsSchema,
  updateContactName,
  updateContactNameSchema,
} from "./app/contacts";
import {
  getUserWallet,
  getUserWalletSchema,
  updateUserInformation,
  updateUserInformationSchema,
} from "./app/user";

export const appTools: TamboTool[] = [
  {
    name: "addContact",
    description:
      "A tool to create a new contact entry with a name and blockchain address. Useful for maintaining a personal address book of frequently used wallets.",
    tool: addContact,
    toolSchema: addContactSchema,
  },
  {
    name: "updateContactName",
    description:
      "A tool to update the name/label of an existing contact. Useful for renaming contacts or correcting contact information.",
    tool: updateContactName,
    toolSchema: updateContactNameSchema,
  },
  {
    name: "deleteContact",
    description:
      "A tool to permanently removes a contact from the user's address book. This action cannot be undone.",
    tool: deleteContact,
    toolSchema: deleteContactSchema,
  },
  {
    name: "getContacts",
    description:
      "A tool to retrieve all contacts from the user's address book. Returns an empty array if no contacts exist.",
    tool: getContacts,
    toolSchema: getContactsSchema,
  },
  {
    name: "updateUserInformation",
    description:
      "A tool to update the information about the current logged in user",
    tool: updateUserInformation,
    toolSchema: updateUserInformationSchema,
  },
  {
    name: "getUserWallet",
    description:
      "A tool to retrieve information about the logged in user wallet.",
    tool: getUserWallet,
    toolSchema: getUserWalletSchema,
  },
];
