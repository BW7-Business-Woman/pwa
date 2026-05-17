import { Home, LayoutGrid, ShoppingBag, User } from "lucide-react";
import { motion } from "framer-motion";
import { useMarketplace } from "@/store/marketplace";

const items = [
  { key: "Início", icon: Home },
  { key: "Categorias", icon: LayoutGrid },
  { key: "Carrinho", icon: ShoppingBag },
  { key: "Perfil", icon: User },
] as const;

export function BottomNavigation() {
  const { activeNav, setActiveNav, cart } = useMarketplace();
  return (
    <div className="fixed left-0 right-0 bottom-3 z-40 px-4 pointer-events-none">
      <nav className="pointer-events-auto mx-auto max-w-md bg-card/95 backdrop-blur-xl rounded-full shadow-float p-1.5 flex items-center justify-between">
        {items.map(({ key, icon: Icon }) => {
          const active = activeNav === key;
          const isCart = key === "Carrinho";
          return (
            <button
              key={key}
              onClick={() => setActiveNav(key)}
              className="relative flex-1 h-12 rounded-full flex items-center justify-center gap-2 transition-colors"
            >
              {active && (
                <motion.span
                  layoutId="nav-pill"
                  className="absolute inset-0 bg-primary rounded-full"
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}
              <span className={`relative flex items-center gap-1.5 ${active ? "text-primary-foreground" : "text-foreground/55"}`}>
                <span className="relative">
                  <Icon className="h-5 w-5" strokeWidth={active ? 2.4 : 2} />
                  {isCart && cart.size > 0 && (
                    <span className="absolute -top-1.5 -right-2 min-w-[16px] h-4 px-1 rounded-full bg-mint text-primary-dark text-[10px] font-bold grid place-items-center">
                      {cart.size}
                    </span>
                  )}
                </span>
                {active && <span className="text-[12px] font-semibold">{key}</span>}
              </span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}
