import React from "react";
import Features from "@/components/Features";
import Hero from "@/components/Hero";
import CTA from "@/components/CTA";
import Footer from "@/components/Footer";
import NavBar from "@/components/Navbar";

const Home = () => {
  return (
    <React.Fragment>
      <NavBar />

      <section className="container mx-auto py-8" id="hero">
        <div className="p-4">
          <Hero />
        </div>
      </section>

      <section className="container mx-auto py-8" id="features">
        <div className="p-4">
          <Features />
        </div>
      </section>

      <section className="bg-gray-50 border border-gray-200" id="cta">
        <CTA />
      </section>

      <Footer />
    </React.Fragment>
  );
};

export default Home;
