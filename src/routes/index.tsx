import { createFileRoute } from "@tanstack/react-router";
import { HeaderSearch } from "@/components/marketplace/HeaderSearch";
import { CategoryTabs } from "@/components/marketplace/CategoryTabs";
import { HeroBanner } from "@/components/marketplace/HeroBanner";
import { ProductGrid } from "@/components/marketplace/ProductGrid";
import { BottomNavigation } from "@/components/marketplace/BottomNavigation";
import { AiChatLauncher } from "@/components/marketplace/AiChat";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "BW7 Marketplace — Conectando mulheres, impulsionando negócios" },
      {
        name: "description",
        content:
          "Marketplace BW7 Business Woman: compre, venda e fortaleça a rede. Descubra produtos, serviços e comunidade.",
      },
      { name: "theme-color", content: "#6C3FB5" },
      { property: "og:title", content: "BW7 Marketplace" },
      { property: "og:description", content: "Conectamos mulheres e impulsionamos negócios." },
    ],
    links: [{ rel: "manifest", href: "/manifest.json" }],
  }),
  component: Index,
});

function Index() {
  return (
    <div className="min-h-screen bg-background pb-28 max-w-md mx-auto">
      <HeaderSearch />
      <CategoryTabs />
      <HeroBanner />
      <ProductGrid />
      <BottomNavigation />
      <AiChatLauncher />
    </div>
  );
}
