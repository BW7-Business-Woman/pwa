import { createFileRoute } from "@tanstack/react-router";
import { MarketplacePage } from "@/components/marketplace/MarketplacePage";

export const Route = createFileRoute("/perfil")({
  component: PerfilRoute,
});

function PerfilRoute() {
  return <MarketplacePage routeNav="Perfil" />;
}
