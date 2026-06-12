"use client";

import { useRef, useState } from "react";
import { useLang } from "@/lib/i18n";
import { useProducts } from "@/lib/useProducts";
import { OrderModal } from "./OrderModal";
import { DropBottleIcon } from "./icons";
import type { Product } from "@/config/site";

function Chevron({ className, flip }: { className?: string; flip?: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      style={flip ? { transform: "scaleX(-1)" } : undefined}
      aria-hidden
    >
      <path
        d="M9 4.5 16.5 12 9 19.5"
        stroke="currentColor"
        strokeWidth="3.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ExternalIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
      <path
        d="M9 5H5v14h14v-4M14 4h6v6M20 4 11 13"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** Mahsulotlar karuseli — surat bosilsa brend sahifasiga olib o'tadi */
export function ProductCarousel() {
  const { lang, t } = useLang();
  const products = useProducts();
  const trackRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const [ordering, setOrdering] = useState<Product | null>(null);

  const onScroll = () => {
    const el = trackRef.current;
    if (!el) return;
    setActive(Math.round(el.scrollLeft / el.clientWidth));
  };

  const go = (i: number) => {
    const el = trackRef.current;
    if (!el) return;
    const idx = Math.max(0, Math.min(products.length - 1, i));
    el.scrollTo({ left: idx * el.clientWidth, behavior: "smooth" });
  };

  return (
    <div className="relative">
      <div
        ref={trackRef}
        onScroll={onScroll}
        className="flex snap-x snap-mandatory overflow-x-auto scroll-smooth [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {products.map((p) => {
          const card = (
            <>
              <div className="flex aspect-[4/3] flex-col items-center justify-center gap-3 rounded-xl bg-gradient-to-b from-[#f6f3fb] to-[#ece4f6] p-4">
                {p.images?.[0] ? (
                  /* eslint-disable-next-line @next/next/no-img-element -- blob'dagi mahsulot surati */
                  <img
                    src={p.images[0]}
                    alt={p.name}
                    className="max-h-full w-auto object-contain"
                  />
                ) : (
                  <DropBottleIcon className="h-16 w-16 text-foreground/80" />
                )}
              </div>
              <p className="mt-3 text-center font-extrabold leading-snug">
                {p.name}
              </p>
              <p className="mt-0.5 text-center text-xs font-bold text-foreground/55">
                {p.short[lang]}
              </p>
              {/* Havola da'vosi faqat haqiqiy URL bo'lganda ko'rsatiladi */}
              {p.url && (
                <p className="mt-2 flex items-center justify-center gap-2 text-center text-sm font-bold">
                  {t.products.tap}
                  <ExternalIcon className="h-5 w-5 shrink-0" />
                </p>
              )}
            </>
          );
          return (
            <div key={p.id} className="w-full shrink-0 snap-center px-1">
              {p.url ? (
                <a
                  href={p.url}
                  target="_blank"
                  rel="noreferrer"
                  className="block rounded-2xl bg-white p-4 shadow-sm transition active:scale-[0.98]"
                >
                  {card}
                </a>
              ) : (
                <div className="rounded-2xl bg-white p-4 shadow-sm">{card}</div>
              )}
              <button
                onClick={() => setOrdering(p)}
                className="mt-3 w-full rounded-full bg-accent-dark py-3.5 font-bold text-white transition hover:bg-accent-dark-hover active:scale-[0.98]"
              >
                {t.order.button}
              </button>
            </div>
          );
        })}
      </div>

      {active > 0 && (
        <button
          onClick={() => go(active - 1)}
          aria-label={t.products.ariaPrev}
          className="absolute -left-2 top-[38%] z-10 text-[#e0559a]"
        >
          <Chevron className="h-9 w-9" flip />
        </button>
      )}
      {active < products.length - 1 && (
        <button
          onClick={() => go(active + 1)}
          aria-label={t.products.ariaNext}
          className="absolute -right-2 top-[38%] z-10 text-[#e0559a]"
        >
          <Chevron className="h-9 w-9" />
        </button>
      )}

      {/* Nuqtalar */}
      <div className="mt-4 flex justify-center gap-2.5">
        {products.map((p, i) => (
          <button
            key={p.id}
            onClick={() => go(i)}
            aria-label={t.products.ariaDot(i + 1)}
            className={`h-2.5 w-2.5 rounded-full transition ${
              i === active ? "bg-[#e0559a]" : "bg-foreground/20"
            }`}
          />
        ))}
      </div>

      {ordering && (
        <OrderModal product={ordering} onClose={() => setOrdering(null)} />
      )}
    </div>
  );
}
