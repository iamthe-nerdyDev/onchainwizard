"use client";

import { cn } from "@/lib/utils";
import React, { forwardRef, useRef } from "react";
import { AnimatedBeam } from "../magicui/animated-beam";
import { BotIcon, CircleUserRoundIcon } from "lucide-react";

const Circle = forwardRef<
  HTMLDivElement,
  { className?: string; children?: React.ReactNode }
>(({ className, children }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        "z-10 flex size-12 items-center justify-center rounded-full border-2 bg-white p-3 shadow-[0_0_20px_-12px_rgba(0,0,0,0.8)]",
        className
      )}
    >
      {children}
    </div>
  );
});

Circle.displayName = "Circle";

const AnimatedBeamDemo = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const div1Ref = useRef<HTMLDivElement>(null);
  const div2Ref = useRef<HTMLDivElement>(null);

  return (
    <div className="absolute left-1/2 top-10 lg:top-20 w-full max-w-[500px] -translate-x-1/2 transition-all duration-300 ease-out [mask-image:linear-gradient(to_top,transparent_10%,#000_100%)] group-hover:scale-105">
      <div
        className="relative flex w-full items-center justify-center overflow-hidden p-10"
        ref={containerRef}
      >
        <div className="flex size-full flex-col items-stretch justify-between gap-10">
          <div className="flex flex-row justify-between">
            <Circle ref={div1Ref}>
              <BotIcon />
            </Circle>
            <Circle ref={div2Ref}>
              <CircleUserRoundIcon />
            </Circle>
          </div>
        </div>

        <AnimatedBeam
          containerRef={containerRef}
          fromRef={div1Ref}
          toRef={div2Ref}
          startYOffset={10}
          endYOffset={10}
          curvature={-20}
        />
        <AnimatedBeam
          containerRef={containerRef}
          fromRef={div1Ref}
          toRef={div2Ref}
          startYOffset={-10}
          endYOffset={-10}
          curvature={20}
          reverse
        />
      </div>
    </div>
  );
};

export default AnimatedBeamDemo;
