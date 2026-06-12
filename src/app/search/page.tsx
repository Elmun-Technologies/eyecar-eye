"use client";

import { useState } from "react";
import { BottomNav } from "@/components/BottomNav";
import { BrandHeader } from "@/components/BrandHeader";
import { DropBottleIcon } from "@/components/icons";
import { useLang } from "@/lib/i18n";
import { useProducts } from "@/lib/useProducts";
import {
  searchProducts,
  type FeatureId,
  type SceneId,
  type SymptomId,
} from "@/config/site";

const SYMPTOM_IDS: SymptomId[] = [
  "tired",
  "dry",
  "blur",
  "itch",
  "red",
  "contact",
];

type StepId = "symptoms" | "primary" | "cooling" | "scene" | "features";

type Step = {
  id: StepId;
  multi: boolean;
  /** Tanlovsiz davom etish mumkinmi */
  optional?: boolean;
  optionIds: string[];
};

/** Originaldagi 5 bosqich (matnlar lug'atdan olinadi) */
const STEPS: Step[] = [
  { id: "symptoms", multi: true, optionIds: SYMPTOM_IDS },
  { id: "primary", multi: false, optionIds: SYMPTOM_IDS },
  { id: "cooling", multi: false, optionIds: ["any", "none", "mild", "strong"] },
  { id: "scene", multi: false, optionIds: ["any", "naked", "soft", "hard"] },
  {
    id: "features",
    multi: true,
    optional: true,
    optionIds: ["vitaminA", "preservativeFree"],
  },
];

function CheckSquare({
  checked,
  className,
}: {
  checked: boolean;
  className?: string;
}) {
  return (
    <svg viewBox="0 0 28 28" fill="none" className={className} aria-hidden>
      <rect
        x="1.5"
        y="1.5"
        width="25"
        height="25"
        rx="7"
        fill={checked ? "url(#chk)" : "#ececf2"}
        stroke={checked ? "none" : "#d4d4de"}
        strokeWidth="1.5"
      />
      {checked && (
        <path
          d="M8 14.5l4 4 8-8.5"
          stroke="#fff"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      )}
      <defs>
        <linearGradient id="chk" x1="0" y1="0" x2="28" y2="28">
          <stop stopColor="#7b6ce4" />
          <stop offset="1" stopColor="#3f8fdc" />
        </linearGradient>
      </defs>
    </svg>
  );
}

/** Mahsulot suratlari: asosiy surat + bir nechta bo'lsa almashinadigan kichik suratlar */
function ProductImages({ images, name }: { images: string[]; name: string }) {
  const [idx, setIdx] = useState(0);
  const current = images[Math.min(idx, images.length - 1)];
  return (
    <div className="w-2/5 shrink-0">
      <span className="flex aspect-square w-full items-center justify-center rounded-2xl bg-white">
        {current ? (
          /* eslint-disable-next-line @next/next/no-img-element -- blob'dagi mahsulot surati */
          <img
            src={current}
            alt={name}
            className="max-h-full w-auto object-contain p-2"
          />
        ) : (
          <DropBottleIcon className="h-14 w-14 text-foreground/70" />
        )}
      </span>
      {images.length > 1 && (
        <div className="mt-2 flex flex-wrap gap-1.5">
          {images.map((src, i) => (
            <button
              key={`${src}-${i}`}
              onClick={() => setIdx(i)}
              className={`overflow-hidden rounded-lg bg-white p-0.5 ${
                i === idx ? "ring-2 ring-[#7b6ce4]" : "opacity-70"
              }`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element -- kichik surat */}
              <img src={src} alt="" className="h-9 w-9 object-contain" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

/** Salqinlik darajasi — originaldagidek 7 yulduzli shkala */
function CoolingStars({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-sm font-extrabold text-[#1f6fb5]">{label}</span>
      <span className="flex gap-0.5">
        {Array.from({ length: 7 }).map((_, i) => (
          <svg key={i} viewBox="0 0 20 20" className="h-4 w-4" aria-hidden>
            <path
              d="M10 1.8 12.5 7l5.7.8-4.1 4 1 5.6L10 14.7l-5.1 2.7 1-5.6-4.1-4L7.5 7Z"
              fill={i < value ? "#1f6fb5" : "#fff"}
              stroke={i < value ? "#1a5e99" : "#b9c4d4"}
              strokeWidth="1.4"
              strokeLinejoin="round"
            />
          </svg>
        ))}
      </span>
    </div>
  );
}

export default function SearchPage() {
  const { lang, t } = useLang();
  const catalog = useProducts();
  const [stepIndex, setStepIndex] = useState(0);
  // Salqinlik va holat bosqichlarida originaldagidek «Farqi yo'q» oldindan tanlangan
  const [answers, setAnswers] = useState<Record<string, string[]>>({
    cooling: ["any"],
    scene: ["any"],
    features: [],
  });
  const [done, setDone] = useState(false);

  const step = STEPS[stepIndex];
  const selected = answers[step.id] ?? [];

  const stepTitle: Record<StepId, string> = {
    symptoms: t.search.stepSymptoms,
    primary: t.search.stepPrimary,
    cooling: t.search.stepCooling,
    scene: t.search.stepScene,
    features: t.search.stepFeatures,
  };

  const optionLabel = (stepId: StepId, optionId: string): string => {
    switch (stepId) {
      case "symptoms":
      case "primary":
        return t.search.symptoms[optionId as SymptomId];
      case "cooling":
        return t.search.coolingOpts[
          optionId as keyof typeof t.search.coolingOpts
        ];
      case "scene":
        return t.search.sceneOpts[optionId as keyof typeof t.search.sceneOpts];
      case "features":
        return t.search.featureOpts[
          optionId as keyof typeof t.search.featureOpts
        ];
    }
  };

  const toggle = (optionId: string) => {
    setAnswers((prev) => {
      const cur = prev[step.id] ?? [];
      const next = step.multi
        ? cur.includes(optionId)
          ? cur.filter((x) => x !== optionId)
          : [...cur, optionId]
        : [optionId];
      return { ...prev, [step.id]: next };
    });
  };

  const next = () => {
    if (stepIndex < STEPS.length - 1) setStepIndex(stepIndex + 1);
    else setDone(true);
  };

  const restart = () => {
    setAnswers({ cooling: ["any"], scene: ["any"], features: [] });
    setStepIndex(0);
    setDone(false);
  };

  if (done) {
    const { products: matched, exact } = searchProducts(catalog, {
      symptoms: (answers.symptoms ?? []) as SymptomId[],
      primary: (answers.primary?.[0] ?? "tired") as SymptomId,
      cooling: (answers.cooling?.[0] ?? "any") as
        | "any"
        | "none"
        | "mild"
        | "strong",
      scene: (answers.scene?.[0] ?? "any") as "any" | SceneId,
      features: (answers.features ?? []) as FeatureId[],
    });

    return (
      <>
        <main className="relative mx-auto flex w-full max-w-md flex-1 flex-col px-4 pb-32 pt-5">
          <div className="dot-pattern pointer-events-none absolute inset-0" />
          <BrandHeader />
          <header className="relative flex flex-col items-center gap-1.5 pt-4 text-center">
            <DropBottleIcon className="h-12 w-12 text-foreground" />
            <h1 className="text-xl font-extrabold">{t.search.title}</h1>
          </header>

          <p className="relative mt-5 text-center text-[17px] font-extrabold leading-relaxed">
            {matched.length === 0 ? (
              t.search.empty
            ) : exact ? (
              <>
                {t.search.exact1}{" "}
                <span className="text-[#3f8fdc]">{t.search.exactBlue}</span>
              </>
            ) : (
              <>
                {t.search.fallback1}{" "}
                <span className="text-[#3f8fdc]">{t.search.fallbackBlue}</span>
                {t.search.fallback2}
              </>
            )}
          </p>

          <section className="relative mt-5 space-y-4">
            {matched.map((p) => (
              <article
                key={p.id}
                className="rounded-3xl bg-surface p-5 shadow-sm"
              >
                <h2 className="text-center font-extrabold">{p.name}</h2>
                <div className="mt-3 flex items-stretch gap-3">
                  <ProductImages images={p.images ?? []} name={p.name} />
                  <div className="min-w-0 flex-1">
                    {p.features.includes("vitaminA") && (
                      <p className="rounded-xl bg-[#f29422] px-3 py-2 text-center text-xs font-extrabold leading-snug text-white">
                        {t.search.vitaminBadge}
                      </p>
                    )}
                    <p className="mt-2 text-sm font-bold leading-snug">
                      {p.short[lang]}
                    </p>
                  </div>
                </div>
                <p className="mt-3 text-[15px] leading-relaxed">
                  {p.description[lang]}
                </p>
                <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
                  <CoolingStars value={p.cooling} label={t.search.coolingLabel} />
                  {p.features.includes("preservativeFree") && (
                    <span className="rounded-full border border-foreground/25 px-3 py-1 text-xs font-bold text-foreground/70">
                      {t.search.preservativeFree}
                    </span>
                  )}
                </div>
                {/* Tugma faqat haqiqiy havola bo'lganda chiqadi — soxta «#» yo'q */}
                {p.url && p.url !== "#" && (
                  <a
                    href={p.url}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-4 flex w-full items-center justify-center gap-2 rounded-full bg-accent-dark py-3.5 text-center font-bold text-white transition hover:bg-accent-dark-hover"
                  >
                    {t.search.brandPage}
                    <svg viewBox="0 0 24 24" fill="none" className="h-4.5 w-4.5" aria-hidden>
                      <path
                        d="M9 5H5v14h14v-4M14 4h6v6M20 4 11 13"
                        stroke="currentColor"
                        strokeWidth="2.4"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </a>
                )}
              </article>
            ))}
          </section>

          <button
            onClick={restart}
            className="relative mt-6 w-full rounded-full border border-muted/60 py-3.5 font-bold text-muted transition hover:bg-black/5"
          >
            {t.search.again}
          </button>
        </main>
        <BottomNav />
      </>
    );
  }

  return (
    <>
      <main className="relative mx-auto flex w-full max-w-md flex-1 flex-col px-5 pb-32 pt-5">
        <div className="dot-pattern pointer-events-none absolute inset-0" />
        <BrandHeader />
        <header className="relative flex flex-col items-center gap-1.5 pt-4 text-center">
          <DropBottleIcon className="h-12 w-12 text-foreground" />
          <h1 className="text-xl font-extrabold">{t.search.title}</h1>
        </header>

        <div className="relative mt-6 flex items-start gap-2.5">
          <CheckSquare checked className="mt-0.5 h-7 w-7 shrink-0" />
          <p className="font-extrabold leading-snug">
            {stepTitle[step.id]}{" "}
            {step.multi && (
              <span className="font-bold text-[#3f8fdc]">
                {t.search.multiNote}
              </span>
            )}
          </p>
        </div>

        <div className="relative mt-4 space-y-3.5">
          {step.optionIds.map((id) => {
            const checked = selected.includes(id);
            return (
              <button
                key={id}
                onClick={() => toggle(id)}
                className={`flex w-full items-center gap-3 rounded-full px-4 py-4 text-left text-[15px] font-bold shadow-sm transition active:scale-[0.98] ${
                  checked ? "bg-[#dcd6f2]" : "bg-white"
                }`}
              >
                <CheckSquare checked={checked} className="h-6 w-6 shrink-0" />
                {optionLabel(step.id, id)}
              </button>
            );
          })}
        </div>

        <div className="relative mt-8 flex items-center gap-3">
          {stepIndex > 0 && (
            <button
              onClick={() => setStepIndex(stepIndex - 1)}
              className="shrink-0 rounded-full bg-[#ececf2] px-7 py-3.5 font-bold shadow-sm transition hover:bg-[#e2e2ea]"
            >
              {t.common.back}
            </button>
          )}
          <button
            onClick={next}
            disabled={!step.optional && selected.length === 0}
            className="flex-1 rounded-full bg-accent-dark py-4 font-bold text-white transition hover:bg-accent-dark-hover disabled:opacity-50"
          >
            {stepIndex < STEPS.length - 1 ? (
              <>
                {t.common.next}&ensp;{stepIndex + 1} / {STEPS.length}
              </>
            ) : (
              t.search.seeResults
            )}
          </button>
        </div>
      </main>
      <BottomNav />
    </>
  );
}
