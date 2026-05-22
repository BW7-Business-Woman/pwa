import {
  Bell,
  CreditCard,
  Heart,
  HelpCircle,
  LockKeyhole,
  MapPin,
  PackageCheck,
  Settings,
  ShieldCheck,
  Store,
  TicketPercent,
  UserRound,
} from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "@tanstack/react-router";
import profileImage from "@/assets/hero-woman.jpg";
import { products } from "@/data/products";
import { marketplaceStores } from "@/data/stores";
import { useMarketplace } from "@/store/marketplace";
import { HeaderSearch } from "./HeaderSearch";
import { LoadingImage } from "./LoadingImage";

const accountActions = [
  { title: "Meus pedidos", detail: "Rastrear, trocar ou comprar novamente", icon: PackageCheck },
  { title: "Login e segurança", detail: "Senha, telefone e proteção da conta", icon: LockKeyhole },
  { title: "Endereços", detail: "Locais de entrega e retirada", icon: MapPin },
  { title: "Pagamentos", detail: "Pix, cartões e preferências", icon: CreditCard },
  { title: "Favoritos", detail: "Produtos salvos para depois", icon: Heart },
  { title: "Cupons", detail: "Descontos e ofertas disponíveis", icon: TicketPercent },
  { title: "Notificações", detail: "Pedidos, promoções e alertas da BW7", icon: Bell },
  { title: "Atendimento", detail: "Ajuda com compras e reembolsos", icon: HelpCircle },
];

const recentOrders = products.slice(0, 3);

function formatPrice(value: number) {
  return `R$ ${value.toFixed(2).replace(".", ",")}`;
}

export function AccountPage() {
  const navigate = useNavigate();
  const { openProduct, setActiveNav } = useMarketplace();
  const preferredStores = marketplaceStores.slice(0, 3);

  return (
    <main className="min-h-screen bg-background pb-12">
      <div className="hidden lg:block">
        <HeaderSearch />
      </div>

      <div className="mx-auto hidden max-w-7xl px-6 py-8 lg:block">
        <section className="grid gap-6 lg:grid-cols-[340px_1fr]">
          <motion.aside
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 28 }}
            className="self-start overflow-hidden rounded-2xl bg-card shadow-card"
          >
            <div className="bg-gradient-hero px-6 py-7 text-primary-foreground">
              <div className="flex items-center gap-4">
                <img
                  src={profileImage}
                  alt="Foto de perfil mockada"
                  className="h-20 w-20 rounded-full border-4 border-white/30 object-cover shadow-card"
                />
                <div>
                  <p className="text-sm text-primary-foreground/80">Olá, Mari!</p>
                  <h1 className="text-2xl font-black tracking-tight">Sua conta</h1>
                </div>
              </div>
              <div className="mt-6 grid grid-cols-2 gap-3">
                <div className="rounded-2xl bg-white/12 px-4 py-3">
                  <p className="text-xl font-black">8</p>
                  <p className="text-xs text-primary-foreground/75">pedidos</p>
                </div>
                <div className="rounded-2xl bg-white/12 px-4 py-3">
                  <p className="text-xl font-black">12</p>
                  <p className="text-xs text-primary-foreground/75">favoritos</p>
                </div>
              </div>
            </div>

            <div className="space-y-3 p-5">
              <div className="flex items-center gap-3 rounded-2xl bg-primary-soft p-4 text-primary">
                <ShieldCheck className="h-5 w-5" />
                <div>
                  <p className="text-sm font-bold">Conta verificada</p>
                  <p className="text-xs text-primary/75">Perfil ativo na comunidade BW7</p>
                </div>
              </div>
              <button
                type="button"
                className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-primary text-sm font-bold text-primary-foreground shadow-soft"
              >
                <Settings className="h-4 w-4" />
                Configurar conta
              </button>
            </div>
          </motion.aside>

          <section className="min-w-0">
            <div className="mb-5 flex items-end justify-between gap-4">
              <div>
                <h2 className="text-3xl font-black tracking-tight">Gerencie sua conta</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Pedidos, segurança, pagamentos e preferências em um só lugar.
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setActiveNav("Carrinho");
                    navigate({ to: "/carrinho" });
                  }}
                  className="h-11 rounded-full bg-secondary px-5 text-sm font-bold text-primary transition-colors hover:bg-primary-soft"
                >
                  Ver carrinho
                </button>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              {accountActions.map(({ title, detail, icon: Icon }, index) => (
                <motion.button
                  key={title}
                  type="button"
                  onClick={() => {
                    if (title !== "Meus pedidos") return;
                    setActiveNav("Pedidos");
                    navigate({ to: "/pedidos" });
                  }}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.03 }}
                  className="min-h-[142px] rounded-2xl bg-card p-5 text-left shadow-soft transition-transform hover:-translate-y-0.5"
                >
                  <span className="grid h-12 w-12 place-items-center rounded-2xl bg-primary-soft text-primary">
                    <Icon className="h-6 w-6" />
                  </span>
                  <span className="mt-4 block text-base font-black">{title}</span>
                  <span className="mt-1 block text-sm leading-5 text-muted-foreground">
                    {detail}
                  </span>
                </motion.button>
              ))}
            </div>

            <div className="mt-6 grid gap-5 xl:grid-cols-[1.1fr_0.9fr]">
              <section className="rounded-2xl bg-card p-5 shadow-soft">
                <div className="mb-4 flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-black tracking-tight">Pedidos recentes</h3>
                    <p className="text-sm text-muted-foreground">Últimas compras mockadas</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setActiveNav("Pedidos");
                      navigate({ to: "/pedidos" });
                    }}
                    className="text-sm font-bold text-primary"
                  >
                    Ver todos
                  </button>
                </div>

                <div className="divide-y divide-border/70">
                  {recentOrders.map((product) => (
                    <button
                      key={product.id}
                      type="button"
                      onClick={() => openProduct(product.id)}
                      className="flex w-full items-center gap-4 py-4 text-left first:pt-0 last:pb-0"
                    >
                      <LoadingImage
                        src={product.image}
                        alt={product.name}
                        width={160}
                        height={160}
                        wrapperClassName="h-20 w-20 shrink-0 rounded-2xl"
                        className="h-full w-full object-cover"
                      />
                      <span className="min-w-0 flex-1">
                        <span className="block line-clamp-1 font-bold">{product.name}</span>
                        <span className="mt-1 block text-sm text-muted-foreground">
                          Entrega prevista para esta semana
                        </span>
                      </span>
                      <span className="shrink-0 text-sm font-black text-primary">
                        {formatPrice(product.price)}
                      </span>
                    </button>
                  ))}
                </div>
              </section>

              <section className="rounded-2xl bg-card p-5 shadow-soft">
                <div className="mb-4">
                  <h3 className="text-xl font-black tracking-tight">Lojas favoritas</h3>
                  <p className="text-sm text-muted-foreground">Vitrines próximas da sua conta</p>
                </div>
                <div className="space-y-3">
                  {preferredStores.map((store) => (
                    <div
                      key={store.id}
                      className="flex items-center gap-3 rounded-2xl bg-secondary p-3"
                    >
                      <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-card text-primary">
                        <Store className="h-5 w-5" />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-sm font-black">{store.name}</span>
                        <span className="block truncate text-xs text-muted-foreground">
                          {store.owner}
                        </span>
                      </span>
                      <span className="rounded-full bg-mint px-2 py-1 text-[11px] font-bold text-primary-dark">
                        {store.rating}
                      </span>
                    </div>
                  ))}
                </div>
              </section>
            </div>
          </section>
        </section>
      </div>

      <div className="lg:hidden">
        <section className="px-4 py-6">
          <div className="rounded-3xl bg-card p-6 text-center shadow-soft">
            <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-primary-soft text-primary">
              <UserRound className="h-7 w-7" />
            </div>
            <h1 className="mt-4 text-xl font-black">Conta</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Esta tela foi preparada para desktop. No mobile, use a aba Perfil.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
