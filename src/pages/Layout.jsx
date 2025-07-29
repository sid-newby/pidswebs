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
  const [navbarScrolled, setNavbarScrolled] = React.useState(false);
  const [reviewOpen, setReviewOpen] = React.useState(false);

  // Determine if current page is Training or SendFile
  const isSpecialPage =
    location.pathname.toLowerCase().includes("training") ||
    location.pathname.toLowerCase().includes("sendfile");

  React.useEffect(() => {
    const handleScroll = () => {
      if (isSpecialPage) {
        setNavbarScrolled(true);
      } else {
        const scrolled = window.scrollY > 50;
        setNavbarScrolled(scrolled);
      }
    };

    // Initial check
    handleScroll();

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
    // eslint-disable-next-line
  }, [location.pathname]);

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

  // Use isSpecialPage OR navbarScrolled for nav color logic
  const navIsScrolled = isSpecialPage || navbarScrolled;

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
      <nav className={`fixed top-4 w-full z-50 transition-all duration-300 ${
        navIsScrolled
          ? 'bg-gray-200/95 backdrop-blur-md border-b border-gray-300 shadow-lg'
          : 'bg-transparent'
      }`}>
        {/* Agent Avatar */}
        <img
          src="/ai.gif"
          alt="AI Agent"
          className="fixed top-4 right-8 z-[100] w-16 h-16 rounded-full animate-agent-pulse"
          style={{
            pointerEvents: "none"
          }}
        />
        <style>
          {`
            @keyframes agentPulse {
              0% { transform: scale(1); box-shadow: 0 0 0 0 rgba(13,148,136,0.25);}
              50% { transform: scale(1.08); box-shadow: 0 0 16px 8px rgba(13,148,136,0.10);}
              100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(13,148,136,0.25);}
            }
            .animate-agent-pulse {
              animation: agentPulse 2.2s infinite cubic-bezier(0.4,0,0.2,1);
              transition: box-shadow 0.3s;
            }
          `}
        </style>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
          {/* Logo */}
          {/* Logo always present but invisible until scrolled */}
          <Link to={createPageUrl("Home")} className="flex items-center space-x-2">
            <div className={`text-4xl bg-gradient-to-r pr-1 transition-all duration-300 ${
              navIsScrolled
                ? 'from-gray-800 to-teal-600 bg-clip-text text-transparent'
                : 'from-white to-cyan-300 bg-clip-text text-transparent drop-shadow-lg'
            } ${navIsScrolled ? '' : 'invisible'}`} style={{ fontFamily: 'Poppins', fontWeight: 700, letterSpacing: '-0.1em', textTransform: 'lowercase' }}>
              platinum ids
            </div>
          </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <button
                onClick={() => scrollToSection("services")}
                className={`transition-colors duration-200 text-sm font-medium ${
                  navIsScrolled
                    ? 'text-gray-700 hover:text-teal-600'
                    : 'text-white hover:text-cyan-300 drop-shadow-sm'
                }`}
              >
                Services
              </button>
              <button
                onClick={() => scrollToSection("team")}
                className={`transition-colors duration-200 text-sm font-medium ${
                  navIsScrolled
                    ? 'text-gray-700 hover:text-teal-600'
                    : 'text-white hover:text-cyan-300 drop-shadow-sm'
                }`}
              >
                Team
              </button>
              <button
                onClick={() => scrollToSection("contact")}
                className={`transition-colors duration-200 text-sm font-medium ${
                  navIsScrolled
                    ? 'text-gray-700 hover:text-teal-600'
                    : 'text-white hover:text-cyan-300 drop-shadow-sm'
                }`}
              >
                Contact
              </button>
              {/* Review Dropdown */}
              <div
                className="relative"
                onMouseEnter={() => setReviewOpen(true)}
                onMouseLeave={() => setReviewOpen(false)}
                onFocus={() => setReviewOpen(true)}
                onBlur={() => setReviewOpen(false)}
                tabIndex={-1}
              >
                <button
                  className={`transition-colors duration-200 text-sm font-medium flex items-center gap-1 ${
                    navIsScrolled
                      ? 'text-gray-700 hover:text-teal-600'
                      : 'text-white hover:text-cyan-300 drop-shadow-sm'
                  }`}
                  aria-haspopup="true"
                  aria-expanded={reviewOpen ? "true" : "false"}
                  onClick={() => setReviewOpen((v) => !v)}
                  type="button"
                >
                  Review
                  <svg className="w-3 h-3 ml-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {reviewOpen && (
                  <div className="absolute left-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                    <a href="https://platinumids.com/training/" target="_blank" rel="noopener noreferrer" className="block px-4 py-2 text-gray-700 hover:bg-gray-100 text-sm">Training</a>
                    <a href="https://platinum-secure.us-east-1.reveal11.cloud" target="_blank" rel="noopener noreferrer" className="block px-4 py-2 text-gray-700 hover:bg-gray-100 text-sm">Reveal</a>
                    <a href="https://www.myrelativity.legal" target="_blank" rel="noopener noreferrer" className="block px-4 py-2 text-gray-700 hover:bg-gray-100 text-sm">Relativity Classic</a>
                    <a href="https://my.relativity.one" target="_blank" rel="noopener noreferrer" className="block px-4 py-2 text-gray-700 hover:bg-gray-100 text-sm">Relativity One</a>
                    <a href="https://iconect.platinumids.com" target="_blank" rel="noopener noreferrer" className="block px-4 py-2 text-gray-700 hover:bg-gray-100 text-sm">iConect v12</a>
                  </div>
                )}
              </div>
              <a
                href="https://platinumids.com/blog/"
                target="_blank"
                rel="noopener noreferrer"
                className={`transition-colors duration-200 text-sm font-medium ${
                  navIsScrolled
                    ? 'text-gray-700 hover:text-teal-600'
                    : 'text-white hover:text-cyan-300 drop-shadow-sm'
                }`}
              >
                Blog
              </a>
              <Link
                to={createPageUrl("SendFile")}
                className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-all duration-300 ${
                  navIsScrolled
                    ? 'neumorphic-button text-gray-800'
                    : 'bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 text-white shadow-lg'
                }`}
              >
                <FileUp className="w-4 h-4" />
                Send File
              </Link>
              <Link
                to={createPageUrl("Training")}
                className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-all duration-300 ${
                  navIsScrolled
                    ? 'neumorphic-button text-gray-800'
                    : 'bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 text-white shadow-lg'
                }`}
              >
                <Calendar className="w-4 h-4" />
                Training
              </Link>
            </div>

            {/* Mobile Menu Trigger */}
            <div className="md:hidden">
              <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className={`transition-colors duration-300 ${
                    navIsScrolled ? 'text-gray-700' : 'text-white'
                  }`}>
                    <Menu className="w-6 h-6" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-80 bg-gray-200">
                  <div className="flex flex-col space-y-4 mt-8">
                    <button
                      onClick={() => scrollToSection("services")}
                      className="text-left text-gray-700 hover:text-teal-600 transition-colors duration-200 text-sm font-medium p-2"
                    >
                      Services
                    </button>
                    <button
                      onClick={() => scrollToSection("team")}
                      className="text-left text-gray-700 hover:text-teal-600 transition-colors duration-200 text-sm font-medium p-2"
                    >
                      Team
                    </button>
                    <button
                      onClick={() => scrollToSection("contact")}
                      className="text-left text-gray-700 hover:text-teal-600 transition-colors duration-200 text-sm font-medium p-2"
                    >
                      Contact
                    </button>
                    {/* Review Dropdown (simple expandable) */}
                    <details className="group">
                      <summary className="text-left text-gray-700 hover:text-teal-600 transition-colors duration-200 text-sm font-medium p-2 cursor-pointer select-none outline-none">
                        Review
                        <span className="inline-block ml-1 transition-transform group-open:rotate-180">&#9660;</span>
                      </summary>
                      <div className="ml-4 mt-2 flex flex-col space-y-1">
                        <a href="https://platinumids.com/training/" target="_blank" rel="noopener noreferrer" className="block px-2 py-1 text-gray-700 hover:bg-gray-100 text-sm rounded">Training</a>
                        <a href="https://platinum-secure.us-east-1.reveal11.cloud" target="_blank" rel="noopener noreferrer" className="block px-2 py-1 text-gray-700 hover:bg-gray-100 text-sm rounded">Reveal</a>
                        <a href="https://www.myrelativity.legal" target="_blank" rel="noopener noreferrer" className="block px-2 py-1 text-gray-700 hover:bg-gray-100 text-sm rounded">Relativity Classic</a>
                        <a href="https://my.relativity.one" target="_blank" rel="noopener noreferrer" className="block px-2 py-1 text-gray-700 hover:bg-gray-100 text-sm rounded">Relativity One</a>
                        <a href="https://iconect.platinumids.com" target="_blank" rel="noopener noreferrer" className="block px-2 py-1 text-gray-700 hover:bg-gray-100 text-sm rounded">iConect v12</a>
                      </div>
                    </details>
                    <a
                      href="https://platinumids.com/blog/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-left text-gray-700 hover:text-teal-600 transition-colors duration-200 text-sm font-medium p-2"
                    >
                      Blog
                    </a>
                    <Link
                      to={createPageUrl("SendFile")}
                      className="neumorphic-button px-4 py-3 rounded-lg text-gray-800 text-sm font-medium flex items-center gap-2 w-full"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <FileUp className="w-4 h-4" />
                      Send File
                    </Link>
                    <Link
                      to={createPageUrl("Training")}
                      className="neumorphic-button px-4 py-3 rounded-lg text-gray-800 text-sm font-medium flex items-center gap-2 w-full"
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
