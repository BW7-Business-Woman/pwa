import { ArrowRight, MapPin, Package, ShoppingBag, Store, Trash2 } from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "@tanstack/react-router";
import { products, type Product } from "@/data/products";
import { marketplaceStores } from "@/data/stores";
import { useMarketplace } from "@/store/marketplace";
import { LoadingImage } from "./LoadingImage";

type StoreGroup = {
  store: (typeof marketplaceStores)[number];
  items: Product[];
};

function formatPrice(value: number) {
  return `R$ ${value.toFixed(2).replace(".", ",")}`;
}

function getProductStore(productId: string) {
  return marketplaceStores.find((store) => store.productIds.includes(productId));
}

function groupCartProducts(cartIds: Set<string>): StoreGroup[] {
  const grouped = new Map<string, StoreGroup>();

  [...cartIds]
    .map((id) => products.find((product) => product.id === id))
    .filter((product): product is Product => Boolean(product))
    .forEach((product) => {
      const store = getProductStore(product.id);
      if (!store) return;

      const group = grouped.get(store.id) ?? { store, items: [] };
      group.items.push(product);
      grouped.set(store.id, group);
    });

  return [...grouped.values()];
}

export function CartPage() {
  const navigate = useNavigate();
  const { cart, removeFromCart, openProduct, setActiveNav, addToCart } = useMarketplace();
  const groups = groupCartProducts(cart);
  const cartProducts = groups.flatMap((group) => group.items);
  const subtotal = cartProducts.reduce((sum, product) => sum + product.price, 0);
  const shippingEstimate = groups.length ? groups.length * 7.9 : 0;
  const total = subtotal + shippingEstimate;

  if (cartProducts.length === 0) {
    return (
      <main className="min-h-screen bg-background pb-28">
        <header className="sticky top-0 z-30 bg-background/90 px-4 pb-4 pt-5 backdrop-blur-xl">
          <div className="flex items-center gap-3">
            <div className="grid h-11 w-11 place-items-center rounded-2xl bg-primary-soft text-primary">
              <ShoppingBag className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight">Carrinho</h1>
              <p className="text-xs text-muted-foreground">Produtos separados por loja</p>
            </div>
          </div>
        </header>

        <section className="px-4 pt-10">
          <div className="rounded-3xl bg-card px-6 py-10 text-center shadow-soft">
            <div className="mx-auto grid h-16 w-16 place-items-center rounded-3xl bg-primary-soft text-primary">
              <ShoppingBag className="h-8 w-8" />
            </div>
            <h2 className="mt-5 text-lg font-bold tracking-tight">Seu carrinho está vazio</h2>
            <p className="mx-auto mt-2 max-w-64 text-sm leading-6 text-muted-foreground">
              Adicione produtos das vitrines BW7 para revisar tudo por loja antes de finalizar.
            </p>
            <button
              type="button"
              onClick={() => {
                setActiveNav("Início");
                navigate({ to: "/" });
              }}
              className="mt-6 h-11 rounded-full bg-primary px-5 text-sm font-bold text-primary-foreground shadow-soft transition-transform active:scale-[0.98]"
            >
              Ver produtos
            </button>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background pb-28">
      <header className="sticky top-0 z-30 bg-background/90 px-4 pb-4 pt-5 backdrop-blur-xl">
        <div className="flex items-center gap-3">
          <div className="grid h-11 w-11 place-items-center rounded-2xl bg-primary-soft text-primary">
            <ShoppingBag className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight">Carrinho</h1>
            <p className="text-xs text-muted-foreground">
              {cartProducts.length} produto{cartProducts.length === 1 ? "" : "s"} em {groups.length}{" "}
              loja
              {groups.length === 1 ? "" : "s"}
            </p>
          </div>
        </div>
      </header>

      <div className="px-4 pt-3 lg:px-8 lg:pt-6 lg:flex lg:items-start lg:gap-6">
        <section className="space-y-3 flex-1">
          {groups.map((group, groupIndex) => {
            const storeSubtotal = group.items.reduce((sum, product) => sum + product.price, 0);

            return (
              <motion.article
                key={group.store.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  delay: groupIndex * 0.05,
                  type: "spring",
                  stiffness: 260,
                  damping: 28,
                }}
                className="overflow-hidden rounded-3xl bg-card shadow-soft"
              >
                <div className="border-b border-border/70 px-4 py-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex min-w-0 items-start gap-3">
                      <div className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-secondary text-primary">
                        <Store className="h-5 w-5" />
                      </div>
                      <div className="min-w-0">
                        <h2 className="truncate text-base font-bold">{group.store.name}</h2>
                        <p className="mt-0.5 text-xs font-medium text-primary">
                          {group.store.owner}
                        </p>
                        <div className="mt-2 flex items-center gap-1 text-xs text-muted-foreground">
                          <MapPin className="h-3.5 w-3.5" />
                          {group.store.location}
                        </div>
                      </div>
                    </div>
                    <span className="shrink-0 rounded-full bg-mint px-2 py-1 text-[10px] font-bold text-primary-dark">
                      {group.items.length} item{group.items.length === 1 ? "" : "s"}
                    </span>
                  </div>
                </div>

                <div className="divide-y divide-border/70">
                  {group.items.map((product) => (
                    <div key={product.id} className="flex gap-3 px-4 py-3">
                      <button
                        type="button"
                        onClick={() => openProduct(product.id)}
                        className="shrink-0 overflow-hidden rounded-2xl"
                        aria-label={`Abrir ${product.name}`}
                      >
                        <LoadingImage
                          src={product.image}
                          alt={product.name}
                          wrapperClassName="h-20 w-20 rounded-2xl"
                          className="h-full w-full object-cover"
                          width={160}
                          height={160}
                        />
                      </button>

                      <div className="min-w-0 flex-1">
                        <button
                          type="button"
                          onClick={() => openProduct(product.id)}
                          className="line-clamp-2 text-left text-sm font-semibold leading-snug"
                        >
                          {product.name}
                        </button>
                        <div className="mt-1 flex items-baseline gap-1.5">
                          <span className="text-[15px] font-bold text-primary">
                            {formatPrice(product.price)}
                          </span>
                          {product.oldPrice && (
                            <span className="text-[11px] text-muted-foreground line-through">
                              {formatPrice(product.oldPrice)}
                            </span>
                          )}
                        </div>
                        <div className="mt-2 flex items-center gap-1.5 text-[11px] text-muted-foreground">
                          <Package className="h-3.5 w-3.5" />
                          Entrega combinada com a loja
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => removeFromCart(product.id)}
                        aria-label={`Remover ${product.name}`}
                        className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-secondary text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-between bg-secondary/55 px-4 py-3">
                  <span className="text-xs font-semibold text-muted-foreground">
                    Subtotal da loja
                  </span>
                  <span className="text-sm font-bold text-foreground">
                    {formatPrice(storeSubtotal)}
                  </span>
                </div>
              </motion.article>
            );
          })}
        </section>

        <aside className="hidden lg:block lg:w-[380px]">
          <div className="sticky top-20">
            <div className="rounded-3xl bg-card p-6 shadow-float ring-1 ring-border/70">
              <div className="space-y-4 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">
                    Subtotal ({cartProducts.length} produtos)
                  </span>
                  <span className="font-semibold">{formatPrice(subtotal)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Frete estimado</span>
                  <span className="font-semibold">{formatPrice(shippingEstimate)}</span>
                </div>
                <div className="flex items-center justify-between border-t border-border pt-3">
                  <span className="font-bold">Total</span>
                  <span className="text-lg font-extrabold text-primary">{formatPrice(total)}</span>
                </div>
              </div>

              <button
                type="button"
                className="mt-6 flex h-12 w-full items-center justify-center gap-2 rounded-full bg-primary text-sm font-bold text-primary-foreground shadow-soft transition-transform active:scale-[0.98]"
              >
                Finalizar compra
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>

            <div className="mt-4 rounded-2xl bg-secondary px-4 py-3 text-xs text-muted-foreground">
              Parte do seu pedido tem frete GRÁTIS. Selecione a opção Frete GRÁTIS na finalização da
              compra.
            </div>

            <div className="mt-4">
              <h3 className="mb-3 text-sm font-bold">Produtos do marketplace</h3>
              <div className="grid gap-3">
                {products
                  .filter((p) => !cart.has(p.id))
                  .slice(0, 4)
                  .map((p) => (
                    <div key={p.id} className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => openProduct(p.id)}
                        className="h-14 w-14 shrink-0 overflow-hidden rounded-md"
                        aria-label={`Abrir ${p.name}`}
                      >
                        <LoadingImage
                          src={p.image}
                          alt={p.name}
                          wrapperClassName="h-full w-full"
                          className="h-full w-full object-cover"
                          width={56}
                          height={56}
                        />
                      </button>

                      <div className="min-w-0 flex-1">
                        <div className="truncate text-sm font-semibold">{p.name}</div>
                        <div className="text-xs text-muted-foreground">{formatPrice(p.price)}</div>
                      </div>

                      <button
                        type="button"
                        onClick={() => addToCart(p.id)}
                        className="ml-2 rounded-full bg-primary px-3 py-1 text-sm font-bold text-primary-foreground"
                      >
                        Adicionar
                      </button>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </aside>
      </div>

      <section className="px-4 pt-4 lg:hidden">
        <div className="rounded-3xl bg-card p-4 shadow-float ring-1 ring-border/70">
          <div className="space-y-2 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Subtotal</span>
              <span className="font-semibold">{formatPrice(subtotal)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Frete estimado</span>
              <span className="font-semibold">{formatPrice(shippingEstimate)}</span>
            </div>
            <div className="flex items-center justify-between border-t border-border pt-3">
              <span className="font-bold">Total</span>
              <span className="text-lg font-extrabold text-primary">{formatPrice(total)}</span>
            </div>
          </div>

          <button
            type="button"
            className="mt-4 flex h-12 w-full items-center justify-center gap-2 rounded-full bg-primary text-sm font-bold text-primary-foreground shadow-soft transition-transform active:scale-[0.98]"
          >
            Finalizar compra
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
        <div className="mt-3">
          <h3 className="mb-3 text-sm font-bold">Produtos do marketplace</h3>
          <div className="-mx-2 flex gap-3 overflow-x-auto px-2">
            {products
              .filter((p) => !cart.has(p.id))
              .slice(0, 6)
              .map((p) => (
                <div key={p.id} className="w-36 shrink-0">
                  <button
                    type="button"
                    onClick={() => openProduct(p.id)}
                    className="overflow-hidden rounded-md bg-white"
                    aria-label={`Abrir ${p.name}`}
                  >
                    <LoadingImage
                      src={p.image}
                      alt={p.name}
                      wrapperClassName="aspect-square w-full"
                      className="h-full w-full object-cover"
                      width={200}
                      height={200}
                    />
                  </button>
                  <div className="mt-2 text-sm">
                    <div className="truncate font-semibold">{p.name}</div>
                    <div className="text-xs text-muted-foreground">{formatPrice(p.price)}</div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </section>
    </main>
  );
}
