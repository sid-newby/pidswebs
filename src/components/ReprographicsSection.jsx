
import React from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ArrowRight, Clock, Users, FileImage, Printer } from "lucide-react";

export default function ReprographicsSection() {
  const features = [
    {
      title: "We Never Sleep",
      subtitle: "24/7 Support",
      description: "Round-the-clock availability ensures your urgent projects are handled immediately, regardless of the hour.",
      icon: Clock
    },
    {
      title: "Trial Specialists", 
      subtitle: "Expert Team",
      description: "Dedicated professionals with deep courtroom experience who understand the critical nature of trial preparation.",
      icon: Users
    },
    {
      title: "Trial Exhibits",
      subtitle: "Professional Quality", 
      description: "High-impact demonstratives, trial boards, and exhibits designed to communicate complex information clearly.",
      icon: FileImage
    }
  ];

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section id="reprographics" className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-gray-250 to-gray-200">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Left Column - Main Content */}
          <div>
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              ANALOG, REPROGRAPHIC & TRIAL SERVICES
            </h2>
            
            <p className="text-xl text-gray-700 leading-relaxed mb-8">
              Complete copy, print, and trial preparation services with seamless paper-to-digital 
              transformations. Our comprehensive reprographics solutions include:
            </p>

            <div className="space-y-4 mb-8">
              <div className="flex items-center gap-3">
                <div className="neumorphic-inset p-2 rounded-lg">
                  <Printer className="w-5 h-5 text-teal-600" />
                </div>
                <span className="text-lg text-gray-700">High-volume copy and print services</span>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="neumorphic-inset p-2 rounded-lg">
                  <FileImage className="w-5 h-5 text-teal-600" />
                </div>
                <span className="text-lg text-gray-700">Professional trial boards and demonstratives</span>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="neumorphic-inset p-2 rounded-lg">
                  <Clock className="w-5 h-5 text-teal-600" />
                </div>
                <span className="text-lg text-gray-700">Archival conversions and digital transformations</span>
              </div>
            </div>
          </div>

          {/* Right Column - Features */}
          <div className="neumorphic rounded-2xl p-6">
            <div className="space-y-6">
              {features.map((feature, index) => (
                <div key={index} className="flex items-start gap-4">
                  <Avatar className="neumorphic-inset">
                    <AvatarFallback>
                      <feature.icon className="w-5 h-5 text-teal-600" />
                    </AvatarFallback>
                  </Avatar>
                  
                  <div>
                    <h4 className="font-bold text-gray-900 text-lg mb-1">
                      {feature.title}
                    </h4>
                    <p className="text-teal-600 font-semibold text-sm mb-2">
                      {feature.subtitle}
                    </p>
                    <p className="text-gray-700 leading-relaxed text-sm">
                      {feature.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Video Section */}
        <div className="mt-16">
          <div className="neumorphic rounded-2xl p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
              Reprographics Capabilities
            </h3>
            <div className="aspect-video rounded-xl overflow-hidden neumorphic-inset">
              <iframe
                src="https://www.youtube.com/embed/PdIDXQ47DBc?si=dLSc0R9hnqjOyl8d"
                title="Reprographics Capabilities"
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
        </div>

        {/* Next Section Button */}
        <div className="text-center mt-12">
          <button
            onClick={() => scrollToSection("team")}
            className="neumorphic-button px-8 py-4 rounded-xl text-gray-800 font-semibold text-lg inline-flex items-center gap-3"
          >
            Next: Meet the Team
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </section>
  );
}
