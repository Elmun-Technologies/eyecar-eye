/**
 * Natija sahifasidagi tushuntiruvchi sxema:
 * yosh (namlik) qatlami + shox parda → yon ko'rinishdagi ko'z bilan bog'langan.
 * Yorliqlar tildan kelganligi uchun props orqali uzatiladi.
 */
export function EyeLayerDiagram({
  className,
  tearLabel,
  corneaLines,
}: {
  className?: string;
  tearLabel: string;
  corneaLines: string[];
}) {
  return (
    <svg viewBox="0 0 320 130" fill="none" className={className} aria-hidden>
      {/* qatlamlar qutisi */}
      <rect
        x="6"
        y="22"
        width="150"
        height="86"
        rx="20"
        fill="#eef1f7"
        stroke="#1d9db8"
        strokeWidth="4"
      />
      {/* yosh qatlami */}
      <path
        d="M86 26c-20 8-32 24-32 39s12 31 32 39h-2c-26 0-48-17-48-39s22-39 48-39h2Z"
        fill="#bfe9ee"
      />
      <path
        d="M96 30c-16 6-26 20-26 35s10 29 26 35"
        stroke="#9fdce4"
        strokeWidth="6"
        strokeLinecap="round"
      />
      <text
        x="38"
        y="71"
        fontSize={tearLabel.length > 5 ? 14 : 20}
        fontWeight="800"
        fill="#17171f"
        textAnchor="middle"
        dominantBaseline="middle"
      >
        {tearLabel}
      </text>
      {corneaLines.length === 1 ? (
        <text
          x="120"
          y="78"
          fontSize="12.5"
          fontWeight="800"
          fill="#17171f"
          textAnchor="middle"
          dominantBaseline="middle"
        >
          {corneaLines[0]}
        </text>
      ) : (
        corneaLines.map((line, i) => (
          <text
            key={line}
            x="120"
            y={i === 0 ? 71 : 90}
            fontSize="17"
            fontWeight="800"
            fill="#17171f"
            textAnchor="middle"
            dominantBaseline="middle"
          >
            {line}
          </text>
        ))
      )}

      {/* bog'lovchi chiziq va marker */}
      <path d="M156 65h84" stroke="#1d9db8" strokeWidth="2.5" />
      <rect x="236" y="59" width="12" height="12" fill="none" stroke="#1d9db8" strokeWidth="2.5" />

      {/* yon ko'rinishdagi ko'z */}
      {/* kipriklar */}
      <path
        d="M250 52c8-14 24-26 44-28M256 44c4-8 12-16 22-20M270 36c2-6 8-12 14-15M286 32c2-5 6-9 11-11M300 32c3-4 7-7 11-8"
        stroke="#3b4258"
        strokeWidth="5"
        strokeLinecap="round"
      />
      {/* ko'z shakli */}
      <path
        d="M246 66c10-22 32-38 56-38 8 10 12 24 12 34s-3 22-9 30c-22 0-48-8-59-26Z"
        fill="#f3f0e8"
        stroke="#3b4258"
        strokeWidth="5"
        strokeLinejoin="round"
      />
      {/* iris */}
      <ellipse cx="262" cy="66" rx="12" ry="17" fill="#aab4c4" stroke="#3b4258" strokeWidth="3.5" />
      <ellipse cx="259" cy="66" rx="5" ry="9" fill="#3b4258" />
      {/* pastki kipriklar */}
      <path
        d="M258 90c-3 4-4 7-4 11M272 94c-2 4-3 7-3 10M288 95c-1 4-1 7 0 10"
        stroke="#3b4258"
        strokeWidth="4"
        strokeLinecap="round"
      />
    </svg>
  );
}
