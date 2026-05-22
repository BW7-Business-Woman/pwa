import {
  Headphones,
  Heart,
  MapPin,
  PackageCheck,
  Settings,
  ShieldCheck,
  TicketPercent,
  WalletCards,
} from "lucide-react";
import { useNavigate } from "@tanstack/react-router";
import profileImage from "@/assets/hero-woman.jpg";
import { useMarketplace } from "@/store/marketplace";

const actions = [
  { label: "Meus pedidos", detail: "Acompanhe compras e entregas", icon: PackageCheck },
  { label: "Endereços", detail: "Entrega e retirada", icon: MapPin },
  { label: "Pagamentos", detail: "Pix, cartões e preferências", icon: WalletCards },
  { label: "Favoritos", detail: "Itens salvos para depois", icon: Heart },
  { label: "Cupons", detail: "Descontos disponíveis", icon: TicketPercent },
  { label: "Atendimento", detail: "Ajuda com pedidos e reembolsos", icon: Headphones },
  { label: "Privacidade", detail: "Dados, senha e segurança", icon: ShieldCheck },
];

export function ProfilePage() {
  const navigate = useNavigate();
  const setActiveNav = useMarketplace((state) => state.setActiveNav);

  return (
    <main className="px-4 pt-5 pb-4">
      <section className="rounded-[28px] bg-card shadow-soft overflow-hidden">
        <div className="h-24 bg-gradient-hero" />
        <div className="px-5 pb-5">
          <div className="-mt-10 flex items-end justify-between gap-4">
            <img
              src={profileImage}
              alt="Foto de perfil mockada"
              className="h-24 w-24 rounded-full border-4 border-card object-cover shadow-card"
            />
            <button
              type="button"
              aria-label="Configurar perfil"
              className="mb-2 grid h-10 w-10 place-items-center rounded-full bg-secondary text-primary transition-transform active:scale-95"
            >
              <Settings className="h-4 w-4" />
            </button>
          </div>

          <div className="mt-3">
            <h1 className="text-[22px] font-bold tracking-tight">M Souza</h1>
            <p className="mt-1 text-sm text-muted-foreground">Cliente BW7 desde 2024</p>
          </div>

        </div>
      </section>

      <section className="mt-5">
        <h2 className="mb-3 text-[17px] font-semibold tracking-tight">Conta</h2>
        <div className="grid gap-2">
          {actions.map(({ label, detail, icon: Icon }) => (
            <button
              key={label}
              type="button"
              onClick={() => {
                if (label !== "Meus pedidos") return;
                setActiveNav("Pedidos");
                navigate({ to: "/pedidos" });
              }}
              className="flex h-16 items-center gap-3 rounded-2xl bg-card px-4 text-left shadow-soft transition-transform active:scale-[0.99]"
            >
              <span className="grid h-10 w-10 place-items-center rounded-full bg-primary-soft text-primary">
                <Icon className="h-5 w-5" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-sm font-semibold">{label}</span>
                <span className="mt-0.5 block text-xs text-muted-foreground">{detail}</span>
              </span>
            </button>
          ))}
        </div>
      </section>
    </main>
  );
}
