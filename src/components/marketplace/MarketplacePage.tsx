import { lazy, Suspense, useEffect } from "react";
import { HeaderSearch } from "@/components/marketplace/HeaderSearch";
import { CategoryTabs } from "@/components/marketplace/CategoryTabs";
import { HeroBanner } from "@/components/marketplace/HeroBanner";
import { ContinueShopping } from "@/components/marketplace/ContinueShopping";
import { ProductGrid } from "@/components/marketplace/ProductGrid";
import { SearchPage } from "@/components/marketplace/SearchPage";
import { BottomNavigation } from "@/components/marketplace/BottomNavigation";
import { ProfilePage } from "@/components/marketplace/ProfilePage";
import { StoresPage } from "@/components/marketplace/StoresPage";
import { ServicesPage } from "@/components/marketplace/ServicesPage";
import { CartPage } from "@/components/marketplace/CartPage";
import { OrdersPage } from "@/components/marketplace/OrdersPage";
import { AccountPage } from "@/components/marketplace/AccountPage";
import { StoreProfilePage } from "@/components/marketplace/StoreProfilePage";
import { StoreStoryPage } from "@/components/marketplace/StoreStoryPage";
import { ProductDetailPage } from "@/components/marketplace/ProductDetailPage";
import { CheckoutPage } from "@/components/marketplace/CheckoutPage";
import { PwaUpdateDialog } from "@/components/PwaUpdateDialog";
import { products } from "@/data/products";
import { marketplaceStores } from "@/data/stores";
import { lazyImportWithRetry } from "@/lib/lazyImportWithRetry";
import { useMarketplace } from "@/store/marketplace";

type MarketplaceNav = "Início" | "Lojas" | "Serviços" | "Carrinho" | "Pedidos" | "Perfil" | "Conta";

const LazyAiChatLauncher = lazy(() =>
  lazyImportWithRetry(
    () =>
      import("@/components/marketplace/AiChat").then((module) => ({
        default: module.AiChatLauncher,
      })),
    "ai-chat-launcher",
  ),
);

function MaybeAiChat() {
  if (!LazyAiChatLauncher) return null;

  return (
    <Suspense fallback={null}>
      <LazyAiChatLauncher />
    </Suspense>
  );
}

export function MarketplacePage({ routeNav }: { routeNav: MarketplaceNav }) {
  const {
    activeNav,
    searchView,
    searchLoading,
    finishSearchLoading,
    confirmedSearch,
    closeSearch,
    selectedProductId,
    selectedStoreProfileId,
    selectedStoreStoryId,
    checkoutDraft,
    setActiveNav,
  } = useMarketplace();
  const currentNav = activeNav === routeNav ? activeNav : routeNav;
  const isProfile = currentNav === "Perfil";
  const isAccount = currentNav === "Conta";
  const isStores = currentNav === "Lojas";
  const isServices = currentNav === "Serviços";
  const isCart = currentNav === "Carrinho";
  const isOrders = currentNav === "Pedidos";
  const isSearchOpen = searchView !== "home";
  const selectedProduct = products.find((product) => product.id === selectedProductId);
  const selectedStoreProfile = marketplaceStores.find(
    (store) => store.id === selectedStoreProfileId,
  );

  useEffect(() => {
    if (activeNav !== routeNav) {
      setActiveNav(routeNav);
    }
  }, [activeNav, routeNav, setActiveNav]);

  useEffect(() => {
    if (!searchLoading) return;

    const timer = window.setTimeout(() => {
      finishSearchLoading();
    }, 850);

    return () => window.clearTimeout(timer);
  }, [finishSearchLoading, searchLoading]);

  const searchLoadingOverlay = searchLoading ? <SearchLoadingOverlay /> : null;

  if (checkoutDraft) {
    return (
      <div className="min-h-screen bg-background max-w-md mx-auto lg:max-w-none">
        <CheckoutPage />
        {searchLoadingOverlay}
      </div>
    );
  }

  if (selectedStoreProfile) {
    return (
      <div className="min-h-screen bg-background max-w-md mx-auto lg:max-w-none">
        <StoreProfilePage store={selectedStoreProfile} />
        {searchLoadingOverlay}
      </div>
    );
  }

  if (selectedProduct) {
    return (
      <div className="min-h-screen bg-background max-w-md mx-auto lg:max-w-none">
        <ProductDetailPage product={selectedProduct} />
        <div className="hidden lg:block">
          <MaybeAiChat />
        </div>
        {searchLoadingOverlay}
      </div>
    );
  }

  if (isSearchOpen) {
    return (
      <div className="min-h-screen bg-background max-w-md mx-auto lg:max-w-none">
        <div className="hidden lg:block">
          <HeaderSearch />
        </div>
        <section className="px-4 pt-5 lg:mx-auto lg:max-w-7xl lg:px-6 lg:pt-8">
          <div className="hidden">
            <div>
              <h1 className="text-[18px] font-semibold tracking-tight lg:text-2xl">
                Resultado da busca
              </h1>
              <p className="text-xs text-muted-foreground lg:mt-1 lg:text-sm">
                Busca por {confirmedSearch}
              </p>
            </div>
            <button
              type="button"
              onClick={closeSearch}
              className="h-9 rounded-full bg-primary-soft px-4 text-xs font-semibold text-primary transition-colors hover:bg-primary hover:text-primary-foreground lg:h-10 lg:px-5 lg:text-sm"
            >
              Início
            </button>
          </div>
          <SearchPage />
        </section>
        {searchLoadingOverlay}
      </div>
    );
  }

  if (selectedStoreStoryId) {
    return (
      <div className="min-h-screen bg-background max-w-md mx-auto">
        <StoreStoryPage storeId={selectedStoreStoryId} />
        <MaybeAiChat />
        {searchLoadingOverlay}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-28 max-w-md mx-auto lg:max-w-none lg:pb-12">
      {isProfile ? (
        <ProfilePage />
      ) : isAccount ? (
        <AccountPage />
      ) : isCart ? (
        <>
          <div className="hidden lg:block">
            <HeaderSearch />
          </div>
          <CartPage />
        </>
      ) : isOrders ? (
        <>
          <div className="hidden lg:block">
            <HeaderSearch />
          </div>
          <OrdersPage />
        </>
      ) : isStores ? (
        <StoresPage />
      ) : isServices ? (
        <>
          <div className="hidden lg:block">
            <HeaderSearch />
          </div>
          <ServicesPage />
        </>
      ) : (
        <>
          <HeaderSearch />
          <CategoryTabs />
          <HeroBanner />
          <ContinueShopping />
          <ProductGrid />
        </>
      )}
      {!isOrders && <BottomNavigation />}
      {!isCart && <MaybeAiChat />}
      <PwaUpdateDialog />
      {searchLoadingOverlay}
    </div>
  );
}

function SearchLoadingOverlay() {
  return (
    <div
      className="fixed inset-0 z-[100] grid place-items-center bg-[radial-gradient(circle_at_top,rgba(167,104,232,0.12),rgba(62,0,108,0.24)_48%,rgba(42,6,10,0.34)_100%)] px-6 backdrop-blur-[2px]"
      role="status"
      aria-live="polite"
      aria-label="Buscando"
    >
      <div className="marketplace-search-progress h-16 w-16 rounded-full" />
    </div>
  );
}
