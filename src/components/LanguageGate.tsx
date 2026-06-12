"use client";

import type { Lang } from "@/lib/i18n";
import { EyeScanIcon } from "./icons";
import { PoweredBy } from "./PoweredBy";

/**
 * Birinchi kirishda butun ekranni qoplaydigan til tanlash darvozasi.
 * Til tanlanmaguncha ilova ko'rinmaydi.
 */
export function LanguageGate({ onPick }: { onPick: (l: Lang) => void }) {
  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-background px-6">
      <div className="dot-pattern pointer-events-none absolute inset-0" />

      <div className="relative flex w-full max-w-md flex-1 flex-col items-center justify-center">
        <EyeScanIcon className="h-16 w-16 text-foreground" />
        <p className="mt-3 text-3xl font-extrabold tracking-wide">Smile</p>

        <h1 className="mt-8 text-center text-lg font-extrabold leading-relaxed">
          Tilni tanlang
          <br />
          Выберите язык
        </h1>

        <div className="mt-6 w-full space-y-3.5">
          <button
            onClick={() => onPick("uz")}
            className="w-full rounded-full bg-accent-dark py-4 text-center text-lg font-bold text-white transition hover:bg-accent-dark-hover active:scale-[0.98]"
          >
            O&rsquo;zbekcha
          </button>
          <button
            onClick={() => onPick("ru")}
            className="w-full rounded-full bg-accent-dark py-4 text-center text-lg font-bold text-white transition hover:bg-accent-dark-hover active:scale-[0.98]"
          >
            Русский
          </button>
        </div>
      </div>

      <div className="relative pb-8">
        <PoweredBy />
      </div>
    </div>
  );
}
