import { createFileRoute } from "@tanstack/react-router";
import { MarketplacePage } from "@/components/marketplace/MarketplacePage";

export const Route = createFileRoute("/lojas")({
  component: LojasRoute,
});

function LojasRoute() {
  return <MarketplacePage routeNav="Lojas" />;
}
