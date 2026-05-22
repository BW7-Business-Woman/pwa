import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { QueryClient } from "@tanstack/react-query";
import { createRouter, RouterProvider } from "@tanstack/react-router";

import { Route as rootRoute } from "./routes/__root";
import { Route as CarrinhoRouteImport } from "./routes/carrinho";
import { Route as ContaRouteImport } from "./routes/conta";
import { Route as IndexRouteImport } from "./routes/index";
import { Route as LojasRouteImport } from "./routes/lojas";
import { Route as LoginRouteImport } from "./routes/login";
import { Route as PedidosRouteImport } from "./routes/pedidos";
import { Route as PerfilRouteImport } from "./routes/perfil";
import { Route as ServicosRouteImport } from "./routes/servicos";
import "./styles.css";

const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error("Root element not found");
}

const IndexRoute = IndexRouteImport.update({
  id: "/",
  path: "/",
  getParentRoute: () => rootRoute,
} as never);

const LoginRoute = LoginRouteImport.update({
  id: "/login",
  path: "/login",
  getParentRoute: () => rootRoute,
} as never);

const CarrinhoRoute = CarrinhoRouteImport.update({
  id: "/carrinho",
  path: "/carrinho",
  getParentRoute: () => rootRoute,
} as never);

const ContaRoute = ContaRouteImport.update({
  id: "/conta",
  path: "/conta",
  getParentRoute: () => rootRoute,
} as never);

const LojasRoute = LojasRouteImport.update({
  id: "/lojas",
  path: "/lojas",
  getParentRoute: () => rootRoute,
} as never);

const PedidosRoute = PedidosRouteImport.update({
  id: "/pedidos",
  path: "/pedidos",
  getParentRoute: () => rootRoute,
} as never);

const PerfilRoute = PerfilRouteImport.update({
  id: "/perfil",
  path: "/perfil",
  getParentRoute: () => rootRoute,
} as never);

const ServicosRoute = ServicosRouteImport.update({
  id: "/servicos",
  path: "/servicos",
  getParentRoute: () => rootRoute,
} as never);

const routeTree = rootRoute._addFileChildren({
  CarrinhoRoute,
  ContaRoute,
  IndexRoute,
  LojasRoute,
  LoginRoute,
  PedidosRoute,
  PerfilRoute,
  ServicosRoute,
} as never);

const queryClient = new QueryClient();
const router = createRouter({
  routeTree,
  context: { queryClient },
  scrollRestoration: true,
  defaultPreloadStaleTime: 0,
});

createRoot(rootElement).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
);
