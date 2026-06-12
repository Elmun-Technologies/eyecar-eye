"use client";

import Link from "next/link";
import { useLang, type Lang } from "@/lib/i18n";
import { CheckFlow } from "@/components/CheckFlow";
import { DoctorIllustration } from "@/components/DoctorIllustration";
import { PoweredBy } from "@/components/PoweredBy";
import { EyeScanIcon, DropBottleIcon } from "@/components/icons";

function LangSwitch() {
  const { lang, setLang } = useLang();
  const items: Array<{ id: Lang; label: string }> = [
    { id: "uz", label: "UZ" },
    { id: "ru", label: "RU" },
  ];
  return (
    <div className="absolute right-0 top-0 z-10 flex overflow-hidden rounded-full bg-white/80 shadow-sm">
      {items.map((it) => (
        <button
          key={it.id}
          onClick={() => setLang(it.id)}
          className={`px-3 py-1.5 text-xs font-extrabold transition ${
            lang === it.id
              ? "bg-accent-dark text-white"
              : "text-foreground/60 hover:text-foreground"
          }`}
        >
          {it.label}
        </button>
      ))}
    </div>
  );
}

export default function Home() {
  const { t } = useLang();
  return (
    <main className="relative mx-auto flex w-full max-w-md flex-1 flex-col px-6 pb-10 pt-12">
      <div className="dot-pattern pointer-events-none absolute inset-0" />

      {/* Sarlavha */}
      <header className="relative text-center">
        <LangSwitch />
        <p className="text-3xl font-extrabold tracking-wide">Smile</p>
        <h1 className="mt-2 text-[34px] font-extrabold leading-tight">
          {t.home.titlePre && <>{t.home.titlePre} </>}
          <span className="bracketed">
            <EyeScanIcon className="mb-1 mr-1 inline h-7 w-7 align-middle text-foreground" />
            {t.home.titleBracket}
          </span>
          {t.home.titlePost && <> {t.home.titlePost}</>}
        </h1>
        <p className="mt-4 text-[15px] font-bold">{t.home.tagline}</p>
      </header>

      {/* Shifokor va gap pufagi */}
      <section className="relative mt-6 flex flex-1 items-start justify-center">
        <div className="relative mt-10 mr-2 max-w-[200px] rounded-2xl bg-white p-4 shadow-sm">
          <p className="text-[15px] font-bold leading-relaxed">
            {t.home.bubblePre && <>{t.home.bubblePre} </>}
            <span className="mr-1 inline-block align-middle">
              <EyeScanIcon className="h-6 w-6" />
            </span>
            {t.home.bubblePost}
          </p>
          <span className="absolute right-[-9px] top-12 h-4 w-4 rotate-45 bg-white" />
        </div>
        <DoctorIllustration className="w-40 shrink-0" />
      </section>

      {/* Asosiy tugmalar */}
      <section className="relative mt-8 grid grid-cols-2 gap-5">
        <CheckFlow />
        <Link
          href="/products"
          className="flex aspect-square flex-col items-center justify-center gap-3 rounded-[32px] bg-gradient-to-b from-[#d9e4f4] to-[#bed4ee] p-4 shadow-lg transition active:scale-[0.97]"
        >
          <DropBottleIcon className="h-16 w-16 text-foreground" />
          <span className="text-[15px] font-extrabold">
            {t.home.cardProducts}
          </span>
        </Link>
      </section>

      {/* Pastki havola */}
      <footer className="relative mt-10 text-center">
        <Link
          href="/terms"
          className="font-bold underline underline-offset-4"
        >
          {t.home.terms} &gt;
        </Link>
        <PoweredBy className="mt-5" />
      </footer>
    </main>
  );
}
