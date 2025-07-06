import Link from "next/link";
import React from "react";
import { WandIcon } from "lucide-react";
import {
  IconBrandX,
  IconBrandTelegram,
  IconBrandReddit,
  IconBrandDiscord,
  IconBrandYoutube,
} from "@tabler/icons-react";

const Footer = () => {
  return (
    <footer className="container mx-auto">
      <div className="p-4 flex flex-col md:flex-row items-center justify-between gap-4">
        <Link href={"/"} className="flex items-center gap-2">
          <h2 className="text-lg font-semibold font-mono">OnchainWizard</h2>
          <WandIcon className="stoke-[1.5]" />
        </Link>

        <div className="flex items-center gap-4 stroke-gray-500">
          <Link href={"#"} target="_blank">
            <IconBrandX strokeWidth={1.5} />
          </Link>
          <Link href={"#"} target="_blank">
            <IconBrandTelegram strokeWidth={1.5} />
          </Link>
          <Link href={"#"} target="_blank">
            <IconBrandReddit strokeWidth={1.5} />
          </Link>
          <Link href={"#"} target="_blank">
            <IconBrandDiscord strokeWidth={1.5} />
          </Link>
          <Link href={"#"} target="_blank">
            <IconBrandYoutube strokeWidth={1.5} />
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
