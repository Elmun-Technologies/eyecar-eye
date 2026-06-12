"use client";

import Link from "next/link";
import { useLang } from "@/lib/i18n";
import { EyeScanIcon } from "./icons";

/** Ichki sahifalar tepasidagi bir qatorli logotip */
export function BrandHeader() {
  const { t } = useLang();
  return (
    <Link href="/" className="relative block text-center">
      <span className="text-lg font-extrabold tracking-wide">
        {t.header.pre}{" "}
      </span>
      <span className="bracketed mx-1 text-lg font-extrabold">
        <EyeScanIcon className="mb-0.5 mr-0.5 inline h-4 w-4 align-middle" />
        {t.header.bracket}
      </span>
      {t.header.post && (
        <span className="text-lg font-extrabold">{t.header.post}</span>
      )}
    </Link>
  );
}
