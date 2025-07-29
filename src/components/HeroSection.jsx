import { ChevronDown } from "lucide-react";
import { useEffect, useRef } from "react";

export default function HeroSection() {
  const starsRef = useRef(null);

  const scrollToServices = () => {
    const element = document.getElementById("services");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  useEffect(() => {
    const createStar = () => {
      if (!starsRef.current) return;
      
      const star = document.createElement('div');
      star.className = 'star';
      star.style.left = Math.random() * 100 + '%';
      star.style.animationDuration = (Math.random() * 3 + 2) + 's';
      star.style.opacity = Math.random() * 0.8 + 0.2;
      starsRef.current.appendChild(star);

      setTimeout(() => {
        if (star.parentNode) {
          star.remove();
        }
      }, 5000);
    };

    const interval = setInterval(createStar, 150);
    
    // Create initial stars
    for (let i = 0; i < 60; i++) {
      setTimeout(createStar, i * 80);
    }

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="min-h-screen bg-gradient-to-b from-indigo-900 via-purple-900 to-slate-900 flex items-center justify-center px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Starry sky effect */}
      <div ref={starsRef} className="absolute inset-0 pointer-events-none z-0">
        <style dangerouslySetInnerHTML={{
          __html: `
            .star {
              position: absolute;
              background: white;
              border-radius: 50%;
              animation: twinkle linear infinite;
            }
            
            .star:nth-child(4n) {
              width: 1px;
              height: 1px;
              opacity: 0.6;
            }
            
            .star:nth-child(4n+1) {
              width: 2px;
              height: 2px;
              box-shadow: 0 0 3px rgba(255,255,255,0.5);
            }
            
            .star:nth-child(4n+2) {
              width: 1.5px;
              height: 1.5px;
              background: #ffd700;
              box-shadow: 0 0 4px rgba(255,215,0,0.6);
            }
            
            .star:nth-child(4n+3) {
              width: 2.5px;
              height: 2.5px;
              background: #87ceeb;
              box-shadow: 0 0 5px rgba(135,206,235,0.4);
            }
            
            @keyframes twinkle {
              0% {
                transform: translateY(100vh) rotate(0deg);
                opacity: 0;
              }
              10% {
                opacity: 1;
              }
              50% {
                opacity: 0.3;
              }
              90% {
                opacity: 1;
              }
              100% {
                transform: translateY(-20px) rotate(180deg);
                opacity: 0;
              }
            }
          `
        }} />
      </div>

      <div className="max-w-4xl mx-auto text-center relative z-10">
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-light text-white leading-tight mb-8 drop-shadow-lg">
          All truths are easy to understand once they are discovered. 
          <span className="block mt-4 text-cyan-400 font-medium">
            The point is to discover them.
          </span>
        </h1>
        
        <div className="mb-8">
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4 drop-shadow-md">
            We Are Platinum
          </h2>
          <p className="text-xl text-gray-200 leading-relaxed max-w-3xl mx-auto drop-shadow-sm">
            Leveling the playing field for firms of all sizes through innovative technology, 
            comprehensive eDiscovery services, and data-driven insights.
          </p>
        </div>

        <button
          onClick={scrollToServices}
          className="bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 px-8 py-4 rounded-xl text-white font-semibold text-lg inline-flex items-center gap-3 transition-all duration-300 shadow-lg hover:shadow-xl"
        >
          Discover Our Services
          <ChevronDown className="w-5 h-5" />
        </button>
      </div>
    </section>
  );
}
