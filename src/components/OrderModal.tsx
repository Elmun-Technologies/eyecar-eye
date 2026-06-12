"use client";

import { useState } from "react";
import { useLang } from "@/lib/i18n";
import type { Product } from "@/config/site";

/**
 * Sotib olish zayavkasi oynasi: ism + telefon. Yuborilgach minnatdorlik
 * holati ko'rsatiladi. Yashirin `website` maydoni — oddiy anti-spam.
 */
export function OrderModal({
  product,
  onClose,
}: {
  product: Product;
  onClose: () => void;
}) {
  const { lang, t } = useLang();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [website, setWebsite] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (name.trim().length < 2) {
      setError(t.order.nameError);
      return;
    }
    if (phone.replace(/\D/g, "").length < 9) {
      setError(t.order.phoneError);
      return;
    }
    setSending(true);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          productId: product.id,
          productName: product.name,
          name,
          phone,
          lang,
          website,
        }),
      });
      if (!res.ok) throw new Error("send-failed");
      setSent(true);
    } catch {
      setError(t.order.error);
    } finally {
      setSending(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 p-5"
      onClick={onClose}
    >
      <div
        className="animate-pop-in w-full max-w-md rounded-3xl bg-surface p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        {sent ? (
          <div className="text-center">
            <p className="text-4xl" aria-hidden>
              ✅
            </p>
            <p className="mt-3 text-[15px] font-bold leading-relaxed">
              {t.order.success}
            </p>
            <button
              onClick={onClose}
              className="mt-6 w-full rounded-full bg-accent-dark py-3.5 font-bold text-white transition hover:bg-accent-dark-hover"
            >
              {t.order.close}
            </button>
          </div>
        ) : (
          <form onSubmit={submit}>
            <h2 className="text-xl font-extrabold">{t.order.title}</h2>
            <p className="mt-1 text-sm font-bold text-foreground/60">
              {product.name}
            </p>
            <p className="mt-2 text-[15px] leading-relaxed">
              {t.order.subtitle}
            </p>

            <label className="mt-4 block">
              <span className="mb-1 block text-xs font-extrabold text-foreground/60">
                {t.order.nameLabel}
              </span>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={t.order.namePlaceholder}
                autoComplete="name"
                className="w-full rounded-xl border border-foreground/15 bg-white px-3 py-3 text-[15px] font-medium outline-none focus:border-[#7b6ce4]"
              />
            </label>
            <label className="mt-3 block">
              <span className="mb-1 block text-xs font-extrabold text-foreground/60">
                {t.order.phoneLabel}
              </span>
              <input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder={t.order.phonePlaceholder}
                type="tel"
                inputMode="tel"
                autoComplete="tel"
                className="w-full rounded-xl border border-foreground/15 bg-white px-3 py-3 text-[15px] font-medium outline-none focus:border-[#7b6ce4]"
              />
            </label>
            {/* Anti-spam: odamlar ko'rmaydi, botlar to'ldiradi */}
            <input
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
              tabIndex={-1}
              autoComplete="off"
              aria-hidden
              className="hidden"
            />

            {error && (
              <p className="mt-3 text-sm font-bold text-brand-red">{error}</p>
            )}

            <button
              type="submit"
              disabled={sending}
              className="mt-5 w-full rounded-full bg-accent-dark py-4 font-bold text-white transition hover:bg-accent-dark-hover disabled:opacity-60"
            >
              {sending ? t.order.sending : t.order.submit}
            </button>
            <p className="mt-3 text-center text-[11px] leading-relaxed text-foreground/50">
              {t.order.privacy}
            </p>
          </form>
        )}
      </div>
    </div>
  );
}
