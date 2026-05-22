import {
  BadgeCheck,
  BriefcaseBusiness,
  CalendarCheck,
  Clock3,
  MapPin,
  MessageCircle,
  Search,
  ShieldCheck,
  Sparkles,
  Star,
  UserRoundCheck,
} from "lucide-react";
import { motion } from "framer-motion";
import { marketplaceServices } from "@/data/services";

const quickFilters = ["Online", "Presencial", "Hoje", "Mais avaliados"];

export function ServicesPage() {
  return (
    <main className="min-h-screen bg-background pb-28">
      <header className="sticky top-0 z-30 bg-background/90 px-4 pb-4 pt-5 backdrop-blur-xl lg:px-8">
        <div className="mx-auto flex max-w-7xl items-center gap-3">
          <div className="grid h-11 w-11 place-items-center rounded-2xl bg-primary-soft text-primary">
            <BriefcaseBusiness className="h-5 w-5" />
          </div>
          <div className="min-w-0">
            <h1 className="truncate text-xl font-bold tracking-tight">Serviços</h1>
            <p className="text-xs text-muted-foreground">Profissionais e solucoes da rede BW7</p>
          </div>
        </div>
      </header>

      <section className="mx-auto max-w-7xl px-4 pt-3 lg:px-8 lg:pt-6">
        <div className="overflow-hidden rounded-3xl bg-gradient-hero p-5 text-primary-foreground shadow-card lg:p-7">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-white/14 px-3 py-1 text-xs font-bold">
                <Sparkles className="h-4 w-4" />
                Rede de especialistas
              </div>
              <h2 className="text-2xl font-black tracking-tight lg:text-4xl">
                Encontre servicos para sua vida e seu negocio
              </h2>
              <p className="mt-3 max-w-xl text-sm leading-6 text-primary-foreground/82 lg:text-base">
                Agende consultorias, mentorias e servicos criativos com profissionais da comunidade.
              </p>
            </div>

            <div className="rounded-2xl bg-white/12 p-4 lg:w-[360px]">
              <label className="mb-2 block text-xs font-bold uppercase text-primary-foreground/75">
                Buscar servico
              </label>
              <div className="flex h-11 items-center gap-2 rounded-full bg-white px-4 text-[#2d063f]">
                <Search className="h-4 w-4 text-primary" />
                <span className="text-sm text-slate-500">Ex: mentoria, design, beleza</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pt-4 lg:px-8">
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
          {quickFilters.map((filter, index) => (
            <button
              key={filter}
              type="button"
              className={`h-10 shrink-0 rounded-full px-4 text-sm font-bold shadow-soft ${
                index === 0 ? "bg-primary text-primary-foreground" : "bg-card text-primary"
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pt-5 lg:px-8">
        <div className="mb-3 flex items-end justify-between gap-3">
          <div>
            <h2 className="text-[17px] font-semibold tracking-tight lg:text-2xl">
              Serviços em destaque
            </h2>
            <p className="text-xs text-muted-foreground lg:text-sm">
              Opcoes verificadas para contratar ou agendar
            </p>
          </div>
        </div>

        <div className="grid gap-3 lg:grid-cols-2 xl:grid-cols-4">
          {marketplaceServices.map((service, index) => (
            <motion.article
              key={service.title}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.04, type: "spring", stiffness: 260, damping: 28 }}
              className="overflow-hidden rounded-2xl bg-card shadow-soft ring-1 ring-border/65"
            >
              <div className="p-4">
                <div className="flex items-start justify-between gap-3">
                  <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-primary-soft text-primary">
                    <UserRoundCheck className="h-6 w-6" />
                  </span>
                  <span className="rounded-full bg-mint px-2.5 py-1 text-[11px] font-bold text-primary-dark">
                    {service.badge}
                  </span>
                </div>

                <p className="mt-4 text-xs font-bold uppercase text-primary">{service.category}</p>
                <h3 className="mt-1 line-clamp-2 text-lg font-black leading-tight">
                  {service.title}
                </h3>
                <p className="mt-1 text-sm font-semibold text-muted-foreground">
                  por {service.provider}
                </p>
                <p className="mt-3 line-clamp-3 text-sm leading-6 text-muted-foreground">
                  {service.description}
                </p>

                <div className="mt-4 grid grid-cols-3 gap-2 text-xs">
                  <div className="rounded-2xl bg-secondary px-3 py-2">
                    <div className="flex items-center gap-1 font-bold text-primary">
                      <Star className="h-3.5 w-3.5 fill-primary" />
                      {service.rating}
                    </div>
                    <p className="mt-0.5 text-[10px] text-muted-foreground">nota</p>
                  </div>
                  <div className="rounded-2xl bg-secondary px-3 py-2">
                    <div className="flex items-center gap-1 font-bold text-primary">
                      <Clock3 className="h-3.5 w-3.5" />
                      {service.duration}
                    </div>
                    <p className="mt-0.5 text-[10px] text-muted-foreground">duracao</p>
                  </div>
                  <div className="rounded-2xl bg-secondary px-3 py-2">
                    <div className="flex items-center gap-1 font-bold text-primary">
                      <MapPin className="h-3.5 w-3.5" />
                      {service.location}
                    </div>
                    <p className="mt-0.5 text-[10px] text-muted-foreground">local</p>
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-between gap-3 border-t border-border pt-4">
                  <div>
                    <p className="text-xs text-muted-foreground">A partir de</p>
                    <p className="text-lg font-extrabold text-primary">{service.price}</p>
                  </div>
                  <button
                    type="button"
                    className="inline-flex h-10 items-center gap-2 rounded-full bg-primary px-4 text-sm font-bold text-primary-foreground"
                  >
                    <CalendarCheck className="h-4 w-4" />
                    Agendar
                  </button>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pt-5 lg:px-8">
        <div className="grid gap-3 lg:grid-cols-3">
          {[
            {
              icon: ShieldCheck,
              title: "Profissionais verificados",
              text: "Perfis revisados para contratar com mais confianca.",
            },
            {
              icon: MessageCircle,
              title: "Conversa antes de fechar",
              text: "Combine escopo, prazo e formato antes do agendamento.",
            },
            {
              icon: BadgeCheck,
              title: "Rede BW7",
              text: "Servicos pensados para mulheres, marcas e pequenos negocios.",
            },
          ].map(({ icon: Icon, title, text }) => (
            <div key={title} className="rounded-2xl bg-card p-4 shadow-soft">
              <span className="grid h-10 w-10 place-items-center rounded-2xl bg-primary-soft text-primary">
                <Icon className="h-5 w-5" />
              </span>
              <h3 className="mt-3 font-black">{title}</h3>
              <p className="mt-1 text-sm leading-6 text-muted-foreground">{text}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
