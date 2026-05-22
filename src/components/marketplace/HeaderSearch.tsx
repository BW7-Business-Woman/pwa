import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Bell,
  Camera,
  Check,
  ChevronDown,
  MapPin,
  Menu,
  Mic,
  Search,
  ShoppingCart,
  X,
} from "lucide-react";
import { useNavigate } from "@tanstack/react-router";
import logoBw7 from "@/assets/logo.jpg";
import { products } from "@/data/products";
import { useMarketplace, type SearchResultType } from "@/store/marketplace";

const permissions = [
  {
    label: "Localização",
    detail: "Ofertas e entregas perto de você",
    icon: MapPin,
    accepted: true,
  },
  { label: "Notificações", detail: "Alertas de pedidos e promoções", icon: Bell, accepted: true },
  { label: "Câmera", detail: "Leitura de QR Code e imagens", icon: Camera, accepted: true },
  { label: "Microfone", detail: "Busca por voz no app", icon: Mic, accepted: true },
];

const searchResultTypes: Array<{ value: SearchResultType; label: string }> = [
  { value: "all", label: "Todos" },
  { value: "products", label: "Produtos" },
  { value: "services", label: "Serviços" },
  { value: "stores", label: "Lojas" },
];

function formatPostalCode(value: string) {
  const digits = value.replace(/\D/g, "").slice(0, 8);
  if (digits.length <= 5) return digits;
  return `${digits.slice(0, 5)}-${digits.slice(5)}`;
}

export function HeaderSearch() {
  const navigate = useNavigate();
  const {
    search,
    setSearch,
    searchResultType,
    setSearchResultType,
    openSearchHistory,
    submitSearch,
    postalCode,
    setPostalCode,
    loadingImageCount,
    cart,
    searchHistory,
    removeSearchHistory,
    openProduct,
    closeProduct,
    closeStoreProfile,
    closeSearch,
    setActiveNav,
  } = useMarketplace();
  const [menuOpen, setMenuOpen] = useState(false);
  const [desktopTypeOpen, setDesktopTypeOpen] = useState(false);
  const [desktopSearchPanelOpen, setDesktopSearchPanelOpen] = useState(false);
  const [locationOpen, setLocationOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const desktopSearchRef = useRef<HTMLDivElement>(null);
  const locationRef = useRef<HTMLDivElement>(null);
  const isLoading = loadingImageCount > 0;
  const hasValidPostalCode = postalCode.replace(/\D/g, "").length === 8;
  const showLoading = mounted && isLoading;
  const activeResultTypeLabel =
    searchResultTypes.find((item) => item.value === searchResultType)?.label ?? "Todos";
  const recentProducts = products.slice(0, 4);
  const searchSuggestions = searchHistory.slice(0, 8);
  const searchSuggestionItems = searchSuggestions.map((suggestion) => ({
    label: suggestion,
    isHistory: searchHistory.some((item) => item.toLowerCase() === suggestion.toLowerCase()),
  }));

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!desktopTypeOpen && !desktopSearchPanelOpen && !locationOpen) return;

    function handlePointerDown(event: MouseEvent) {
      const target = event.target;
      if (!(target instanceof Node)) return;

      if (desktopTypeOpen && !desktopSearchRef.current?.contains(target)) {
        setDesktopTypeOpen(false);
      }
      if (desktopSearchPanelOpen && !desktopSearchRef.current?.contains(target)) {
        setDesktopSearchPanelOpen(false);
      }
      if (locationOpen && !locationRef.current?.contains(target)) {
        setLocationOpen(false);
      }
    }

    document.addEventListener("mousedown", handlePointerDown);
    return () => document.removeEventListener("mousedown", handlePointerDown);
  }, [desktopSearchPanelOpen, desktopTypeOpen, locationOpen]);

  function submitInputSearch() {
    setDesktopSearchPanelOpen(false);
    submitSearch(search);
  }

  function submitSuggestion(query: string) {
    setDesktopSearchPanelOpen(false);
    setSearch(query);
    submitSearch(query);
  }

  return (
    <>
      <header className="sticky top-0 z-30 bg-background/85 backdrop-blur-xl px-4 pt-4 pb-3 lg:hidden">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setMenuOpen(true)}
            aria-label="Abrir menu"
            className="grid h-11 w-11 place-items-center rounded-2xl bg-card shadow-soft text-foreground transition-transform active:scale-95"
          >
            <Menu className="h-5 w-5" />
          </button>
          <div className="flex-1 flex items-center gap-2 h-11 px-4 rounded-2xl bg-card shadow-soft">
            <input
              name="mobile-marketplace-search"
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              autoComplete="off"
              autoCorrect="off"
              spellCheck={false}
              enterKeyHint="search"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  submitInputSearch();
                }
              }}
              placeholder="Qual produto ou serviço você precisa?"
              className="flex-1 min-w-0 bg-transparent outline-none text-sm placeholder:text-muted-foreground"
            />
            <button
              type="button"
              onClick={openSearchHistory}
              aria-label="Abrir busca"
              className="grid h-7 w-7 shrink-0 place-items-center rounded-full text-primary transition-colors active:bg-primary-soft"
            >
              <Search className="h-4 w-4" />
            </button>
          </div>
        </div>
        <AnimatePresence>
          {showLoading && (
            <motion.div
              initial={{ opacity: 0, scaleX: 0.92 }}
              animate={{ opacity: 1, scaleX: 1 }}
              exit={{ opacity: 0, scaleX: 0.96 }}
              className="absolute inset-x-1/2 bottom-0 h-1 w-screen -translate-x-1/2 origin-left overflow-hidden bg-secondary"
              aria-hidden="true"
            >
              <div className="marketplace-loading-line h-full w-full" />
            </motion.div>
          )}
        </AnimatePresence>
      </header>
      <header className="sticky top-0 z-30 hidden border-b-4 border-[#a768e8] bg-[#3e006c] text-[#f1e4ff] lg:block">
        <div className="flex h-[74px] items-center gap-5 px-6">
          <button
            type="button"
            onClick={() => {
              closeProduct();
              closeStoreProfile();
              closeSearch();
              setActiveNav("Início");
              navigate({ to: "/" });
            }}
            aria-label="Ir para o início"
            className="flex h-full w-[170px] shrink-0 items-center justify-center"
          >
            <img src={logoBw7} alt="BW7 Marketplace" className="max-h-14 w-full object-contain" />
          </button>

          <div ref={locationRef} className="relative min-w-[184px] shrink-0">
            <button
              type="button"
              onClick={() => {
                setLocationOpen((current) => !current);
              }}
              className="flex min-h-[50px] w-full items-center gap-2 text-left text-sm leading-tight text-[#f1e4ff]"
            >
              <MapPin className="h-6 w-6 shrink-0" />
              <span className="min-w-0">
                <span className="block text-xs text-white/80">
                  {hasValidPostalCode ? "Enviar para" : "Informe sua entrega"}
                </span>
                <span className="block truncate font-bold">
                  {hasValidPostalCode ? `CEP ${postalCode}` : "Digite seu CEP"}
                </span>
              </span>
            </button>

            <AnimatePresence>
              {locationOpen && (
                <motion.form
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  transition={{ duration: 0.14 }}
                  onSubmit={(event) => {
                    event.preventDefault();
                    if (hasValidPostalCode) setLocationOpen(false);
                  }}
                  className="absolute left-0 top-full z-50 mt-2 w-[260px] rounded bg-white p-3 text-[#25102e] shadow-[0_18px_42px_-22px_rgba(0,0,0,0.55)] ring-2 ring-[#a768e8]"
                >
                  <label
                    className="mb-2 block text-xs font-bold uppercase tracking-wide text-slate-600"
                    htmlFor="header-postal-code"
                  >
                    CEP de entrega
                  </label>
                  <div className="flex gap-2">
                    <input
                      id="header-postal-code"
                      value={postalCode}
                      onChange={(event) => setPostalCode(formatPostalCode(event.target.value))}
                      inputMode="numeric"
                      maxLength={9}
                      placeholder="00000-000"
                      className="h-10 min-w-0 flex-1 rounded border border-slate-300 px-3 text-sm outline-none focus:border-[#a768e8] focus:ring-2 focus:ring-[#a768e8]/25"
                    />
                    <button
                      type="submit"
                      disabled={!hasValidPostalCode}
                      className="h-10 rounded bg-[#a768e8] px-3 text-xs font-bold text-white transition-colors hover:bg-[#9254d6] disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      OK
                    </button>
                  </div>
                </motion.form>
              )}
            </AnimatePresence>
          </div>

          <div ref={desktopSearchRef} className="relative min-w-[280px] flex-1">
            <form
              className="flex h-[50px] overflow-hidden rounded bg-[#fbf7ff] text-[#2d063f] shadow-sm ring-2 ring-[#a768e8]/30 transition-shadow"
              onSubmit={(event) => {
                event.preventDefault();
                setDesktopTypeOpen(false);
                submitInputSearch();
              }}
            >
              <button
                type="button"
                onClick={() => {
                  setDesktopTypeOpen((current) => !current);
                }}
                className="flex w-[116px] shrink-0 items-center justify-center gap-1 border-r border-[#d7bdf4] bg-[#eadbff] text-sm font-medium text-[#430064]"
                aria-expanded={desktopTypeOpen}
              >
                <span className="truncate">{activeResultTypeLabel}</span>
                <ChevronDown className="h-4 w-4" />
              </button>
              <input
                name="desktop-marketplace-search"
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                onClick={() => setDesktopSearchPanelOpen(true)}
                onFocus={() => setDesktopSearchPanelOpen(true)}
                autoComplete="off"
                autoCorrect="off"
                spellCheck={false}
                enterKeyHint="search"
                placeholder="Pesquisar produtos e serviços"
                className="min-w-0 flex-1 px-4 text-lg outline-none placeholder:text-slate-500"
              />
              <button
                type="submit"
                aria-label="Pesquisar"
                className="grid w-[58px] shrink-0 place-items-center bg-[#a768e8] text-white transition-colors hover:bg-[#9254d6]"
              >
                <Search className="h-7 w-7" strokeWidth={2.4} />
              </button>
            </form>

            <AnimatePresence>
              {desktopSearchPanelOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  transition={{ duration: 0.14 }}
                  className="absolute left-0 top-[50px] z-[55] w-full overflow-hidden rounded-b border-2 border-t-0 border-[#a768e8] bg-white text-[#25102e] shadow-[0_24px_54px_-24px_rgba(62,0,108,0.45)]"
                >
                  <div className="px-4 pb-4 pt-3">
                    <h2 className="text-sm font-black uppercase tracking-wide text-[#25102e]">
                      CONTINUAR COMPRANDO
                    </h2>
                    <div className="mt-3 grid grid-cols-4 gap-3">
                      {recentProducts.map((product) => (
                        <button
                          key={product.id}
                          type="button"
                          onClick={() => {
                            setDesktopSearchPanelOpen(false);
                            openProduct(product.id);
                          }}
                          className="min-w-0 overflow-hidden rounded-xl border border-slate-200 bg-white text-left transition-colors hover:border-[#a768e8]"
                        >
                          <div className="aspect-[1.45] bg-slate-50">
                            <img
                              src={product.image}
                              alt={product.name}
                              className="h-full w-full object-cover"
                              loading="lazy"
                            />
                          </div>
                          <div className="px-2.5 pb-2 pt-1.5">
                            <p className="truncate text-sm font-medium text-[#25102e]">
                              {product.name}
                            </p>
                            <p className="text-xs text-slate-500">Visto recentemente</p>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {searchSuggestionItems.length > 0 ? (
                    <div className="border-t border-slate-200 py-2">
                      {searchSuggestionItems.map((suggestion) => (
                        <div
                          key={suggestion.label}
                          className="flex h-11 w-full items-center text-base font-bold text-[#9b259e] transition-colors hover:bg-[#f7efff]"
                        >
                          <button
                            type="button"
                            onClick={() => submitSuggestion(suggestion.label)}
                            className="min-w-0 flex-1 px-4 text-left"
                          >
                            <span className="block truncate">{suggestion.label}</span>
                          </button>
                          {suggestion.isHistory ? (
                            <button
                              type="button"
                              onClick={(event) => {
                                event.stopPropagation();
                                removeSearchHistory(suggestion.label);
                              }}
                              aria-label={`Remover ${suggestion.label} do historico`}
                              className="grid h-11 w-12 shrink-0 place-items-center text-slate-900 transition-colors hover:text-[#9b259e]"
                            >
                              <X className="h-5 w-5" />
                            </button>
                          ) : null}
                        </div>
                      ))}
                    </div>
                  ) : null}
                </motion.div>
              )}

              {desktopTypeOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  transition={{ duration: 0.14 }}
                  className="absolute left-0 top-full z-[60] mt-1 w-[164px] overflow-hidden rounded bg-white text-[#25102e] shadow-[0_18px_42px_-22px_rgba(0,0,0,0.55)] ring-2 ring-[#a768e8]"
                >
                  {searchResultTypes.map((item) => (
                    <button
                      key={item.value}
                      type="button"
                      onClick={() => {
                        setSearchResultType(item.value);
                        setDesktopTypeOpen(false);
                      }}
                      className={`flex h-11 w-full items-center justify-between px-3 text-left text-sm font-bold transition-colors hover:bg-[#f7efff] ${
                        searchResultType === item.value ? "text-[#9b259e]" : "text-[#25102e]"
                      }`}
                    >
                      {item.label}
                      {searchResultType === item.value ? <Check className="h-4 w-4" /> : null}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <button
            type="button"
            onClick={() => {
              closeProduct();
              closeStoreProfile();
              closeSearch();
              setActiveNav("Conta");
              navigate({ to: "/conta" });
            }}
            className="shrink-0 text-left text-sm leading-tight"
          >
            <span className="block text-xs">Olá, Mari</span>
            <span className="flex items-center gap-1 font-bold">
              Conta
              <ChevronDown className="h-4 w-4" />
            </span>
          </button>

          <button
            type="button"
            onClick={() => {
              closeProduct();
              closeStoreProfile();
              closeSearch();
              setActiveNav("Pedidos");
              navigate({ to: "/pedidos" });
            }}
            className="shrink-0 text-left text-sm font-bold leading-tight"
          >
            Devoluções
            <span className="block">e Pedidos</span>
          </button>

          <button
            type="button"
            onClick={() => {
              closeProduct();
              closeStoreProfile();
              closeSearch();
              setActiveNav("Carrinho");
              navigate({ to: "/carrinho" });
            }}
            className="flex min-w-[128px] shrink-0 items-center gap-3 font-bold"
            aria-label={cart.size > 0 ? `Carrinho com ${cart.size} itens` : "Carrinho (vazio)"}
          >
            <span className="relative">
              <ShoppingCart className="h-10 w-10" strokeWidth={2.5} />
              {cart.size > 0 ? (
                <span className="absolute -right-2 -top-2 inline-flex h-6 min-w-[1.5rem] items-center justify-center rounded-full bg-white text-sm font-bold text-[#3e006c] px-1.5">
                  {cart.size}
                </span>
              ) : null}
            </span>
            <span className="hidden lg:block">Carrinho</span>
          </button>
        </div>
        <AnimatePresence>
          {showLoading && (
            <motion.div
              initial={{ opacity: 0, scaleX: 0.92 }}
              animate={{ opacity: 1, scaleX: 1 }}
              exit={{ opacity: 0, scaleX: 0.96 }}
              className="absolute inset-x-0 bottom-0 h-1 origin-left overflow-hidden bg-[#a768e8]"
              aria-hidden="true"
            >
              <div className="marketplace-loading-line h-full w-full" />
            </motion.div>
          )}
        </AnimatePresence>
      </header>
      <AnimatePresence>
        {menuOpen && <PermissionsSidebar onClose={() => setMenuOpen(false)} />}
      </AnimatePresence>
    </>
  );
}

function PermissionsSidebar({ onClose }: { onClose: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-primary-dark/40 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.aside
        initial={{ x: "-100%" }}
        animate={{ x: 0 }}
        exit={{ x: "-100%" }}
        transition={{ type: "spring", stiffness: 320, damping: 34 }}
        onClick={(e) => e.stopPropagation()}
        className="h-full w-[84vw] max-w-[340px] bg-background shadow-float"
      >
        <div className="flex h-full flex-col px-4 pb-5 pt-5">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-[20px] font-bold tracking-tight">Permissões</h2>
              <p className="mt-1 text-xs text-muted-foreground">Status simulado para testes</p>
            </div>
            <button
              type="button"
              onClick={onClose}
              aria-label="Fechar menu"
              className="grid h-10 w-10 place-items-center rounded-full bg-card text-foreground shadow-soft transition-transform active:scale-95"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="mt-6 rounded-[24px] bg-card p-3 shadow-soft">
            <div className="mb-2 px-1 text-xs font-semibold uppercase text-muted-foreground">
              Permissões aceitas
            </div>

            <div className="grid gap-2">
              {permissions.map(({ label, detail, icon: Icon, accepted }) => (
                <button
                  key={label}
                  type="button"
                  className="flex min-h-16 items-center gap-3 rounded-2xl px-3 text-left transition-colors hover:bg-secondary"
                >
                  <span className="grid h-10 w-10 place-items-center rounded-full bg-primary-soft text-primary">
                    <Icon className="h-5 w-5" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-sm font-semibold">{label}</span>
                    <span className="mt-0.5 block text-xs text-muted-foreground">{detail}</span>
                  </span>
                  <span
                    className={`grid h-7 min-w-7 place-items-center rounded-full px-2 text-[11px] font-bold ${
                      accepted ? "bg-mint text-primary-dark" : "bg-secondary text-muted-foreground"
                    }`}
                  >
                    {accepted ? <Check className="h-3.5 w-3.5" /> : "Off"}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div className="mt-auto rounded-2xl bg-secondary px-4 py-3 text-xs text-muted-foreground">
            Essas opções ainda são apenas visuais e não solicitam permissões reais do dispositivo.
          </div>
        </div>
      </motion.aside>
    </motion.div>
  );
}


