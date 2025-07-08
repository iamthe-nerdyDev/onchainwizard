"use client";

import React from "react";
import { TamboProvider } from "@tambo-ai/react";
import { components, tools } from "@/components/tambo/lib/tambo";

const CustomTamboProvider = ({
  userId,
  children,
}: {
  userId: number;
  children: React.ReactNode;
}) => {
  return (
    <TamboProvider
      apiKey={process.env.NEXT_PUBLIC_TAMBO_API_KEY!}
      components={components}
      tools={tools}
      userToken={String(userId)}
    >
      {children}
    </TamboProvider>
  );
};

export default CustomTamboProvider;
