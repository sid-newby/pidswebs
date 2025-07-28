
import React from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Mail, Linkedin } from "lucide-react";

export default function TeamSection() {
  const teamMembers = [
    {
      name: "Michael S. Holmes",
      role: "CEO",
      initials: "MH",
      bio: "Passionate advocate for technology-driven progress in the legal industry. Michael brings decades of leadership experience and vision for transforming how legal teams approach complex data challenges.",
      fullBio: "As CEO of Platinum IDS, Michael S. Holmes is a passionate advocate for technology-driven progress in the legal industry. With over two decades of experience, he has built Platinum IDS into a leading provider of eDiscovery and data science solutions. Michael's vision centers on democratizing access to sophisticated legal technology, ensuring that firms of all sizes can compete effectively in today's data-driven legal landscape.",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face"
    },
    {
      name: "David Martinez", 
      role: "COO",
      initials: "DM",
      bio: "Operations and finance leader who brings US Marine Corps discipline to managing facilities, HR, and strategic operations.",
      fullBio: "David Martinez serves as COO, overseeing operations, finance, HR, and facilities management. Drawing on his experience in the US Marine Corps, David brings exceptional organizational discipline and strategic thinking to Platinum IDS. His military background instills a culture of precision, reliability, and mission-focused execution across all operational aspects of the company.",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&crop=face"
    },
    {
      name: "Jesse Holmes",
      role: "Sr. Partner/Key Accounts", 
      initials: "JH",
      bio: "Legal veteran with 20+ years of experience managing large-scale cases and complex client relationships.",
      fullBio: "Jesse Holmes brings over 20 years of legal industry experience to his role as Senior Partner and Key Accounts manager. His deep understanding of legal processes and client needs makes him instrumental in managing Platinum IDS's most complex and high-stakes cases. Jesse plays a pivotal role in ensuring that large-scale litigation projects are executed flawlessly from initial consultation through final delivery.",
      image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=200&h=200&fit=crop&crop=face"
    },
    {
      name: "Sid Newby",
      role: "CTO",
      initials: "SN", 
      bio: "Certified Ethical Hacker & Forensic Investigator leading technology infrastructure and security initiatives.",
      fullBio: "As Chief Technology Officer, Sid Newby leads Platinum IDS's technology and security initiatives. A Certified Ethical Hacker and Forensic Investigator, Sid ensures that all client data is protected with enterprise-grade security measures. His expertise in cybersecurity and digital forensics provides clients with confidence that their sensitive legal data is handled with the highest levels of protection and integrity.",
      image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=200&h=200&fit=crop&crop=face"
    },
    {
      name: "Aaron Toledo",
      role: "Technical Fellow, Data Science",
      initials: "AT",
      bio: "Analytics and machine learning expert who manages the Tracker app and drives data science innovation.",
      fullBio: "Aaron Toledo serves as Technical Fellow for Data Science, driving analytics and machine learning initiatives across Platinum IDS's service offerings. He leads the development and management of the Tracker application and other proprietary data analysis tools. Aaron's expertise in advanced analytics and custom algorithm development helps clients extract meaningful insights from complex datasets.",
      image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&h=200&fit=crop&crop=face"
    },
    {
      name: "Chase Plumlee",
      role: "Director of Digital Services",
      initials: "CP",
      bio: "eDiscovery specialist who leads digital initiatives and optimizes electronic data processing workflows.", 
      fullBio: "Chase Plumlee directs Platinum IDS's digital services as Director of Digital Services, leading eDiscovery initiatives and optimizing electronic data processing workflows. His deep technical expertise in digital data handling ensures that complex electronic discovery projects are managed efficiently and cost-effectively. Chase's leadership in digital transformation helps clients navigate the evolving landscape of electronic evidence management.",
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop&crop=face"
    }
  ];

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section id="team" className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-200">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            PLATINUM'S CORE
          </h2>
          <p className="text-xl text-gray-700 max-w-4xl mx-auto leading-relaxed">
            Our leadership team unites career experts dedicated to data management and legal eDiscovery. 
            With decades of combined experience, our core mission is your success – leveling the playing 
            field through innovative technology and unparalleled service.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {teamMembers.map((member, index) => (
            <Dialog key={index}>
              <DialogTrigger asChild>
                <div className="neumorphic rounded-2xl p-6 hover:shadow-inner transition-all duration-300 cursor-pointer group">
                  <div className="text-center">
                    <Avatar className="w-24 h-24 mx-auto mb-4 neumorphic">
                      <AvatarImage src={member.image} alt={member.name} />
                      <AvatarFallback className="text-lg font-semibold text-teal-600">
                        {member.initials}
                      </AvatarFallback>
                    </Avatar>
                    
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      {member.name}
                    </h3>
                    
                    <Badge variant="secondary" className="mb-4 bg-teal-100 text-teal-800">
                      {member.role}
                    </Badge>
                    
                    <p className="text-gray-600 leading-relaxed text-sm">
                      {member.bio}
                    </p>
                  </div>
                </div>
              </DialogTrigger>
              
              <DialogContent className="max-w-2xl bg-gray-200 border-gray-300">
                <DialogHeader>
                  <div className="flex items-center gap-4 mb-4">
                    <Avatar className="w-16 h-16 neumorphic">
                      <AvatarImage src={member.image} alt={member.name} />
                      <AvatarFallback className="text-lg font-semibold text-teal-600">
                        {member.initials}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <DialogTitle className="text-2xl font-bold text-gray-900">
                        {member.name}
                      </DialogTitle>
                      <Badge variant="secondary" className="bg-teal-100 text-teal-800">
                        {member.role}
                      </Badge>
                    </div>
                  </div>
                </DialogHeader>
                
                <div className="space-y-4">
                  <p className="text-gray-700 leading-relaxed">
                    {member.fullBio}
                  </p>
                  
                  <div className="flex gap-3 pt-4">
                    <button className="neumorphic-button p-3 rounded-lg">
                      <Mail className="w-5 h-5 text-gray-700" />
                    </button>
                    <button className="neumorphic-button p-3 rounded-lg">
                      <Linkedin className="w-5 h-5 text-gray-700" />
                    </button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          ))}
        </div>

        {/* Contact CTA */}
        <div className="neumorphic rounded-2xl p-8 text-center">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            Ready to Level the Playing Field?
          </h3>
          <p className="text-lg text-gray-700 mb-6 max-w-2xl mx-auto">
            We're here to level the playing field for firms of all sizes by leveraging 
            cutting-edge technology and offering transparent, flat-rate pricing.
          </p>
          <button
            onClick={() => scrollToSection("contact")}
            className="neumorphic-button px-8 py-4 rounded-xl text-gray-800 font-semibold text-lg inline-flex items-center gap-3"
          >
            Contact Us Today
            <Mail className="w-5 h-5" />
          </button>
        </div>
      </div>
    </section>
  );
}
