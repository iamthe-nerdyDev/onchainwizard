import { WandIcon } from "lucide-react";
import Link from "next/link";
import React from "react";
import { Button } from "../ui/button";
import CustomLocaleSwitcher from "../CustomLocaleSwitcher";
import session from "@/lib/middleware/session";
import AuthButton from "./AuthButton";

const NavBar = async () => {
  const userId = await session();

  return (
    <nav>
      <div className="container mx-auto">
        <div className="p-4 flex items-center justify-between">
          <Link href={"/"} className="flex items-center gap-2">
            <h2 className="text-lg font-semibold font-mono">OnchainWizard</h2>
            <WandIcon className="stoke-[1.5]" />
          </Link>

          <div className="flex items-center gap-3">
            <CustomLocaleSwitcher />
            <span className="w-[1px] h-7 bg-gray-400" />
            {userId ? (
              <AuthButton />
            ) : (
              <Button
                asChild
                size={"default"}
                variant={"default"}
                className="bg-black text-white hover:bg-gray-800"
              >
                <Link href="/login">Get Started</Link>
              </Button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
