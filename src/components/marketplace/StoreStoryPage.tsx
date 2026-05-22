import {
  ArrowLeft,
  MapPin,
  Navigation,
  Package,
  Phone,
  ShieldCheck,
  Star,
  Store,
} from "lucide-react";
import { motion } from "framer-motion";
import { products, type Product } from "@/data/products";
import { marketplaceStores } from "@/data/stores";
import { useMarketplace } from "@/store/marketplace";
import { LoadingImage } from "./LoadingImage";

function formatPrice(value: number) {
  return `R$ ${value.toFixed(2).replace(".", ",")}`;
}

function getStoreProducts(productIds: string[]) {
  return productIds
    .map((id) => products.find((product) => product.id === id))
    .filter((product): product is Product => Boolean(product));
}

export function StoreStoryPage({ storeId }: { storeId: string }) {
  const { closeStoreStory, openProduct } = useMarketplace();
  const store = marketplaceStores.find((item) => item.id === storeId);

  if (!store) {
    return (
      <main className="min-h-screen bg-background px-4 py-5">
        <button
          type="button"
          onClick={closeStoreStory}
          className="grid h-11 w-11 place-items-center rounded-2xl bg-card shadow-soft"
          aria-label="Voltar"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
      </main>
    );
  }

  const storeProducts = getStoreProducts(store.productIds);
  const coverProduct = storeProducts[0];
  const openContact = () => {
    const message = encodeURIComponent(`Olá, tenho interesse nos produtos da loja ${store.name}.`);
    window.open(`https://wa.me/?text=${message}`, "_blank", "noopener,noreferrer");
  };
  const openMaps = () => {
    const query = encodeURIComponent(`${store.name} ${store.location}`);
    window.open(`https://www.google.com/maps/search/?api=1&query=${query}`, "_blank", "noopener,noreferrer");
  };

  return (
    <main className="min-h-screen bg-background pb-28">
      <header className="sticky top-0 z-30 flex items-center justify-between bg-background/90 px-4 py-4 backdrop-blur-xl">
        <button
          type="button"
          onClick={closeStoreStory}
          aria-label="Voltar"
          className="grid h-11 w-11 place-items-center rounded-2xl bg-card text-foreground shadow-soft transition-transform active:scale-95"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <span className="rounded-full bg-primary-soft px-3 py-1 text-xs font-bold text-primary">
          História da loja
        </span>
      </header>

      <motion.section
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 260, damping: 28 }}
      >
        <div className="relative mx-4 overflow-hidden rounded-[28px] bg-primary-dark shadow-card">
          {coverProduct && (
            <LoadingImage
              src={coverProduct.image}
              alt={store.name}
              wrapperClassName="h-56 w-full bg-primary-dark"
              className="h-full w-full object-cover opacity-80"
              width={720}
              height={420}
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-primary-dark via-primary-dark/45 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-4 text-primary-foreground">
            <div className="mb-3 flex items-center gap-3">
              <div className="grid h-12 w-12 place-items-center rounded-2xl bg-primary-foreground/15 backdrop-blur">
                <Store className="h-6 w-6" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <h1 className="truncate text-xl font-bold">{store.name}</h1>
                  <span className="shrink-0 rounded-full bg-mint px-2 py-0.5 text-[10px] font-bold text-primary-dark">
                    {store.badge}
                  </span>
                </div>
                <p className="mt-1 text-xs font-semibold text-primary-foreground/80">
                  {store.owner}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1 text-xs text-primary-foreground/75">
              <MapPin className="h-3.5 w-3.5" />
              {store.location}
            </div>
          </div>
        </div>

        <div className="px-4 pt-5">
          <div className="grid grid-cols-3 gap-2">
            <div className="rounded-2xl bg-card px-3 py-3 shadow-soft">
              <div className="flex items-center gap-1 text-xs font-bold text-primary">
                <Star className="h-3.5 w-3.5 fill-primary" />
                {store.rating}
              </div>
              <p className="mt-0.5 text-[10px] text-muted-foreground">avaliação</p>
            </div>
            <div className="rounded-2xl bg-card px-3 py-3 shadow-soft">
              <div className="flex items-center gap-1 text-xs font-bold text-primary">
                <Package className="h-3.5 w-3.5" />
                {store.sales}
              </div>
              <p className="mt-0.5 text-[10px] text-muted-foreground">vendas</p>
            </div>
            <div className="rounded-2xl bg-card px-3 py-3 shadow-soft">
              <div className="flex items-center gap-1 text-xs font-bold text-primary">
                <ShieldCheck className="h-3.5 w-3.5" />
                BW7
              </div>
              <p className="mt-0.5 text-[10px] text-muted-foreground">verificada</p>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={openMaps}
              className="flex h-12 items-center justify-center gap-2 rounded-full bg-primary text-sm font-bold text-primary-foreground shadow-soft transition-transform active:scale-[0.98]"
            >
              <Navigation className="h-4 w-4" />
              Ver no mapa
            </button>
            <button
              type="button"
              onClick={openContact}
              className="flex h-12 items-center justify-center gap-2 rounded-full bg-primary-soft text-sm font-bold text-primary shadow-soft transition-transform active:scale-[0.98]"
            >
              <Phone className="h-4 w-4" />
              Contato
            </button>
          </div>

          <section className="mt-5 rounded-2xl bg-card p-4 shadow-soft">
            <h2 className="text-base font-bold">Sobre a loja</h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">{store.story}</p>
          </section>

          <section className="mt-6">
            <div className="mb-3">
              <h2 className="text-[17px] font-semibold tracking-tight">Produtos da loja</h2>
              <p className="text-xs text-muted-foreground">Escolhas disponíveis nessa vitrine</p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {storeProducts.map((product) => (
                <button
                  type="button"
                  key={product.id}
                  onClick={() => openProduct(product.id)}
                  className="overflow-hidden rounded-2xl bg-card text-left shadow-soft transition-transform active:scale-[0.98]"
                >
                  <LoadingImage
                    src={product.image}
                    alt={product.name}
                    wrapperClassName="aspect-square w-full"
                    className="h-full w-full object-cover"
                    width={320}
                    height={320}
                  />
                  <div className="p-3">
                    <p className="line-clamp-2 min-h-[2.4em] text-xs font-semibold leading-snug">
                      {product.name}
                    </p>
                    <p className="mt-1 text-sm font-bold text-primary">
                      {formatPrice(product.price)}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </section>
        </div>
      </motion.section>
    </main>
  );
}
