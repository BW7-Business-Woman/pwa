import { motion } from "framer-motion";
import { categories } from "@/data/products";
import { useMarketplace } from "@/store/marketplace";

export function CategoryTabs() {
  const { activeCategory, setCategory } = useMarketplace();
  return (
    <nav className="px-4 mt-1">
      <div className="flex gap-2 overflow-x-auto scrollbar-hide -mx-1 px-1 py-1">
        {categories.map((c) => {
          const active = c === activeCategory;
          return (
            <button
              key={c}
              onClick={() => setCategory(c)}
              className="relative shrink-0 px-5 h-10 rounded-full text-sm font-medium transition-colors"
            >
              {active && (
                <motion.span
                  layoutId="category-pill"
                  className="absolute inset-0 rounded-full bg-primary shadow-soft"
                  transition={{ type: "spring", stiffness: 400, damping: 32 }}
                />
              )}
              <span className={`relative ${active ? "text-primary-foreground" : "text-primary/80"}`}>
                {c}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
