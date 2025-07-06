import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const generateOTP = (length: number) => {
  const digits = "0123456789";
  let otp = "";
  for (let i = 0; i < length; i++) {
    otp += digits[Math.floor(Math.random() * digits.length)];
  }

  return otp;
};

/**
 *
 * @param ttl: number - ttl in minutes
 */
export function getExpiryDate(ttl: number) {
  return new Date(Date.now() + ttl * 60 * 1000).toISOString();
}
