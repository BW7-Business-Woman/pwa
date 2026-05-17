import { useEffect, useRef, useState } from "react";
import { Sparkle, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import {
  Conversation,
  ConversationContent,
  ConversationScrollButton,
} from "@/components/ai-elements/conversation";
import { Message, MessageContent, MessageResponse } from "@/components/ai-elements/message";
import {
  PromptInput,
  PromptInputTextarea,
  PromptInputFooter,
  PromptInputSubmit,
} from "@/components/ai-elements/prompt-input";
import { Shimmer } from "@/components/ai-elements/shimmer";

const SUGGESTIONS = [
  "Me sugira um presente",
  "Tem oferta hoje?",
  "Como vendo na BW7?",
];

export function AiChatLauncher() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <motion.button
        whileTap={{ scale: 0.92 }}
        onClick={() => setOpen(true)}
        aria-label="Conversar com a Bia"
        className="fixed right-4 bottom-24 z-30 h-14 w-14 rounded-full bg-gradient-hero text-primary-foreground shadow-float flex items-center justify-center ring-2 ring-background"
      >
        <span className="absolute inset-0 rounded-full bg-primary/40 blur-xl -z-10" />
        <Sparkle className="h-6 w-6" fill="currentColor" />
        <span className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-mint ring-2 ring-background" />
      </motion.button>

      <AnimatePresence>{open && <ChatSheet onClose={() => setOpen(false)} />}</AnimatePresence>
    </>
  );
}

function ChatSheet({ onClose }: { onClose: () => void }) {
  const [input, setInput] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const transport = useRef(new DefaultChatTransport({ api: "/api/chat" })).current;

  const { messages, sendMessage, status, error } = useChat({
    transport,
  });

  useEffect(() => {
    textareaRef.current?.focus();
  }, []);

  useEffect(() => {
    if (status === "ready") textareaRef.current?.focus();
  }, [status]);

  const isLoading = status === "submitted" || status === "streaming";

  const send = (text: string) => {
    const value = text.trim();
    if (!value || isLoading) return;
    sendMessage({ text: value });
    setInput("");
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
        className="w-full max-w-md h-[88vh] sm:h-[640px] bg-background rounded-t-3xl sm:rounded-3xl shadow-float flex flex-col overflow-hidden"
      >
        {/* Header */}
        <div className="relative px-5 pt-5 pb-4 bg-gradient-hero text-primary-foreground">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-primary-foreground/15 grid place-items-center backdrop-blur">
              <Sparkle className="h-5 w-5" fill="currentColor" />
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="font-semibold text-[15px] leading-tight">Bia · BW7</h2>
              <p className="text-[11px] text-primary-foreground/75 flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-mint" />
                Online agora · responde em segundos
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

        {/* Messages */}
        <Conversation className="flex-1 bg-background">
          <ConversationContent className="px-4 py-4">
            {messages.length === 0 && (
              <div className="py-6 text-center">
                <div className="mx-auto h-14 w-14 rounded-2xl bg-gradient-hero text-primary-foreground grid place-items-center shadow-card mb-3">
                  <Sparkle className="h-7 w-7" fill="currentColor" />
                </div>
                <h3 className="text-[15px] font-semibold">Oi! Sou a Bia 👋</h3>
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

            {messages.map((m) => (
              <Message from={m.role} key={m.id}>
                <MessageContent>
                  {m.parts.map((part, i) =>
                    part.type === "text" ? (
                      <MessageResponse key={i}>{part.text}</MessageResponse>
                    ) : null,
                  )}
                </MessageContent>
              </Message>
            ))}

            {status === "submitted" && (
              <Message from="assistant">
                <MessageContent>
                  <Shimmer>Pensando...</Shimmer>
                </MessageContent>
              </Message>
            )}

            {error && (
              <div className="text-[12px] text-destructive bg-destructive/10 rounded-xl px-3 py-2">
                Não consegui responder agora. Tente novamente.
              </div>
            )}
          </ConversationContent>
          <ConversationScrollButton />
        </Conversation>

        {/* Composer */}
        <div className="px-3 pt-2 pb-3 border-t bg-background">
          <PromptInput
            onSubmit={(_, e) => {
              e.preventDefault();
              send(input);
            }}
          >
            <PromptInputTextarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Pergunte algo à Bia..."
            />
            <PromptInputFooter className="justify-end">
              <PromptInputSubmit
                status={status}
                disabled={!input.trim() || isLoading}
              />
            </PromptInputFooter>
          </PromptInput>
        </div>
      </motion.div>
    </motion.div>
  );
}
