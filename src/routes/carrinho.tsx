import { createFileRoute } from "@tanstack/react-router";
import { MarketplacePage } from "@/components/marketplace/MarketplacePage";

export const Route = createFileRoute("/carrinho")({
  component: CarrinhoRoute,
});

function CarrinhoRoute() {
  return <MarketplacePage routeNav="Carrinho" />;
}
