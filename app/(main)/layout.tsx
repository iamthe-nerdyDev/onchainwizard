import CustomSessionProvider from "@/components/CustomSessionProvider";
import Footer from "@/components/Footer";
import NavBar from "@/components/Navbar";
import React from "react";

const MainLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <main className="flex flex-col min-h-[100vh] justify-between">
      <div>
        <NavBar />
        <CustomSessionProvider>{children}</CustomSessionProvider>
      </div>

      <Footer />
    </main>
  );
};

export default MainLayout;
