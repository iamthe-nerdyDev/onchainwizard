"use client";

import React from "react";
import { SessionProvider, useSession } from "next-auth/react";

const Loader = () => {
  return (
    <div className="loader">
      <h1>
        <span className="let1">l</span>
        <span className="let2">o</span>
        <span className="let3">a</span>
        <span className="let4">d</span>
        <span className="let5">i</span>
        <span className="let6">n</span>
        <span className="let7">g</span>
      </h1>
    </div>
  );
};

const RenderLayout = ({ children }: { children: React.ReactNode }) => {
  const { status } = useSession();

  if (status === "loading") return <Loader />;
  return children;
};

const CustomSessionProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <SessionProvider>
      <RenderLayout>{children}</RenderLayout>
    </SessionProvider>
  );
};

export default CustomSessionProvider;
