"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
/* eslint-disable @next/next/no-img-element -- dataURL kesmalar uchun next/image shart emas */
import { EyeScanIcon } from "@/components/icons";
import { BrandHeader } from "@/components/BrandHeader";
import { BottomNav } from "@/components/BottomNav";
import { EyeLayerDiagram } from "@/components/EyeLayerDiagram";
import { RESULT_STORAGE_KEY, type AnalysisResult } from "@/lib/analysis";

const STAR_VERDICT: Record<number, string> = {
  5: "Ajoyib! Ko'zingiz holati juda yaxshi.",
  4: "Yaxshi holat — dam olishni unutmang.",
  3: "Ko'zingizni ortiqcha zo'riqtirayotgan bo'lishingiz mumkin.",
  2: "Ko'z charchog'i sezilarli — parvarish talab etiladi.",
  1: "Ko'zingiz holatiga jiddiy e'tibor bering.",
};

function ScoreBar({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
}) {
  const low = value < 50;
  return (
    <div>
      <div className="flex items-center justify-between">
        <span className="flex items-center gap-1.5 font-extrabold">
          {icon}
          {label}
        </span>
        <span
          className="text-sm font-extrabold"
          style={{ color: low ? "#c0392b" : "#1f6fb5" }}
        >
          {low ? "O'rtachadan pastroq" : "O'rtachadan yuqoriroq"}
        </span>
      </div>
      <div className="mt-2 h-4 overflow-hidden rounded-full bg-white shadow-inner">
        <div
          className="h-full rounded-full transition-[width] duration-1000"
          style={{
            width: `${Math.max(value, 6)}%`,
            background: low
              ? "linear-gradient(90deg,#e2574a,#c0392b)"
              : "linear-gradient(90deg,#1f6fb5,#27d3c4)",
            boxShadow: low
              ? "0 0 10px rgba(192,57,43,.5)"
              : "0 0 10px rgba(39,211,196,.6)",
          }}
        />
      </div>
    </div>
  );
}

function Stars({ filled }: { filled: number }) {
  return (
    <div className="flex items-center justify-center gap-1.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <svg key={i} viewBox="0 0 36 36" className="h-11 w-11" aria-hidden>
          <path
            d="M18 3.5 22.4 12.6l10 1.4-7.2 7 1.7 9.9L18 26.2 9.1 30.9l1.7-9.9-7.2-7 10-1.4L18 3.5Z"
            fill={i <= filled ? "#f4c81d" : "#ffffff"}
            stroke={i <= filled ? "#e0a90c" : "#c9c9d6"}
            strokeWidth={i <= filled ? 1.5 : 1.8}
            strokeDasharray={i <= filled ? undefined : "3 3"}
            strokeLinejoin="round"
          />
        </svg>
      ))}
    </div>
  );
}

function HeartIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
      <path
        d="M12 20.5C7 16.5 3.5 13.3 3.5 9.6 3.5 7 5.5 5 8 5c1.6 0 3.1.8 4 2.1C12.9 5.8 14.4 5 16 5c2.5 0 4.5 2 4.5 4.6 0 3.7-3.5 6.9-8.5 10.9Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function TearDropIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
      <path
        d="M12 3.5c3.5 4.5 6.5 8 6.5 11.5a6.5 6.5 0 0 1-13 0C5.5 11.5 8.5 8 12 3.5Z"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function ResultPage() {
  const router = useRouter();
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [missing, setMissing] = useState(false);

  useEffect(() => {
    // sessionStorage faqat klientda bor — hydration mosligini buzmaslik
    // uchun mount'dan keyin o'qiladi
    /* eslint-disable react-hooks/set-state-in-effect */
    const raw = sessionStorage.getItem(RESULT_STORAGE_KEY);
    if (!raw) {
      setMissing(true);
      return;
    }
    try {
      setResult(JSON.parse(raw) as AnalysisResult);
    } catch {
      setMissing(true);
    }
    /* eslint-enable react-hooks/set-state-in-effect */
  }, []);

  useEffect(() => {
    if (missing) router.replace("/");
  }, [missing, router]);

  if (!result) return null;

  // Shox parda skori — qizarishning teskarisi; namlik skori — ochiqlikdan
  const corneaScore = 100 - result.redness;
  const tearScore = result.openness;
  const stars = Math.min(5, Math.max(1, Math.round(result.score / 20)));

  return (
    <>
      <main className="relative mx-auto flex w-full max-w-md flex-1 flex-col px-4 pb-32 pt-5">
        <div className="dot-pattern pointer-events-none absolute inset-0" />

        <BrandHeader />

        {/* Asosiy natija kartasi */}
        <section className="relative mt-4 rounded-3xl bg-surface p-5 shadow-sm">
          <h1 className="text-center text-lg font-extrabold">
            Ko'zni AI tekshiruvi natijasi
          </h1>

          <div className="mt-5 space-y-5">
            <ScoreBar
              icon={<EyeScanIcon className="h-5 w-5 text-[#1d9db8]" />}
              label="Shox parda skori"
              value={corneaScore}
            />
            <ScoreBar
              icon={<TearDropIcon className="h-5 w-5 text-[#1f6fb5]" />}
              label="Namlik skori"
              value={tearScore}
            />
          </div>

          <EyeLayerDiagram className="mx-auto mt-6 w-full max-w-[320px]" />

          {/* Umumiy baho */}
          <div className="mt-6 rounded-2xl bg-white p-5">
            <h2 className="text-center text-lg font-extrabold">
              Ko'zning umumiy bahosi
            </h2>
            <div className="mt-3">
              <Stars filled={stars} />
            </div>
            <p className="mt-3 text-center text-[15px] leading-relaxed">
              <span className="font-extrabold">«{stars} yulduz»</span>{" "}
              {STAR_VERDICT[stars]}
            </p>
            <p className="mt-3 text-xs leading-relaxed text-foreground/65">
              ※ Umumiy baho shox parda va namlik skorlarini o'z ichiga olgan,
              ko'z bilan bog'liq 4 ta ko'rsatkichdan jamlab hisoblanadi.
            </p>
          </div>

          {/* Ko'z kesmalari */}
          <div className="mt-4 grid grid-cols-2 gap-3">
            {(
              [
                ["O'ng ko'z", result.right],
                ["Chap ko'z", result.left],
              ] as const
            ).map(([label, eye]) => (
              <figure key={label} className="rounded-2xl bg-white p-2.5">
                <img
                  src={eye.crop}
                  alt={label}
                  className="aspect-[4/3] w-full rounded-xl object-cover"
                />
                <figcaption className="mt-1.5 text-center text-xs font-bold text-foreground/70">
                  {label}
                </figcaption>
              </figure>
            ))}
          </div>

          <Link
            href="/info"
            className="mt-6 block w-full rounded-full bg-accent-dark py-4 text-center font-bold text-white transition hover:bg-accent-dark-hover"
          >
            Keyingisi
          </Link>

          {/* Pastga aylantirish ishorasi */}
          <div
            className="animate-bob mt-3 flex flex-col items-center text-[#f06ba8]"
            aria-hidden
          >
            <span className="text-lg font-extrabold lowercase tracking-widest [text-shadow:0_0_6px_#fff,0_0_12px_#ffd1e6]">
              scroll
            </span>
            <HeartIcon className="-mt-0.5 h-5 w-5" />
          </div>
        </section>

        {/* Ogohlantirish */}
        <p className="relative mt-4 rounded-2xl bg-white/70 p-4 text-xs leading-relaxed text-foreground/70">
          Ushbu xizmat{" "}
          <span className="font-bold text-brand-red">
            tibbiy qurilma hisoblanmaydi
          </span>{" "}
          va natijalar tashxis o'rnini bosmaydi. Belgilar uzoq davom etsa,
          tibbiyot muassasasiga murojaat qiling.
        </p>
      </main>
      <BottomNav />
    </>
  );
}
