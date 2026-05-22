import { type ReactNode } from "react";
import { ArrowLeft, BriefcaseBusiness, Clock, MapPin, Search, Star, Store, X } from "lucide-react";
import { useNavigate } from "@tanstack/react-router";
import { products, type Product } from "@/data/products";
import { marketplaceServices, type MarketplaceService } from "@/data/services";
import { marketplaceStores } from "@/data/stores";
import { useMarketplace } from "@/store/marketplace";

const searchResultTypeLabels = {
  all: "todos",
  products: "produtos",
  services: "serviços",
  stores: "lojas",
} as const;

function matchesSearch(value: string, query: string) {
  return value.toLowerCase().includes(query.toLowerCase());
}

function matchesService(service: MarketplaceService, query: string) {
  return [
    service.title,
    service.provider,
    service.category,
    service.description,
    service.location,
  ].some((value) => matchesSearch(value, query));
}

function matchesStore(store: (typeof marketplaceStores)[number], query: string) {
  return [store.name, store.owner, store.location, store.neighborhood, store.badge, store.story].some(
    (value) => matchesSearch(value, query),
  );
}

function ServiceResultCard({ service }: { service: MarketplaceService }) {
  const navigate = useNavigate();
  const { setActiveNav, closeSearch } = useMarketplace();

  return (
    <button
      type="button"
      onClick={() => {
        closeSearch();
        setActiveNav("Serviços");
        navigate({ to: "/servicos" });
      }}
      className="flex h-full flex-col rounded-2xl bg-card p-4 text-left shadow-soft ring-1 ring-border/65 transition-transform hover:-translate-y-0.5"
    >
      <div className="flex items-start justify-between gap-3">
        <span className="grid h-12 w-12 place-items-center rounded-2xl bg-primary-soft text-primary">
          <BriefcaseBusiness className="h-6 w-6" />
        </span>
        <span className="rounded-full bg-mint px-2.5 py-1 text-[11px] font-bold text-primary-dark">
          Serviço
        </span>
      </div>
      <p className="mt-4 text-xs font-bold uppercase text-primary">{service.category}</p>
      <h3 className="mt-1 line-clamp-2 text-base font-black leading-tight">{service.title}</h3>
      <p className="mt-1 text-sm font-semibold text-muted-foreground">por {service.provider}</p>
      <p className="mt-3 line-clamp-3 text-sm leading-6 text-muted-foreground">
        {service.description}
      </p>
      <div className="mt-auto flex items-center justify-between gap-3 pt-4 text-xs">
        <span className="flex items-center gap-1 font-bold text-primary">
          <Star className="h-3.5 w-3.5 fill-primary" />
          {service.rating}
        </span>
        <span className="flex min-w-0 items-center gap-1 text-muted-foreground">
          <MapPin className="h-3.5 w-3.5 shrink-0" />
          <span className="truncate">{service.location}</span>
        </span>
        <span className="font-extrabold text-primary">{service.price}</span>
      </div>
    </button>
  );
}

function StoreResultCard({ store }: { store: (typeof marketplaceStores)[number] }) {
  const { closeSearch, openStoreProfile, openStoreStory, setActiveNav } = useMarketplace();

  return (
    <button
      type="button"
      onClick={() => {
        const isMobileViewport = typeof window !== "undefined" && window.innerWidth < 768;

        closeSearch();
        setActiveNav("Lojas");
        if (isMobileViewport) {
          openStoreStory(store.id);
        } else {
          openStoreProfile(store.id);
        }
      }}
      className="flex h-full flex-col rounded-2xl bg-card p-4 text-left shadow-soft ring-1 ring-border/65 transition-transform hover:-translate-y-0.5"
    >
      <div className="flex items-start justify-between gap-3">
        <span className="grid h-12 w-12 place-items-center rounded-2xl bg-primary-soft text-primary">
          <Store className="h-6 w-6" />
        </span>
        <span className="rounded-full bg-primary-soft px-2.5 py-1 text-[11px] font-bold text-primary">
          Loja
        </span>
      </div>
      <p className="mt-4 text-xs font-bold uppercase text-primary">{store.owner}</p>
      <h3 className="mt-1 line-clamp-2 text-base font-black leading-tight">{store.name}</h3>
      <p className="mt-2 line-clamp-3 text-sm leading-6 text-muted-foreground">{store.story}</p>
      <div className="mt-auto flex items-center justify-between gap-3 pt-4 text-xs">
        <span className="flex items-center gap-1 font-bold text-primary">
          <Star className="h-3.5 w-3.5 fill-primary" />
          {store.rating}
        </span>
        <span className="flex min-w-0 items-center gap-1 text-muted-foreground">
          <MapPin className="h-3.5 w-3.5 shrink-0" />
          <span className="truncate">{store.location}</span>
        </span>
        <span className="font-extrabold text-primary">{store.badge}</span>
      </div>
    </button>
  );
}

function ProductResultCard({ product }: { product: Product }) {
  const { openProduct } = useMarketplace();

  return (
    <button
      type="button"
      onClick={() => openProduct(product.id)}
      className="flex h-full flex-col overflow-hidden rounded-2xl bg-card text-left shadow-soft ring-1 ring-border/65 transition-transform hover:-translate-y-0.5"
    >
      <div className="relative aspect-square bg-secondary/40">
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          width={512}
          height={512}
          className="h-full w-full object-cover"
        />
        {product.tag ? (
          <span className="absolute left-2 top-2 rounded-full bg-primary-soft px-2 py-1 text-[10px] font-semibold text-primary">
            {product.tag}
          </span>
        ) : null}
      </div>
      <div className="flex flex-1 flex-col gap-1 p-3">
        <h3 className="line-clamp-2 min-h-[2.4em] text-[13px] font-medium leading-snug">
          {product.name}
        </h3>
        <div className="mt-auto flex items-baseline gap-1.5 pt-1">
          <span className="text-[15px] font-semibold text-primary">
            R$ {product.price.toFixed(2).replace(".", ",")}
          </span>
          {product.oldPrice ? (
            <span className="text-[11px] text-muted-foreground line-through">
              R$ {product.oldPrice.toFixed(2).replace(".", ",")}
            </span>
          ) : null}
        </div>
      </div>
    </button>
  );
}

function ResultsSection({
  title,
  count,
  children,
}: {
  title: string;
  count: number;
  children: ReactNode;
}) {
  if (count === 0) return null;

  return (
    <section className="mt-6 first:mt-0">
      <div className="mb-3 flex items-end justify-between gap-3">
        <h2 className="text-[17px] font-semibold tracking-tight lg:text-xl">{title}</h2>
        <span className="rounded-full bg-secondary px-3 py-1 text-xs font-bold text-muted-foreground">
          {count}
        </span>
      </div>
      {children}
    </section>
  );
}

export function SearchPage() {
  const {
    search,
    searchResultType,
    confirmedSearch,
    searchHistory,
    searchView,
    setSearch,
    submitSearch,
    closeSearch,
  } = useMarketplace();
  const isResults = searchView === "results";
  const query = isResults ? confirmedSearch : search;
  const filteredProducts = products.filter((product) => matchesSearch(product.name, query));
  const filteredServices = marketplaceServices.filter((service) => matchesService(service, query));
  const filteredStores = marketplaceStores.filter((store) => matchesStore(store, query));
  const visibleProductResults =
    searchResultType === "all" || searchResultType === "products" ? filteredProducts : [];
  const visibleServiceResults =
    searchResultType === "all" || searchResultType === "services" ? filteredServices : [];
  const visibleStoreResults =
    searchResultType === "all" || searchResultType === "stores" ? filteredStores : [];
  const totalResults =
    visibleProductResults.length + visibleServiceResults.length + visibleStoreResults.length;
  const recommendedProducts = products.slice(0, 10);

  function handleSubmit(query?: string) {
    submitSearch(query);
  }

  return (
    <main className="min-h-screen bg-background pb-8">
      <header className="sticky top-0 z-30 bg-background/90 px-4 pb-3 pt-4 backdrop-blur-xl lg:hidden">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={closeSearch}
            aria-label="Voltar para o início"
            className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-card text-foreground shadow-soft transition-transform active:scale-95"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>

          <form
            className="flex h-11 min-w-0 flex-1 items-center gap-2 rounded-2xl bg-card px-4 shadow-soft"
            onSubmit={(event) => {
              event.preventDefault();
              handleSubmit();
            }}
          >
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Buscar produtos e serviços"
              className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch("")}
                aria-label="Limpar busca"
                className="grid h-7 w-7 place-items-center rounded-full text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            )}
            <button
              type="submit"
              aria-label="Confirmar busca"
              className="grid h-7 w-7 place-items-center rounded-full bg-primary text-primary-foreground transition-transform active:scale-95"
            >
              <Search className="h-4 w-4" />
            </button>
          </form>
        </div>
      </header>

      {isResults ? (
        <section className="px-4 pt-5 lg:mx-auto lg:max-w-7xl lg:px-6 lg:pt-8">
          <div className="mb-4 flex items-end justify-between gap-3 lg:mb-6">
            <div>
              <h1 className="text-[18px] font-semibold tracking-tight lg:text-2xl">
                Resultado da busca
              </h1>
            </div>
            <button
              type="button"
              onClick={closeSearch}
              className="h-9 rounded-full bg-primary-soft px-4 text-xs font-semibold text-primary transition-colors hover:bg-primary hover:text-primary-foreground lg:h-10 lg:px-5 lg:text-sm"
            >
              Início
            </button>
          </div>

          {totalResults === 0 ? (
            <>
              <section>
                <div className="mb-4">
                  <h2 className="text-[17px] font-semibold tracking-tight lg:text-xl">
                    Produtos que voce pode gostar
                  </h2>
                  <p className="text-xs text-muted-foreground lg:mt-1 lg:text-sm">
                    Veja algumas opções que podem combinar com você
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-5 xl:grid-cols-5">
                  {recommendedProducts.map((product) => (
                    <div key={product.id}>
                      <ProductResultCard product={product} />
                    </div>
                  ))}
                </div>
              </section>
            </>
          ) : (
            <div>
              <ResultsSection title="Produtos" count={visibleProductResults.length}>
                <div className="grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-5 xl:grid-cols-5">
                  {visibleProductResults.map((product) => (
                    <div key={product.id}>
                      <ProductResultCard product={product} />
                    </div>
                  ))}
                </div>
              </ResultsSection>

              <ResultsSection title="Serviços" count={visibleServiceResults.length}>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 lg:gap-5 xl:grid-cols-4">
                  {visibleServiceResults.map((service) => (
                    <div key={service.title}>
                      <ServiceResultCard service={service} />
                    </div>
                  ))}
                </div>
              </ResultsSection>

              <ResultsSection title="Lojas" count={visibleStoreResults.length}>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 lg:gap-5 xl:grid-cols-4">
                  {visibleStoreResults.map((store) => (
                    <div key={store.id}>
                      <StoreResultCard store={store} />
                    </div>
                  ))}
                </div>
              </ResultsSection>
            </div>
          )}
        </section>
      ) : (
        <section className="px-4 pt-5 lg:mx-auto lg:max-w-4xl lg:px-6 lg:pt-8">
          <h1 className="mb-3 text-[18px] font-semibold tracking-tight lg:text-2xl">
            Histórico de busca
          </h1>
          {searchHistory.length > 0 ? (
            <div className="grid gap-2">
              {searchHistory.map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => handleSubmit(item)}
                  className="flex h-12 items-center gap-3 rounded-2xl bg-card px-4 text-left text-sm font-medium shadow-soft transition-colors hover:bg-secondary"
                >
                  <Clock className="h-4 w-4 text-primary" />
                  <span className="min-w-0 flex-1 truncate">{item}</span>
                  <Search className="h-4 w-4 text-muted-foreground" />
                </button>
              ))}
            </div>
          ) : (
            <div className="rounded-2xl bg-card p-8 text-center text-sm text-muted-foreground shadow-soft">
              Suas buscas recentes aparecerão aqui.
            </div>
          )}
        </section>
      )}
    </main>
  );
}
