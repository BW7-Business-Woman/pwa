import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import bannerBw7 from "@/assets/Banner - BW7.jpg";
import bannerBw7Second from "@/assets/Banner_2 - BW7.jpg";
import { LoadingImage } from "./LoadingImage";

const banners = [
  { src: bannerBw7, alt: "Banner BW7 Business Woman" },
  { src: bannerBw7Second, alt: "Banner BW7 marketplace" },
];

export function HeroBanner() {
  const [activeBanner, setActiveBanner] = useState(0);

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setActiveBanner((current) => (current + 1) % banners.length);
    }, 4500);

    return () => window.clearInterval(intervalId);
  }, []);

  return (
    <section className="px-4 mt-4 lg:mx-auto lg:max-w-7xl lg:px-6">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative overflow-hidden rounded-3xl bg-gradient-hero shadow-card"
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={banners[activeBanner].src}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.55 }}
          >
            <LoadingImage
              src={banners[activeBanner].src}
              alt={banners[activeBanner].alt}
              width={704}
              height={516}
              wrapperClassName="w-full"
              className="block w-full object-cover lg:max-h-[420px]"
            />
          </motion.div>
        </AnimatePresence>

        <div className="absolute bottom-3 right-4 flex items-center gap-1.5">
          {banners.map((banner, index) => (
            <span
              key={banner.src}
              className={`h-1.5 rounded-full bg-white shadow-sm transition-all ${
                index === activeBanner ? "w-6 opacity-95" : "w-1.5 opacity-55"
              }`}
            />
          ))}
        </div>
      </motion.div>
    </section>
  );
}
