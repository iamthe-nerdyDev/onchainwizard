import { WandIcon } from "lucide-react";
import Link from "next/link";
import React from "react";
import { Button } from "../ui/button";
import { LocaleSwitcher } from "lingo.dev/react/client";

const NavBar = () => {
  return (
    <nav>
      <div className="container mx-auto">
        <div className="p-4 flex items-center justify-between">
          <Link href={"/"} className="flex items-center gap-2">
            <h2 className="text-lg font-semibold font-mono">OnchainWizard</h2>
            <WandIcon className="stoke-[1.5]" />
          </Link>

          <div className="flex items-center gap-4">
            <LocaleSwitcher locales={["en", "es", "fr", "de"]} />
            <Button asChild size={"default"} variant={"outline"}>
              <a href="/login">Login</a>
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
