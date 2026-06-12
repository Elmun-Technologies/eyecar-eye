/** Hamkor belgisi — sahifalar pastida ko'rsatiladi */
export function PoweredBy({ className }: { className?: string }) {
  return (
    <p
      className={`text-center text-[11px] font-bold tracking-wider text-foreground/45 ${className ?? ""}`}
    >
      Powered by Dr Schats
    </p>
  );
}
