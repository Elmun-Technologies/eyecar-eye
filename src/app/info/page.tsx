import Link from "next/link";
import { BrandHeader } from "@/components/BrandHeader";
import { BottomNav } from "@/components/BottomNav";
import { DropBottleIcon } from "@/components/icons";
import { site } from "@/config/site";

export const metadata = {
  title: `Shox parda haqida — ${site.brand}`,
};

const SYMPTOMS = [
  "Kuniga 5 soatdan ko'proq TV, smartfon yoki kompyuter ekraniga qaraysiz",
  "Kun davomida ko'zga qum tushgandek g'ijirlab turadi",
  "Ko'zni 10 soniyadan ortiq ochiq tutib turolmaysiz",
  "Ko'z vaqti-vaqti bilan og'rib turadi",
  "Ko'z doim qurib, xira va charchagan his etiladi",
];

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
function NormalEye({ className }: { className?: string }) {
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
        Oddiy holatdagi ko'z
      </text>
    </svg>
  );
}

/** Maxsus usulda ko'rsatilgan shikastlanish — stilizatsiya */
function DamagedEye({ className }: { className?: string }) {
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
      <text x="232" y="56" fontSize="13" fontWeight="700" fill="#fff" textAnchor="middle">
        shikast
      </text>
      <rect x="0" y="0" width="170" height="44" rx="12" fill="#00000055" />
      <text x="12" y="19" fontSize="12.5" fontWeight="700" fill="#fff">
        Maxsus usul bilan shox parda
      </text>
      <text x="12" y="36" fontSize="12.5" fontWeight="700" fill="#fff">
        shikasti ko'rsatilgan
      </text>
    </svg>
  );
}

export default function InfoPage() {
  return (
    <>
      <main className="relative mx-auto flex w-full max-w-md flex-1 flex-col px-4 pb-32 pt-5">
        <div className="dot-pattern pointer-events-none absolute inset-0" />

        <BrandHeader />

        <section className="relative mt-4 rounded-3xl bg-surface p-5 shadow-sm">
          <h1 className="text-center text-[22px] font-extrabold leading-snug">
            Sizning{" "}
            <span className="text-brand-red">«shox pardangiz»</span> joyidami?
          </h1>

          {/* Belgilar ro'yxati */}
          <div className="mt-5 rounded-2xl bg-white p-5">
            <h2 className="text-center font-extrabold leading-relaxed">
              Ko'zdagi turli noqulay sezgilarga aslida shox parda
              shikastlanishi<sup>※</sup> sabab bo'layotgan bo'lishi mumkin
            </h2>
            <p className="mt-1 text-right text-[11px] text-foreground/60">
              ※ yengil ishqalanish natijasida
            </p>
            <ul className="mt-4 space-y-3.5">
              {SYMPTOMS.map((s) => (
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
              <span className="text-brand-red">
                Shox parda shikastlanishi
              </span>
              <sup>※</sup> nima?
            </h2>
            <p className="mt-1 text-right text-[11px] text-foreground/60">
              ※ yengil ishqalanish natijasida
            </p>
            <p className="mt-3 text-[15px] leading-relaxed">
              <span className="font-bold text-brand-red">
                Shox parda shikastlanishi
              </span>{" "}
              — ko'z yuzasi zararlangan, ammo tashqaridan qaraganda bilinmaydigan
              holat.
            </p>
            <NormalEye className="mt-4 w-full rounded-xl" />
            <DamagedEye className="mt-3 w-full rounded-xl" />
            <p className="mt-4 text-[15px] leading-relaxed">
              Yosh o'tishi, kompyuter, smartfon va linzalardan uzoq vaqt
              foydalanish kabi omillar ta'sirida zamonaviy insonlarda shox parda
              shikastlanishi tez-tez uchraydi. Tiklanish quvvati pasaysa, ko'z
              o'z holiga qaytishi qiyinlashadi.
            </p>
          </div>

          {/* Mahsulot CTA */}
          <div className="mt-5 rounded-2xl bg-gradient-to-b from-[#d9e4f4] to-[#c5d8ef] p-5">
            <div className="flex items-center gap-3">
              <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-white/85">
                <DropBottleIcon className="h-9 w-9 text-foreground" />
              </span>
              <h2 className="font-extrabold leading-snug">
                Sinovdan o'tgan davo vositalarimiz shox parda tiklanishini
                qo'llab-quvvatlaydi
              </h2>
            </div>
            <Link
              href="/products"
              className="mt-4 block w-full rounded-full bg-accent-dark py-3.5 text-center font-bold text-white transition hover:bg-accent-dark-hover"
            >
              Davo vositalarini ko'rish
            </Link>
          </div>
        </section>
      </main>
      <BottomNav />
    </>
  );
}
