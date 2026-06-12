"use client";

import { useState } from "react";
import { BottomNav } from "@/components/BottomNav";
import { DropBottleIcon } from "@/components/icons";
import { matchProducts, type SymptomId } from "@/config/site";

type Step = {
  id: string;
  title: string;
  note?: string;
  multi: boolean;
  options: Array<{ id: string; label: string }>;
};

/**
 * So'rovnoma bosqichlari. 1-bosqich original ilovaga mos;
 * 2–5 bosqichlar vaqtincha — original skrinshotlari kelganda almashtiriladi.
 */
const STEPS: Step[] = [
  {
    id: "symptoms",
    title: "Bezovta qilayotgan belgilarni tanlang",
    note: "(bir nechtasini tanlash mumkin)",
    multi: true,
    options: [
      { id: "tired", label: "Ko'z charchog'i" },
      { id: "dry", label: "Quruq ko'z (ko'z qurishi)" },
      { id: "blur", label: "Ko'z xiralashishi (yiring ko'p bo'lganda)" },
      { id: "itch", label: "Ko'z qichishishi" },
      { id: "red", label: "Ko'z qizarishi" },
      { id: "contact", label: "Linza taqqandagi noqulaylik" },
    ],
  },
  {
    id: "lens",
    title: "Kontakt linza taqasizmi?",
    multi: false,
    options: [
      { id: "yes", label: "Ha, muntazam" },
      { id: "sometimes", label: "Ba'zan" },
      { id: "no", label: "Yo'q" },
    ],
  },
  {
    id: "age",
    title: "Yoshingiz nechada?",
    multi: false,
    options: [
      { id: "young", label: "30 gacha" },
      { id: "mid", label: "30–44" },
      { id: "senior", label: "45 va undan katta" },
    ],
  },
  {
    id: "screen",
    title: "Kuniga ekran oldida qancha vaqt o'tkazasiz?",
    multi: false,
    options: [
      { id: "low", label: "3 soatgacha" },
      { id: "mid", label: "3–7 soat" },
      { id: "high", label: "7 soatdan ko'p" },
    ],
  },
  {
    id: "feel",
    title: "Tomchidan qanday his yoqadi?",
    multi: false,
    options: [
      { id: "cool", label: "Kuchli salqinlik" },
      { id: "mild", label: "Yengil salqinlik" },
      { id: "neutral", label: "Farqi yo'q / yumshoq" },
    ],
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

export default function SearchPage() {
  const [stepIndex, setStepIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string[]>>({});
  const [done, setDone] = useState(false);

  const step = STEPS[stepIndex];
  const selected = answers[step.id] ?? [];

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
    setAnswers({});
    setStepIndex(0);
    setDone(false);
  };

  if (done) {
    const symptoms = (answers.symptoms ?? []) as SymptomId[];
    const wearsLenses =
      answers.lens?.[0] === "yes" || answers.lens?.[0] === "sometimes";
    const matched = matchProducts(symptoms, wearsLenses);

    return (
      <>
        <main className="relative mx-auto flex w-full max-w-md flex-1 flex-col px-5 pb-32 pt-8">
          <div className="dot-pattern pointer-events-none absolute inset-0" />
          <header className="relative flex flex-col items-center gap-1.5 text-center">
            <DropBottleIcon className="h-12 w-12 text-foreground" />
            <h1 className="text-xl font-extrabold">
              Sizga mos ko'z tomchilari
            </h1>
            <p className="text-sm text-foreground/65">
              Javoblaringiz asosida quyidagi vositalarni tavsiya qilamiz.
            </p>
          </header>

          <section className="relative mt-5 space-y-4">
            {matched.map((p) => (
              <article key={p.id} className="rounded-3xl bg-surface p-5 shadow-sm">
                <div className="flex items-center gap-4">
                  <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-b from-[#e9ddf5] to-[#ddccf0]">
                    <DropBottleIcon className="h-10 w-10 text-foreground" />
                  </span>
                  <div className="min-w-0">
                    <h2 className="font-extrabold">{p.name}</h2>
                    <p className="text-sm font-bold text-foreground/60">
                      {p.short}
                    </p>
                  </div>
                </div>
                <p className="mt-3 text-[15px] leading-relaxed">
                  {p.description}
                </p>
                {p.url && (
                  <a
                    href={p.url}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-4 block w-full rounded-full bg-accent-dark py-3 text-center font-bold text-white transition hover:bg-accent-dark-hover"
                  >
                    Batafsil
                  </a>
                )}
              </article>
            ))}
          </section>

          <button
            onClick={restart}
            className="relative mt-6 w-full rounded-full border border-muted/60 py-3.5 font-bold text-muted transition hover:bg-black/5"
          >
            Qaytadan boshlash
          </button>
        </main>
        <BottomNav />
      </>
    );
  }

  return (
    <>
      <main className="relative mx-auto flex w-full max-w-md flex-1 flex-col px-5 pb-32 pt-8">
        <div className="dot-pattern pointer-events-none absolute inset-0" />

        <header className="relative flex flex-col items-center gap-1.5 text-center">
          <DropBottleIcon className="h-12 w-12 text-foreground" />
          <h1 className="text-xl font-extrabold">Ko'z tomchisi qidiruvi</h1>
        </header>

        <div className="relative mt-6 flex items-start gap-2.5">
          <CheckSquare checked className="mt-0.5 h-7 w-7 shrink-0" />
          <p className="font-extrabold leading-snug">
            {step.title}{" "}
            {step.note && (
              <span className="font-bold text-[#3f8fdc]">{step.note}</span>
            )}
          </p>
        </div>

        <div className="relative mt-4 space-y-3.5">
          {step.options.map((o) => {
            const checked = selected.includes(o.id);
            return (
              <button
                key={o.id}
                onClick={() => toggle(o.id)}
                className={`flex w-full items-center gap-3 rounded-full bg-white px-4 py-4 text-left text-[15px] font-bold shadow-sm transition active:scale-[0.98] ${
                  checked ? "ring-2 ring-[#7b6ce4]" : ""
                }`}
              >
                <CheckSquare checked={checked} className="h-6 w-6 shrink-0" />
                {o.label}
              </button>
            );
          })}
        </div>

        <button
          onClick={next}
          disabled={selected.length === 0}
          className="relative mt-8 w-full rounded-full bg-accent-dark py-4 font-bold text-white transition hover:bg-accent-dark-hover disabled:opacity-50"
        >
          {stepIndex < STEPS.length - 1 ? "Keyingisi" : "Natijani ko'rish"}
          &ensp;{stepIndex + 1} / {STEPS.length}
        </button>

        {stepIndex > 0 && (
          <button
            onClick={() => setStepIndex(stepIndex - 1)}
            className="relative mt-3 w-full rounded-full border border-muted/60 py-3 font-bold text-muted transition hover:bg-black/5"
          >
            Orqaga
          </button>
        )}
      </main>
      <BottomNav />
    </>
  );
}
