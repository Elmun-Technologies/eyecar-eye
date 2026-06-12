"use client";

import Link from "next/link";
import { PoweredBy } from "@/components/PoweredBy";
import { useLang } from "@/lib/i18n";

export default function TermsPage() {
  const { t } = useLang();
  return (
    <main className="relative mx-auto flex w-full max-w-md flex-1 flex-col px-5 pb-10 pt-8">
      <div className="dot-pattern pointer-events-none absolute inset-0" />

      <h1 className="relative text-xl font-extrabold">{t.terms.title}</h1>

      <section className="relative mt-5 space-y-5 rounded-3xl bg-surface p-6 shadow-sm">
        {t.terms.sections.map((s) => (
          <div key={s.title}>
            <h2 className="font-extrabold">{s.title}</h2>
            <p className="mt-1.5 text-[15px] leading-relaxed text-foreground/85">
              {s.body}
            </p>
          </div>
        ))}
      </section>

      <Link
        href="/"
        className="relative mt-8 block w-full rounded-full border border-muted/60 py-3.5 text-center font-bold text-muted transition hover:bg-black/5"
      >
        {t.terms.backHome}
      </Link>
      <PoweredBy className="relative mt-5" />
    </main>
  );
}
