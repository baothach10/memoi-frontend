import Footer from "@/components/ui/organisms/Footer";
import React, { forwardRef } from "react";

const GridSectionWithFooter = forwardRef<HTMLElement>((props, ref) => {
  return (
    <section
      ref={ref}
      className="h-screen w-full snap-start relative overflow-hidden flex flex-col"
    >
      <div className="flex-1 bg-linear-to-br from-orange-500 to-pink-600 flex items-center justify-center p-8">
        <div className="max-w-7xl w-full">
          <h2 className="text-4xl md:text-5xl font-bold text-white text-center mb-8">
            Our Services
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="bg-white/20 backdrop-blur-sm rounded-2xl p-6 border-2 border-white/30 hover:bg-white/30 transition-all transform hover:scale-105"
              >
                <div className="w-12 h-12 bg-white/30 rounded-full flex items-center justify-center mb-4">
                  <span className="text-2xl text-white">{item}</span>
                </div>
                <h3 className="text-xl font-bold text-white mb-3">
                  Service {item}
                </h3>
                <p className="text-white/90 text-base leading-relaxed">
                  Discover amazing features that will transform the way you work
                  and achieve your goals.
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </section>
  );
});

GridSectionWithFooter.displayName = "GridSectionWithFooter";

export default GridSectionWithFooter;
