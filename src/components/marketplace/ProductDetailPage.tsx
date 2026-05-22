import { lazy, Suspense, useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  BadgeCheck,
  CreditCard,
  MapPin,
  MessageCircle,
  Minus,
  Plus,
  QrCode,
  RotateCcw,
  Share2,
  ShoppingBag,
  Sparkle,
  Star,
  Truck,
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useNavigate } from "@tanstack/react-router";
import { products, type Product } from "@/data/products";
import { marketplaceStores } from "@/data/stores";
import { useMarketplace } from "@/store/marketplace";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { ChatScreenContext } from "./AiChat";
import { HeaderSearch } from "./HeaderSearch";
import { LoadingImage } from "./LoadingImage";

const LazyChatSheet = lazy(() =>
  import("./AiChatSheet").then((module) => ({
    default: module.ChatSheet,
  })),
);

const tagStyles: Record<string, string> = {
  Novo: "bg-mint text-primary-dark",
  "Mais vendido": "bg-primary text-primary-foreground",
  Oferta: "bg-primary-soft text-primary",
};

const descriptions: Record<string, string> = {
  "1": "Meias macias com acabamento premium para uso diário, combinando conforto, durabilidade e um toque delicado no visual.",
  "2": "Faixinha leve e confortável para compor penteados rápidos com acabamento feminino e elegante.",
  "3": "Sandália versátil para produções casuais ou mais arrumadas, com visual sofisticado e ajuste confortável.",
  "4": "Tênis pensado para conforto prolongado, com proposta terapêutica e design fácil de combinar.",
  "5": "Cookie artesanal com recheio generoso, ideal para presentear ou transformar uma pausa em um mimo especial.",
  "6": "Óculos redondo com desenho feminino, leve e marcante para completar o look do dia.",
  "7": "Calça jeans modeladora com caimento valorizado, feita para acompanhar a rotina com estilo.",
  "8": "Kit de beleza completo para cuidados essenciais, reunindo praticidade e uma experiência pronta para presentear.",
};

const mockStockByProductId: Record<string, number> = {
  "1": 18,
  "2": 9,
  "3": 14,
  "4": 7,
  "5": 24,
  "6": 11,
  "7": 6,
  "8": 13,
};

function formatPrice(value: number) {
  return `R$ ${value.toFixed(2).replace(".", ",")}`;
}

function formatPostalCode(value: string) {
  const digits = value.replace(/\D/g, "").slice(0, 8);
  if (digits.length <= 5) return digits;
  return `${digits.slice(0, 5)}-${digits.slice(5)}`;
}

function ProductMiniCard({ product }: { product: Product }) {
  const { openProduct } = useMarketplace();

  return (
    <button
      type="button"
      onClick={() => openProduct(product.id)}
      className="group w-36 shrink-0 overflow-hidden rounded-2xl bg-card text-left shadow-soft transition-transform active:scale-[0.98]"
    >
      <div className="aspect-square overflow-hidden bg-secondary">
        <LoadingImage
          src={product.image}
          alt={product.name}
          wrapperClassName="h-full w-full"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          width={288}
          height={288}
        />
      </div>
      <div className="p-3">
        <p className="line-clamp-2 min-h-[2.35em] text-xs font-semibold leading-snug">
          {product.name}
        </p>
        <p className="mt-1 text-sm font-bold text-primary">{formatPrice(product.price)}</p>
      </div>
    </button>
  );
}

function ProductShelf({
  title,
  subtitle,
  items,
}: {
  title: string;
  subtitle: string;
  items: Product[];
}) {
  if (items.length === 0) return null;

  return (
    <section className="mt-6">
      <div className="mb-3 flex items-end justify-between gap-3">
        <div>
          <h2 className="text-[17px] font-semibold tracking-tight">{title}</h2>
          <p className="text-xs text-muted-foreground">{subtitle}</p>
        </div>
      </div>
      <div className="-mx-4 flex gap-3 overflow-x-auto px-4 pb-2 scrollbar-hide">
        {items.map((item) => (
          <ProductMiniCard key={item.id} product={item} />
        ))}
      </div>
    </section>
  );
}

function PaymentOptionsModal({
  open,
  onOpenChange,
  total,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  total: number;
}) {
  const installmentOptions = [1, 2, 3, 4, 5, 10];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[calc(100%-2rem)] max-w-lg rounded-3xl border-border bg-card p-0 shadow-float">
        <div className="p-5 sm:p-6">
          <DialogHeader className="text-left">
            <DialogTitle>Opções de pagamento</DialogTitle>
            <DialogDescription>
              Simulação de pagamento para este produto no marketplace BW7.
            </DialogDescription>
          </DialogHeader>

          <div className="mt-5 grid gap-3">
            <div className="rounded-2xl border border-primary/25 bg-primary-soft/70 p-4">
              <div className="flex items-start gap-3">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-card text-primary">
                  <QrCode className="h-5 w-5" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="font-bold text-foreground">Pix</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Aprovação imediata após confirmação mockada.
                  </p>
                </div>
                <span className="shrink-0 text-sm font-extrabold text-primary">
                  {formatPrice(total)}
                </span>
              </div>
            </div>

            <div className="rounded-2xl border border-border bg-secondary/50 p-4">
              <div className="mb-3 flex items-center gap-2 font-bold">
                <CreditCard className="h-5 w-5 text-primary" />
                Cartão de crédito
              </div>
              <div className="divide-y divide-border/70 text-sm">
                {installmentOptions.map((installments) => (
                  <div key={installments} className="flex items-center justify-between gap-3 py-2">
                    <span className="text-muted-foreground">{installments}x sem juros</span>
                    <span className="font-semibold text-foreground">
                      {formatPrice(total / installments)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export function ProductDetailPage({ product }: { product: Product }) {
  const navigate = useNavigate();
  const {
    addToCart,
    cart,
    closeProduct,
    openCheckout,
    openStoreProfile,
    postalCode,
    setActiveNav,
    setPostalCode,
  } = useMarketplace();
  const [chatOpen, setChatOpen] = useState(false);
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [shippingEditing, setShippingEditing] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const productStore = marketplaceStores.find((store) => store.productIds.includes(product.id));
  const sameStoreProducts = productStore
    ? productStore.productIds
        .filter((id) => id !== product.id)
        .map((id) => products.find((item) => item.id === id))
        .filter((item): item is Product => Boolean(item))
    : [];
  const similarProducts = products
    .filter((item) => item.id !== product.id)
    .filter((item) => item.category === product.category)
    .filter((item) => !sameStoreProducts.some((storeProduct) => storeProduct.id === item.id))
    .slice(0, 6);
  const galleryImages = [product.image];
  const hasMultipleImages = galleryImages.length > 1;
  const discount = product.oldPrice
    ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)
    : null;
  const shippingPrice = useMemo(() => 7.9 + Number(product.id) * 1.35, [product.id]);
  const deliveryDays = 2 + (Number(product.id) % 4);
  const availableStock = mockStockByProductId[product.id] ?? 10;
  const postalCodeDigits = postalCode.replace(/\D/g, "");
  const hasValidPostalCode = postalCodeDigits.length === 8;
  const showShippingEstimate = hasValidPostalCode && !shippingEditing;
  const canDecreaseQuantity = quantity > 1;
  const canIncreaseQuantity = quantity < availableStock;
  const selectedProductsTotal = product.price * quantity;
  const chatContext: ChatScreenContext = {
    screen: "produto",
    product: {
      id: product.id,
      name: product.name,
      price: formatPrice(product.price),
      category: product.category,
      tag: product.tag,
      storeName: productStore?.name,
    },
    store: productStore
      ? {
          id: productStore.id,
          name: productStore.name,
          owner: productStore.owner,
          location: productStore.location,
          rating: productStore.rating,
          sales: productStore.sales,
          badge: productStore.badge,
          products: sameStoreProducts.map((item) => item.name),
        }
      : undefined,
    cart: {
      count: cart.size,
      products: [...cart]
        .map((id) => products.find((item) => item.id === id)?.name)
        .filter((name): name is string => Boolean(name)),
    },
  };

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    setShippingEditing(false);
    setQuantity(1);
  }, [product.id]);

  function handlePostalCodeChange(event: React.ChangeEvent<HTMLInputElement>) {
    setPostalCode(formatPostalCode(event.target.value));
  }

  function handleShippingSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!hasValidPostalCode) return;
    setShippingEditing(false);
  }

  function handleCartClick() {
    addToCart(product.id);
    closeProduct();
    setActiveNav("Carrinho");
    navigate({ to: "/carrinho" });
  }

  function handleBuyNow() {
    openCheckout(product.id, quantity);
  }

  function decreaseQuantity() {
    setQuantity((current) => Math.max(1, current - 1));
  }

  function increaseQuantity() {
    setQuantity((current) => Math.min(availableStock, current + 1));
  }

  return (
    <main className="min-h-screen bg-background pb-28 lg:pb-12">
      <div className="hidden lg:block">
        <HeaderSearch />
      </div>

      <header className="sticky top-0 z-30 flex items-center justify-between bg-background/85 px-4 py-4 backdrop-blur-xl lg:hidden">
        <button
          type="button"
          onClick={closeProduct}
          aria-label="Voltar"
          className="grid h-11 w-11 place-items-center rounded-2xl bg-card text-foreground shadow-soft transition-transform active:scale-95"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        {LazyChatSheet && (
          <button
            type="button"
            onClick={() => setChatOpen(true)}
            aria-label="Falar com a Assistente BW7"
            className="relative grid h-11 w-11 place-items-center rounded-2xl bg-gradient-hero text-primary-foreground shadow-soft transition-transform active:scale-95"
          >
            <MessageCircle className="h-5 w-5" />
            <Sparkle
              className="absolute -right-1 -top-1 h-4 w-4 rounded-full bg-mint p-0.5 text-primary-dark ring-2 ring-background"
              fill="currentColor"
            />
          </button>
        )}
      </header>

      <motion.section
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 260, damping: 28 }}
        className="lg:hidden"
      >
        <div className="relative mx-4 overflow-hidden rounded-[28px] bg-secondary/50 shadow-card">
          <LoadingImage
            src={product.image}
            alt={product.name}
            wrapperClassName="aspect-square w-full"
            className="h-full w-full object-cover"
            width={768}
            height={768}
          />
          {product.tag && (
            <span
              className={`absolute left-4 top-4 rounded-full px-3 py-1 text-xs font-bold ${tagStyles[product.tag]}`}
            >
              {product.tag}
            </span>
          )}
        </div>

        <div className="px-4 pt-5">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <p className="text-xs font-semibold uppercase text-primary">{product.category}</p>
              <h1 className="mt-1 text-[25px] font-bold leading-tight tracking-tight">
                {product.name}
              </h1>
            </div>
            <div className="flex shrink-0 items-center gap-1 rounded-full bg-card px-3 py-2 text-xs font-bold text-primary shadow-soft">
              <Star className="h-4 w-4 fill-primary text-primary" />
              4,8
            </div>
          </div>

          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-[26px] font-extrabold text-primary">
              {formatPrice(product.price)}
            </span>
            {product.oldPrice && (
              <span className="text-sm text-muted-foreground line-through">
                {formatPrice(product.oldPrice)}
              </span>
            )}
            {discount && (
              <span className="rounded-full bg-mint px-2 py-1 text-[11px] font-bold text-primary-dark">
                -{discount}%
              </span>
            )}
          </div>

          <p className="mt-4 text-sm leading-6 text-muted-foreground">
            {descriptions[product.id] ?? "Produto selecionado no marketplace BW7."}
          </p>

          <div className="mt-5 grid grid-cols-3 gap-2">
            {["Entrega combinada", "Compra segura", "Vendedora BW7"].map((item) => (
              <div
                key={item}
                className="rounded-2xl bg-card px-3 py-3 text-center text-[11px] font-semibold text-foreground shadow-soft"
              >
                {item}
              </div>
            ))}
          </div>

          <div className="mt-5 flex items-center justify-between rounded-2xl bg-card px-4 py-3 shadow-soft">
            <div>
              <span className="text-sm font-semibold">Quantidade</span>
              <p className="mt-0.5 text-[11px] text-muted-foreground">
                {availableStock} unidades em estoque
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={decreaseQuantity}
                disabled={!canDecreaseQuantity}
                aria-label="Diminuir quantidade"
                className="grid h-8 w-8 place-items-center rounded-full bg-secondary text-muted-foreground disabled:cursor-not-allowed disabled:opacity-45"
              >
                <Minus className="h-4 w-4" />
              </button>
              <span className="grid h-8 min-w-8 place-items-center text-sm font-bold">
                {quantity}
              </span>
              <button
                type="button"
                onClick={increaseQuantity}
                disabled={!canIncreaseQuantity}
                aria-label="Aumentar quantidade"
                className="grid h-8 w-8 place-items-center rounded-full bg-primary-soft text-primary disabled:cursor-not-allowed disabled:opacity-45"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
          </div>
          <div className="mt-2 flex items-center justify-between rounded-2xl bg-secondary px-4 py-3 text-sm">
            <span className="font-semibold text-foreground">Total selecionado</span>
            <span className="font-bold text-primary">{formatPrice(selectedProductsTotal)}</span>
          </div>

          <form
            onSubmit={handleShippingSubmit}
            className="mt-5 rounded-2xl bg-card p-4 shadow-soft"
          >
            <div className="mb-3 flex items-center gap-2">
              <Truck className="h-5 w-5 text-primary" />
              <div>
                <h2 className="text-sm font-bold">Calcular frete</h2>
                <p className="text-xs text-muted-foreground">Simulação para entrega nacional</p>
              </div>
            </div>

            <div className={showShippingEstimate ? "hidden" : "flex gap-2"}>
              <label className="sr-only" htmlFor="shipping-postal-code">
                CEP
              </label>
              <input
                id="shipping-postal-code"
                value={postalCode}
                onChange={handlePostalCodeChange}
                inputMode="numeric"
                maxLength={9}
                placeholder="Digite seu CEP"
                className="h-11 min-w-0 flex-1 rounded-full bg-secondary px-4 text-sm outline-none placeholder:text-muted-foreground focus:ring-2 focus:ring-primary"
              />
              <button
                type="submit"
                disabled={!hasValidPostalCode}
                className="h-11 rounded-full bg-primary-soft px-4 text-xs font-bold text-primary transition-colors hover:bg-primary hover:text-primary-foreground disabled:cursor-not-allowed disabled:opacity-50"
              >
                Calcular
              </button>
            </div>

            {showShippingEstimate && (
              <div className="mt-3 rounded-2xl bg-secondary px-4 py-3">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex min-w-0 items-center gap-2">
                    <MapPin className="h-4 w-4 shrink-0 text-primary" />
                    <span className="truncate text-xs font-semibold">
                      Entrega em {deliveryDays} dias úteis
                    </span>
                  </div>
                  <div className="shrink-0 text-right">
                    <span className="block text-xs font-bold text-primary">
                      {formatPrice(shippingPrice)}
                    </span>
                    <button
                      type="button"
                      onClick={() => setShippingEditing(true)}
                      className="mt-1 text-[11px] font-bold text-primary underline-offset-2 hover:underline"
                    >
                      Alterar CEP
                    </button>
                  </div>
                </div>
              </div>
            )}
          </form>

          <ProductShelf
            title={productStore ? `Mais da ${productStore.name}` : "Mais da mesma loja"}
            subtitle="Produtos da mesma vendedora"
            items={sameStoreProducts}
          />

          <ProductShelf
            title="Produtos similares"
            subtitle="Outras opções que combinam com essa busca"
            items={similarProducts}
          />
        </div>
      </motion.section>

      <section
        className={`mx-auto hidden max-w-[1760px] gap-7 px-6 py-8 text-foreground lg:grid ${
          hasMultipleImages
            ? "grid-cols-[80px_minmax(420px,1.05fr)_minmax(420px,0.9fr)_304px]"
            : "grid-cols-[minmax(420px,1.05fr)_minmax(420px,0.9fr)_304px]"
        }`}
      >
        {hasMultipleImages && (
          <aside className="flex flex-col gap-3">
            {galleryImages.map((image, index) => (
              <button
                key={image}
                type="button"
                className={`grid h-[66px] w-[66px] place-items-center overflow-hidden rounded-lg border bg-card p-1 transition-colors ${
                  index === 0 ? "border-primary" : "border-border hover:border-primary-mid"
                }`}
                aria-label={`Ver imagem ${index + 1}`}
              >
                <LoadingImage
                  src={image}
                  alt={product.name}
                  wrapperClassName="h-full w-full"
                  className="h-full w-full object-cover"
                  width={132}
                  height={132}
                />
              </button>
            ))}
          </aside>
        )}

        <div className="self-start">
          <div className="relative min-h-[580px] bg-background">
            <button
              type="button"
              aria-label="Compartilhar"
              className="absolute right-3 top-3 z-10 grid h-10 w-10 place-items-center rounded-full bg-card text-foreground shadow-soft ring-1 ring-border"
            >
              <Share2 className="h-5 w-5" />
            </button>
            <LoadingImage
              src={product.image}
              alt={product.name}
              wrapperClassName="flex min-h-[580px] w-full items-center justify-center"
              className="max-h-[620px] w-full object-contain"
              width={900}
              height={900}
            />
          </div>
        </div>

        <section className="min-w-0">
          {productStore ? (
            <button
              type="button"
              onClick={() => openStoreProfile(productStore.id)}
              className="text-sm font-semibold text-primary transition-colors hover:text-primary-mid"
            >
              Visite a loja {productStore.name}
            </button>
          ) : (
            <p className="text-sm font-semibold text-primary">{product.category}</p>
          )}
          <h1 className="mt-1 text-[30px] font-bold leading-tight text-foreground">
            {product.name}
          </h1>

          <div className="mt-3 flex flex-wrap items-center gap-2 text-sm">
            <span>4,8</span>
            <span className="flex text-primary" aria-label="Avaliação 4,8 de 5">
              {Array.from({ length: 5 }).map((_, index) => (
                <Star key={index} className="h-4 w-4 fill-current" />
              ))}
            </span>
            <span className="text-primary">(2.064)</span>
            <span className="text-muted-foreground">|</span>
            <button type="button" className="text-primary">
              Pesquisar nesta página
            </button>
          </div>

          <div className="mt-3 flex items-center gap-3">
            {product.tag && (
              <span
                className={`rounded-full px-3 py-1 text-xs font-bold ${tagStyles[product.tag]}`}
              >
                {product.tag}
              </span>
            )}
          </div>

          <hr className="my-4 border-border" />

          <div>
            <div className="flex items-start gap-1">
              <span className="mt-2 text-sm">R$</span>
              <span className="text-[42px] font-extrabold leading-none text-primary">
                {Math.floor(product.price)}
              </span>
              <span className="mt-1 text-xl">{(product.price % 1).toFixed(2).slice(2)}</span>
            </div>
            {product.oldPrice && (
              <p className="mt-1 text-sm text-slate-500">
                De: <span className="line-through">{formatPrice(product.oldPrice)}</span>
              </p>
            )}
            <p className="mt-3 text-base leading-6 text-foreground">
              à vista no Pix ou cartão.{" "}
              <strong>Ou em até 10x de {formatPrice(product.price / 10)} sem juros</strong>
            </p>
            <button
              type="button"
              onClick={() => setPaymentModalOpen(true)}
              className="mt-1 text-sm font-semibold text-primary"
            >
              Ver opções de pagamento
            </button>
          </div>

          <div className="mt-6 grid grid-cols-3 gap-4 border-y border-border py-5">
            {[
              { label: "Pagamentos e Segurança", icon: CreditCard },
              { label: "Enviado pela BW7", icon: Truck },
              { label: "Política de devolução", icon: RotateCcw },
            ].map(({ label, icon: Icon }) => (
              <div key={label} className="text-center text-sm font-semibold text-primary">
                <span className="mx-auto mb-2 grid h-11 w-11 place-items-center rounded-full bg-primary-soft text-primary ring-1 ring-border">
                  <Icon className="h-5 w-5" />
                </span>
                {label}
              </div>
            ))}
          </div>

          <div className="mt-6">
            <p className="text-sm">
              Cor: <strong>{product.tag === "Oferta" ? "Violeta" : "Selecionada"}</strong>
            </p>
            <div className="mt-2 flex gap-3">
              {galleryImages.map((image, index) => (
                <button
                  key={index}
                  type="button"
                  className={`h-[110px] w-[98px] overflow-hidden rounded-2xl border bg-card p-2 ${
                    index === 0 ? "border-primary ring-2 ring-primary" : "border-border"
                  }`}
                >
                  <LoadingImage
                    src={image}
                    alt={product.name}
                    wrapperClassName="h-12 w-full"
                    className="h-full w-full object-contain"
                    width={120}
                    height={120}
                  />
                  <span className="mt-2 block text-left text-sm font-semibold">
                    {formatPrice(product.price)}
                  </span>
                  {product.oldPrice && (
                    <span className="block text-left text-xs text-slate-500 line-through">
                      {formatPrice(product.oldPrice)}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-8">
            <h2 className="text-lg font-bold">Sobre este produto</h2>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground">
              {descriptions[product.id] ?? "Produto selecionado no marketplace BW7."}
            </p>
          </div>
        </section>

        <aside className="h-max rounded-2xl border border-border bg-card p-5 shadow-soft">
          <div className="flex items-start gap-1">
            <span className="mt-2 text-sm">R$</span>
            <span className="text-[38px] font-extrabold leading-none text-primary">
              {Math.floor(product.price)}
            </span>
            <span className="mt-1 text-lg">{(product.price % 1).toFixed(2).slice(2)}</span>
          </div>
          <form
            onSubmit={handleShippingSubmit}
            className={showShippingEstimate ? "hidden" : "mt-4"}
          >
            <label
              className="mb-2 block text-sm font-semibold text-foreground"
              htmlFor="shipping-postal-code-desktop"
            >
              Calcular entrega
            </label>
            <div className="flex gap-2">
              <input
                id="shipping-postal-code-desktop"
                value={postalCode}
                onChange={handlePostalCodeChange}
                inputMode="numeric"
                maxLength={9}
                placeholder="Digite seu CEP"
                className="h-10 min-w-0 flex-1 rounded-full bg-secondary px-4 text-sm outline-none placeholder:text-muted-foreground focus:ring-2 focus:ring-primary"
              />
              <button
                type="submit"
                disabled={!hasValidPostalCode}
                className="h-10 rounded-full bg-primary-soft px-4 text-xs font-bold text-primary transition-colors hover:bg-primary hover:text-primary-foreground disabled:cursor-not-allowed disabled:opacity-50"
              >
                OK
              </button>
            </div>
          </form>
          {showShippingEstimate ? (
            <div className="mt-3 rounded-2xl bg-secondary/70 px-4 py-3 text-sm">
              <div className="flex items-start gap-2">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                <div>
                  <p className="font-semibold text-foreground">
                    Entrega em {deliveryDays} dias úteis
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    CEP {postalCode} - frete {formatPrice(shippingPrice)}
                  </p>
                  <button
                    type="button"
                    onClick={() => setShippingEditing(true)}
                    className="mt-2 text-xs font-bold text-primary underline-offset-2 hover:underline"
                  >
                    Alterar CEP
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <p className="mt-3 text-sm leading-6 text-foreground">
              Informe seu CEP para simular prazo e frete deste produto.
            </p>
          )}
          <div className="mt-5">
            <p className="text-xl font-semibold text-primary">Em estoque</p>
            <p className="mt-1 text-sm text-muted-foreground">
              {availableStock} unidades disponíveis
            </p>
          </div>
          <div className="mt-4 rounded-2xl border border-border bg-secondary/40 p-3">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-foreground">Quantidade</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Estoque mockado: {availableStock} unidades
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={decreaseQuantity}
                  disabled={!canDecreaseQuantity}
                  aria-label="Diminuir quantidade"
                  className="grid h-9 w-9 place-items-center rounded-full bg-card text-muted-foreground ring-1 ring-border disabled:cursor-not-allowed disabled:opacity-45"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="grid h-9 min-w-9 place-items-center rounded-full bg-card px-2 text-sm font-bold text-foreground ring-1 ring-border">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={increaseQuantity}
                  disabled={!canIncreaseQuantity}
                  aria-label="Aumentar quantidade"
                  className="grid h-9 w-9 place-items-center rounded-full bg-primary-soft text-primary ring-1 ring-border disabled:cursor-not-allowed disabled:opacity-45"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            </div>
            <div className="mt-3 flex items-center justify-between border-t border-border pt-3 text-sm">
              <span className="font-semibold text-foreground">Total selecionado</span>
              <span className="font-bold text-primary">{formatPrice(selectedProductsTotal)}</span>
            </div>
          </div>
          <div className="mt-5 grid gap-2">
            <button
              type="button"
              onClick={() => addToCart(product.id)}
              className="h-11 rounded-full bg-primary-soft text-sm font-bold text-primary transition-colors hover:bg-primary hover:text-primary-foreground"
            >
              Adicionar ao carrinho
            </button>
            <button
              type="button"
              onClick={handleBuyNow}
              className="h-11 rounded-full bg-primary text-sm font-bold text-primary-foreground shadow-float transition-transform active:scale-95"
            >
              Comprar agora
            </button>
          </div>

          <div className="mt-6 grid gap-2 text-sm">
            <div className="flex justify-between gap-3">
              <span className="text-slate-500">Enviado por</span>
              <span className="text-right">{productStore?.name ?? "BW7 Marketplace"}</span>
            </div>
            <div className="flex justify-between gap-3">
              <span className="text-slate-500">Vendido por</span>
              <span className="text-right">{productStore?.owner ?? "BW7"}</span>
            </div>
            <div className="flex justify-between gap-3">
              <span className="text-slate-500">Pagamento</span>
              <span className="text-right text-primary">Transação segura</span>
            </div>
          </div>

          <div className="mt-5 rounded-2xl border border-border bg-secondary/40 p-3 text-sm">
            <div className="flex items-center gap-2 font-semibold">
              <BadgeCheck className="h-4 w-4 text-primary" />
              Compra segura BW7
            </div>
            <p className="mt-2 text-xs leading-5 text-muted-foreground">
              Suporte para pedidos, entrega e devolução diretamente pelo marketplace.
            </p>
          </div>
        </aside>
      </section>

      <section className="mx-auto hidden max-w-7xl px-6 pb-10 lg:block">
        <ProductShelf
          title={productStore ? `Mais da ${productStore.name}` : "Mais da mesma loja"}
          subtitle="Produtos da mesma vendedora"
          items={sameStoreProducts}
        />
        <ProductShelf
          title="Produtos similares"
          subtitle="Outras opções que combinam com essa busca"
          items={similarProducts}
        />
      </section>

      <div className="fixed bottom-0 left-1/2 z-40 grid w-full max-w-md -translate-x-1/2 grid-cols-[0.88fr_1.12fr] gap-2 bg-background/90 px-4 pb-5 pt-3 backdrop-blur-xl lg:hidden">
        <button
          type="button"
          onClick={handleCartClick}
          className="flex h-13 items-center justify-center gap-2 rounded-full bg-primary-soft text-xs font-bold text-primary transition-transform active:scale-95"
        >
          <ShoppingBag className="h-5 w-5" />
          Carrinho
        </button>
        <button
          type="button"
          onClick={handleBuyNow}
          className="flex h-13 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground shadow-float transition-transform active:scale-95"
        >
          Comprar agora
        </button>
      </div>

      <AnimatePresence>
        {chatOpen && LazyChatSheet && (
          <Suspense fallback={null}>
            <LazyChatSheet context={chatContext} onClose={() => setChatOpen(false)} />
          </Suspense>
        )}
      </AnimatePresence>

      <PaymentOptionsModal
        open={paymentModalOpen}
        onOpenChange={setPaymentModalOpen}
        total={selectedProductsTotal}
      />
    </main>
  );
}
