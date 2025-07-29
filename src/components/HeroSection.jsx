import { ChevronDown } from "lucide-react";

export default function HeroSection() {
  const scrollToServices = () => {
    const element = document.getElementById("services");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="min-h-screen flex items-end justify-start pl-16 pr-0 pb-16 relative overflow-hidden">
      <video
        src="/bg.webm"
        autoPlay
        muted
        loop
        className="absolute inset-0 w-full h-full object-cover -z-20"
      />

      <div className="max-w-4xl text-left relative z-20">
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
