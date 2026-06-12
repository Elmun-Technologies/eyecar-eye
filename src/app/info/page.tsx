"use client";

import Link from "next/link";
import { BrandHeader } from "@/components/BrandHeader";
import { BottomNav } from "@/components/BottomNav";
import { useLang } from "@/lib/i18n";

function CheckBadge({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 28 28" fill="none" className={className} aria-hidden>
      <path
        d="M14 1.5l3 2.3 3.7-.7 1.5 3.5 3.5 1.5-.7 3.7 2.5 3.2-2.5 2.8.7 3.7-3.5 1.5-1.5 3.5-3.7-.7-3 2.7-3-2.7-3.7.7-1.5-3.5-3.5-1.5.7-3.7L.5 14 3 11.8l-.7-3.7 3.5-1.5 1.5-3.5 3.7.7 3-2.3Z"
        fill="url(#cbg)"
      />
      <path
        d="M9 14.2l3.4 3.4 6.6-7"
        stroke="#fff"
        strokeWidth="2.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <defs>
        <linearGradient id="cbg" x1="0" y1="0" x2="28" y2="28">
          <stop stopColor="#7b6ce4" />
          <stop offset="1" stopColor="#3f8fdc" />
        </linearGradient>
      </defs>
    </svg>
  );
}

/** Oddiy holatdagi ko'z — stilizatsiya qilingan illyustratsiya */
function NormalEye({ className, label }: { className?: string; label: string }) {
  return (
    <svg viewBox="0 0 280 160" className={className} aria-hidden>
      <rect width="280" height="160" rx="12" fill="#caa37e" />
      <ellipse cx="140" cy="80" rx="95" ry="78" fill="#8a5a35" />
      <circle cx="140" cy="80" r="62" fill="#5d3a1f" />
      {/* iris tolalari */}
      {Array.from({ length: 24 }).map((_, i) => {
        const a = (i / 24) * Math.PI * 2;
        return (
          <line
            key={i}
            x1={140 + Math.cos(a) * 34}
            y1={80 + Math.sin(a) * 34}
            x2={140 + Math.cos(a) * 58}
            y2={80 + Math.sin(a) * 58}
            stroke="#7a4c28"
            strokeWidth="3"
            strokeLinecap="round"
          />
        );
      })}
      <circle cx="140" cy="80" r="30" fill="#160d06" />
      <ellipse cx="122" cy="58" rx="12" ry="8" fill="#fff" opacity="0.9" />
      <rect x="0" y="132" width="280" height="28" rx="12" fill="#00000055" />
      <text
        x="140"
        y="150"
        textAnchor="middle"
        fontSize="13"
        fontWeight="700"
        fill="#fff"
      >
        {label}
      </text>
    </svg>
  );
}

/** Maxsus usulda ko'rsatilgan shikastlanish — stilizatsiya */
function DamagedEye({
  className,
  line1,
  line2,
  arrowWord,
}: {
  className?: string;
  line1: string;
  line2: string;
  arrowWord: string;
}) {
  return (
    <svg viewBox="0 0 280 160" className={className} aria-hidden>
      <rect width="280" height="160" rx="12" fill="#1450b8" />
      <ellipse cx="140" cy="80" rx="100" ry="78" fill="#2069d8" />
      <circle cx="140" cy="80" r="62" fill="#1c4fae" />
      <circle cx="140" cy="80" r="28" fill="#0d2a66" />
      {/* shikast dog'lari */}
      {(
        [
          [168, 102, 4], [180, 96, 3], [174, 112, 3.5], [190, 108, 2.5],
          [160, 116, 3], [150, 108, 2.5], [186, 92, 2], [196, 100, 2.5],
          [120, 60, 2], [108, 92, 2.5], [150, 50, 2],
        ] as const
      ).map(([x, y, r], i) => (
        <circle key={i} cx={x} cy={y} r={r} fill="#9fe8e0" opacity="0.85" />
      ))}
      <ellipse
        cx="172"
        cy="104"
        rx="26"
        ry="14"
        fill="none"
        stroke="#fff"
        strokeWidth="2.5"
        transform="rotate(-15 172 104)"
      />
      <ellipse
        cx="190"
        cy="100"
        rx="18"
        ry="11"
        fill="none"
        stroke="#fff"
        strokeWidth="2.5"
        transform="rotate(-15 190 100)"
      />
      <path
        d="M226 64l-24 26M238 78l-30 18"
        stroke="#fff"
        strokeWidth="2.5"
        markerEnd="url(#arr)"
      />
      <defs>
        <marker id="arr" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto">
          <path d="M0 0l10 5-10 5z" fill="#fff" />
        </marker>
      </defs>
      <text x="226" y="56" fontSize="12" fontWeight="700" fill="#fff" textAnchor="middle">
        {arrowWord}
      </text>
      <rect x="0" y="0" width="190" height="44" rx="12" fill="#00000055" />
      <text x="12" y="19" fontSize="12" fontWeight="700" fill="#fff">
        {line1}
      </text>
      <text x="12" y="36" fontSize="12" fontWeight="700" fill="#fff">
        {line2}
      </text>
    </svg>
  );
}

/** Hujayrali to'qima fonidagi yoriq — tiklanish sustligi haqida */
function CorneaCrack({
  className,
  cap1,
  cap2,
}: {
  className?: string;
  cap1: string;
  cap2: string;
}) {
  return (
    <svg viewBox="0 0 280 150" className={className} aria-hidden>
      <defs>
        <pattern id="cells1" width="14" height="12" patternUnits="userSpaceOnUse">
          <rect width="14" height="12" fill="#f3d9b8" />
          <circle cx="3.5" cy="3" r="1.5" fill="#e09a64" opacity="0.5" />
          <circle cx="10.5" cy="9" r="1.5" fill="#e09a64" opacity="0.5" />
        </pattern>
      </defs>
      <rect width="280" height="150" rx="12" fill="url(#cells1)" />
      <path
        d="M30 62c30-14 70-20 110-14s75 16 112 12c-20 12-58 16-104 12S58 70 30 62Z"
        fill="#4a1d0a"
        opacity="0.92"
      />
      <path
        d="M42 64c28-10 66-15 100-10s68 12 100 10"
        stroke="#2b0f04"
        strokeWidth="5"
        strokeLinecap="round"
        fill="none"
        opacity="0.7"
      />
      <rect x="10" y="108" width="248" height="34" rx="10" fill="#ffffffd9" />
      <text x="18" y="122" fontSize="11" fontWeight="700" fill="#4a3522">
        {cap1}
      </text>
      <text x="18" y="136" fontSize="11" fontWeight="700" fill="#4a3522">
        {cap2}
      </text>
    </svg>
  );
}

/** Shikast fonida kuchayadigan belgilar so'zlari */
function SymptomWords({
  className,
  words,
}: {
  className?: string;
  words: [string, string, string, string];
}) {
  return (
    <svg viewBox="0 0 280 150" className={className} aria-hidden>
      <defs>
        <pattern id="cells2" width="14" height="12" patternUnits="userSpaceOnUse">
          <rect width="14" height="12" fill="#f3d9b8" />
          <circle cx="3.5" cy="3" r="1.5" fill="#e09a64" opacity="0.5" />
          <circle cx="10.5" cy="9" r="1.5" fill="#e09a64" opacity="0.5" />
        </pattern>
      </defs>
      <rect width="280" height="150" rx="12" fill="url(#cells2)" />
      <path
        d="M120 44c34-8 76-6 118 4"
        stroke="#5a2410"
        strokeWidth="6"
        strokeLinecap="round"
        opacity="0.8"
      />
      <path
        d="M14 120c30-10 60-12 96-8"
        stroke="#5a2410"
        strokeWidth="5"
        strokeLinecap="round"
        opacity="0.7"
      />
      <text x="22" y="48" fontSize="22" fontWeight="800" fill="#6e4a2a">
        {words[0]}
      </text>
      <text x="160" y="86" fontSize="21" fontWeight="800" fill="#8f7bc7">
        {words[1]}
      </text>
      <text x="22" y="92" fontSize="21" fontWeight="800" fill="#b0556b">
        {words[2]}
      </text>
      <text x="120" y="132" fontSize="21" fontWeight="800" fill="#7a68bd">
        {words[3]}
      </text>
    </svg>
  );
}

/** A vitamini tomchisi shikastlangan yuzaga tushmoqda */
function VitaminDrop({
  className,
  dropLine,
  note,
}: {
  className?: string;
  dropLine: string;
  note: string;
}) {
  return (
    <svg viewBox="0 0 280 160" className={className} aria-hidden>
      <defs>
        <pattern id="cells3" width="14" height="12" patternUnits="userSpaceOnUse">
          <rect width="14" height="12" fill="#f3d9b8" />
          <circle cx="3.5" cy="3" r="1.5" fill="#e09a64" opacity="0.5" />
          <circle cx="10.5" cy="9" r="1.5" fill="#e09a64" opacity="0.5" />
        </pattern>
        <radialGradient id="dropGold" cx="0.4" cy="0.3" r="0.9">
          <stop offset="0%" stopColor="#fff3c4" />
          <stop offset="55%" stopColor="#f7cf66" />
          <stop offset="100%" stopColor="#eba93a" />
        </radialGradient>
      </defs>
      <rect width="280" height="160" rx="12" fill="url(#cells3)" />
      <path
        d="M24 60c26-10 54-13 84-9M196 52c24-4 44-2 62 4"
        stroke="#5a2410"
        strokeWidth="5"
        strokeLinecap="round"
        opacity="0.75"
      />
      <path
        d="M140 26c26 34 40 54 40 74a40 40 0 0 1-80 0c0-20 14-40 40-74Z"
        fill="url(#dropGold)"
        stroke="#d9962e"
        strokeWidth="2"
      />
      <ellipse cx="126" cy="86" rx="9" ry="14" fill="#fff" opacity="0.55" />
      <text
        x="140"
        y="92"
        textAnchor="middle"
        fontSize="15"
        fontWeight="800"
        fill="#a33a52"
      >
        A
      </text>
      <text
        x="140"
        y="112"
        textAnchor="middle"
        fontSize="11"
        fontWeight="700"
        fill="#a33a52"
      >
        {dropLine}
      </text>
      <text x="12" y="20" fontSize="10" fontWeight="700" fill="#6b5a44">
        {note}
      </text>
    </svg>
  );
}

/** Gialuron kislota ishlab chiqarilishi — hujayralar qatori */
function HyaluronCells({
  className,
  line1,
  line2,
  legend,
  note,
}: {
  className?: string;
  line1: string;
  line2: string;
  legend: string;
  note: string;
}) {
  const cells = [
    [34, 118], [86, 124], [140, 120], [194, 126], [246, 118],
  ] as const;
  const dots = [
    [22, 88], [58, 96], [104, 86], [150, 94], [200, 88], [242, 96],
    [70, 132], [120, 140], [176, 136], [226, 142],
  ] as const;
  const drops = [70, 140, 210] as const;
  return (
    <svg viewBox="0 0 280 170" className={className} aria-hidden>
      <defs>
        <radialGradient id="dropGold2" cx="0.4" cy="0.3" r="0.9">
          <stop offset="0%" stopColor="#fff3c4" />
          <stop offset="55%" stopColor="#f7cf66" />
          <stop offset="100%" stopColor="#eba93a" />
        </radialGradient>
      </defs>
      <rect width="280" height="170" rx="12" fill="#fdeee4" />
      <text
        x="140"
        y="30"
        textAnchor="middle"
        fontSize="12.5"
        fontWeight="800"
        fill="#1f4f8f"
      >
        {line1}
      </text>
      <text
        x="140"
        y="46"
        textAnchor="middle"
        fontSize="12.5"
        fontWeight="800"
        fill="#1f4f8f"
      >
        {line2}
      </text>
      {cells.map(([x, y], i) => (
        <g key={i}>
          <ellipse cx={x} cy={y} rx="27" ry="20" fill="#f3c4ad" stroke="#dd9d82" strokeWidth="1.5" />
          <ellipse cx={x} cy={y + 3} rx="9" ry="7" fill="#d98a8a" />
        </g>
      ))}
      {dots.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="4" fill="#3f8fdc" opacity="0.9" />
      ))}
      {drops.map((x, i) => (
        <g key={i}>
          <path
            d={`M${x} 62c11 14 17 23 17 32a17 17 0 0 1-34 0c0-9 6-18 17-32Z`}
            fill="url(#dropGold2)"
            stroke="#d9962e"
            strokeWidth="1.5"
          />
          <text x={x} y={100} textAnchor="middle" fontSize="11" fontWeight="800" fill="#a33a52">
            A
          </text>
        </g>
      ))}
      <text x="12" y="162" fontSize="10" fontWeight="700" fill="#6b5a44">
        {note}
      </text>
      <circle cx="152" cy="159" r="4" fill="#3f8fdc" />
      <text x="160" y="163" fontSize="10" fontWeight="700" fill="#1f4f8f">
        {legend}
      </text>
    </svg>
  );
}

export default function InfoPage() {
  const { t } = useLang();
  return (
    <>
      <main className="relative mx-auto flex w-full max-w-md flex-1 flex-col px-4 pb-32 pt-5">
        <div className="dot-pattern pointer-events-none absolute inset-0" />

        <BrandHeader />

        <section className="relative mt-4 rounded-3xl bg-surface p-5 shadow-sm">
          <h1 className="text-center text-[22px] font-extrabold leading-snug">
            {t.info.h1pre} <span className="text-brand-red">{t.info.h1red}</span>{" "}
            {t.info.h1post}
          </h1>

          {/* Belgilar ro'yxati */}
          <div className="mt-5 rounded-2xl bg-white p-5">
            <h2 className="text-center font-extrabold leading-relaxed">
              {t.info.checklistT1}
              <sup>※</sup>
              {t.info.checklistT2 && <> {t.info.checklistT2}</>}
            </h2>
            <p className="mt-1 text-right text-[11px] text-foreground/60">
              {t.info.rubNote}
            </p>
            <ul className="mt-4 space-y-3.5">
              {t.info.symptoms.map((s) => (
                <li
                  key={s}
                  className="flex items-start gap-2.5 border-b border-dashed border-foreground/20 pb-3.5 text-[15px] font-bold leading-snug last:border-b-0 last:pb-0"
                >
                  <CheckBadge className="mt-0.5 h-6 w-6 shrink-0" />
                  {s}
                </li>
              ))}
            </ul>
          </div>

          {/* Shox parda shikastlanishi nima? */}
          <div className="mt-5 rounded-2xl bg-white p-5">
            <h2 className="text-center text-lg font-extrabold">
              <span className="text-brand-red">{t.info.damageTitleRed}</span>
              <sup>※</sup> {t.info.damageTitlePost}
            </h2>
            <p className="mt-1 text-right text-[11px] text-foreground/60">
              {t.info.rubNote}
            </p>
            <p className="mt-3 text-[15px] leading-relaxed">
              <span className="font-bold text-brand-red">
                {t.info.damageTextRed}
              </span>{" "}
              {t.info.damageTextPost}
            </p>
            <NormalEye className="mt-4 w-full rounded-xl" label={t.info.normalEye} />
            <DamagedEye
              className="mt-3 w-full rounded-xl"
              line1={t.info.damagedEyeL1}
              line2={t.info.damagedEyeL2}
              arrowWord={t.info.damagedArrow}
            />
            <p className="mt-4 text-[15px] leading-relaxed">{t.info.aging}</p>
            <CorneaCrack
              className="mt-4 w-full rounded-xl"
              cap1={t.info.crackCap1}
              cap2={t.info.crackCap2}
            />
            <p className="mt-4 text-[15px] leading-relaxed">{t.info.worsen}</p>
            <SymptomWords
              className="mt-3 w-full rounded-xl"
              words={[
                t.info.wordTired,
                t.info.wordBlur,
                t.info.wordRed,
                t.info.wordItch,
              ]}
            />
          </div>

          {/* A vitamini bo'limi */}
          <div className="mt-5 rounded-2xl bg-white p-5">
            <h2 className="text-center text-lg font-extrabold leading-snug">
              {t.info.vt1}
              <sup>※</sup> {t.info.vt2}{" "}
              <span className="text-[#e8930c]">{t.info.vtOrange}</span>
              {t.info.vt3 && <> {t.info.vt3}</>}
            </h2>
            <p className="mt-1 text-right text-[11px] text-foreground/60">
              {t.info.rubNote}
            </p>
            <p className="mt-3 text-[15px] leading-relaxed">
              <span className="font-bold text-[#e8930c]">
                {t.info.vitaminOrange}
              </span>{" "}
              {t.info.vitaminRest}
            </p>
            <VitaminDrop
              className="mt-4 w-full rounded-xl"
              dropLine={t.info.dropLine}
              note={t.info.imgNote}
            />
            <div
              className="mx-auto mt-3 h-0 w-0 border-x-[16px] border-t-[14px] border-x-transparent border-t-foreground/50"
              aria-hidden
            />
            <HyaluronCells
              className="mt-3 w-full rounded-xl"
              line1={t.info.hyaluronL1}
              line2={t.info.hyaluronL2}
              legend={t.info.legend}
              note={t.info.imgNote}
            />
          </div>

          {/* Pastki tugmalar */}
          <div className="mt-6 flex items-center gap-3">
            <Link
              href="/result"
              className="flex shrink-0 flex-col items-center justify-center rounded-full bg-white px-5 py-2.5 text-[13px] font-bold leading-tight shadow-sm transition hover:bg-white/70"
            >
              <span>{t.info.backL1}</span>
              <span>{t.info.backL2}</span>
            </Link>
            <Link
              href="/products"
              className="flex-1 rounded-full bg-accent-dark py-4 text-center font-bold text-white transition hover:bg-accent-dark-hover"
            >
              {t.common.next}
            </Link>
          </div>
        </section>
      </main>
      <BottomNav />
    </>
  );
}
