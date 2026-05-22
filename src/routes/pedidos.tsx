import { createFileRoute } from "@tanstack/react-router";
import { MarketplacePage } from "@/components/marketplace/MarketplacePage";

export const Route = createFileRoute("/pedidos")({
  component: PedidosRoute,
});

function PedidosRoute() {
  return <MarketplacePage routeNav="Pedidos" />;
}
