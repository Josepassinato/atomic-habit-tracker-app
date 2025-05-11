
import React from "react";
import Header from "@/components/Header";
import Hero from "@/components/sections/Hero";
import Features from "@/components/sections/Features";
import Testimonials from "@/components/sections/Testimonials";
import Pricing from "@/components/sections/Pricing";
import CTA from "@/components/sections/CTA";
import Footer from "@/components/sections/Footer";

const LandingPage = () => {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <Hero />
      <Features />
      <Testimonials />
      <Pricing />
      <CTA />
      <Footer />
    </div>
  );
};

export default LandingPage;
