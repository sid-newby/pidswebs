import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, Brain, TrendingUp, Cpu } from "lucide-react";

export default function DataScienceSection() {
  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section id="data-science" className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-200">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Main Content */}
          <div className="xl:text-left">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              DATA SCIENCE
            </h2>
            
            <p className="text-xl text-gray-700 leading-relaxed mb-6">
              Transform complex data into actionable insights that drive legal strategy. 
              Our expert team leverages <span className="text-teal-600 font-semibold">advanced analytics</span>, 
              <span className="text-teal-600 font-semibold"> machine learning</span>, and 
              <span className="text-teal-600 font-semibold"> custom algorithms</span> to uncover 
              patterns and relationships hidden within your data.
            </p>
            
            <p className="text-lg text-gray-600 leading-relaxed mb-6">
              Our solutions don't just analyze data – they educate juries and motivate judges 
              by presenting complex information in clear, compelling visualizations that tell 
              your story effectively.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
              <div className="neumorphic-inset rounded-xl p-4 text-center">
                <Brain className="w-8 h-8 text-teal-600 mx-auto mb-2" />
                <h4 className="font-semibold text-gray-800">AI.</h4>
                <p className="text-sm text-gray-600">Machine learning algorithms</p>
              </div>
              
              <div className="neumorphic-inset rounded-xl p-4 text-center">
                <TrendingUp className="w-8 h-8 text-teal-600 mx-auto mb-2" />
                <h4 className="font-semibold text-gray-800">Predict.</h4>
                <p className="text-sm text-gray-600">Beautiful Advanced Analytics</p>
              </div>
              
              <div className="neumorphic-inset rounded-xl p-4 text-center">
                <Cpu className="w-8 h-8 text-teal-600 mx-auto mb-2" />
                <h4 className="font-semibold text-gray-800">Savage.</h4>
                <p className="text-sm text-gray-600">Tailored Powerful Algorithms</p>
              </div>
            </div>

            <button
              onClick={() => scrollToSection("reprographics")}
              className="neumorphic-button px-8 py-4 rounded-xl text-gray-800 font-semibold text-lg inline-flex items-center gap-3"
            >
              Explore Trial Solutions
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>

          {/* Right Column - Visual */}
          <div className="relative">
            <div className="neumorphic rounded-2xl p-8">
              <img
                src="https://images.unsplash.com/photo-1518186285589-2f7649de83e0?w=500&h=400&fit=crop"
                alt="Data visualization and analytics"
                className="w-full h-80 object-cover rounded-xl"
              />
              
              {/* Overlay with blur effect for depth */}
              <div className="absolute inset-0 bg-gradient-to-t from-gray-200/20 to-transparent rounded-2xl pointer-events-none" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}