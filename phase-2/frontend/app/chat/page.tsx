"use client";

import { useState, useRef, useEffect } from "react";
import ProtectedRoute from "../components/auth/ProtectedRoute";
import { useAuth } from "@/lib/auth";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "";

type Message = { role: "user" | "assistant"; content: string };

export default function ChatPage() {
  const { session } = useAuth();
  const token = session?.token ?? "";
  const [threadId, setThreadId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isListening, setIsListening] = useState(false);
  const [voiceError, setVoiceError] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<{ start(): void; stop(): void } | null>(null);
  const sendWithTextRef = useRef<(text: string) => Promise<void>>(() => Promise.resolve());

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const win = window as unknown as { SpeechRecognition?: new () => unknown; webkitSpeechRecognition?: new () => unknown };
    const SR = win.SpeechRecognition || win.webkitSpeechRecognition;
    if (!SR) return;
    const rec = new SR() as {
      continuous: boolean;
      interimResults: boolean;
      lang: string;
      start(): void;
      stop(): void;
      onresult: (e: unknown) => void;
      onerror: () => void;
      onend: () => void;
    };
    rec.continuous = false;
    rec.interimResults = true;
    rec.lang = "en-US";
    rec.onresult = (e: unknown) => {
      const ev = e as { results: ArrayLike<{ 0: { transcript: string }; isFinal?: boolean }>; resultIndex: number };
      const results = ev.results;
      const t: string[] = [];
      const len = results?.length ?? 0;
      for (let i = 0; i < len; i++) {
        const r = results[i];
        if (r && r[0]) t.push(r[0].transcript);
      }
      const text = t.join(" ").trim();
      const last = results?.[ev.resultIndex];
      if (last?.isFinal && text) sendWithTextRef.current(text);
    };
    rec.onerror = () => setIsListening(false);
    rec.onend = () => setIsListening(false);
    recognitionRef.current = rec;
    return () => {
      try {
        recognitionRef.current?.stop();
      } catch {
        // ignore
      }
    };
  }, []);

  const toggleMic = () => {
    if (!recognitionRef.current) {
      setVoiceError("Voice not supported in this browser.");
      return;
    }
    setVoiceError(null);
    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      try {
        recognitionRef.current.start();
        setIsListening(true);
      } catch (err) {
        setVoiceError("Microphone access denied or failed.");
        setIsListening(false);
      }
    }
  };

  const sendWithText = async (text: string) => {
    const t = text.trim();
    if (!t || !token || isLoading) return;
    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: t }]);
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_URL}/api/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          thread_id: threadId,
          message: t,
        }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.detail || res.statusText);
      }
      const data = await res.json();
      setThreadId(data.thread_id);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: data.message?.content ?? "No response.",
        },
      ]);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Request failed");
      setMessages((prev) => prev.slice(0, -1));
    } finally {
      setIsLoading(false);
    }
  };

  const send = () => sendWithText(input);
  sendWithTextRef.current = sendWithText;

  return (
    <ProtectedRoute>
      <div className="max-w-2xl mx-auto flex flex-col h-[calc(100vh-8rem)]">
        <h1 className="text-xl font-semibold mb-4">Todo Assistant</h1>
        <p className="text-sm text-muted-foreground mb-4">
          Ask to list, add, complete, or delete tasks in plain language.
        </p>
        <div className="flex-1 border rounded-lg bg-card overflow-hidden flex flex-col">
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.length === 0 && !isLoading && (
              <p className="text-muted-foreground text-sm">
                e.g. &quot;Show my tasks&quot;, &quot;Add task: Buy milk&quot;,
                &quot;Mark task 1 as done&quot;
              </p>
            )}
            {messages.map((m, i) => (
              <div
                key={i}
                className={
                  m.role === "user"
                    ? "text-right"
                    : "text-left"
                }
              >
                <span
                  className={
                    m.role === "user"
                      ? "inline-block px-3 py-2 rounded-lg bg-primary text-primary-foreground text-sm"
                      : "inline-block px-3 py-2 rounded-lg bg-muted text-sm max-w-[85%]"
                  }
                >
                  {m.content}
                </span>
              </div>
            ))}
            {isLoading && (
              <p className="text-muted-foreground text-sm">Thinking...</p>
            )}
            <div ref={bottomRef} />
          </div>
          {error && (
            <p className="px-4 py-2 text-sm text-destructive bg-destructive/10">
              {error}
            </p>
          )}
          {voiceError && (
            <p className="px-4 py-1 text-sm text-amber-600 dark:text-amber-400">
              {voiceError}
            </p>
          )}
          <form
            className="p-4 border-t flex gap-2 items-center"
            onSubmit={(e) => {
              e.preventDefault();
              send();
            }}
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type or use mic..."
              className="flex-1 px-3 py-2 border rounded-md bg-background text-sm"
              disabled={isLoading || !token}
            />
            <button
              type="button"
              onClick={toggleMic}
              disabled={isLoading || !token}
              title={isListening ? "Stop listening" : "Speak"}
              className={`p-2 rounded-md border ${isListening ? "bg-red-500/20 border-red-500 animate-pulse" : "bg-card border-border hover:bg-muted"}`}
              aria-label={isListening ? "Stop listening" : "Use microphone"}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
              </svg>
            </button>
            <button
              type="submit"
              disabled={isLoading || !input.trim() || !token}
              className="px-4 py-2 rounded-md bg-primary text-primary-foreground text-sm font-medium disabled:opacity-50"
            >
              Send
            </button>
          </form>
        </div>
      </div>
    </ProtectedRoute>
  );
}
