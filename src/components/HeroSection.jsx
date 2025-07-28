import React from "react";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";

export default function HeroSection() {
  const scrollToServices = () => {
    const element = document.getElementById("services");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="min-h-screen bg-gradient-to-b from-gray-200 to-gray-300 flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Text Content */}
          <div className="text-center lg:text-left">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-light text-gray-800 leading-tight mb-8">
              All truths are easy to understand once they are discovered. 
              <span className="block mt-4 text-teal-600 font-medium">
                The point is to discover them.
              </span>
            </h1>
            
            <div className="mb-8">
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                We Are Platinum
              </h2>
              <p className="text-xl text-gray-700 leading-relaxed max-w-2xl">
                Leveling the playing field for firms of all sizes through innovative technology, 
                comprehensive eDiscovery services, and data-driven insights.
              </p>
            </div>

            <button
              onClick={scrollToServices}
              className="neumorphic-button px-8 py-4 rounded-xl text-gray-800 font-semibold text-lg inline-flex items-center gap-3"
            >
              Discover Our Services
              <ChevronDown className="w-5 h-5" />
            </button>
          </div>

          {/* Image */}
          <div className="flex justify-center lg:justify-end">
            <div className="neumorphic rounded-3xl p-8 max-w-md">
              <img
                src="https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=500&fit=crop&crop=face"
                alt="Classical statue representing wisdom and discovery"
                className="w-full h-96 object-cover rounded-2xl filter grayscale"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}