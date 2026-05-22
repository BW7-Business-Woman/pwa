import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, LockKeyhole, Mail, UserRound } from "lucide-react";

import loginImage from "@/assets/login.png";
import logo from "@/assets/logo - sem fundo.png";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Login | BW7 Marketplace" },
      {
        name: "description",
        content: "Acesse sua conta BW7 Marketplace para comprar, vender e fortalecer sua rede.",
      },
      { name: "theme-color", content: "#6C3FB5" },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const [authMode, setAuthMode] = useState<"login" | "register">("login");
  const isRegister = authMode === "register";

  return (
    <main className="relative min-h-dvh overflow-hidden bg-[#eee9ff] px-3 py-3 text-foreground sm:px-6 sm:py-6 lg:flex lg:h-screen lg:items-center lg:px-10 lg:py-6">
      <section className="relative mx-auto grid min-h-[calc(100dvh-1.5rem)] w-full max-w-md overflow-hidden rounded-[24px] bg-white shadow-float sm:min-h-[calc(100dvh-3rem)] lg:h-[calc(100vh-3rem)] lg:max-h-[720px] lg:min-h-0 lg:max-w-6xl lg:grid-cols-[0.96fr_1fr] lg:rounded-[28px]">
        <div className="flex items-center justify-center px-5 py-7 sm:px-10 sm:py-10 lg:items-start lg:px-14 lg:py-6">
          <div className="relative w-full max-w-sm lg:-translate-y-5">
            <div className="mb-4 flex items-center justify-center sm:mb-6 lg:mb-3">
              <img
                src={logo}
                alt="BW7 Marketplace"
                className="h-28 w-auto translate-y-3 object-contain sm:h-36 lg:h-44 lg:translate-y-8"
              />
            </div>

            <div className="text-center">
              <h1 className="text-2xl font-extrabold tracking-normal text-primary-dark sm:text-3xl">
                {isRegister ? "Cadastrar" : "Entrar"}
              </h1>
              <p className="mt-2 text-sm font-medium text-muted-foreground">
                {isRegister
                  ? "Crie sua conta e comece a fortalecer sua rede BW7."
                  : "Acesse sua conta e continue fortalecendo a rede BW7."}
              </p>
            </div>

            <div className="mt-5 grid h-11 grid-cols-2 rounded-2xl bg-[#f1effb] p-1 text-sm font-extrabold text-primary-dark">
              <button
                type="button"
                onClick={() => setAuthMode("login")}
                className={`relative rounded-xl transition ${
                  authMode === "login" ? "text-white" : "hover:text-primary"
                }`}
              >
                {authMode === "login" ? (
                  <motion.span
                    layoutId="auth-toggle"
                    className="absolute inset-0 rounded-xl bg-primary shadow-card"
                    transition={{ type: "spring", stiffness: 420, damping: 34 }}
                  />
                ) : null}
                <span className="relative">Login</span>
              </button>
              <button
                type="button"
                onClick={() => setAuthMode("register")}
                className={`relative rounded-xl transition ${
                  authMode === "register" ? "text-white" : "hover:text-primary"
                }`}
              >
                {authMode === "register" ? (
                  <motion.span
                    layoutId="auth-toggle"
                    className="absolute inset-0 rounded-xl bg-primary shadow-card"
                    transition={{ type: "spring", stiffness: 420, damping: 34 }}
                  />
                ) : null}
                <span className="relative">Cadastro</span>
              </button>
            </div>

            <div className="relative mt-5 min-h-[240px] overflow-hidden lg:min-h-[228px]">
              <AnimatePresence mode="wait" initial={false}>
                {isRegister ? (
                  <motion.form
                    key="register"
                    className="space-y-3 sm:space-y-4 lg:space-y-3"
                    initial={{ opacity: 0, x: 28, filter: "blur(6px)" }}
                    animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
                    exit={{ opacity: 0, x: -28, filter: "blur(6px)" }}
                    transition={{ duration: 0.34, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <label className="group flex h-12 items-center gap-3 rounded-2xl bg-[#f1effb] px-4 text-sm text-primary-dark ring-1 ring-transparent transition focus-within:bg-white focus-within:ring-primary/35">
                      <UserRound className="h-5 w-5 shrink-0 text-primary" aria-hidden="true" />
                      <span className="sr-only">Nome completo</span>
                      <input
                        type="text"
                        name="name"
                        autoComplete="name"
                        placeholder="Nome completo"
                        className="h-full min-w-0 flex-1 bg-transparent text-sm font-medium outline-none placeholder:text-primary-dark/55"
                      />
                    </label>

                    <label className="group flex h-12 items-center gap-3 rounded-2xl bg-[#f1effb] px-4 text-sm text-primary-dark ring-1 ring-transparent transition focus-within:bg-white focus-within:ring-primary/35">
                      <Mail className="h-5 w-5 shrink-0 text-primary" aria-hidden="true" />
                      <span className="sr-only">Email</span>
                      <input
                        type="email"
                        name="email"
                        autoComplete="email"
                        placeholder="Email"
                        className="h-full min-w-0 flex-1 bg-transparent text-sm font-medium outline-none placeholder:text-primary-dark/55"
                      />
                    </label>

                    <label className="group flex h-12 items-center gap-3 rounded-2xl bg-[#f1effb] px-4 text-sm text-primary-dark ring-1 ring-transparent transition focus-within:bg-white focus-within:ring-primary/35">
                      <LockKeyhole className="h-5 w-5 shrink-0 text-primary" aria-hidden="true" />
                      <span className="sr-only">Senha</span>
                      <input
                        type="password"
                        name="password"
                        autoComplete="new-password"
                        placeholder="Senha"
                        className="h-full min-w-0 flex-1 bg-transparent text-sm font-medium outline-none placeholder:text-primary-dark/55"
                      />
                    </label>

                    <button
                      type="submit"
                      className="mx-auto flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-primary px-6 text-sm font-extrabold text-white shadow-card transition hover:bg-primary-dark focus:outline-none focus:ring-4 focus:ring-primary/20 sm:w-auto sm:min-w-40"
                    >
                      Criar conta
                      <ArrowRight className="h-4 w-4" aria-hidden="true" />
                    </button>
                  </motion.form>
                ) : (
                  <motion.form
                    key="login"
                    className="space-y-3 sm:space-y-4 lg:space-y-3"
                    initial={{ opacity: 0, x: -28, filter: "blur(6px)" }}
                    animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
                    exit={{ opacity: 0, x: 28, filter: "blur(6px)" }}
                    transition={{ duration: 0.34, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <label className="group flex h-12 items-center gap-3 rounded-2xl bg-[#f1effb] px-4 text-sm text-primary-dark ring-1 ring-transparent transition focus-within:bg-white focus-within:ring-primary/35">
                      <UserRound className="h-5 w-5 shrink-0 text-primary" aria-hidden="true" />
                      <span className="sr-only">Usuário</span>
                      <input
                        type="text"
                        name="username"
                        autoComplete="username"
                        placeholder="Usuário"
                        className="h-full min-w-0 flex-1 bg-transparent text-sm font-medium outline-none placeholder:text-primary-dark/55"
                      />
                    </label>

                    <label className="group flex h-12 items-center gap-3 rounded-2xl bg-[#f1effb] px-4 text-sm text-primary-dark ring-1 ring-transparent transition focus-within:bg-white focus-within:ring-primary/35">
                      <LockKeyhole className="h-5 w-5 shrink-0 text-primary" aria-hidden="true" />
                      <span className="sr-only">Senha</span>
                      <input
                        type="password"
                        name="password"
                        autoComplete="current-password"
                        placeholder="Senha"
                        className="h-full min-w-0 flex-1 bg-transparent text-sm font-medium outline-none placeholder:text-primary-dark/55"
                      />
                    </label>

                    <div className="flex items-center justify-between gap-3 text-xs font-semibold text-muted-foreground">
                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          className="h-4 w-4 rounded border-input accent-primary"
                        />
                        Lembrar acesso
                      </label>
                      <a href="#" className="text-primary transition hover:text-primary-dark">
                        Esqueci minha senha
                      </a>
                    </div>

                    <button
                      type="submit"
                      className="mx-auto flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-primary px-6 text-sm font-extrabold text-white shadow-card transition hover:bg-primary-dark focus:outline-none focus:ring-4 focus:ring-primary/20 sm:w-auto sm:min-w-36"
                    >
                      Entrar agora
                      <ArrowRight className="h-4 w-4" aria-hidden="true" />
                    </button>
                  </motion.form>
                )}
              </AnimatePresence>
            </div>

            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={authMode}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.22, ease: "easeOut" }}
              >
                <div className="my-5 flex items-center gap-3 text-sm font-bold text-primary-dark sm:my-6 lg:my-4">
                  <span className="h-px flex-1 bg-border" />
                  <span>{isRegister ? "Cadastrar com" : "Entrar com"}</span>
                  <span className="h-px flex-1 bg-border" />
                </div>

                <div className="space-y-3">
                  <button className="flex h-12 w-full items-center justify-center gap-3 rounded-2xl border border-border bg-white text-sm font-bold text-primary-dark transition hover:border-primary/30 hover:bg-secondary">
                    <span
                      className="flex h-5 w-5 items-center justify-center rounded-full text-base font-extrabold leading-none text-[#db4437]"
                      aria-hidden="true"
                    >
                      G
                    </span>
                    {isRegister ? "Cadastrar com Google" : "Continuar com Google"}
                  </button>
                </div>

                <p className="mt-5 text-center text-sm font-medium text-muted-foreground sm:mt-6 lg:mt-4">
                  {isRegister ? "Já tem conta?" : "Ainda não tem conta?"}{" "}
                  {isRegister ? (
                    <button
                      type="button"
                      onClick={() => setAuthMode("login")}
                      className="font-extrabold text-primary transition hover:text-primary-dark"
                    >
                      Entrar
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setAuthMode("register")}
                      className="font-extrabold text-primary transition hover:text-primary-dark"
                    >
                      Criar cadastro
                    </button>
                  )}
                </p>
              </motion.div>
            </AnimatePresence>

            {!isRegister ? (
              <p className="absolute left-0 right-0 mt-3 text-center text-sm font-medium text-muted-foreground">
                <Link to="/" className="font-extrabold text-primary hover:text-primary-dark">
                  Conhecer marketplace
                </Link>
              </p>
            ) : null}
          </div>
        </div>

        <div className="relative hidden min-h-[420px] overflow-hidden bg-gradient-hero px-8 py-8 lg:flex lg:min-h-0 lg:flex-col lg:gap-8">
          <div className="w-fit rounded-full bg-white/16 px-5 py-3 text-sm font-extrabold text-white ring-1 ring-white/30 backdrop-blur">
            BW7 Business Woman
          </div>

          <div className="flex min-h-0 flex-1 items-center justify-center py-2">
            <div className="relative aspect-[4/5] w-[min(72%,370px)] max-h-[300px] overflow-hidden rounded-[30px] border border-white/45 bg-white/16 p-3 shadow-float backdrop-blur-sm">
              <img
                src={loginImage}
                alt="Mulher empreendedora usando tablet"
                className="h-full w-full rounded-[20px] object-cover object-top"
              />
            </div>
          </div>

          <div className="mb-36 ml-auto w-full max-w-[280px] rounded-[24px] bg-white/14 p-5 text-white ring-1 ring-white/25 backdrop-blur">
            <p className="text-xl font-extrabold leading-tight">Conecte, venda e cresça.</p>
            <p className="mt-2 text-xs font-semibold leading-relaxed text-white/78">
              Sua vitrine digital para novos negócios e parcerias.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
