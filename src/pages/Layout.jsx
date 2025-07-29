
import React from "react";
import PropTypes from "prop-types";
import { Link, useLocation } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Menu, FileUp, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

export default function Layout({ children }) {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const scrollToSection = (sectionId) => {
    if (location.pathname !== createPageUrl("Home")) {
      window.location.href = createPageUrl("Home") + "#" + sectionId;
    } else {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
    setMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-200">
      <style>
        {`
          :root {
            --neumorphic-bg: #e0e0e0;
            --neumorphic-shadow-light: #ffffff;
            --neumorphic-shadow-dark: #bebebe;
            --accent-teal: #0d9488;
          }
          
          .neumorphic {
            background: var(--neumorphic-bg);
            box-shadow: 8px 8px 16px var(--neumorphic-shadow-dark), 
                        -8px -8px 16px var(--neumorphic-shadow-light);
          }
          
          .neumorphic-inset {
            background: var(--neumorphic-bg);
            box-shadow: inset 4px 4px 8px var(--neumorphic-shadow-dark), 
                        inset -4px -4px 8px var(--neumorphic-shadow-light);
          }
          
          .neumorphic-pressed {
            background: var(--neumorphic-bg);
            box-shadow: inset 6px 6px 12px var(--neumorphic-shadow-dark), 
                        inset -6px -6px 12px var(--neumorphic-shadow-light);
            transform: scale(0.98);
          }
          
          .neumorphic-button {
            background: var(--neumorphic-bg);
            box-shadow: 6px 6px 12px var(--neumorphic-shadow-dark), 
                        -6px -6px 12px var(--neumorphic-shadow-light);
            transition: all 0.2s ease;
          }
          
          .neumorphic-button:hover {
            box-shadow: 4px 4px 8px var(--neumorphic-shadow-dark), 
                        -4px -4px 8px var(--neumorphic-shadow-light);
            transform: translateY(1px);
          }
          
          .neumorphic-button:active {
            box-shadow: inset 4px 4px 8px var(--neumorphic-shadow-dark), 
                        inset -4px -4px 8px var(--neumorphic-shadow-light);
            transform: scale(0.98);
          }
        `}
      </style>

      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-gray-200 border-b border-gray-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link to={createPageUrl("Home")} className="flex items-center space-x-2">
              <div className="text-4xl bg-gradient-to-r from-gray-800 to-teal-600 bg-clip-text text-transparent pr-1" style={{ fontFamily: 'Poppins', fontWeight: 800, letterSpacing: '-0.05em' }}>
                PLATINUM IDS
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <button
                onClick={() => scrollToSection("services")}
                className="text-gray-700 hover:text-teal-600 transition-colors duration-200 font-medium"
              >
                Services
              </button>
              <button
                onClick={() => scrollToSection("team")}
                className="text-gray-700 hover:text-teal-600 transition-colors duration-200 font-medium"
              >
                Team
              </button>
              <button
                onClick={() => scrollToSection("contact")}
                className="text-gray-700 hover:text-teal-600 transition-colors duration-200 font-medium"
              >
                Contact
              </button>
              <Link
                to={createPageUrl("SendFile")}
                className="neumorphic-button px-4 py-2 rounded-lg text-gray-800 font-medium flex items-center gap-2"
              >
                <FileUp className="w-4 h-4" />
                Send File
              </Link>
              <Link
                to={createPageUrl("Training")}
                className="neumorphic-button px-4 py-2 rounded-lg text-gray-800 font-medium flex items-center gap-2"
              >
                <Calendar className="w-4 h-4" />
                Training
              </Link>
            </div>

            {/* Mobile Menu Trigger */}
            <div className="md:hidden">
              <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="text-gray-700">
                    <Menu className="w-6 h-6" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-80 bg-gray-200">
                  <div className="flex flex-col space-y-4 mt-8">
                    <button
                      onClick={() => scrollToSection("services")}
                      className="text-left text-gray-700 hover:text-teal-600 transition-colors duration-200 font-medium p-2"
                    >
                      Services
                    </button>
                    <button
                      onClick={() => scrollToSection("team")}
                      className="text-left text-gray-700 hover:text-teal-600 transition-colors duration-200 font-medium p-2"
                    >
                      Team
                    </button>
                    <button
                      onClick={() => scrollToSection("contact")}
                      className="text-left text-gray-700 hover:text-teal-600 transition-colors duration-200 font-medium p-2"
                    >
                      Contact
                    </button>
                    <Link
                      to={createPageUrl("SendFile")}
                      className="neumorphic-button px-4 py-3 rounded-lg text-gray-800 font-medium flex items-center gap-2 w-full"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <FileUp className="w-4 h-4" />
                      Send File
                    </Link>
                    <Link
                      to={createPageUrl("Training")}
                      className="neumorphic-button px-4 py-3 rounded-lg text-gray-800 font-medium flex items-center gap-2 w-full"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <Calendar className="w-4 h-4" />
                      Training
                    </Link>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-gray-200 border-t border-gray-300 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-xl font-bold text-gray-800 mb-4">Platinum IDS</h3>
              <p className="text-gray-600 leading-relaxed">
                Leveling the playing field for firms of all sizes through technology-driven eDiscovery, 
                data science, and reprographic services.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-800 mb-4">Services</h4>
              <ul className="space-y-2 text-gray-600">
                <li>eDiscovery</li>
                <li>Data Science</li>
                <li>Reprographics</li>
                <li>Trial Support</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-gray-800 mb-4">Resources</h4>
              <ul className="space-y-2 text-gray-600">
                <li>Platform Training</li>
                <li>File Transfer</li>
                <li>Support</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-300 mt-8 pt-8 text-center text-gray-600">
            <p>&copy; 2024 Platinum IDS. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

Layout.propTypes = {
  children: PropTypes.node.isRequired,
};
