"use client";

import React from "react";
import { TamboProvider } from "@tambo-ai/react";
import { components } from "@/components/tambo/lib/tambo";

const CustomTamboProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <TamboProvider
      apiKey={process.env.NEXT_PUBLIC_TAMBO_API_KEY!}
      components={components}
    >
      {children}
    </TamboProvider>
  );
};

export default CustomTamboProvider;
