import { createFileRoute } from "@tanstack/react-router";
import { MarketplacePage } from "@/components/marketplace/MarketplacePage";

export const Route = createFileRoute("/conta")({
  component: ContaRoute,
});

function ContaRoute() {
  return <MarketplacePage routeNav="Conta" />;
}
