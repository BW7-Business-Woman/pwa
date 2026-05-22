import { BookOpen, MapPin, Package, ShieldCheck, Star, Store } from "lucide-react";
import { motion } from "framer-motion";
import { products } from "@/data/products";
import { marketplaceStores } from "@/data/stores";
import { useMarketplace } from "@/store/marketplace";
import { LoadingImage } from "./LoadingImage";

type StoreInfo = (typeof marketplaceStores)[number];

function StoreCard({
  store,
  index,
  onOpenProduct,
  onOpenStory,
}: {
  store: StoreInfo;
  index: number;
  onOpenProduct: (id: string) => void;
  onOpenStory: (id: string) => void;
}) {
  const storeProducts = store.productIds
    .map((id) => products.find((product) => product.id === id))
    .filter(Boolean);
  const firstProduct = storeProducts[0];

  return (
    <motion.article
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, type: "spring", stiffness: 260, damping: 28 }}
      className="overflow-hidden rounded-2xl bg-card shadow-soft"
    >
      <div className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex min-w-0 items-start gap-3">
            <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-secondary text-primary">
              <Store className="h-6 w-6" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h2 className="truncate text-base font-bold">{store.name}</h2>
                <span className="shrink-0 rounded-full bg-mint px-2 py-0.5 text-[10px] font-bold text-primary-dark">
                  {store.badge}
                </span>
              </div>
              <p className="mt-0.5 text-xs font-medium text-primary">{store.owner}</p>
              <div className="mt-2 flex items-center gap-1 text-xs text-muted-foreground">
                <MapPin className="h-3.5 w-3.5" />
                {store.location}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-3 gap-2">
          <div className="rounded-2xl bg-secondary px-3 py-2">
            <div className="flex items-center gap-1 text-xs font-bold text-primary">
              <Star className="h-3.5 w-3.5 fill-primary" />
              {store.rating}
            </div>
            <p className="mt-0.5 text-[10px] text-muted-foreground">avaliação</p>
          </div>
          <div className="rounded-2xl bg-secondary px-3 py-2">
            <div className="flex items-center gap-1 text-xs font-bold text-primary">
              <Package className="h-3.5 w-3.5" />
              {store.sales}
            </div>
            <p className="mt-0.5 text-[10px] text-muted-foreground">vendas</p>
          </div>
          <button
            type="button"
            onClick={() => onOpenStory(store.id)}
            className="flex items-center justify-center gap-1 rounded-2xl bg-primary-soft px-3 py-2 text-xs font-bold text-primary"
          >
            <BookOpen className="h-3.5 w-3.5" />
            História
          </button>
        </div>

        <div className="mt-4 flex gap-2 overflow-hidden">
          {storeProducts.map((product) =>
            product ? (
              <button
                type="button"
                key={product.id}
                onClick={() => onOpenProduct(product.id)}
                className="group min-w-0 flex-1 overflow-hidden rounded-2xl bg-secondary text-left"
              >
                <LoadingImage
                  src={product.image}
                  alt={product.name}
                  wrapperClassName="aspect-square w-full"
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  width={180}
                  height={180}
                />
                <div className="p-2">
                  <p className="line-clamp-2 text-[11px] font-semibold leading-tight">
                    {product.name}
                  </p>
                </div>
              </button>
            ) : null,
          )}
        </div>

        {firstProduct && (
          <button
            type="button"
            onClick={() => onOpenStory(store.id)}
            className="mt-4 h-11 w-full rounded-full bg-primary text-sm font-bold text-primary-foreground transition-transform active:scale-[0.98]"
          >
            Ver história da loja
          </button>
        )}
      </div>
    </motion.article>
  );
}

export function StoresPage() {
  const { openProduct, openStoreStory } = useMarketplace();
  const nearbyStores = [...marketplaceStores].sort((a, b) => a.distanceKm - b.distanceKm);

  return (
    <main className="min-h-screen bg-background pb-28">
      <header className="sticky top-0 z-30 bg-background/90 px-4 pb-4 pt-5 backdrop-blur-xl">
        <div className="flex items-center gap-3">
          <div className="grid h-11 w-11 place-items-center rounded-2xl bg-primary-soft text-primary">
            <Store className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight">Lojas</h1>
            <p className="text-xs text-muted-foreground">Vitrines da comunidade BW7</p>
          </div>
        </div>
      </header>

      <section className="px-4 pt-3">
        <div className="rounded-2xl bg-gradient-hero p-4 text-primary-foreground shadow-card">
          <div className="mb-3 flex items-center gap-2">
            <ShieldCheck className="h-5 w-5" />
            <span className="text-sm font-bold">Lojas verificadas</span>
          </div>
          <p className="text-sm leading-6 text-primary-foreground/85">
            Encontre empreendedoras, marcas parceiras e produtos selecionados em uma vitrine só.
          </p>
        </div>
      </section>

      <section className="mt-5 space-y-3 px-4">
        <div className="mb-3 flex items-end justify-between">
          <div>
            <h2 className="text-[17px] font-semibold tracking-tight">Lojas perto de mim</h2>
            <p className="text-xs text-muted-foreground">Vitrines selecionadas na sua região</p>
          </div>
        </div>

        {nearbyStores.map((store, index) => (
          <StoreCard
            key={store.id}
            store={store}
            index={index}
            onOpenProduct={openProduct}
            onOpenStory={openStoreStory}
          />
        ))}
      </section>

      <section className="mt-5 space-y-3 px-4">
        <div>
          <h2 className="text-[17px] font-semibold tracking-tight">Todas as lojas</h2>
          <p className="text-xs text-muted-foreground">Explore vitrines e produtos da rede</p>
        </div>

        {marketplaceStores.map((store, index) => (
          <StoreCard
            key={store.id}
            store={store}
            index={index}
            onOpenProduct={openProduct}
            onOpenStory={openStoreStory}
          />
        ))}
      </section>
    </main>
  );
}
