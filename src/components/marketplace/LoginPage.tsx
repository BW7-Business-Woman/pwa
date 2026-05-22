import { useState, type FormEvent } from "react";
import * as Lucide from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useMarketplace } from "@/store/marketplace";

export function LoginPage() {
  const { setActiveNav } = useMarketplace();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const isSignUp = mode === "signup";

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!email.trim() || !password.trim() || (isSignUp && !name.trim())) {
      setMessage("Preencha todos os campos para continuar.");
      return;
    }

    setMessage(
      isSignUp
        ? "Conta criada mockada! Agora você pode entrar com email e senha."
        : "Login mockado realizado com sucesso."
    );
  };

  const handleGoogle = () => {
    setMessage("Mock: login com Google realizado. Bem-vinda à BW7!");
  };

  return (
    <main className="min-h-screen bg-background px-4 py-10 text-foreground">
      <div className="mx-auto flex max-w-xl flex-col gap-8 rounded-[32px] border border-border bg-card p-8 shadow-soft lg:p-12">
        <div className="space-y-2 text-center">
          <p className="text-sm uppercase tracking-[0.22em] text-muted-foreground">Acesso mockado</p>
          <h1 className="text-4xl font-black tracking-tight text-foreground">
            {isSignUp ? "Criar conta" : "Entrar"}
          </h1>
          <p className="mx-auto max-w-xl text-sm leading-6 text-muted-foreground">
            Nome, email e senha ou continue com Google. Tudo simulado para protótipo.
          </p>
        </div>

        <div className="grid gap-4">
          <Button
            type="button"
            variant="outline"
            size="lg"
            className="justify-center gap-2"
            onClick={handleGoogle}
          >
            <Lucide.LogIn className="h-5 w-5" />
            Continuar com Google
          </Button>

          <div className="relative">
            <div className="absolute inset-x-10 top-1/2 h-px bg-border" />
            <span className="relative inline-flex bg-card px-3 text-xs uppercase tracking-[0.24em] text-muted-foreground">
              ou use email e senha
            </span>
          </div>

          <form onSubmit={handleSubmit} className="grid gap-4">
            {isSignUp && (
              <div className="grid gap-2">
                <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
                  <Lucide.User className="h-4 w-4" />
                  Nome completo
                </div>
                <Input
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  placeholder="Seu nome"
                  aria-label="Nome"
                />
              </div>
            )}

            <div className="grid gap-2">
              <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
                <Lucide.Mail className="h-4 w-4" />
                Email
              </div>
              <Input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="email@exemplo.com"
                aria-label="Email"
              />
            </div>

            <div className="grid gap-2">
              <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
                <Lucide.Lock className="h-4 w-4" />
                Senha
              </div>
              <Input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="••••••••"
                aria-label="Senha"
              />
            </div>

            <Button type="submit" size="lg" className="mt-2">
              {isSignUp ? "Criar conta" : "Entrar"}
            </Button>
          </form>

          <div className="rounded-3xl bg-secondary/70 px-4 py-4 text-sm text-muted-foreground">
            <p className="font-semibold text-foreground">Login mockado</p>
            <p>
              Esta tela não autentica de verdade. Tudo é simulado para apresentação e fluxo de conta.
            </p>
          </div>

          {message ? (
            <div className="rounded-3xl bg-primary-soft px-4 py-4 text-sm text-primary">
              {message}
            </div>
          ) : null}

          <div className="flex flex-col gap-3 text-center text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
            <span>
              {isSignUp ? "Já tem conta?" : "Ainda não tem conta?"}
            </span>
            <button
              type="button"
              onClick={() => {
                setMode(isSignUp ? "signin" : "signup");
                setMessage("");
              }}
              className="font-semibold text-primary hover:underline"
            >
              {isSignUp ? "Entrar" : "Criar conta"}
            </button>
          </div>

          <button
            type="button"
            onClick={() => setActiveNav("Início")}
            className="inline-flex items-center justify-center gap-2 rounded-full border border-input bg-background px-4 py-3 text-sm font-semibold text-foreground transition hover:bg-accent"
          >
            <Lucide.ArrowLeft className="h-4 w-4" />
            Voltar para o marketplace
          </button>
        </div>
      </div>
    </main>
  );
}
