import CryptoJS from "crypto-js";
import { Keypair } from "@solana/web3.js";
import bs58 from "bs58";

const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || "";

export default class Wallet {
  static createKey() {
    const keypair = Keypair.generate();
    const pk = bs58.encode(keypair.secretKey);

    const encryptedPK = CryptoJS.AES.encrypt(pk, ENCRYPTION_KEY).toString();
    return { encryptedPK, publicKey: keypair.publicKey.toBase58() };
  }

  static decryptKey(ciphertext: string) {
    const bytes = CryptoJS.AES.decrypt(ciphertext, ENCRYPTION_KEY);
    return bytes.toString(CryptoJS.enc.Utf8);
  }
}
