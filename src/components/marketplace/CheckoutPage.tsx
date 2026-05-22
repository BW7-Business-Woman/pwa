import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "@tanstack/react-router";
import {
  ArrowLeft,
  BadgeCheck,
  CheckCircle2,
  CreditCard,
  MapPin,
  QrCode,
  ShieldCheck,
} from "lucide-react";
import { products } from "@/data/products";
import { marketplaceStores } from "@/data/stores";
import { useMarketplace } from "@/store/marketplace";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { LoadingImage } from "./LoadingImage";

type PaymentMethod = "pix" | "card";
type CheckoutScreen = "payment" | "confirmation" | "success";
type CardField = "name" | "number" | "expiry" | "cvv";
type MobileCardStep = CardField | "installments";
type Product = (typeof products)[number];
type Store = (typeof marketplaceStores)[number] | undefined;
type CheckoutSummary = {
  subtotal: number;
  shipping: number;
  discount: number;
  interest: number;
  total: number;
};
type CardForm = {
  name: string;
  number: string;
  expiry: string;
  cvv: string;
};

const MAX_CARD_INSTALLMENTS = 10;
const FREE_INSTALLMENTS_LIMIT = 3;
const CARD_FIXED_INTEREST_RATE = 0.0499;

function formatPrice(value: number) {
  return `R$ ${value.toFixed(2).replace(".", ",")}`;
}

function calculateCardInterest(total: number, installments: number) {
  return installments > FREE_INSTALLMENTS_LIMIT ? total * CARD_FIXED_INTEREST_RATE : 0;
}

function getInstallmentTotal(total: number, installments: number) {
  return total + calculateCardInterest(total, installments);
}

function getInstallmentLabel(total: number, installments: number) {
  const installmentTotal = getInstallmentTotal(total, installments);
  const suffix = installments <= FREE_INSTALLMENTS_LIMIT ? "sem juros" : "com juros";
  return `${installments}x de ${formatPrice(installmentTotal / installments)} ${suffix}`;
}

function getProductStore(productId: string) {
  return marketplaceStores.find((store) => store.productIds.includes(productId));
}

function getPaymentCopy(paymentMethod: PaymentMethod) {
  return paymentMethod === "pix"
    ? {
        label: "Pix",
        description: "Aprovação imediata com 3% de desconto mockado.",
      }
    : {
        label: "Cartão",
        description: "Até 3x sem juros. Acima disso, com juros fixos.",
      };
}

function onlyDigits(value: string) {
  return value.replace(/\D/g, "");
}

function formatCardNumber(value: string) {
  return onlyDigits(value)
    .slice(0, 16)
    .replace(/(\d{4})(?=\d)/g, "$1 ")
    .trim();
}

function formatExpiry(value: string) {
  const digits = onlyDigits(value).slice(0, 4);
  if (digits.length <= 2) return digits;
  return `${digits.slice(0, 2)}/${digits.slice(2)}`;
}

function cardNumberPreview(value: string) {
  const digits = onlyDigits(value).padEnd(16, "#").slice(0, 16);
  return digits.replace(/(.{4})(?=.)/g, "$1 ");
}

function CheckoutHeader({
  title,
  subtitle,
  backLabel,
  onBack,
}: {
  title: string;
  subtitle: string;
  backLabel: string;
  onBack: () => void;
}) {
  return (
    <header className="sticky top-0 z-30 bg-background/90 px-4 py-4 backdrop-blur-xl lg:static lg:h-[76px] lg:px-8">
      <div className="mx-auto flex max-w-6xl items-center gap-3">
        <button
          type="button"
          onClick={onBack}
          className="grid h-11 w-11 place-items-center rounded-2xl bg-card text-foreground shadow-soft"
          aria-label={backLabel}
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div>
          <h1 className="text-xl font-bold tracking-tight">{title}</h1>
          <p className="text-xs text-muted-foreground">{subtitle}</p>
        </div>
      </div>
    </header>
  );
}

function ProductCard({
  product,
  store,
  quantity,
  onOpenProduct,
}: {
  product: Product;
  store: Store;
  quantity: number;
  onOpenProduct: () => void;
}) {
  return (
    <article className="rounded-3xl bg-card p-4 shadow-soft lg:p-5">
      <div className="flex gap-3">
        <button
          type="button"
          onClick={onOpenProduct}
          className="shrink-0 overflow-hidden rounded-2xl"
          aria-label={`Abrir ${product.name}`}
        >
          <LoadingImage
            src={product.image}
            alt={product.name}
            wrapperClassName="h-24 w-24 lg:h-28 lg:w-28"
            className="h-full w-full object-cover"
            width={224}
            height={224}
          />
        </button>
        <div className="min-w-0 flex-1">
          <p className="text-xs font-semibold uppercase text-primary">
            {store?.name ?? "BW7 Marketplace"}
          </p>
          <h2 className="mt-1 line-clamp-2 text-base font-bold">{product.name}</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Quantidade: <strong className="text-foreground">{quantity}</strong>
          </p>
          <p className="mt-2 text-lg font-extrabold text-primary">{formatPrice(product.price)}</p>
        </div>
      </div>
    </article>
  );
}

function DeliveryCard({ product, postalCode }: { product: Product; postalCode: string }) {
  return (
    <section className="rounded-3xl bg-card p-4 shadow-soft lg:p-5">
      <div className="mb-4 flex items-center gap-2">
        <MapPin className="h-5 w-5 text-primary" />
        <h2 className="text-base font-bold">Entrega</h2>
      </div>
      <div className="rounded-2xl bg-secondary px-4 py-3 text-sm">
        <p className="font-semibold text-foreground">
          Entrega em {2 + (Number(product.id) % 4)} dias úteis
        </p>
        <p className="mt-1 text-xs text-muted-foreground">
          {postalCode ? `CEP ${postalCode}` : "CEP não informado"} - frete mockado
        </p>
      </div>
    </section>
  );
}

function SummaryCard({
  summary,
  buttonLabel,
  onSubmit,
  helper,
}: {
  summary: CheckoutSummary;
  buttonLabel: string;
  onSubmit: () => void;
  helper?: string;
}) {
  return (
    <aside className="h-max rounded-3xl bg-card p-5 shadow-float ring-1 ring-border/70 lg:sticky lg:top-0">
      <h2 className="text-base font-bold">Resumo</h2>
      <div className="mt-4 space-y-3 text-sm">
        <div className="flex justify-between gap-3">
          <span className="text-muted-foreground">Produtos</span>
          <span className="font-semibold">{formatPrice(summary.subtotal)}</span>
        </div>
        <div className="flex justify-between gap-3">
          <span className="text-muted-foreground">Frete</span>
          <span className="font-semibold">{formatPrice(summary.shipping)}</span>
        </div>
        {summary.discount > 0 ? (
          <div className="flex justify-between gap-3">
            <span className="text-muted-foreground">Desconto Pix</span>
            <span className="font-semibold text-primary">- {formatPrice(summary.discount)}</span>
          </div>
        ) : null}
        {summary.interest > 0 ? (
          <div className="flex justify-between gap-3">
            <span className="text-muted-foreground">Juros do cartão</span>
            <span className="font-semibold">{formatPrice(summary.interest)}</span>
          </div>
        ) : null}
        <div className="flex justify-between gap-3 border-t border-border pt-3">
          <span className="font-bold">Total</span>
          <span className="text-xl font-extrabold text-primary">{formatPrice(summary.total)}</span>
        </div>
      </div>

      <button
        type="button"
        onClick={onSubmit}
        className="mt-5 flex h-12 w-full items-center justify-center gap-2 rounded-full bg-primary text-sm font-bold text-primary-foreground shadow-soft transition-transform active:scale-[0.98]"
      >
        {buttonLabel}
        <ShieldCheck className="h-4 w-4" />
      </button>

      {helper ? <p className="mt-3 text-center text-xs text-muted-foreground">{helper}</p> : null}
    </aside>
  );
}

function CardDetailsModal({
  open,
  onOpenChange,
  card,
  onCardChange,
  orderTotal,
  installments,
  onInstallmentsChange,
  onSave,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  card: CardForm;
  onCardChange: (card: CardForm) => void;
  orderTotal: number;
  installments: number;
  onInstallmentsChange: (installments: number) => void;
  onSave: () => void;
}) {
  const [activeField, setActiveField] = useState<CardField>("number");
  const isBackVisible = activeField === "cvv";
  const installmentTotal = getInstallmentTotal(orderTotal, installments);
  const installmentValue = installmentTotal / installments;
  const hasInterest = installments > FREE_INSTALLMENTS_LIMIT;

  function updateCard(field: keyof CardForm, value: string) {
    const nextValue =
      field === "number"
        ? formatCardNumber(value)
        : field === "expiry"
          ? formatExpiry(value)
          : field === "cvv"
            ? onlyDigits(value).slice(0, 4)
            : value.toUpperCase().slice(0, 28);

    onCardChange({ ...card, [field]: nextValue });
  }

  function inputClass(field: CardField) {
    return `h-11 rounded-xl px-3 text-sm font-normal outline-none transition-all ${
      activeField === field
        ? "bg-primary-soft ring-2 ring-primary"
        : "bg-secondary focus:ring-2 focus:ring-primary"
    }`;
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        onOpenAutoFocus={(event) => event.preventDefault()}
        className="max-h-[calc(100dvh-1rem)] w-[calc(100%-1rem)] max-w-4xl overflow-y-auto overflow-x-hidden rounded-3xl border border-white/35 bg-white p-0 shadow-float sm:w-[calc(100%-2rem)] sm:bg-white/72 sm:backdrop-blur-2xl sm:rounded-3xl lg:max-h-[calc(100vh-2rem)]"
      >
        <div className="grid gap-0 lg:grid-cols-[1.08fr_0.92fr]">
          <section className="bg-[linear-gradient(135deg,rgba(62,0,108,0.86),rgba(108,63,181,0.46),rgba(255,255,255,0.12))] p-6 text-primary-foreground lg:p-8">
            <DialogHeader className="text-left">
              <DialogTitle>Dados do cartão</DialogTitle>
              <DialogDescription className="text-primary-foreground/70">
                Preencha os dados para usar cartão neste pedido mockado.
              </DialogDescription>
            </DialogHeader>

            <div className="mt-7 [perspective:1200px]">
              <motion.div
                animate={{ rotateY: isBackVisible ? 180 : 0 }}
                transition={{ type: "spring", stiffness: 180, damping: 22 }}
                className="relative mx-auto h-[260px] w-full max-w-[430px]"
                style={{ transformStyle: "preserve-3d" }}
              >
                <div
                  className="absolute inset-0 overflow-hidden rounded-[28px] bg-[#6c3fb5] p-7 shadow-float ring-1 ring-white/15"
                  style={{ backfaceVisibility: "hidden" }}
                >
                  <div className="absolute -right-12 -top-14 h-44 w-44 rounded-full bg-mint/25" />
                  <div className="absolute -bottom-16 -left-10 h-44 w-44 rounded-full bg-white/10" />
                  <div className="relative flex items-center justify-between">
                    <span className="text-xs font-bold uppercase text-white/75">BW7 Card</span>
                    <CreditCard className="h-6 w-6 text-white" />
                  </div>
                  <div className="relative mt-10">
                    <motion.div
                      animate={{
                        scale: activeField === "number" ? 1.02 : 1,
                        backgroundColor:
                          activeField === "number"
                            ? "rgba(255,255,255,0.16)"
                            : "rgba(255,255,255,0)",
                      }}
                      className="rounded-2xl px-3 py-3 font-mono text-[25px] font-bold tracking-[0.12em] text-white"
                    >
                      {cardNumberPreview(card.number)}
                    </motion.div>
                  </div>
                  <div className="relative mt-8 grid grid-cols-[1fr_auto] gap-5">
                    <motion.div
                      animate={{
                        y: activeField === "name" ? -2 : 0,
                        backgroundColor:
                          activeField === "name" ? "rgba(255,255,255,0.16)" : "rgba(255,255,255,0)",
                      }}
                      className="min-w-0 rounded-2xl px-3 py-2"
                    >
                      <p className="text-[10px] uppercase text-white/55">Nome</p>
                      <p className="truncate text-base font-bold">{card.name || "NOME COMPLETO"}</p>
                    </motion.div>
                    <div className="px-3 py-2 text-right">
                      <p className="text-[10px] uppercase text-white/55">Validade</p>
                      <p className="text-base font-bold">{card.expiry || "MM/AA"}</p>
                    </div>
                  </div>
                </div>

                <div
                  className="absolute inset-0 overflow-hidden rounded-[28px] bg-[#241135] py-7 shadow-float ring-1 ring-white/15"
                  style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
                >
                  <div className="h-12 bg-black/70" />
                  <div className="mx-7 mt-8 rounded-2xl bg-white/85 p-4 text-right">
                    <motion.span
                      animate={{ scale: activeField === "cvv" ? 1.08 : 1 }}
                      className="font-mono text-2xl font-bold text-primary-dark"
                    >
                      {card.cvv || "CVV"}
                    </motion.span>
                  </div>
                  <p className="mx-7 mt-7 text-xs leading-5 text-white/55">
                    Código de segurança usado apenas para esta simulação.
                  </p>
                </div>
              </motion.div>
            </div>
          </section>

          <form
            className="grid content-start gap-5 bg-white/62 p-6 backdrop-blur-xl lg:p-8"
            onSubmit={(event) => {
              event.preventDefault();
              onSave();
              onOpenChange(false);
            }}
          >
            <label className="grid gap-1.5 text-sm font-semibold text-foreground">
              Nome impresso no cartão
              <input
                value={card.name}
                onFocus={() => setActiveField("name")}
                onChange={(event) => updateCard("name", event.target.value)}
                placeholder="Nome completo"
                className={inputClass("name")}
              />
            </label>

            <label className="grid gap-1.5 text-sm font-semibold text-foreground">
              Número do cartão
              <input
                value={card.number}
                inputMode="numeric"
                onFocus={() => setActiveField("number")}
                onChange={(event) => updateCard("number", event.target.value)}
                placeholder="0000 0000 0000 0000"
                className={inputClass("number")}
              />
            </label>

            <div className="grid grid-cols-2 gap-6">
              <label className="grid gap-1.5 text-sm font-semibold text-foreground">
                Validade
                <input
                  value={card.expiry}
                  inputMode="numeric"
                  onFocus={() => setActiveField("expiry")}
                  onChange={(event) => updateCard("expiry", event.target.value)}
                  placeholder="MM/AA"
                  className={inputClass("expiry")}
                />
              </label>
              <label className="grid gap-1.5 text-sm font-semibold text-foreground">
                CVV
                <input
                  value={card.cvv}
                  inputMode="numeric"
                  onFocus={() => setActiveField("cvv")}
                  onChange={(event) => updateCard("cvv", event.target.value)}
                  placeholder="123"
                  className={inputClass("cvv")}
                />
              </label>
            </div>

            <label className="grid gap-1.5 text-sm font-semibold text-foreground">
              Parcelamento
              <select
                value={installments}
                onChange={(event) => onInstallmentsChange(Number(event.target.value))}
                className="h-11 rounded-xl bg-secondary px-3 text-sm font-normal outline-none transition-all focus:ring-2 focus:ring-primary"
              >
                {Array.from({ length: MAX_CARD_INSTALLMENTS }, (_, index) => {
                  const optionInstallments = index + 1;
                  return (
                    <option key={optionInstallments} value={optionInstallments}>
                      {getInstallmentLabel(orderTotal, optionInstallments)}
                    </option>
                  );
                })}
              </select>
              <span className="text-xs font-medium text-muted-foreground">
                {hasInterest
                  ? `${installments}x de ${formatPrice(installmentValue)} com juros fixos`
                  : `${installments}x de ${formatPrice(installmentValue)} sem juros`}
              </span>
            </label>

            <DialogFooter className="mt-2 gap-2 sm:space-x-0">
              <button
                type="button"
                onClick={() => onOpenChange(false)}
                className="h-11 rounded-full bg-secondary px-5 text-sm font-bold text-foreground"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="h-11 rounded-full bg-primary px-5 text-sm font-bold text-primary-foreground shadow-soft"
              >
                Salvar cartão
              </button>
            </DialogFooter>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function MobileCardDetailsScreen({
  card,
  onCardChange,
  orderTotal,
  installments,
  onInstallmentsChange,
  onBack,
  onSave,
}: {
  card: CardForm;
  onCardChange: (card: CardForm) => void;
  orderTotal: number;
  installments: number;
  onInstallmentsChange: (installments: number) => void;
  onBack: () => void;
  onSave: () => void;
}) {
  const [step, setStep] = useState<MobileCardStep>("name");
  const activeField: CardField = step === "installments" ? "number" : step;
  const isBackVisible = step === "cvv";
  const installmentTotal = getInstallmentTotal(orderTotal, installments);
  const installmentValue = installmentTotal / installments;
  const hasInterest = installments > FREE_INSTALLMENTS_LIMIT;
  const steps: MobileCardStep[] = ["name", "number", "expiry", "cvv", "installments"];
  const stepIndex = steps.indexOf(step);
  const isLastStep = step === "installments";

  const stepCopy: Record<MobileCardStep, { title: string; helper: string; placeholder: string }> = {
    name: {
      title: "Nome impresso no cartão",
      helper: "Digite o nome como aparece no cartão.",
      placeholder: "Nome completo",
    },
    number: {
      title: "Número do cartão",
      helper: "Use apenas números. A separação aparece automaticamente.",
      placeholder: "0000 0000 0000 0000",
    },
    expiry: {
      title: "Validade",
      helper: "Informe mês e ano no formato MM/AA.",
      placeholder: "MM/AA",
    },
    cvv: {
      title: "CVV",
      helper: "O cartão vira para mostrar o código de segurança.",
      placeholder: "123",
    },
    installments: {
      title: "Parcelamento",
      helper: hasInterest
        ? `${installments}x de ${formatPrice(installmentValue)} com juros fixos`
        : `${installments}x de ${formatPrice(installmentValue)} sem juros`,
      placeholder: "",
    },
  };

  const canContinue =
    step === "name"
      ? card.name.trim().length >= 3
      : step === "number"
        ? onlyDigits(card.number).length >= 16
        : step === "expiry"
          ? onlyDigits(card.expiry).length >= 4
          : step === "cvv"
            ? onlyDigits(card.cvv).length >= 3
            : true;

  function updateCard(field: keyof CardForm, value: string) {
    const nextValue =
      field === "number"
        ? formatCardNumber(value)
        : field === "expiry"
          ? formatExpiry(value)
          : field === "cvv"
            ? onlyDigits(value).slice(0, 4)
            : value.toUpperCase().slice(0, 28);

    onCardChange({ ...card, [field]: nextValue });
  }

  function goBack() {
    if (stepIndex === 0) {
      onBack();
      return;
    }

    setStep(steps[stepIndex - 1]);
  }

  function goNext() {
    if (!canContinue) return;
    if (isLastStep) {
      onSave();
      return;
    }

    setStep(steps[stepIndex + 1]);
  }

  return (
    <main className="fixed inset-0 z-50 overflow-y-auto bg-background pb-8">
      <CheckoutHeader
        title="Dados do cartão"
        subtitle={`${stepIndex + 1} de ${steps.length}`}
        backLabel="Voltar"
        onBack={goBack}
      />

      <div className="mx-auto flex min-h-[calc(100dvh-76px)] max-w-xl flex-col px-4 pt-4">
        <section className="overflow-hidden rounded-3xl bg-[linear-gradient(135deg,rgba(62,0,108,0.92),rgba(108,63,181,0.58),rgba(255,255,255,0.12))] p-5 text-primary-foreground shadow-soft">
          <div className="[perspective:1200px]">
            <motion.div
              animate={{ rotateY: isBackVisible ? 180 : 0 }}
              transition={{ type: "spring", stiffness: 180, damping: 22 }}
              className="relative mx-auto h-[220px] w-full max-w-[380px]"
              style={{ transformStyle: "preserve-3d" }}
            >
              <div
                className="absolute inset-0 overflow-hidden rounded-[24px] bg-[#6c3fb5] p-5 shadow-float ring-1 ring-white/15"
                style={{ backfaceVisibility: "hidden" }}
              >
                <div className="absolute -right-12 -top-14 h-40 w-40 rounded-full bg-mint/25" />
                <div className="absolute -bottom-16 -left-10 h-40 w-40 rounded-full bg-white/10" />
                <div className="relative flex items-center justify-between">
                  <span className="text-xs font-bold uppercase text-white/75">BW7 Card</span>
                  <CreditCard className="h-6 w-6 text-white" />
                </div>
                <motion.div
                  animate={{
                    scale: activeField === "number" ? 1.02 : 1,
                    backgroundColor:
                      activeField === "number" ? "rgba(255,255,255,0.16)" : "rgba(255,255,255,0)",
                  }}
                  className="relative mt-9 rounded-2xl px-3 py-3 font-mono text-[20px] font-bold tracking-[0.1em] text-white"
                >
                  {cardNumberPreview(card.number)}
                </motion.div>
                <div className="relative mt-6 grid grid-cols-[1fr_auto] gap-3">
                  <motion.div
                    animate={{
                      y: activeField === "name" ? -2 : 0,
                      backgroundColor:
                        activeField === "name" ? "rgba(255,255,255,0.16)" : "rgba(255,255,255,0)",
                    }}
                    className="min-w-0 rounded-2xl px-3 py-2"
                  >
                    <p className="text-[10px] uppercase text-white/55">Nome</p>
                    <p className="truncate text-sm font-bold">{card.name || "NOME COMPLETO"}</p>
                  </motion.div>
                  <div className="px-3 py-2 text-right">
                    <p className="text-[10px] uppercase text-white/55">Validade</p>
                    <p className="text-sm font-bold">{card.expiry || "MM/AA"}</p>
                  </div>
                </div>
              </div>

              <div
                className="absolute inset-0 overflow-hidden rounded-[24px] bg-[#241135] py-6 shadow-float ring-1 ring-white/15"
                style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
              >
                <div className="h-11 bg-black/70" />
                <div className="mx-6 mt-7 rounded-2xl bg-white/85 p-4 text-right">
                  <motion.span
                    animate={{ scale: activeField === "cvv" ? 1.08 : 1 }}
                    className="font-mono text-2xl font-bold text-primary-dark"
                  >
                    {card.cvv || "CVV"}
                  </motion.span>
                </div>
                <p className="mx-6 mt-6 text-xs leading-5 text-white/55">
                  Código de segurança usado apenas para esta simulação.
                </p>
              </div>
            </motion.div>
          </div>
        </section>

        <form
          className="mt-4 flex flex-1 flex-col rounded-3xl bg-card p-4 shadow-soft"
          onSubmit={(event) => {
            event.preventDefault();
            goNext();
          }}
        >
          <div className="mb-5 flex gap-2">
            {steps.map((item) => (
              <span
                key={item}
                className={`h-1.5 flex-1 rounded-full ${
                  steps.indexOf(item) <= stepIndex ? "bg-primary" : "bg-secondary"
                }`}
              />
            ))}
          </div>

          <motion.div
            key={step}
            initial={{ opacity: 0, x: 18 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -18 }}
            transition={{ duration: 0.18 }}
            className="grid gap-2"
          >
            <label className="grid gap-2 text-sm font-semibold text-foreground">
              {stepCopy[step].title}
              {step === "installments" ? (
                <select
                  value={installments}
                  onChange={(event) => onInstallmentsChange(Number(event.target.value))}
                  className="h-12 rounded-2xl bg-secondary px-4 text-base font-normal outline-none transition-all focus:ring-2 focus:ring-primary"
                >
                  {Array.from({ length: MAX_CARD_INSTALLMENTS }, (_, index) => {
                    const optionInstallments = index + 1;
                    return (
                      <option key={optionInstallments} value={optionInstallments}>
                        {getInstallmentLabel(orderTotal, optionInstallments)}
                      </option>
                    );
                  })}
                </select>
              ) : (
                <input
                  value={card[step]}
                  inputMode={step === "name" ? "text" : "numeric"}
                  onFocus={() => setStep(step)}
                  onChange={(event) => updateCard(step, event.target.value)}
                  placeholder={stepCopy[step].placeholder}
                  className="h-12 rounded-2xl bg-secondary px-4 text-base font-normal outline-none transition-all focus:ring-2 focus:ring-primary"
                />
              )}
            </label>
            <p className="min-h-5 text-xs font-medium text-muted-foreground">
              {stepCopy[step].helper}
            </p>
          </motion.div>

          <div className="mt-auto grid gap-2 pt-8">
            <button
              type="submit"
              disabled={!canContinue}
              className="h-12 rounded-full bg-primary px-5 text-sm font-bold text-primary-foreground shadow-soft disabled:cursor-not-allowed disabled:opacity-45"
            >
              {isLastStep ? "Salvar cartão" : "Continuar"}
            </button>
            <button
              type="button"
              onClick={goBack}
              className="h-11 rounded-full bg-secondary px-5 text-sm font-bold text-foreground"
            >
              {stepIndex === 0 ? "Cancelar" : "Voltar"}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}

function PaymentScreen({
  product,
  store,
  quantity,
  postalCode,
  summary,
  paymentMethod,
  cardInstallments,
  onPaymentChange,
  onCardInstallmentsChange,
  onBack,
  onOpenProduct,
  onContinue,
}: {
  product: Product;
  store: Store;
  quantity: number;
  postalCode: string;
  summary: CheckoutSummary;
  paymentMethod: PaymentMethod;
  cardInstallments: number;
  onPaymentChange: (method: PaymentMethod) => void;
  onCardInstallmentsChange: (installments: number) => void;
  onBack: () => void;
  onOpenProduct: () => void;
  onContinue: () => void;
}) {
  const isMobile = useIsMobile();
  const [cardModalOpen, setCardModalOpen] = useState(false);
  const [cardScreenOpen, setCardScreenOpen] = useState(false);
  const [hasSavedCard, setHasSavedCard] = useState(false);
  const [card, setCard] = useState<CardForm>({
    name: "",
    number: "",
    expiry: "",
    cvv: "",
  });
  const cardLastDigits = onlyDigits(card.number).slice(-4);

  function handleCardClick() {
    onPaymentChange("card");
    const isMobileViewport = typeof window !== "undefined" && window.innerWidth < 768;
    if (isMobile || isMobileViewport) {
      setCardScreenOpen(true);
    } else {
      setCardModalOpen(true);
    }
  }

  function handleSaveCard() {
    setHasSavedCard(true);
    setCardScreenOpen(false);
  }

  if (cardScreenOpen) {
    return (
      <MobileCardDetailsScreen
        card={card}
        onCardChange={setCard}
        orderTotal={summary.subtotal + summary.shipping}
        installments={cardInstallments}
        onInstallmentsChange={onCardInstallmentsChange}
        onBack={() => setCardScreenOpen(false)}
        onSave={handleSaveCard}
      />
    );
  }

  return (
    <main className="min-h-screen bg-background pb-28 lg:fixed lg:inset-0 lg:overflow-hidden lg:pb-0">
      <CheckoutHeader
        title="Selecionar pagamento"
        subtitle="Escolha como deseja pagar"
        backLabel="Voltar ao produto"
        onBack={onBack}
      />

      <div className="mx-auto grid max-w-6xl gap-4 px-4 pt-4 lg:h-[calc(100vh-76px)] lg:grid-cols-[1fr_360px] lg:overflow-hidden lg:px-8 lg:pb-6">
        <section className="space-y-4 lg:overflow-y-auto lg:pr-2">
          <section className="rounded-3xl bg-card p-4 shadow-soft lg:p-5">
            <h2 className="text-base font-bold">Meio de pagamento</h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <button
                type="button"
                onClick={() => onPaymentChange("pix")}
                className={`rounded-2xl border p-4 text-left transition-colors ${
                  paymentMethod === "pix"
                    ? "border-primary bg-primary-soft text-primary"
                    : "border-border bg-background text-foreground hover:border-primary/50"
                }`}
              >
                <span className="flex items-center justify-between gap-3">
                  <QrCode className="h-5 w-5" />
                  {paymentMethod === "pix" ? <CheckCircle2 className="h-5 w-5" /> : null}
                </span>
                <span className="mt-3 block text-sm font-bold">Pix</span>
                <span className="mt-1 block text-xs text-muted-foreground">
                  Aprovação imediata e 3% de desconto mockado.
                </span>
              </button>

              <button
                type="button"
                onClick={handleCardClick}
                className={`rounded-2xl border p-4 text-left transition-colors ${
                  paymentMethod === "card"
                    ? "border-primary bg-primary-soft text-primary"
                    : "border-border bg-background text-foreground hover:border-primary/50"
                }`}
              >
                <span className="flex items-center justify-between gap-3">
                  <CreditCard className="h-5 w-5" />
                  {paymentMethod === "card" ? <CheckCircle2 className="h-5 w-5" /> : null}
                </span>
                <span className="mt-3 block text-sm font-bold">Cartão</span>
                <span className="mt-1 block text-xs text-muted-foreground">
                  Até 3x sem juros. Acima disso, com juros fixos.
                </span>
              </button>
            </div>

            {paymentMethod === "card" && hasSavedCard ? (
              <div className="mt-4 flex flex-col gap-3 rounded-2xl bg-primary-soft p-4 text-primary sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0">
                  <p className="text-sm font-bold">
                    Cartão cadastrado
                    {cardLastDigits ? ` final ${cardLastDigits}` : ""}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {getInstallmentLabel(summary.subtotal + summary.shipping, cardInstallments)}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleCardClick}
                  className="h-10 shrink-0 rounded-full bg-card px-4 text-xs font-bold text-primary shadow-soft"
                >
                  Alterar cartão
                </button>
              </div>
            ) : null}
          </section>

          <ProductCard
            product={product}
            store={store}
            quantity={quantity}
            onOpenProduct={onOpenProduct}
          />
          <DeliveryCard product={product} postalCode={postalCode} />
        </section>

        <SummaryCard
          summary={summary}
          buttonLabel="Continuar"
          onSubmit={onContinue}
          helper="A confirmação do pedido vem na próxima tela."
        />
      </div>

      {!isMobile ? (
        <CardDetailsModal
          open={cardModalOpen}
          onOpenChange={setCardModalOpen}
          card={card}
          onCardChange={setCard}
          orderTotal={summary.subtotal + summary.shipping}
          installments={cardInstallments}
          onInstallmentsChange={onCardInstallmentsChange}
          onSave={() => setHasSavedCard(true)}
        />
      ) : null}
    </main>
  );
}

function ConfirmationScreen({
  product,
  store,
  quantity,
  postalCode,
  summary,
  paymentMethod,
  cardInstallments,
  onBack,
  onOpenProduct,
  onChangePayment,
  onConfirm,
}: {
  product: Product;
  store: Store;
  quantity: number;
  postalCode: string;
  summary: CheckoutSummary;
  paymentMethod: PaymentMethod;
  cardInstallments: number;
  onBack: () => void;
  onOpenProduct: () => void;
  onChangePayment: () => void;
  onConfirm: () => void;
}) {
  const paymentCopy = getPaymentCopy(paymentMethod);

  return (
    <main className="min-h-screen bg-background pb-28 lg:fixed lg:inset-0 lg:overflow-hidden lg:pb-0">
      <CheckoutHeader
        title="Confirmar pedido"
        subtitle="Revise antes de finalizar"
        backLabel="Voltar ao pagamento"
        onBack={onBack}
      />

      <div className="mx-auto grid max-w-6xl gap-4 px-4 pt-4 lg:h-[calc(100vh-76px)] lg:grid-cols-[1fr_360px] lg:overflow-hidden lg:px-8 lg:pb-6">
        <section className="space-y-4 lg:overflow-y-auto lg:pr-2">
          <ProductCard
            product={product}
            store={store}
            quantity={quantity}
            onOpenProduct={onOpenProduct}
          />
          <DeliveryCard product={product} postalCode={postalCode} />

          <section className="rounded-3xl bg-card p-4 shadow-soft lg:p-5">
            <h2 className="text-base font-bold">Pagamento selecionado</h2>
            <div className="mt-4 flex items-start gap-3 rounded-2xl bg-primary-soft p-4 text-primary">
              {paymentMethod === "pix" ? (
                <QrCode className="h-5 w-5 shrink-0" />
              ) : (
                <CreditCard className="h-5 w-5 shrink-0" />
              )}
              <div>
                <p className="text-sm font-bold">{paymentCopy.label}</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {paymentMethod === "card"
                    ? getInstallmentLabel(summary.subtotal + summary.shipping, cardInstallments)
                    : paymentCopy.description}
                </p>
                <button
                  type="button"
                  onClick={onChangePayment}
                  className="mt-3 text-xs font-bold text-primary underline-offset-2 hover:underline"
                >
                  Alterar pagamento
                </button>
              </div>
            </div>
          </section>
        </section>

        <SummaryCard
          summary={summary}
          buttonLabel="Confirmar pedido"
          onSubmit={onConfirm}
          helper="Confira produto, entrega e pagamento antes de criar o pedido."
        />
      </div>
    </main>
  );
}

function SuccessScreen({
  product,
  paymentMethod,
  summary,
  cardInstallments,
  onOpenProduct,
}: {
  product: Product;
  paymentMethod: PaymentMethod;
  summary: CheckoutSummary;
  cardInstallments: number;
  onOpenProduct: () => void;
}) {
  const paymentCopy = getPaymentCopy(paymentMethod);

  return (
    <main className="min-h-screen bg-background pb-28 lg:fixed lg:inset-0 lg:overflow-hidden lg:pb-0">
      <CheckoutHeader
        title="Pedido criado"
        subtitle="Nenhuma cobrança real foi realizada"
        backLabel="Voltar ao produto"
        onBack={onOpenProduct}
      />

      <div className="mx-auto grid max-w-6xl gap-4 px-4 pt-4 lg:h-[calc(100vh-76px)] lg:grid-cols-[1fr_360px] lg:overflow-hidden lg:px-8 lg:pb-6">
        <section className="rounded-3xl bg-card p-6 text-center shadow-soft lg:p-8">
          <span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-mint/30 text-primary-dark">
            <BadgeCheck className="h-8 w-8" />
          </span>
          <h2 className="mt-5 text-xl font-extrabold">Pedido mockado criado</h2>
          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-muted-foreground">
            Seu pedido foi confirmado com pagamento via {paymentCopy.label}. Nenhuma cobrança real
            foi realizada.
          </p>
          <button
            type="button"
            onClick={onOpenProduct}
            className="mt-6 h-11 rounded-full bg-primary px-6 text-sm font-bold text-primary-foreground shadow-soft"
          >
            Voltar ao produto
          </button>
        </section>

        <aside className="h-max rounded-3xl bg-card p-5 shadow-float ring-1 ring-border/70 lg:sticky lg:top-0">
          <h2 className="text-base font-bold">Resumo final</h2>
          <div className="mt-4 space-y-3 text-sm">
            <div className="flex justify-between gap-3">
              <span className="text-muted-foreground">Produto</span>
              <span className="max-w-[180px] text-right font-semibold">{product.name}</span>
            </div>
            <div className="flex justify-between gap-3">
              <span className="text-muted-foreground">Pagamento</span>
              <span className="font-semibold">
                {paymentMethod === "card"
                  ? `${paymentCopy.label} em ${cardInstallments}x`
                  : paymentCopy.label}
              </span>
            </div>
            <div className="flex justify-between gap-3 border-t border-border pt-3">
              <span className="font-bold">Total</span>
              <span className="text-xl font-extrabold text-primary">
                {formatPrice(summary.total)}
              </span>
            </div>
          </div>
        </aside>
      </div>
    </main>
  );
}

export function CheckoutPage() {
  const navigate = useNavigate();
  const { checkoutDraft, closeCheckout, createMockOrder, openProduct, postalCode } =
    useMarketplace();
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("pix");
  const [cardInstallments, setCardInstallments] = useState(1);
  const [checkoutScreen, setCheckoutScreen] = useState<CheckoutScreen>("payment");
  const product = products.find((item) => item.id === checkoutDraft?.productId);
  const store = product ? getProductStore(product.id) : undefined;

  const summary = useMemo(() => {
    if (!product || !checkoutDraft) return null;

    const subtotal = product.price * checkoutDraft.quantity;
    const shipping = 7.9 + Number(product.id) * 1.35;
    const discount = paymentMethod === "pix" ? subtotal * 0.03 : 0;
    const totalBeforeInterest = subtotal + shipping - discount;
    const interest =
      paymentMethod === "card" ? calculateCardInterest(totalBeforeInterest, cardInstallments) : 0;

    return {
      subtotal,
      shipping,
      discount,
      interest,
      total: totalBeforeInterest + interest,
    };
  }, [cardInstallments, checkoutDraft, paymentMethod, product]);

  if (!checkoutDraft || !product || !summary) {
    return (
      <main className="min-h-screen bg-background px-4 py-6">
        <button
          type="button"
          onClick={closeCheckout}
          className="grid h-11 w-11 place-items-center rounded-2xl bg-card shadow-soft"
          aria-label="Voltar"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div className="mt-10 rounded-3xl bg-card p-6 text-center shadow-soft">
          <h1 className="text-lg font-bold">Pedido não encontrado</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Volte ao produto para iniciar uma nova finalização.
          </p>
        </div>
      </main>
    );
  }

  const openCurrentProduct = () => openProduct(product.id);

  if (checkoutScreen === "confirmation") {
    return (
      <ConfirmationScreen
        product={product}
        store={store}
        quantity={checkoutDraft.quantity}
        postalCode={postalCode}
        summary={summary}
        paymentMethod={paymentMethod}
        cardInstallments={cardInstallments}
        onBack={() => setCheckoutScreen("payment")}
        onOpenProduct={openCurrentProduct}
        onChangePayment={() => setCheckoutScreen("payment")}
        onConfirm={() => {
          createMockOrder({
            productId: product.id,
            quantity: checkoutDraft.quantity,
            paymentMethod,
            installments: paymentMethod === "card" ? cardInstallments : 1,
            subtotal: summary.subtotal,
            shipping: summary.shipping,
            discount: summary.discount,
            interest: summary.interest,
            total: summary.total,
          });
          navigate({ to: "/pedidos" });
        }}
      />
    );
  }

  if (checkoutScreen === "success") {
    return (
      <SuccessScreen
        product={product}
        paymentMethod={paymentMethod}
        summary={summary}
        cardInstallments={cardInstallments}
        onOpenProduct={openCurrentProduct}
      />
    );
  }

  return (
    <PaymentScreen
      product={product}
      store={store}
      quantity={checkoutDraft.quantity}
      postalCode={postalCode}
      summary={summary}
      paymentMethod={paymentMethod}
      cardInstallments={cardInstallments}
      onPaymentChange={setPaymentMethod}
      onCardInstallmentsChange={setCardInstallments}
      onBack={openCurrentProduct}
      onOpenProduct={openCurrentProduct}
      onContinue={() => setCheckoutScreen("confirmation")}
    />
  );
}
