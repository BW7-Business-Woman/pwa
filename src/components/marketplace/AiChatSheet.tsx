import { useEffect, useRef, useState } from "react";
import { CornerDownLeft, LoaderCircle, Sparkle, X } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { products, type Product } from "@/data/products";
import { useMarketplace } from "@/store/marketplace";
import { type ChatScreenContext, formatPrice, productContext } from "./AiChat";

type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  parts: Array<{ type: "text"; text: string }>;
};

type StoredChatHistory = {
  messages: ChatMessage[];
  recommendationMessageId: string | null;
  recommendedProductId: string | null;
};

const SUGGESTIONS = [
  "Me sugira um presente",
  "Tem oferta hoje?",
  "Como vendo na BW7?",
];

const apiBaseUrl = (import.meta.env.VITE_API_BASE_URL ?? "").replace(/\/$/, "");
const chatApiUrl = `${apiBaseUrl}/api/chat`;
const chatHistoryStorageKey = "bw7:assistant-chat-history";
const maxStoredMessages = 40;
let inMemoryChatHistory: StoredChatHistory = {
  messages: [],
  recommendationMessageId: null,
  recommendedProductId: null,
};

function createId() {
  return `msg-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

function getRandomProduct() {
  return products[Math.floor(Math.random() * products.length)];
}

function getMessageText(message: ChatMessage): string {
  return message.parts.map((part) => part.text).join(" ");
}

function loadStoredChatHistory(): StoredChatHistory {
  return inMemoryChatHistory;
}

function saveStoredChatHistory(
  messages: ChatMessage[],
  recommendationMessageId: string | null,
  recommendedProductId: string | null,
) {
  const messagesWithText = messages
    .filter((message) => getMessageText(message).trim())
    .slice(-maxStoredMessages);
  const shouldStoreRecommendation =
    recommendationMessageId &&
    recommendedProductId &&
    messagesWithText.some((message) => message.id === recommendationMessageId);

  inMemoryChatHistory = {
    messages: messagesWithText,
    recommendationMessageId: shouldStoreRecommendation ? recommendationMessageId : null,
    recommendedProductId: shouldStoreRecommendation ? recommendedProductId : null,
  };
}

function clearLegacyStoredChatHistory() {
  if (typeof window === "undefined") return;

  try {
    window.localStorage.removeItem(chatHistoryStorageKey);
  } catch {
    // Storage can fail in private mode or when access is blocked.
  }
}

function isRecommendationRequest(message: string) {
  const normalized = message
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase();

  return /\b(?:me\s+.*\b(?:sugere?|sugest(?:ao|ao)?|recomend(?:a|ar)|indic(?:a|ar|e|uar)|indiqu(?:e|ar)|dica|presente|produto|algo)\b|sugere?r?|recomenda?r?|indic(?:a|ar|e|uar)|indiqu(?:e|ar)|dica|presente|produto|algo|outro|outra|mais\s+uma|mais\s+um|outra\s+sugest(?:ao|ao)|mais\s+uma\s+sugest(?:ao|ao)|outra\s+indicacao|mais\s+uma\s+indicacao)\b/.test(
    normalized,
  );
}

function appendAssistantText(
  messages: ChatMessage[],
  assistantId: string,
  text: string,
) {
  return messages.map((message) =>
    message.id === assistantId
      ? { ...message, parts: [{ type: "text" as const, text: getMessageText(message) + text }] }
      : message,
  );
}

function extractTextDelta(value: unknown) {
  if (!value || typeof value !== "object") return "";
  const data = value as Record<string, unknown>;

  if (typeof data.delta === "string") return data.delta;
  if (typeof data.textDelta === "string") return data.textDelta;
  if (typeof data.text === "string" && data.type === "text-delta") return data.text;
  if (typeof data.content === "string" && data.type === "text-delta") return data.content;

  return "";
}

async function readChatStream(
  response: Response,
  onText: (text: string) => void,
) {
  if (!response.body) return;

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  while (true) {
    const { value, done } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split(/\r?\n/);
    buffer = lines.pop() ?? "";

    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed || trimmed === "data: [DONE]") continue;

      const payload = trimmed.startsWith("data:")
        ? trimmed.slice(5).trim()
        : trimmed;
      const legacyMatch = payload.match(/^\d+:(.*)$/);

      try {
        const parsed = JSON.parse(legacyMatch ? legacyMatch[1] : payload);
        if (typeof parsed === "string") {
          onText(parsed);
          continue;
        }

        const delta = extractTextDelta(parsed);
        if (delta) onText(delta);
      } catch {
        if (!payload.includes("{") && !payload.includes("}")) {
          onText(payload);
        }
      }
    }
  }
}

export function ChatSheet({
  context,
  onClose,
}: {
  context?: ChatScreenContext;
  onClose: () => void;
}) {
  const initialHistoryRef = useRef(loadStoredChatHistory());
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>(
    () => initialHistoryRef.current.messages,
  );
  const [status, setStatus] = useState<"ready" | "submitted" | "streaming" | "error">("ready");
  const [recommendedProduct, setRecommendedProduct] = useState<Product | null>(() =>
    products.find((product) => product.id === initialHistoryRef.current.recommendedProductId) ?? null,
  );
  const [recommendationMessageId, setRecommendationMessageId] = useState<string | null>(
    () => initialHistoryRef.current.recommendationMessageId,
  );
  const abortRef = useRef<AbortController | null>(null);
  const messagesRef = useRef<HTMLDivElement>(null);
  const openProduct = useMarketplace((state) => state.openProduct);

  useEffect(() => {
    clearLegacyStoredChatHistory();
    return () => abortRef.current?.abort();
  }, []);
  useEffect(() => {
    saveStoredChatHistory(
      messages,
      recommendationMessageId,
      recommendedProduct?.id ?? null,
    );
  }, [messages, recommendationMessageId, recommendedProduct]);
  useEffect(() => {
    const messagesElement = messagesRef.current;
    if (!messagesElement) return;

    messagesElement.scrollTop = messagesElement.scrollHeight;
  }, [messages, status]);

  const isLoading = status === "submitted" || status === "streaming";

  const send = async (text: string) => {
    const value = text.trim();
    if (!value || isLoading) return;

    const userMessage: ChatMessage = {
      id: createId(),
      role: "user",
      parts: [{ type: "text", text: value }],
    };
    const assistantMessage: ChatMessage = {
      id: createId(),
      role: "assistant",
      parts: [{ type: "text", text: "" }],
    };
    const recommendation = isRecommendationRequest(value) ? getRandomProduct() : null;
    const nextMessages = [...messages, userMessage, assistantMessage];

    setInput("");
    setStatus("submitted");
    setRecommendedProduct(null);
    setRecommendationMessageId(null);
    setMessages(nextMessages);

    const controller = new AbortController();
    abortRef.current = controller;

    try {
      const response = await fetch(chatApiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: nextMessages.filter((message) => getMessageText(message).trim()),
          context: {
            ...(context ?? {}),
            ...(recommendation ? { recommendedProduct: productContext(recommendation) } : {}),
          },
        }),
        signal: controller.signal,
      });

      if (!response.ok) {
        throw new Error(`Chat request failed with status ${response.status}`);
      }

      let hasReceivedText = false;
      await readChatStream(response, (delta) => {
        if (!hasReceivedText) {
          hasReceivedText = true;
          setStatus("streaming");
        }
        setMessages((current) => appendAssistantText(current, assistantMessage.id, delta));
      });

      if (recommendation) {
        setRecommendedProduct(recommendation);
        setRecommendationMessageId(assistantMessage.id);
      }
      setStatus("ready");
    } catch (error) {
      if ((error as Error).name === "AbortError") return;
      setStatus("error");
    } finally {
      abortRef.current = null;
    }
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    send(input);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-primary-dark/40 backdrop-blur-sm flex items-end sm:items-center justify-center"
      onClick={onClose}
    >
      <motion.div
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ type: "spring", stiffness: 320, damping: 32 }}
        onClick={(e) => e.stopPropagation()}
        data-assistente-bw7-chat
        className="w-full max-w-md h-[88vh] sm:h-[640px] bg-background rounded-t-3xl sm:rounded-3xl shadow-float flex flex-col overflow-hidden"
      >
        <div className="relative px-5 pt-5 pb-4 bg-gradient-hero text-primary-foreground">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-primary-foreground/15 grid place-items-center backdrop-blur">
              <Sparkle className="h-5 w-5" fill="currentColor" />
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="font-semibold text-[15px] leading-tight">Assistente - BW7</h2>
              <p className="text-[11px] text-primary-foreground/75 flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-mint" />
                Online agora - responde em segundos
              </p>
            </div>
            <button
              onClick={onClose}
              aria-label="Fechar"
              className="h-9 w-9 rounded-full bg-primary-foreground/15 hover:bg-primary-foreground/25 grid place-items-center transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div ref={messagesRef} className="flex-1 overflow-y-auto bg-background px-4 py-4">
          <div className="flex flex-col gap-8">
            {messages.length === 0 && (
              <div className="py-6 text-center">
                <div className="mx-auto h-14 w-14 rounded-2xl bg-gradient-hero text-primary-foreground grid place-items-center shadow-card mb-3">
                  <Sparkle className="h-7 w-7" fill="currentColor" />
                </div>
                <h3 className="text-[15px] font-semibold">Oi! Sou a Assistente BW7!</h3>
                <p className="text-[12px] text-muted-foreground mt-1 max-w-[260px] mx-auto">
                  Posso te ajudar a encontrar produtos, comparar opções ou conhecer a comunidade BW7.
                </p>
                <div className="mt-5 flex flex-col gap-2">
                  {SUGGESTIONS.map((s) => (
                    <button
                      key={s}
                      onClick={() => send(s)}
                      className="mx-auto text-[12px] px-3 py-2 rounded-full bg-primary-soft text-primary hover:bg-primary hover:text-primary-foreground transition-colors"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {messages.map((message) => (
              <div
                key={message.id}
                className={
                  message.role === "user"
                    ? "ml-auto flex w-full max-w-[95%] justify-end"
                    : "flex w-full max-w-[95%] justify-start"
                }
              >
                <div
                  className={
                    message.role === "user"
                      ? "w-fit max-w-full whitespace-pre-wrap rounded-lg bg-secondary px-4 py-3 text-sm text-foreground"
                      : "w-fit max-w-full whitespace-pre-wrap text-sm text-foreground"
                  }
                >
                  {message.parts.map((part, index) =>
                    part.text ? (
                      <p key={index} className="leading-relaxed">
                        {part.text}
                      </p>
                    ) : null,
                  )}
                  {message.role === "assistant" && message.id === recommendationMessageId && recommendedProduct ? (
                    <div className="mt-3 rounded-3xl border border-primary/10 bg-primary/5 p-4 text-sm">
                      <div className="mb-3 flex items-start justify-between gap-4">
                        <div>
                          <p className="text-sm font-semibold text-foreground">{recommendedProduct.name}</p>
                          <p className="text-[12px] text-muted-foreground mt-1">
                            Categoria: {recommendedProduct.category}
                            {recommendedProduct.tag ? ` - ${recommendedProduct.tag}` : ""}
                          </p>
                        </div>
                        <span className="rounded-full bg-primary/10 px-3 py-1 text-[11px] font-semibold text-primary">
                          {formatPrice(recommendedProduct.price)}
                        </span>
                      </div>
                      <Button
                        variant="secondary"
                        className="w-full bg-primary-dark text-primary-foreground hover:bg-primary"
                        onClick={() => openProduct(recommendedProduct.id)}
                      >
                        Ver produto
                      </Button>
                    </div>
                  ) : null}
                </div>
              </div>
            ))}

            {status === "submitted" && (
              <div className="flex w-full max-w-[95%] justify-start">
                <span className="inline-flex items-center gap-2 text-[12px] font-semibold">
                  <span className="ai-thinking-gradient-static">Pensando...</span>
                </span>
              </div>
            )}

            {status === "error" && (
              <div className="text-[12px] text-destructive bg-destructive/10 rounded-xl px-3 py-2">
                Nao consegui responder agora. Tente novamente.
              </div>
            )}
          </div>
        </div>

        <div className="px-3 pt-2 pb-3 border-t bg-background">
          <form onSubmit={handleSubmit} className="rounded-2xl border border-border bg-card p-2 shadow-soft">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter" && !event.shiftKey) {
                  event.preventDefault();
                  send(input);
                }
              }}
              placeholder="Pergunte algo a Assistente BW7..."
              rows={2}
              className="max-h-32 min-h-14 w-full resize-none bg-transparent px-3 py-2 text-sm text-foreground outline-none placeholder:text-muted-foreground"
            />
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={!input.trim() || isLoading}
                aria-label="Enviar mensagem"
                className="grid h-8 w-8 place-items-center rounded-full bg-primary text-primary-foreground transition-colors hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isLoading ? (
                  <LoaderCircle className="h-4 w-4 animate-spin" />
                ) : (
                  <CornerDownLeft className="h-4 w-4" />
                )}
              </button>
            </div>
          </form>
        </div>
      </motion.div>
    </motion.div>
  );
}
