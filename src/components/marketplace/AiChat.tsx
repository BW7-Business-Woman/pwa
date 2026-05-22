import { lazy, Suspense, useState } from "react";
import { MessageCircle, Sparkle } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { products, type Product } from "@/data/products";
import { marketplaceStores } from "@/data/stores";
import { lazyImportWithRetry } from "@/lib/lazyImportWithRetry";
import { useMarketplace } from "@/store/marketplace";

const LazyChatSheet = lazy(() =>
  lazyImportWithRetry(
    () =>
      import("@/components/marketplace/AiChatSheet").then((module) => ({
        default: module.ChatSheet,
      })),
    "ai-chat-sheet",
  ),
);

export type ChatScreenContext = {
  screen: string;
  activeNav?: string;
  activeCategory?: string;
  search?: {
    view: string;
    query: string;
    results: string[];
  };
  product?: {
    id: string;
    name: string;
    price: string;
    category: string;
    tag?: string;
    storeName?: string;
  };
  store?: {
    id: string;
    name: string;
    owner: string;
    location: string;
    rating: string;
    sales: string;
    badge: string;
    products: string[];
  };
  cart?: {
    count: number;
    products: string[];
  };
};

export function formatPrice(value: number) {
  return `R$ ${value.toFixed(2).replace(".", ",")}`;
}

export function productContext(product: Product): ChatScreenContext["product"] {
  const store = marketplaceStores.find((item) => item.productIds.includes(product.id));

  return {
    id: product.id,
    name: product.name,
    price: formatPrice(product.price),
    category: product.category,
    tag: product.tag,
    storeName: store?.name,
  };
}

function storeContext(storeId: string): ChatScreenContext["store"] {
  const store = marketplaceStores.find((item) => item.id === storeId);
  if (!store) return undefined;

  return {
    id: store.id,
    name: store.name,
    owner: store.owner,
    location: store.location,
    rating: store.rating,
    sales: store.sales,
    badge: store.badge,
    products: store.productIds
      .map((id) => products.find((product) => product.id === id)?.name)
      .filter((name): name is string => Boolean(name)),
  };
}

function buildContext(): ChatScreenContext {
  const state = useMarketplace.getState();
  const selectedProduct = products.find((product) => product.id === state.selectedProductId);
  const selectedStore = state.selectedStoreStoryId
    ? storeContext(state.selectedStoreStoryId)
    : undefined;
  const query = state.searchView === "results" ? state.confirmedSearch : state.search;
  const searchResults =
    state.searchView === "home" || !query.trim()
      ? []
      : products
          .filter((product) => product.name.toLowerCase().includes(query.toLowerCase()))
          .map((product) => product.name);
  const cartProducts = [...state.cart]
    .map((id) => products.find((product) => product.id === id)?.name)
    .filter((name): name is string => Boolean(name));
  const screen = selectedProduct
    ? "produto"
    : selectedStore
      ? "historia_da_loja"
      : state.searchView !== "home"
        ? "busca"
        : state.activeNav.toLowerCase();

  return {
    screen,
    activeNav: state.activeNav,
    activeCategory: state.activeCategory,
    product: selectedProduct ? productContext(selectedProduct) : undefined,
    store: selectedStore,
    search:
      state.searchView === "home"
        ? undefined
        : {
            view: state.searchView,
            query,
            results: searchResults,
          },
    cart: {
      count: state.cart.size,
      products: cartProducts,
    },
  };
}

export function AiChatLauncher() {
  const activeNav = useMarketplace((state) => state.activeNav);
  const [open, setOpen] = useState(false);
  const isOrdersPage = activeNav === "Pedidos";

  return (
    <>
      <motion.button
        whileHover={{ y: -2, scale: 1.02 }}
        whileTap={{ scale: 0.92 }}
        onClick={() => setOpen(true)}
        disabled={open}
        aria-label="Conversar com a Assistente BW7"
        className={`group fixed z-30 flex h-14 items-center rounded-full border border-primary/10 bg-card/95 text-foreground shadow-float ring-1 ring-background/80 backdrop-blur-xl transition-colors hover:bg-background disabled:pointer-events-none lg:bottom-8 lg:right-8 lg:w-auto lg:gap-2.5 lg:pl-2 lg:pr-4 ${
          isOrdersPage
            ? "bottom-5 right-4 w-14 justify-center p-0"
            : "bottom-24 right-[max(1rem,calc((100vw-28rem)/2+1rem))] gap-2.5 pl-2 pr-4"
        }`}
      >
        <span className="absolute inset-x-3 -bottom-1 h-5 rounded-full bg-primary/20 blur-xl -z-10 opacity-80 transition-opacity group-hover:opacity-100" />
        <span className="relative grid h-10 w-10 place-items-center rounded-full bg-gradient-hero text-primary-foreground shadow-[0_10px_22px_-12px_oklch(0.48_0.18_300/0.75)]">
          <MessageCircle className="h-5 w-5" />
          <Sparkle className="absolute -right-0.5 -top-0.5 h-3.5 w-3.5 rounded-full bg-mint p-0.5 text-primary-dark ring-2 ring-card" fill="currentColor" />
        </span>
        <span className={`${isOrdersPage ? "hidden lg:flex" : "flex"} min-w-0 flex-col items-start leading-none`}>
          <span className="text-[13px] font-semibold tracking-normal">Assistente BW7</span>
          <span className="mt-1 flex items-center gap-1.5 text-[10px] font-medium text-muted-foreground">
            <span className="h-1.5 w-1.5 rounded-full bg-mint" />
            IA online
          </span>
        </span>
      </motion.button>

      <AnimatePresence>
        {open && (
          <Suspense fallback={null}>
            <LazyChatSheet context={buildContext()} onClose={() => setOpen(false)} />
          </Suspense>
        )}
      </AnimatePresence>
    </>
  );
}
