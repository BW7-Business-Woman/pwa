import { motion } from "framer-motion";
import { products } from "@/data/products";
import { useMarketplace } from "@/store/marketplace";
import { ProductCard } from "./ProductCard";

export function ProductGrid() {
  const { activeCategory, search } = useMarketplace();
  const filtered = products.filter((p) => {
    const matchCat = activeCategory === "Produtos" ? true : p.category === activeCategory;
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <section className="px-4 mt-6">
      <div className="flex items-end justify-between mb-3">
        <div>
          <h2 className="text-[17px] font-semibold tracking-tight">Produtos em destaque</h2>
          <p className="text-xs text-muted-foreground">Selecionados pra você</p>
        </div>
        <button className="text-xs font-medium text-primary">Ver tudo</button>
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-2xl bg-card shadow-soft p-8 text-center text-sm text-muted-foreground">
          Nenhum produto encontrado.
        </div>
      ) : (
        <motion.div
          layout
          className="grid grid-cols-2 gap-3"
        >
          {filtered.map((p, i) => (
            <motion.div
              key={p.id}
              layout
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
            >
              <ProductCard product={p} />
            </motion.div>
          ))}
        </motion.div>
      )}
    </section>
  );
}
