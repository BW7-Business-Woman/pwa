import { create } from "zustand";

interface MarketplaceState {
  favorites: Set<string>;
  cart: Set<string>;
  activeCategory: string;
  search: string;
  activeNav: "Início" | "Categorias" | "Carrinho" | "Perfil";
  toggleFavorite: (id: string) => void;
  addToCart: (id: string) => void;
  setCategory: (c: string) => void;
  setSearch: (s: string) => void;
  setActiveNav: (n: MarketplaceState["activeNav"]) => void;
}

export const useMarketplace = create<MarketplaceState>((set) => ({
  favorites: new Set(),
  cart: new Set(),
  activeCategory: "Produtos",
  search: "",
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
  setCategory: (activeCategory) => set({ activeCategory }),
  setSearch: (search) => set({ search }),
  setActiveNav: (activeNav) => set({ activeNav }),
}));
