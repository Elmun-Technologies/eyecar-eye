"use client";

/**
 * Klient tomonida joriy katalogni beradi: dastlab seed ro'yxat
 * ko'rsatiladi (statik renderga mos), mount'dan keyin /api/products
 * dan yangilanadi. Natija modul darajasida keshlenadi — sahifalar
 * orasida qayta so'ralmaydi.
 */
import { useEffect, useState } from "react";
import { products as seedProducts, type Product } from "@/config/site";

let cached: Product[] | null = null;

export function useProducts(): Product[] {
  const [list, setList] = useState<Product[]>(cached ?? seedProducts);

  useEffect(() => {
    if (cached) return;
    let cancelled = false;
    fetch("/api/products")
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (!cancelled && Array.isArray(data?.products) && data.products.length) {
          cached = data.products as Product[];
          setList(cached);
        }
      })
      .catch(() => {
        // tarmoq xatosida seed ro'yxat qolaveradi
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return list;
}
