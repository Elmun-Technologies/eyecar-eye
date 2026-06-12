"use client";

import { useMemo } from "react";
import qrcode from "qrcode-generator";

/**
 * QR kodni SVG sifatida chizadi — tashqi servislarsiz, oflayn ham ishlaydi.
 * value o'zgarganda qayta hisoblanadi.
 */
export function QrCode({
  value,
  className,
}: {
  value: string;
  className?: string;
}) {
  const { path, size } = useMemo(() => {
    const qr = qrcode(0, "M");
    qr.addData(value);
    qr.make();
    const n = qr.getModuleCount();
    let d = "";
    for (let r = 0; r < n; r++) {
      for (let c = 0; c < n; c++) {
        if (qr.isDark(r, c)) d += `M${c} ${r}h1v1h-1z`;
      }
    }
    return { path: d, size: n };
  }, [value]);

  return (
    <svg
      viewBox={`0 0 ${size} ${size}`}
      className={className}
      role="img"
      aria-label={value}
      shapeRendering="crispEdges"
    >
      <rect width={size} height={size} fill="#fff" />
      <path d={path} fill="#17171f" />
    </svg>
  );
}
