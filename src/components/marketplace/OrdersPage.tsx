import { useMemo, useState } from "react";
import {
  ArrowLeft,
  BadgeCheck,
  ChevronDown,
  CreditCard,
  PackageCheck,
  QrCode,
  ReceiptText,
} from "lucide-react";
import { useNavigate } from "@tanstack/react-router";
import { products } from "@/data/products";
import { marketplaceStores } from "@/data/stores";
import { useMarketplace } from "@/store/marketplace";
import { LoadingImage } from "./LoadingImage";

const orderTabs = [
  { key: "all", label: "Pedidos" },
  { key: "Pago", label: "Pagos" },
  { key: "Enviado", label: "Enviados" },
  { key: "Cancelado", label: "Cancelados" },
  { key: "Concluído", label: "Concluídos" },
] as const;

type OrderTab = (typeof orderTabs)[number]["key"];

function formatPrice(value: number) {
  return `R$ ${value.toFixed(2).replace(".", ",")}`;
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

function getProductStore(productId: string) {
  return marketplaceStores.find((store) => store.productIds.includes(productId));
}

export function OrdersPage() {
  const navigate = useNavigate();
  const { orders, openProduct, setActiveNav } = useMarketplace();
  const [activeTab, setActiveTab] = useState<OrderTab>("all");
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);
  const filteredOrders = useMemo(
    () => (activeTab === "all" ? orders : orders.filter((order) => order.status === activeTab)),
    [activeTab, orders],
  );

  function getTabCount(tab: OrderTab) {
    return tab === "all" ? orders.length : orders.filter((order) => order.status === tab).length;
  }

  return (
    <main className="min-h-screen bg-background pb-32 lg:pb-10">
      <header className="sticky top-0 z-30 bg-background/95 px-4 py-3 backdrop-blur-xl lg:static lg:px-8 lg:py-4">
        <div className="mx-auto flex max-w-6xl items-center gap-3">
          <button
            type="button"
            onClick={() => {
              setActiveNav("Início");
              navigate({ to: "/" });
            }}
            className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-card text-foreground shadow-soft lg:hidden"
            aria-label="Voltar ao início"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div className="min-w-0">
            <h1 className="truncate text-xl font-bold tracking-tight">Meus pedidos</h1>
            <p className="text-xs text-muted-foreground">Acompanhe suas compras mockadas</p>
          </div>
        </div>
      </header>

      <section className="mx-auto max-w-6xl px-3 pt-3 sm:px-4 lg:px-8 lg:pt-4">
        {orders.length === 0 ? (
          <EmptyState
            title="Nenhum pedido ainda"
            description="Quando você finalizar uma compra mockada, ela aparecerá aqui."
            actionLabel="Ver produtos"
            onAction={() => {
              setActiveNav("Início");
              navigate({ to: "/" });
            }}
          />
        ) : (
          <>
            <div className="mb-3 grid grid-cols-3 gap-2 lg:mb-4 lg:flex lg:flex-wrap">
              {orderTabs.map((tab) => {
                const active = activeTab === tab.key;
                const count = getTabCount(tab.key);

                return (
                  <button
                    key={tab.key}
                    type="button"
                    onClick={() => setActiveTab(tab.key)}
                    className={`flex h-10 min-w-0 items-center justify-center gap-1.5 rounded-2xl px-2 text-[11px] font-bold transition-colors sm:text-xs lg:h-10 lg:w-auto lg:rounded-full lg:px-4 lg:text-sm ${
                      active
                        ? "bg-primary text-primary-foreground shadow-soft"
                        : "bg-card text-foreground shadow-soft hover:bg-secondary"
                    } ${tab.key === "Cancelado" || tab.key === "Concluído" ? "col-span-1" : ""}`}
                    aria-pressed={active}
                  >
                    <span className="truncate">{tab.label}</span>
                    <span
                      className={`grid h-5 min-w-5 shrink-0 place-items-center rounded-full px-1.5 text-[10px] ${
                        active
                          ? "bg-white/20 text-primary-foreground"
                          : "bg-secondary text-muted-foreground"
                      }`}
                    >
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>

            {filteredOrders.length === 0 ? (
              <EmptyState
                title="Nenhum pedido nesta categoria"
                description="Quando houver pedidos com esse status, eles aparecerão aqui."
              />
            ) : (
              <div className="grid gap-3 lg:gap-4">
                {filteredOrders.map((order) => {
                  const product = products.find((item) => item.id === order.productId);
                  const store = getProductStore(order.productId);
                  const paymentLabel =
                    order.paymentMethod === "pix" ? "Pix" : `Cartão em ${order.installments}x`;

                  const expanded = expandedOrderId === order.id;

                  return (
                    <article
                      key={order.id}
                      className="overflow-hidden rounded-[24px] bg-card shadow-soft ring-1 ring-border/60 lg:rounded-3xl"
                    >
                      <button
                        type="button"
                        onClick={() => setExpandedOrderId(expanded ? null : order.id)}
                        className="flex w-full items-start justify-between gap-3 px-3 py-3 text-left transition-colors hover:bg-secondary/50 sm:px-4 lg:px-5"
                        aria-expanded={expanded}
                        aria-controls={`order-details-${order.id}`}
                      >
                        <span className="flex min-w-0 flex-1 items-start gap-3">
                          <span className="min-w-0 flex-1">
                            <span className="block text-xs font-bold uppercase text-primary">
                              {order.id}
                            </span>
                            <span className="mt-0.5 block text-[11px] text-muted-foreground sm:text-xs">
                              Pedido criado em {formatDate(order.createdAt)}
                            </span>
                            <span className="mt-2 block truncate text-sm font-bold text-foreground">
                              {product?.name ?? "Produto removido"}
                            </span>
                          </span>
                          <span className="hidden shrink-0 text-right sm:block">
                            <span className="block text-[11px] font-semibold uppercase text-muted-foreground">
                              Total
                            </span>
                            <span className="block text-sm font-extrabold text-primary">
                              {formatPrice(order.total)}
                            </span>
                          </span>
                        </span>
                        <span className="flex shrink-0 items-center gap-2">
                          <span className="inline-flex h-7 items-center gap-1 rounded-full bg-mint/45 px-2.5 text-[11px] font-bold text-primary-dark sm:h-8 sm:gap-1.5 sm:px-3 sm:text-xs">
                            <BadgeCheck className="h-3.5 w-3.5" />
                            {order.status}
                          </span>
                          <ChevronDown
                            className={`h-5 w-5 text-muted-foreground transition-transform ${
                              expanded ? "rotate-180" : ""
                            }`}
                          />
                        </span>
                      </button>

                      <div
                        id={`order-details-${order.id}`}
                        className={`grid transition-[grid-template-rows] duration-300 ease-out ${
                          expanded ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                        }`}
                      >
                        <div className="min-h-0 overflow-hidden">
                          <div className="grid gap-3 border-t border-border p-3 sm:p-4 lg:grid-cols-[1fr_260px] lg:gap-4 lg:p-5">
                            <button
                              type="button"
                              onClick={() => product && openProduct(product.id)}
                              className="flex min-w-0 gap-3 text-left"
                              disabled={!product}
                            >
                              {product ? (
                                <LoadingImage
                                  src={product.image}
                                  alt={product.name}
                                  wrapperClassName="h-20 w-20 shrink-0 overflow-hidden rounded-2xl bg-secondary sm:h-24 sm:w-24"
                                  className="h-full w-full object-cover"
                                  width={192}
                                  height={192}
                                />
                              ) : (
                                <span className="grid h-20 w-20 shrink-0 place-items-center rounded-2xl bg-secondary text-muted-foreground sm:h-24 sm:w-24">
                                  <PackageCheck className="h-6 w-6" />
                                </span>
                              )}
                              <span className="min-w-0 flex-1">
                                <span className="block line-clamp-2 text-sm font-bold sm:text-base">
                                  {product?.name ?? "Produto removido"}
                                </span>
                                <span className="mt-1 block text-xs font-semibold uppercase text-primary">
                                  {store?.name ?? "BW7 Marketplace"}
                                </span>
                                <span className="mt-2 block text-sm text-muted-foreground">
                                  Quantidade:{" "}
                                  <strong className="text-foreground">{order.quantity}</strong>
                                </span>
                              </span>
                            </button>

                            <div className="rounded-2xl bg-secondary/70 p-3 text-sm sm:p-4">
                              <div className="flex items-center gap-2 font-bold text-foreground">
                                {order.paymentMethod === "pix" ? (
                                  <QrCode className="h-4 w-4 text-primary" />
                                ) : (
                                  <CreditCard className="h-4 w-4 text-primary" />
                                )}
                                {paymentLabel}
                              </div>
                              <div className="mt-3 space-y-2 text-xs">
                                <div className="flex justify-between gap-3">
                                  <span className="text-muted-foreground">Produtos</span>
                                  <span className="font-semibold">
                                    {formatPrice(order.subtotal)}
                                  </span>
                                </div>
                                {order.discount > 0 ? (
                                  <div className="flex justify-between gap-3">
                                    <span className="text-muted-foreground">Desconto</span>
                                    <span className="font-semibold text-primary">
                                      - {formatPrice(order.discount)}
                                    </span>
                                  </div>
                                ) : null}
                                {order.interest > 0 ? (
                                  <div className="flex justify-between gap-3">
                                    <span className="text-muted-foreground">Juros</span>
                                    <span className="font-semibold">
                                      {formatPrice(order.interest)}
                                    </span>
                                  </div>
                                ) : null}
                                <div className="flex justify-between gap-3 border-t border-border pt-2">
                                  <span className="font-bold">Total</span>
                                  <span className="font-extrabold text-primary">
                                    {formatPrice(order.total)}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
          </>
        )}
      </section>
    </main>
  );
}

function EmptyState({
  title,
  description,
  actionLabel,
  onAction,
}: {
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}) {
  return (
    <div className="rounded-3xl bg-card px-5 py-9 text-center shadow-soft sm:px-6 sm:py-10">
      <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-primary-soft text-primary">
        <ReceiptText className="h-7 w-7" />
      </span>
      <h2 className="mt-5 text-lg font-extrabold">{title}</h2>
      <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-muted-foreground">{description}</p>
      {actionLabel && onAction ? (
        <button
          type="button"
          onClick={onAction}
          className="mt-6 h-11 rounded-full bg-primary px-6 text-sm font-bold text-primary-foreground shadow-soft"
        >
          {actionLabel}
        </button>
      ) : null}
    </div>
  );
}
