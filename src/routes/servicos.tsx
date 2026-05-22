import { createFileRoute } from "@tanstack/react-router";
import { MarketplacePage } from "@/components/marketplace/MarketplacePage";

export const Route = createFileRoute("/servicos")({
  component: ServicosRoute,
});

function ServicosRoute() {
  return <MarketplacePage routeNav="Serviços" />;
}
