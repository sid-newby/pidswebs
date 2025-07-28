import React from "react";
import HeroSection from "../components/HeroSection";
import ServicesOverview from "../components/ServicesOverview";
import EDiscoverySection from "../components/EDiscoverySection";
import DataScienceSection from "../components/DataScienceSection";
import ReprographicsSection from "../components/ReprographicsSection";
import TeamSection from "../components/TeamSection";
import ContactSection from "../components/ContactSection";

export default function Home() {
  return (
    <div className="bg-gray-200">
      <HeroSection />
      <ServicesOverview />
      <EDiscoverySection />
      <DataScienceSection />
      <ReprographicsSection />
      <TeamSection />
      <ContactSection />
    </div>
  );
}