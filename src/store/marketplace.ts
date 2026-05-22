import { create } from "zustand";

type CheckoutDraft = {
  productId: string;
  quantity: number;
} | null;

export type SearchResultType = "all" | "products" | "services" | "stores";

export type MockOrder = {
  id: string;
  productId: string;
  quantity: number;
  paymentMethod: "pix" | "card";
  installments: number;
  subtotal: number;
  shipping: number;
  discount: number;
  interest: number;
  total: number;
  createdAt: string;
  status: "Pago" | "Enviado" | "Cancelado" | "Concluído";
};

interface MarketplaceState {
  favorites: Set<string>;
  cart: Set<string>;
  orders: MockOrder[];
  activeCategory: string;
  search: string;
  searchResultType: SearchResultType;
  postalCode: string;
  confirmedSearch: string;
  searchHistory: string[];
  searchView: "home" | "history" | "results";
  searchLoading: boolean;
  selectedProductId: string | null;
  selectedStoreProfileId: string | null;
  selectedStoreStoryId: string | null;
  checkoutDraft: CheckoutDraft;
  continueShoppingProductId: string | null;
  loadingImageCount: number;
  activeNav: "Início" | "Lojas" | "Serviços" | "Carrinho" | "Pedidos" | "Perfil" | "Conta";
  toggleFavorite: (id: string) => void;
  addToCart: (id: string) => void;
  removeFromCart: (id: string) => void;
  openProduct: (id: string) => void;
  closeProduct: () => void;
  openCheckout: (productId: string, quantity?: number) => void;
  closeCheckout: () => void;
  createMockOrder: (order: Omit<MockOrder, "id" | "createdAt" | "status">) => MockOrder;
  openStoreProfile: (id: string) => void;
  closeStoreProfile: () => void;
  openStoreStory: (id: string) => void;
  closeStoreStory: () => void;
  setCategory: (c: string) => void;
  setSearch: (s: string) => void;
  setSearchResultType: (type: SearchResultType) => void;
  setPostalCode: (postalCode: string) => void;
  openSearchHistory: () => void;
  submitSearch: (query?: string) => void;
  removeSearchHistory: (query: string) => void;
  finishSearchLoading: () => void;
  closeSearch: () => void;
  beginImageLoading: () => void;
  endImageLoading: () => void;
  setActiveNav: (n: MarketplaceState["activeNav"]) => void;
}

export const useMarketplace = create<MarketplaceState>((set) => ({
  favorites: new Set(),
  cart: new Set(),
  orders: [],
  activeCategory: "Produtos",
  search: "",
  searchResultType: "all",
  postalCode: "",
  confirmedSearch: "",
  searchHistory: [],
  searchView: "home",
  searchLoading: false,
  selectedProductId: null,
  selectedStoreProfileId: null,
  selectedStoreStoryId: null,
  checkoutDraft: null,
  continueShoppingProductId: null,
  loadingImageCount: 0,
  activeNav: "Início",
  toggleFavorite: (id) =>
    set((s) => {
      const f = new Set(s.favorites);
      f.has(id) ? f.delete(id) : f.add(id);
      return { favorites: f };
    }),
  addToCart: (id) =>
    set((s) => {
      const c = new Set(s.cart);
      c.add(id);
      return { cart: c };
    }),
  removeFromCart: (id) =>
    set((s) => {
      const c = new Set(s.cart);
      c.delete(id);
      return { cart: c };
    }),
  openProduct: (selectedProductId) =>
    set({
      selectedProductId,
      checkoutDraft: null,
      selectedStoreProfileId: null,
      continueShoppingProductId: selectedProductId,
    }),
  closeProduct: () => set({ selectedProductId: null }),
  openCheckout: (productId, quantity = 1) =>
    set({
      checkoutDraft: { productId, quantity: Math.max(1, quantity) },
      selectedProductId: null,
      selectedStoreProfileId: null,
      selectedStoreStoryId: null,
      searchView: "home",
    }),
  closeCheckout: () => set({ checkoutDraft: null }),
  createMockOrder: (order) => {
    const mockOrder: MockOrder = {
      ...order,
      id: `BW7-${Date.now().toString(36).toUpperCase()}`,
      createdAt: new Date().toISOString(),
      status: "Pago",
    };

    set((state) => ({
      orders: [mockOrder, ...state.orders],
      checkoutDraft: null,
      activeNav: "Pedidos",
    }));

    return mockOrder;
  },
  openStoreProfile: (selectedStoreProfileId) =>
    set({
      selectedStoreProfileId,
      selectedProductId: null,
      selectedStoreStoryId: null,
      checkoutDraft: null,
      searchView: "home",
    }),
  closeStoreProfile: () => set({ selectedStoreProfileId: null }),
  openStoreStory: (selectedStoreStoryId) => set({ selectedStoreStoryId }),
  closeStoreStory: () => set({ selectedStoreStoryId: null }),
  setCategory: (activeCategory) => set({ activeCategory }),
  setSearch: (search) => set({ search }),
  setSearchResultType: (searchResultType) => set({ searchResultType }),
  setPostalCode: (postalCode) => set({ postalCode }),
  openSearchHistory: () => set({ searchView: "history" }),
  submitSearch: (query) =>
    set((s) => {
      const normalizedQuery = (query ?? s.search).trim();

      if (!normalizedQuery) {
        return { search: "", confirmedSearch: "", searchView: "home", searchLoading: false };
      }

      const searchHistory = [
        normalizedQuery,
        ...s.searchHistory.filter((item) => item.toLowerCase() !== normalizedQuery.toLowerCase()),
      ].slice(0, 6);

      return {
        search: normalizedQuery,
        confirmedSearch: normalizedQuery,
        searchHistory,
        searchView: "results",
        searchLoading: true,
        selectedProductId: null,
        selectedStoreProfileId: null,
        selectedStoreStoryId: null,
        checkoutDraft: null,
      };
    }),
  removeSearchHistory: (query) =>
    set((state) => ({
      searchHistory: state.searchHistory.filter(
        (item) => item.toLowerCase() !== query.toLowerCase(),
      ),
    })),
  finishSearchLoading: () => set({ searchLoading: false }),
  closeSearch: () =>
    set({ search: "", confirmedSearch: "", searchView: "home", searchLoading: false }),
  beginImageLoading: () => set((state) => ({ loadingImageCount: state.loadingImageCount + 1 })),
  endImageLoading: () =>
    set((state) => ({ loadingImageCount: Math.max(0, state.loadingImageCount - 1) })),
  setActiveNav: (activeNav) => set({ activeNav }),
}));
