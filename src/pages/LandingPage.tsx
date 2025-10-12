
import React from "react";
import { useLocation } from "react-router-dom";
import Header from "@/components/Header";
import Hero from "@/components/sections/Hero";
import { SocialProof } from "@/components/sections/SocialProof";
import Features from "@/components/sections/Features";
import Testimonials from "@/components/sections/Testimonials";
import Pricing from "@/components/sections/Pricing";
import CTA from "@/components/sections/CTA";
import Footer from "@/components/sections/Footer";
import PageNavigation from "@/components/PageNavigation";

const LandingPage = () => {
  const location = useLocation();
  
  // Show back button only if not on root path
  const showBackButton = location.pathname !== '/';

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      {showBackButton && <PageNavigation showLogout={false} />}
      <Hero />
      <SocialProof />
      <Features />
      <Testimonials />
      <Pricing />
      <CTA />
      <Footer />
    </div>
  );
};

export default LandingPage;
