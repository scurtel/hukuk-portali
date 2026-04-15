"use client";

import { useMemo, useState } from "react";

import { buildPrompt, type PromptContentType } from "@/lib/promptBuilder";

type AdminPanelClientProps = {
  adminPassword: string;
};

export function AdminPanelClient({ adminPassword }: AdminPanelClientProps) {
  const [passwordInput, setPasswordInput] = useState("");
  const [authError, setAuthError] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const [topic, setTopic] = useState("");
  const [type, setType] = useState<PromptContentType>("haber");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState("");
  const [error, setError] = useState("");

  const builtPrompt = useMemo(() => buildPrompt(type, topic), [type, topic]);

  function handleLogin() {
    if (!adminPassword) {
      setAuthError("Sistem şifresi tanımlı değil.");
      return;
    }

    if (passwordInput === adminPassword) {
      setIsAuthenticated(true);
      setAuthError("");
      return;
    }

    setAuthError("Şifre yanlış");
  }

  async function handleGenerate() {
    setError("");

    if (!topic.trim()) {
      setError("Lütfen içerik konusu giriniz.");
      return;
    }

    setLoading(true);
    setResult("");

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          prompt: builtPrompt
        })
      });

      const data = (await response.json()) as { content?: string; error?: string };

      if (!response.ok) {
        setError(data.error ?? "İçerik üretimi sırasında bir hata oluştu.");
        return;
      }

      setResult(data.content ?? "");
    } catch {
      setError("Sunucuya bağlanırken bir hata oluştu.");
    } finally {
      setLoading(false);
    }
  }

  async function handleCopy() {
    if (!result) {
      return;
    }

    await navigator.clipboard.writeText(result);
  }

  if (!isAuthenticated) {
    return (
      <section className="mx-auto w-full max-w-md px-4 py-10">
        <h1 className="mb-4 text-2xl font-bold text-slate-900">Admin Girişi</h1>
        <div className="space-y-3 rounded-lg border bg-white p-4">
          <input
            type="password"
            value={passwordInput}
            onChange={(event) => setPasswordInput(event.target.value)}
            placeholder="Şifre"
            className="w-full rounded-md border px-3 py-2 text-sm outline-none focus:border-brand-500"
          />
          <button
            type="button"
            onClick={handleLogin}
            className="rounded-md bg-brand-700 px-4 py-2 text-sm font-medium text-white"
          >
            Giriş
          </button>
          {authError ? <p className="text-sm text-red-600">{authError}</p> : null}
        </div>
      </section>
    );
  }

  return (
    <section className="mx-auto w-full max-w-3xl px-4 py-10">
      <h1 className="mb-6 text-3xl font-bold text-slate-900">AI İçerik Üretim Paneli</h1>

      <div className="space-y-4 rounded-lg border bg-white p-4">
        <div>
          <label htmlFor="topic" className="mb-1 block text-sm font-medium text-slate-700">
            Konu
          </label>
          <input
            id="topic"
            type="text"
            value={topic}
            onChange={(event) => setTopic(event.target.value)}
            placeholder="Örn: Kira sözleşmesinde tahliye şartları"
            className="w-full rounded-md border px-3 py-2 text-sm outline-none focus:border-brand-500"
          />
        </div>

        <div>
          <label htmlFor="type" className="mb-1 block text-sm font-medium text-slate-700">
            Tür
          </label>
          <select
            id="type"
            value={type}
            onChange={(event) => setType(event.target.value as PromptContentType)}
            className="w-full rounded-md border px-3 py-2 text-sm outline-none focus:border-brand-500"
          >
            <option value="haber">Haber</option>
            <option value="rehber">Rehber</option>
            <option value="analiz">Analiz</option>
          </select>
        </div>

        <button
          type="button"
          onClick={handleGenerate}
          disabled={loading}
          className="rounded-md bg-brand-700 px-4 py-2 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? "Üretiliyor..." : "İçerik Üret"}
        </button>
      </div>

      {error ? <p className="mt-4 text-sm text-red-600">{error}</p> : null}

      <div className="mt-6">
        <label className="mb-1 block text-sm font-medium text-slate-700">Sonuç</label>
        <textarea
          rows={14}
          readOnly
          value={result}
          placeholder="Üretilen içerik burada görünecek."
          className="w-full rounded-md border bg-slate-50 px-3 py-2 text-sm text-slate-800"
        />
        <button
          type="button"
          onClick={handleCopy}
          disabled={!result}
          className="mt-3 rounded-md border px-4 py-2 text-sm font-medium text-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Kopyala
        </button>
      </div>
    </section>
  );
}
