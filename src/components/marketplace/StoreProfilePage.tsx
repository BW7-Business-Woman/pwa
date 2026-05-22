import { MapPin, Package, ShieldCheck, Star, Store } from "lucide-react";
import { motion } from "framer-motion";
import { products } from "@/data/products";
import { marketplaceStores } from "@/data/stores";
import { useMarketplace } from "@/store/marketplace";
import { HeaderSearch } from "./HeaderSearch";
import { LoadingImage } from "./LoadingImage";
import { ProductCard } from "./ProductCard";

type StoreInfo = (typeof marketplaceStores)[number];

function StoreMetric({ label, value, icon: Icon }: { label: string; value: string; icon: typeof Star }) {
  return (
    <div className="rounded-2xl bg-card px-4 py-3 shadow-soft">
      <div className="flex items-center gap-2 text-sm font-bold text-primary">
        <Icon className="h-4 w-4" />
        {value}
      </div>
      <p className="mt-1 text-xs text-muted-foreground">{label}</p>
    </div>
  );
}

export function StoreProfilePage({ store }: { store: StoreInfo }) {
  const { openProduct } = useMarketplace();
  const storeProducts = store.productIds
    .map((id) => products.find((product) => product.id === id))
    .filter((product): product is (typeof products)[number] => Boolean(product));
  const featuredProduct = storeProducts[0];

  return (
    <main className="min-h-screen bg-background pb-16">
      <div className="hidden lg:block">
        <HeaderSearch />
      </div>

      <header className="sticky top-0 z-30 flex items-center gap-3 bg-background/90 px-4 py-4 backdrop-blur-xl lg:hidden">
        <div>
          <h1 className="text-lg font-bold">{store.name}</h1>
          <p className="text-xs text-muted-foreground">Perfil da loja</p>
        </div>
      </header>

      <section className="mx-auto max-w-7xl px-4 py-5 lg:px-6 lg:py-8">
        <motion.section
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 260, damping: 28 }}
          className="overflow-hidden rounded-[28px] bg-card shadow-card"
        >
          <div className="bg-gradient-hero px-5 py-7 text-primary-foreground lg:px-8 lg:py-10">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
              <div className="flex min-w-0 items-start gap-4">
                <div className="grid h-20 w-20 shrink-0 place-items-center rounded-3xl bg-white/15 text-white ring-1 ring-white/20">
                  <Store className="h-10 w-10" />
                </div>
                <div className="min-w-0">
                  <span className="inline-flex rounded-full bg-mint px-3 py-1 text-xs font-bold text-primary-dark">
                    {store.badge}
                  </span>
                  <h1 className="mt-3 text-3xl font-extrabold tracking-tight lg:text-5xl">
                    {store.name}
                  </h1>
                  <p className="mt-2 text-sm font-semibold text-primary-foreground/90 lg:text-base">
                    {store.owner}
                  </p>
                  <div className="mt-3 flex items-center gap-2 text-sm text-primary-foreground/85">
                    <MapPin className="h-4 w-4" />
                    {store.neighborhood}, {store.location}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 lg:w-[420px]">
                <div className="rounded-2xl bg-white/12 px-3 py-3 text-center">
                  <div className="text-lg font-black">{store.rating}</div>
                  <div className="text-[11px] text-primary-foreground/75">avaliação</div>
                </div>
                <div className="rounded-2xl bg-white/12 px-3 py-3 text-center">
                  <div className="text-lg font-black">{store.sales}</div>
                  <div className="text-[11px] text-primary-foreground/75">vendas</div>
                </div>
                <div className="rounded-2xl bg-white/12 px-3 py-3 text-center">
                  <div className="text-lg font-black">{storeProducts.length}</div>
                  <div className="text-[11px] text-primary-foreground/75">produtos</div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid gap-6 p-5 lg:grid-cols-[1fr_360px] lg:p-8">
            <div>
              <h2 className="text-xl font-bold">Sobre a loja</h2>
              <p className="mt-3 max-w-3xl text-sm leading-7 text-muted-foreground lg:text-base">
                {store.story}
              </p>

              {featuredProduct && (
                <button
                  type="button"
                  onClick={() => openProduct(featuredProduct.id)}
                  className="mt-6 flex w-full gap-4 rounded-2xl bg-secondary p-3 text-left transition-colors hover:bg-primary-soft lg:max-w-xl"
                >
                  <LoadingImage
                    src={featuredProduct.image}
                    alt={featuredProduct.name}
                    wrapperClassName="h-24 w-24 shrink-0 overflow-hidden rounded-2xl bg-card"
                    className="h-full w-full object-cover"
                    width={192}
                    height={192}
                  />
                  <span className="min-w-0 py-1">
                    <span className="block text-xs font-bold uppercase text-primary">
                      Produto em destaque
                    </span>
                    <span className="mt-1 block line-clamp-2 font-bold">
                      {featuredProduct.name}
                    </span>
                    <span className="mt-2 block text-sm font-extrabold text-primary">
                      R$ {featuredProduct.price.toFixed(2).replace(".", ",")}
                    </span>
                  </span>
                </button>
              )}
            </div>

            <aside className="grid gap-3 self-start">
              <StoreMetric label="Avaliação média" value={store.rating} icon={Star} />
              <StoreMetric label="Pedidos vendidos" value={store.sales} icon={Package} />
              <div className="rounded-2xl bg-primary-soft p-4 text-primary">
                <div className="flex items-center gap-2 text-sm font-bold">
                  <ShieldCheck className="h-5 w-5" />
                  Loja verificada BW7
                </div>
                <p className="mt-2 text-xs leading-5 text-primary/80">
                  Perfil com curadoria da comunidade, produtos mockados e fluxo seguro de compra.
                </p>
              </div>
            </aside>
          </div>
        </motion.section>

        <section className="mt-8">
          <div className="mb-4 flex items-end justify-between gap-3">
            <div>
              <h2 className="text-xl font-bold tracking-tight lg:text-2xl">Produtos da loja</h2>
              <p className="text-sm text-muted-foreground">Vitrine de {store.name}</p>
            </div>
          </div>

          <motion.div layout className="grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-5 xl:grid-cols-5">
            {storeProducts.map((product, index) => (
              <motion.div
                key={product.id}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.04 }}
              >
                <ProductCard product={product} />
              </motion.div>
            ))}
          </motion.div>
        </section>
      </section>
    </main>
  );
}
