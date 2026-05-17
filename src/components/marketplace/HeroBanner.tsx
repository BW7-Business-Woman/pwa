import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import hero from "@/assets/hero-woman.jpg";

export function HeroBanner() {
  return (
    <section className="px-4 mt-4">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative overflow-hidden rounded-3xl bg-gradient-hero shadow-card"
      >
        <div className="absolute -right-10 -top-10 h-44 w-44 rounded-full bg-primary-soft/20 blur-2xl" />
        <div className="absolute -left-8 -bottom-8 h-40 w-40 rounded-full bg-mint/30 blur-2xl" />

        <div className="relative grid grid-cols-5 gap-2 p-5 min-h-[210px]">
          <div className="col-span-3 flex flex-col justify-between">
            <div>
              <span className="inline-block text-[10px] tracking-widest uppercase text-primary-foreground/70 mb-2">
                BW7 · Business Woman
              </span>
              <h1 className="text-primary-foreground text-[19px] leading-[1.2] font-semibold">
                De Norte a Sul, conectamos mulheres e impulsionamos negócios.
              </h1>
              <p className="mt-2 text-[12px] leading-snug text-primary-foreground/75">
                Compre, venda, conecte-se e fortaleça a rede BW7.
              </p>
            </div>
            <button className="mt-4 self-start inline-flex items-center gap-1.5 rounded-full bg-background/15 hover:bg-background/25 backdrop-blur px-3.5 py-2 text-[12px] font-medium text-primary-foreground border border-primary-foreground/20 transition-colors">
              Conheça a comunidade
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
          <div className="col-span-2 relative">
            <div className="absolute inset-0 rounded-2xl overflow-hidden">
              <img
                src={hero}
                alt="Mulher empreendedora BW7"
                width={1024}
                height={1024}
                className="h-full w-full object-cover object-top"
              />
              <div className="absolute inset-0 bg-gradient-to-l from-transparent to-primary/30" />
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
