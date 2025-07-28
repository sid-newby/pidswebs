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
      <div className="max-w-4xl mx-auto text-center">
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
          <p className="text-xl text-gray-700 leading-relaxed max-w-3xl mx-auto">
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
    </section>
  );
}
