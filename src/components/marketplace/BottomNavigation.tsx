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
    <div className="fixed left-0 right-0 bottom-4 z-40 px-5 pointer-events-none">
      <div className="pointer-events-auto mx-auto max-w-sm relative">
        {/* glow */}
        <div className="absolute inset-x-6 -bottom-2 h-8 bg-primary/30 blur-2xl rounded-full" />

        <nav className="relative bg-primary-dark/95 backdrop-blur-xl rounded-[28px] shadow-float px-2 py-2 flex items-center justify-around gap-1 border border-primary-foreground/5">
          {items.map(({ key, icon: Icon }) => {
            const active = activeNav === key;
            const isCart = key === "Carrinho";
            const count = cart.size;

            return (
              <button
                key={key}
                onClick={() => setActiveNav(key)}
                aria-label={key}
                aria-current={active ? "page" : undefined}
                className="relative flex-1 h-12 flex items-center justify-center"
              >
                {active && (
                  <motion.span
                    layoutId="nav-pill"
                    className="absolute inset-y-1 inset-x-1 bg-primary rounded-[20px] shadow-[0_8px_20px_-6px_oklch(0.48_0.18_300/0.6)]"
                    transition={{ type: "spring", stiffness: 380, damping: 32 }}
                  />
                )}

                <motion.span
                  animate={{ scale: active ? 1 : 1, y: active ? -1 : 0 }}
                  className="relative flex flex-col items-center justify-center gap-0.5"
                >
                  <span className="relative">
                    <Icon
                      className={`h-[20px] w-[20px] transition-colors ${
                        active ? "text-primary-foreground" : "text-primary-foreground/55"
                      }`}
                      strokeWidth={active ? 2.4 : 2}
                    />
                    {isCart && count > 0 && (
                      <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute -top-1.5 -right-2 min-w-[16px] h-4 px-1 rounded-full bg-mint text-primary-dark text-[10px] font-bold grid place-items-center ring-2 ring-primary-dark"
                      >
                        {count}
                      </motion.span>
                    )}
                  </span>
                  <span
                    className={`text-[10px] font-medium leading-none transition-colors ${
                      active ? "text-primary-foreground" : "text-primary-foreground/45"
                    }`}
                  >
                    {key}
                  </span>
                </motion.span>
              </button>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
