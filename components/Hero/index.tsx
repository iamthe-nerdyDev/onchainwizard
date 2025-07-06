import React from "react";
import { cn } from "@/lib/utils";
import { AnimatedShinyText } from "@/components/magicui/animated-shiny-text";
import { ArrowRightIcon } from "lucide-react";
import { AuroraText } from "@/components/magicui/aurora-text";

const Hero = () => {
  return (
    <div>
      <div className="z-10 flex min-h-20 items-center justify-center">
        <div
          className={cn(
            "group rounded-full border border-gray-200 bg-gray-50 text-base text-white transition-all ease-in hover:cursor-pointer hover:bg-neutral-200 dark:border-white/5 dark:bg-neutral-900 dark:hover:bg-neutral-800"
          )}
        >
          <AnimatedShinyText className="inline-flex items-center justify-center px-4 py-1 transition ease-out hover:text-neutral-600 hover:duration-300 hover:dark:text-neutral-400">
            <span>✨ Introducing OnchainWizard</span>
            <ArrowRightIcon className="ml-1 size-3 transition-transform duration-300 ease-in-out group-hover:translate-x-0.5" />
          </AnimatedShinyText>
        </div>
      </div>

      <h1 className="text-5xl text-center font-bold tracking-tighter md:text-6xl lg:text-7xl">
        <div>
          <AuroraText>Personalized</AuroraText>
        </div>
        Onchain Experience
      </h1>
    </div>
  );
};

export default Hero;
