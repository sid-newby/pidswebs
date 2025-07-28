import React from "react";
import { Button } from "@/components/ui/button";
import { Database, BarChart3, FileText, ArrowRight } from "lucide-react";

export default function ServicesOverview() {
  const services = [
    {
      id: "ediscovery",
      title: "eDiscovery",
      description: "Cost-confident data preservation, collection, and presentation with flat-rate pricing.",
      icon: Database,
      image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=400&h=300&fit=crop"
    },
    {
      id: "data-science", 
      title: "Data Science",
      description: "Transform complex data into actionable insights with advanced analytics and machine learning.",
      icon: BarChart3,
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=300&fit=crop"
    },
    {
      id: "reprographics",
      title: "Reprographics",
      description: "24/7 copy, print, trial boards, and digital transformation services.",
      icon: FileText, 
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop"
    }
  ];

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section id="services" className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-200">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            Services
          </h2>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
            With over 20 years of experience, Platinum IDS delivers comprehensive solutions 
            across eDiscovery, Data Science, and Reprographics to empower legal teams of all sizes.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {services.map((service) => (
            <div
              key={service.id}
              onClick={() => scrollToSection(service.id)}
              className="neumorphic rounded-2xl p-6 hover:shadow-inner transition-all duration-300 cursor-pointer group"
            >
              <div className="mb-6 overflow-hidden rounded-xl">
                <img
                  src={service.image}
                  alt={service.title}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              
              <div className="flex items-center gap-3 mb-4">
                <div className="neumorphic-inset p-3 rounded-xl">
                  <service.icon className="w-6 h-6 text-teal-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">{service.title}</h3>
              </div>
              
              <p className="text-gray-700 leading-relaxed mb-4">
                {service.description}
              </p>
              
              <div className="flex items-center text-teal-600 font-semibold">
                Learn More <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          ))}
        </div>

        <div className="text-center">
          <button
            onClick={() => scrollToSection("ediscovery")}
            className="neumorphic-button px-8 py-4 rounded-xl text-gray-800 font-semibold text-lg inline-flex items-center gap-3"
          >
            Next: All Inclusive, Flat Rate eDiscovery
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </section>
  );
}