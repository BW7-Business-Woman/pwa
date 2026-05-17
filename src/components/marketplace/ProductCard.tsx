import { Heart } from "lucide-react";
import { motion } from "framer-motion";
import type { Product } from "@/data/products";
import { useMarketplace } from "@/store/marketplace";

const tagStyles: Record<string, string> = {
  Novo: "bg-mint/90 text-primary-dark",
  "Mais vendido": "bg-primary text-primary-foreground",
  Oferta: "bg-primary-soft text-primary",
};

export function ProductCard({ product }: { product: Product }) {
  const { favorites, toggleFavorite, addToCart } = useMarketplace();
  const fav = favorites.has(product.id);
  return (
    <motion.article
      whileTap={{ scale: 0.97 }}
      whileHover={{ y: -2 }}
      transition={{ type: "spring", stiffness: 300, damping: 22 }}
      className="group bg-card rounded-2xl shadow-soft overflow-hidden flex flex-col"
    >
      <div className="relative aspect-square bg-secondary/40">
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          width={512}
          height={512}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {product.tag && (
          <span className={`absolute left-2 top-2 text-[10px] font-semibold px-2 py-1 rounded-full ${tagStyles[product.tag]}`}>
            {product.tag}
          </span>
        )}
        <button
          aria-label="Favoritar"
          onClick={() => toggleFavorite(product.id)}
          className="absolute right-2 top-2 h-8 w-8 grid place-items-center rounded-full bg-card/90 backdrop-blur shadow-soft transition-transform active:scale-90"
        >
          <Heart
            className={`h-4 w-4 transition-colors ${fav ? "fill-primary text-primary" : "text-foreground/60"}`}
          />
        </button>
      </div>
      <div className="p-3 flex flex-col gap-1">
        <h3 className="text-[13px] font-medium leading-snug line-clamp-2 min-h-[2.4em]">
          {product.name}
        </h3>
        <div className="flex items-baseline gap-1.5 mt-0.5">
          <span className="text-[15px] font-semibold text-primary">
            R$ {product.price.toFixed(2).replace(".", ",")}
          </span>
          {product.oldPrice && (
            <span className="text-[11px] text-muted-foreground line-through">
              R$ {product.oldPrice.toFixed(2).replace(".", ",")}
            </span>
          )}
        </div>
        <button
          onClick={() => addToCart(product.id)}
          className="mt-2 h-8 rounded-full bg-primary-soft text-primary text-[12px] font-medium hover:bg-primary hover:text-primary-foreground transition-colors"
        >
          Adicionar
        </button>
      </div>
    </motion.article>
  );
}
