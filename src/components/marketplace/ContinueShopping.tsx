import { ArrowRight, ShoppingBag } from "lucide-react";
import { motion } from "framer-motion";
import { products } from "@/data/products";
import { useMarketplace } from "@/store/marketplace";
import { LoadingImage } from "./LoadingImage";

function formatPrice(value: number) {
  return `R$ ${value.toFixed(2).replace(".", ",")}`;
}

export function ContinueShopping() {
  const { continueShoppingProductId, openProduct } = useMarketplace();
  const product = products.find((item) => item.id === continueShoppingProductId);

  if (!product) return null;

  return (
    <motion.section
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 260, damping: 28 }}
      className="mt-5 px-4 lg:mx-auto lg:max-w-7xl lg:px-6"
    >
      <div className="mb-3 flex items-center justify-between">
        <div>
          <h2 className="text-[17px] font-semibold tracking-tight">Continue comprando</h2>
          <p className="text-xs text-muted-foreground">Volte para o produto que você abriu</p>
        </div>
      </div>

      <button
        type="button"
        onClick={() => openProduct(product.id)}
        className="flex w-full items-center gap-3 rounded-2xl bg-card p-3 text-left shadow-soft transition-transform active:scale-[0.99] lg:max-w-2xl"
      >
        <LoadingImage
          src={product.image}
          alt={product.name}
          wrapperClassName="h-20 w-20 shrink-0 rounded-2xl"
          className="h-full w-full object-cover"
          width={160}
          height={160}
        />
        <div className="min-w-0 flex-1">
          <div className="mb-1 flex items-center gap-1.5 text-[11px] font-semibold uppercase text-primary">
            <ShoppingBag className="h-3.5 w-3.5" />
            {product.category}
          </div>
          <h3 className="line-clamp-2 text-sm font-semibold leading-snug">{product.name}</h3>
          <div className="mt-1 flex items-baseline gap-1.5">
            <span className="text-[15px] font-bold text-primary">
              {formatPrice(product.price)}
            </span>
            {product.oldPrice && (
              <span className="text-[11px] text-muted-foreground line-through">
                {formatPrice(product.oldPrice)}
              </span>
            )}
          </div>
        </div>
        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-primary-soft text-primary">
          <ArrowRight className="h-4 w-4" />
        </span>
      </button>
    </motion.section>
  );
}
