"use client";

import Link from "next/link";
import { BrandHeader } from "@/components/BrandHeader";
import { BottomNav } from "@/components/BottomNav";
import { ProductCarousel } from "@/components/ProductCarousel";
import { useLang } from "@/lib/i18n";

export default function ProductsPage() {
  const { t } = useLang();
  return (
    <>
      <main className="relative mx-auto flex w-full max-w-md flex-1 flex-col px-4 pb-32 pt-5">
        <div className="dot-pattern pointer-events-none absolute inset-0" />

        <BrandHeader />

        {/* Karusel kartasi */}
        <section className="relative mt-4 rounded-3xl bg-gradient-to-b from-[#e9ddf5] to-[#ddccf0] p-5 shadow-sm">
          <h1 className="text-center text-[17px] font-extrabold leading-snug">
            {t.products.titleL1}
            <br />
            {t.products.titleL2}
          </h1>
          <div className="mt-4">
            <ProductCarousel />
          </div>
        </section>

        {/* Tomchi qidiruviga o'tish */}
        <Link
          href="/search"
          className="relative mt-6 flex items-center justify-center gap-2 rounded-full bg-accent-dark px-6 py-4 text-center font-bold leading-snug text-white transition hover:bg-accent-dark-hover"
        >
          <span>
            {t.products.ctaL1}
            <br />
            {t.products.ctaL2}
          </span>
          <span aria-hidden className="text-xl">
            ›
          </span>
        </Link>
      </main>
      <BottomNav />
    </>
  );
}
