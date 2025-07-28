import React from "react";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { ArrowRight, Shield, Zap, HeadphonesIcon } from "lucide-react";

export default function EDiscoverySection() {
  const features = [
    {
      id: "logistics",
      title: "Logistics: Agnostic", 
      icon: Shield,
      content: "Our platform-agnostic approach ensures seamless integration with your existing legal technology stack, regardless of the systems you currently use."
    },
    {
      id: "access",
      title: "Instant Access",
      icon: Zap,
      content: "Get immediate access to your data with our cloud-based infrastructure. No waiting, no delays - your information is available when you need it."
    },
    {
      id: "support", 
      title: "Fully Supported",
      icon: HeadphonesIcon,
      content: "Our expert team provides comprehensive support throughout the entire eDiscovery process, from initial consultation to final delivery."
    }
  ];

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section id="ediscovery" className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-gray-200 to-gray-250">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Left Column - Main Content */}
          <div className="xl:text-left max-w-prose">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              EDISCOVERY
            </h2>
            
            <p className="text-xl text-gray-700 leading-relaxed mb-8">
              Preserve, collect, and present your data with complete confidence. Our comprehensive 
              eDiscovery solutions eliminate uncertainty with transparent, flat-rate pricing through 
              our innovative <span className="text-teal-600 font-semibold">Cost Confidence</span> program.
            </p>
            
            <p className="text-lg text-gray-600 leading-relaxed mb-8">
              Whether you're handling routine litigation or complex multi-jurisdictional matters, 
              our technology-driven approach ensures your data is secure, accessible, and 
              presentation-ready when you need it most.
            </p>

            <button
              onClick={() => scrollToSection("contact")}
              className="neumorphic-button px-8 py-4 rounded-xl text-gray-800 font-semibold text-lg inline-flex items-center gap-3 mb-8"
            >
              Learn about Cost Confidence
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>

          {/* Right Column - Features */}
          <div className="neumorphic rounded-2xl p-6">
            <Accordion type="single" collapsible className="space-y-2">
              {features.map((feature) => (
                <AccordionItem key={feature.id} value={feature.id} className="border-none">
                  <AccordionTrigger className="neumorphic-button rounded-xl px-4 py-3 hover:no-underline text-left">
                    <div className="flex items-center gap-3">
                      <div className="neumorphic-inset p-2 rounded-lg">
                        <feature.icon className="w-5 h-5 text-teal-600" />
                      </div>
                      <span className="font-bold text-gray-900">{feature.title}</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-4 py-4 text-gray-700 leading-relaxed">
                    {feature.content}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>

        {/* Video Section */}
        <div className="mt-16">
          <div className="neumorphic rounded-2xl p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
              Cost Confidence Overview
            </h3>
            <div className="aspect-video rounded-xl overflow-hidden neumorphic-inset">
              <iframe
                src="https://www.youtube.com/embed/dQw4w9WgXcQ"
                title="Cost Confidence Program"
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
            onClick={() => scrollToSection("data-science")}
            className="neumorphic-button px-8 py-4 rounded-xl text-gray-800 font-semibold text-lg inline-flex items-center gap-3"
          >
            Next: Data Science
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </section>
  );
}