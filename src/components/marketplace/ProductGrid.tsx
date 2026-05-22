import { products } from "@/data/products";
import { useMarketplace } from "@/store/marketplace";
import { Heart } from "lucide-react";

const tagStyles: Record<string, string> = {
  Novo: "bg-mint/90 text-primary-dark",
  "Mais vendido": "bg-primary text-primary-foreground",
  Oferta: "bg-primary-soft text-primary",
};

export function ProductGrid({ showHeader = true }: { showHeader?: boolean }) {
  const {
    activeCategory,
    search,
    confirmedSearch,
    searchView,
    favorites,
    toggleFavorite,
    addToCart,
    openProduct,
  } = useMarketplace();
  const effectiveSearch = searchView === "results" ? confirmedSearch : search;
  const filtered = products.filter((p) => {
    const matchCat = activeCategory === "Produtos" ? true : p.category === activeCategory;
    const matchSearch = p.name.toLowerCase().includes(effectiveSearch.toLowerCase());
    return matchCat && matchSearch;
  });
  const showSearchRecommendations = searchView === "results" && filtered.length === 0;
  const visibleProducts = showSearchRecommendations ? products.slice(0, 10) : filtered;

  return (
    <section className="px-4 mt-6 lg:mx-auto lg:max-w-7xl lg:px-6">
      {showHeader ? (
      <div className="flex items-end justify-between mb-3">
        <div>
          <h2 className="text-[17px] font-semibold tracking-tight">Produtos em destaque</h2>
          <p className="text-xs text-muted-foreground">Selecionados pra você</p>
        </div>
        <button className="text-xs font-medium text-primary">Ver tudo</button>
      </div>
      ) : null}

      {showSearchRecommendations ? (
        <div className="mb-3">
          <h2 className="text-[17px] font-semibold tracking-tight">Produtos que voce pode gostar</h2>
        </div>
      ) : null}

      {visibleProducts.length === 0 ? (
        <div className="rounded-2xl bg-card shadow-soft p-8 text-center text-sm text-muted-foreground">
          Nenhum produto encontrado.
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-5 xl:grid-cols-5">
          {visibleProducts.map((p) => (
            <div
              key={p.id}
              role="button"
              tabIndex={0}
              onClick={() => openProduct(p.id)}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  openProduct(p.id);
                }
              }}
              className="group flex cursor-pointer flex-col overflow-hidden rounded-2xl bg-card shadow-soft outline-none transition-transform hover:-translate-y-0.5 focus-visible:ring-2 focus-visible:ring-primary"
            >
              <div className="relative aspect-square bg-secondary/40">
                <img
                  src={p.image}
                  alt={p.name}
                  loading="lazy"
                  width={512}
                  height={512}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                {p.tag && (
                  <span className={`absolute left-2 top-2 rounded-full px-2 py-1 text-[10px] font-semibold ${tagStyles[p.tag]}`}>
                    {p.tag}
                  </span>
                )}
                <button
                  type="button"
                  aria-label="Favoritar"
                  onClick={(event) => {
                    event.stopPropagation();
                    toggleFavorite(p.id);
                  }}
                  className="absolute right-2 top-2 grid h-8 w-8 place-items-center rounded-full bg-card/90 shadow-soft backdrop-blur transition-transform active:scale-90"
                >
                  <Heart
                    className={`h-4 w-4 transition-colors ${
                      favorites.has(p.id) ? "fill-primary text-primary" : "text-foreground/60"
                    }`}
                  />
                </button>
              </div>
              <div className="flex flex-col gap-1 p-3">
                <h3 className="line-clamp-2 min-h-[2.4em] text-[13px] font-medium leading-snug">
                  {p.name}
                </h3>
                <div className="mt-0.5 flex items-baseline gap-1.5">
                  <span className="text-[15px] font-semibold text-primary">
                    R$ {p.price.toFixed(2).replace(".", ",")}
                  </span>
                  {p.oldPrice && (
                    <span className="text-[11px] text-muted-foreground line-through">
                      R$ {p.oldPrice.toFixed(2).replace(".", ",")}
                    </span>
                  )}
                </div>
                <button
                  type="button"
                  onClick={(event) => {
                    event.stopPropagation();
                    addToCart(p.id);
                  }}
                  className="mt-2 h-8 rounded-full bg-primary-soft text-[12px] font-medium text-primary transition-colors hover:bg-primary hover:text-primary-foreground"
                >
                  Adicionar
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
