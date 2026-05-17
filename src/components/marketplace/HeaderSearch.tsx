import { Menu, Search } from "lucide-react";
import { useMarketplace } from "@/store/marketplace";

export function HeaderSearch() {
  const { search, setSearch } = useMarketplace();
  return (
    <header className="sticky top-0 z-30 bg-background/85 backdrop-blur-xl px-4 pt-4 pb-3">
      <div className="flex items-center gap-3">
        <button
          aria-label="Abrir menu"
          className="grid h-11 w-11 place-items-center rounded-2xl bg-card shadow-soft text-foreground transition-transform active:scale-95"
        >
          <Menu className="h-5 w-5" />
        </button>
        <div className="flex-1 flex items-center gap-2 h-11 px-4 rounded-2xl bg-card shadow-soft">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Qual produto você precisa?"
            className="flex-1 bg-transparent outline-none text-sm placeholder:text-muted-foreground"
          />
          <Search className="h-4 w-4 text-primary" />
        </div>
      </div>
    </header>
  );
}
